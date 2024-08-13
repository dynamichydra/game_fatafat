const moment = require('moment');
const libFunc = require('../lib/func.js');
const sql = require('../modules/mysql/common').init;
const generalCls = require('./general.js');

const fatafat = function () {
  this.code = 'fatafat';
  this.func = new libFunc();
  this.gnrl = new generalCls();
}

fatafat.prototype.startGame = async function () {
  let _ = this;
  let conn = await sql.connectDB();

  let curDate = moment().format('YYYY-MM-DD H:mm')+':00';
  let t = await sql.customSQL("UPDATE game_inplay SET status = '2' WHERE game_code ='"+_.code+"' AND status = '1' AND end <= '"+curDate+"'");
  t = await sql.customSQL("UPDATE game_inplay SET status = '1' WHERE game_code ='"+_.code+"' AND status = '0' AND start <= '"+curDate+"'");
  conn.release();
}

fatafat.prototype.generateGame = async function (data) {
  let gameInfo = await this.getGameInfo({key:['info']})
  if(gameInfo.SUCCESS){
    gameInfo = gameInfo.MESSAGE.info;
  }else{
    gameInfo = [];
  }
  let res = this.gnrl.generateGame(this.code, data.date, gameInfo, this.func);
  return (res);
}

fatafat.prototype.cancelAllBet = async function (data) {
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
          t = await sql.setDelete(_.code,{"id":item.id});
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

fatafat.prototype.generateResult = async function (data) {
  let _ = this;
  let gameInfo = await this.getGameInfo({key:['price']});
  gameInfo = gameInfo.MESSAGE.price;
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

      let t = await sql.setData('game_inplay',{'id':inPlay.id,'status':'2','result_one':data.num,'result_two':data.single});
      if(t.SUCCESS){
        t = await sql.customSQL("CALL setFatafatResult("+inPlay.id+",'"+_.code+"','"+gameInfo.patti+"','"+gameInfo.single+"')");
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
      result({SUCCESS:false,MESSAGE:'There is some issue to generate result'});
    }else{
      result({SUCCESS:true,MESSAGE:'Success'});
    }
  });
}

fatafat.prototype.getGameInfo = async function(data){
  let _ = this;
  return new Promise(async function (result) {
    let res = await _.func.readGameJson('config/game.json',_.code,data);
    result(res);
  });
}

module.exports = fatafat; 