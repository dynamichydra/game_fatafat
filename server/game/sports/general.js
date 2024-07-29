const moment = require('moment');
const libFunc = require('../../lib/func.js');
let sql = require('../../modules/mysql/common').init;

const sportsGeneral = function () {
  this.func = new libFunc();
}

sportsGeneral.prototype.getGameInfo = async function(data){
  let _ = this;
  return new Promise(async function (result) {
    let res = await _.func.readJson('config/sports.json','game');
    result(res);
  });
}


module.exports = sportsGeneral; 