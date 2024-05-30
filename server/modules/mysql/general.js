exports.init = {

  call : async function(commonObj, data){
      let _ = this;
      return new Promise(async function (result) {
        if(data){
          //type transfer
          if(data.grant_type == 'balance_update'){

            let sql = " ";
            if(data.game == 'fatafat'){
              sql = ` CALL updateFatafatUser(${data.id});`;
            }else if(data.game == 'fatafatSuper'){
              sql = ` CALL updateFatafatSuperUser(${data.id});`;
            }else if(data.game == 'gameChance'){
              sql = ` CALL updateGameChanceUser(${data.id});`;
            }
            let t = await commonObj.customSQL(sql);
            if(t.SUCCESS){
              sql = ` UPDATE game_inplay SET result_done='1' WHERE id='${data.id}'`;
              t = await commonObj.customSQL(sql);
            }
            result(t);
          }else{
            result({SUCCESS:false,MESSAGE:'No grand type'});
          }
        }else{
          result({SUCCESS:false,MESSAGE:'No data'});
        }
      });
    },
};