const moment = require('moment');
const libFunc = require('../lib/func.js');
let sql = require('../modules/mysql/common').init;


const generalGame = function () {
  this.func = new libFunc();
}

generalGame.prototype.startGame = async function () {
  let _ = this;
  let conn = await sql.connectDB();

  let curDate = moment().format('YYYY-MM-DD H:mm')+':00';

  let runningGame = await sql.getData('game_inplay', {'where':[
    {'key':'status','operator':'is','value':1},
    {'key':'end','operator':'lower','value':curDate}
  ]});
  if(runningGame.SUCCESS && runningGame.MESSAGE.length>0){
    
    for(const item of runningGame.MESSAGE){
      await sql.setData('game_inplay',{
        'id':item.id,
        'status':2});
    }
  }
  
  let targetGame = await sql.getData('game_inplay', {'where':[
    {'key':'status','operator':'is','value':0},
    {'key':'start','operator':'lower','value':curDate}
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

module.exports = generalGame; 