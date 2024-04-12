const moment = require('moment');
const libFunc = require('../lib/func.js');
let sql = require('../modules/mysql/common').init;


const sensex = function () {
  this.code = 'sensex';
  this.func = new libFunc();
  this.price = {'jori':100};
}

sensex.prototype.startGame = async function () {
  let _ = this;
  let conn = await sql.connectDB();

  let runningGame = await sql.getData('game_inplay', {'where':[
    {'key':'game_code','operator':'is','value':_.code},
    {'key':'status','operator':'is','value':1}
  ]});
  if(runningGame.SUCCESS && runningGame.MESSAGE.length>0){
    
    for(const item of runningGame.MESSAGE){
      await sql.setData('game_inplay',{
        'id':item.id,
        'status':2});
    }
  }
  let curDate = moment().format('YYYY-MM-DD H:mm')+':00';
  let targetGame = await sql.getData('game_inplay', {'where':[
    {'key':'game_code','operator':'is','value':_.code},
    {'key':'status','operator':'is','value':0},
    {'key':'start','operator':'is','value':curDate}
  ]});
  if(targetGame.SUCCESS && targetGame.MESSAGE.length>0){
    for(const item of targetGame.MESSAGE){
      await sql.setData('game_inplay',{
        'id':item.id,
        'status':1});
    }
  }
  conn.release();
}

sensex.prototype.generateGame = async function (data) {
  let curDate = moment().format('YYYY-MM-DD');
  if(data && data.date){
    curDate = data.date;
  }

  let gameStartTime = [
    {'name':"Bazi1",start:"06:00:00",end:"15:30:00",duration:330}
  ];
  let _ = this;
  return new Promise(async function (result) {
    let conn = await sql.connectDB();
    let res = await sql.getData('game_inplay', {'where':[
        {'key':'game_code','operator':'is','value':_.code},
        {'key':'start','operator':'higher-equal','value':curDate+' 00:00:00'},
      ]});
    for(let i in gameStartTime){
      let found = false;
      if(res.SUCCESS && res.MESSAGE.length>0){
        found = _.func.findValueDate(res.MESSAGE, 'start',curDate+' '+gameStartTime[i].start);
      }

      if(!found){
        await sql.setData('game_inplay',
            {'name':gameStartTime[i].name,
            'start':curDate+' '+gameStartTime[i].start,
            'end':curDate+' '+gameStartTime[i].end,
            'duration':gameStartTime[i].duration,
            'game_code':_.code}
          );
      }
    }
    conn.release();
    result(res);
  });
}

sensex.prototype.cancelAllBet = async function (data) {
  let _ = this;
  return new Promise(async function (result) {
    let conn = await sql.connectDB();
    let res = await sql.getData('game_inplay', {'where':[
      {'key':'game_code','operator':'is','value':_.code},
       {'key':'id','operator':'is','value':data.id}
    ]});
    if(res.SUCCESS && res.MESSAGE.id){
      let oldBet = await sql.getData(_.code, {'where':[
        {'key':'game_id','operator':'is','value':res.MESSAGE.id}
      ]});
      if(oldBet.SUCCESS && oldBet.MESSAGE.length>0){
        await sql.startTransaction();
        let count = 0;
        for(const item of oldBet.MESSAGE){
          let user = await sql.getData('user', {where:[
            {key:"id",operator:"is", value:item.user_id}
          ]});
          let bal = user.MESSAGE.balance + item.amt - item.price;
          t = await sql.setDelete(_.code,{id:item.id});
          
          t = await sql.customSQL("UPDATE user SET balance = '"+bal+"' WHERE id ="+item.user_id);
          let insertSql = "INSERT INTO transaction_log SET id='BC-"+Date.now()+""+(count++)+"."+item.user_id+"', user_id="+item.user_id+",amt='"+(item.amt - item.price)+"', ref_no='"+item.id+"',description='"+_.code+" win return - bal: "+bal+"' ";
          t = await sql.customSQL(insertSql);
        }
        await sql.commitTransaction();
      }
    }
    conn.release();
    result({SUCCESS:true,MESSAGE:'Success'});
  });
}

sensex.prototype.generateResult = async function (data) {
  let _ = this;
  
  return new Promise(async function (result) {
    let conn = await sql.connectDB();
    
    let res = await sql.getData('game_inplay', {'where':[
      {'key':'game_code','operator':'is','value':_.code},
       {'key':'id','operator':'is','value':data.id}
    ]});
    let errorFound = null;
    if(res.SUCCESS && res.MESSAGE.id){
      let inPlay = res.MESSAGE;
      await sql.startTransaction();

      let t = await sql.setData('game_inplay',{'id':inPlay.id,'status':'2','result_one':data.jori});
      if(t.SUCCESS){
        t = await sql.customSQL("CALL setStockResult("+inPlay.id+",'"+_.code+"','"+_.price.jori+"')");
        if(!t.SUCCESS){
          errorFound = true;
        }
      }else{
        errorFound = true;
      }
      if(errorFound){
        await sql.rollbackTransaction();
      }else{
        await sql.commitTransaction();
      }
    }
    conn.release();
    if(errorFound){
      result({SUCCESS:false,MESSAGE:'There is some issue'});
    }else{
      result({SUCCESS:true,MESSAGE:'Success'});
    }
  });
}

module.exports = sensex; 