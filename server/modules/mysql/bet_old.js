const moment =  require('moment');

exports.init = {

  call : async function(commonObj, data){
      let _ = this;
      return new Promise(async function (result) {
        console.log(data);
        
        if(data && data.data && data.type && data.game){
          let user = await commonObj.getData('user', {where:[
            {key:"id",operator:"is", value:data.data.user_id}
          ]});
          if(user.SUCCESS){
            if(user.MESSAGE.status==1){
              let res = null;
              if(data.type == 'bet' && data.game == 'motka'){
                res = await _.betMotka(commonObj,data.data,user.MESSAGE);
              }else if(data.type == 'bet' && (data.game == 'rocket' || data.game == 'super')){
                res = await _.betRocket(commonObj,data.data,user.MESSAGE,data.game);
              }
              result(res);
            }else{
              result({SUCCESS:false,MESSAGE:'Penal suspend, please contact upline.'});
            }
            
          }else{
            result({SUCCESS:false,MESSAGE:'There is some issue to submit.'});
          }
        }else{
          result({SUCCESS:false,MESSAGE:'Invalid Request'});
        }
      });
    },

    betRocket(commonObj,data,user,gameType){
      return new Promise(async function (result) {
        let game = await commonObj.getData('game_inplay', {where:[
          {key:"id", operator:"is", value : data.game_id}
        ]});
        if(game.SUCCESS && (parseInt(game.MESSAGE.status) == 1 || parseInt(game.MESSAGE.status) == 0)){
          const endTime = moment(game.MESSAGE.end, 'YYYY-MM-DD HH:mm:ss');
          const startTime = moment(game.MESSAGE.start, 'YYYY-MM-DD HH:mm:ss');;
          if (startTime.isBefore(endTime)){
            let totAmt = 0;
            for(let i in data.bet){
              totAmt += parseFloat(data.bet[i].a);
            }
            if(parseFloat(totAmt) < parseFloat(user.balance)){
              let betNo = [];
              let errMsg = null;
              totAmt = 0;
              for(let i in data.bet){
                let amtLmt = await commonObj.customSQL("SELECT sum(amt) amt FROM `rocket_bet` WHERE number="+data.bet[i].n+" AND game_id ="+data.game_id+" AND user_id="+user.id+" AND type = '"+data.type+"'");
                
                let bajiLimit = data.type=='Patti'?100:5000;
                
                const service = 0;
                const amt = parseFloat(data.bet[i].a) - service;
                if((amtLmt.MESSAGE[0].amt && (amtLmt.MESSAGE[0].amt+amt)>bajiLimit) || (amt>bajiLimit)){
                  if(!errMsg){
                    errMsg = "Following number did not place due to max limit: ";
                  }
                  errMsg += data.bet[i].n+", ";
                }else{
                  totAmt += parseFloat(data.bet[i].a);
                  let insertSql = "INSERT INTO rocket_bet SET id='"+Date.now()+i+"."+user.id+"', game_id="+data.game_id+",user_id="+user.id+", number="+data.bet[i].n+",type='"+data.type+"',service='"+service+"',amt='"+amt+"' ";
                  let t = await commonObj.customSQL(insertSql);
                  // let t = await commonObj.setData('rocket_bet', {
                  //   game_id:data.game_id,
                  //   user_id:user.id,
                  //   number:data.bet[i].n,
                  //   type : data.type,
                  //   service : service,
                  //   amt:amt}
                  // );
                  betNo.push(data.bet[i].n);
                }
                
              }
              
              if(betNo.length>0){
                let bal = parseFloat(user.balance) - parseFloat(totAmt);
                let t = await commonObj.setData('user', {id:user.id, 
                  balance:bal
                  });
                t = await commonObj.setData('transaction_log', {
                    user_id : user.id, 
                    amt : totAmt,
                    ref_no : data.game_id,
                    description : "Mumbai "+gameType+" bet "+betNo.toString()
                  });
                if(errMsg){
                  result({SUCCESS:false,MESSAGE: errMsg});
                }else{
                  result(t);
                }
              }else{
                result({SUCCESS:false,MESSAGE: errMsg});
              }
              
            
            }else{
              result({SUCCESS:false,MESSAGE: 'Not sufficient balance.'});
            }
          }else{
            result({SUCCESS:false,MESSAGE: 'Game already over.'});
          } 
          
        }else{
          result({SUCCESS:false,MESSAGE: 'Game already over.'});
        }        
      });
    },

    betMotka(commonObj,data,user){
      return new Promise(async function (result) {
        if(parseFloat(data.amt) < parseFloat(user.balance)){
          let game = await commonObj.getData('game_inplay', {where:[
            {key:"id", operator:"is", value : data.game_id}
          ]});
          if(game.SUCCESS && parseInt(game.MESSAGE.status) == 1){
            data.service = (parseFloat(data.amt) * 2)/100;
            data.amt = parseFloat(data.amt) - parseFloat(data.service);
            let t = await commonObj.setData('motka_bet', data);

            let bal = parseFloat(user.balance) - (data.amt + data.service);
            t = await commonObj.setData('user', {id:user.id, 
              balance:bal
              });

            t = await commonObj.setData('transaction_log', {
                user_id : user.id, 
                amt : (data.amt + data.service) ,
                ref_no : data.game_id,
                description : "Motka bet "+(data.number??'')+' '+(data.size??'')+' '+(data.color??'')
              });
            
            result(t);
          }else{
            result({SUCCESS:false,MESSAGE: 'Game already over.'});
          }
        }else{
          result({SUCCESS:false,MESSAGE: 'Not sufficient balance.'});
        }
      });
    }

};