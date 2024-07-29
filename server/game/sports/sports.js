
const sportsLib = function () {
  
}

sportsLib.prototype.executeTask = function (obj) {
  const cls = require('./'+obj.TYPE+'.js');
  let game = new cls();
  let msg = {SUCCESS:false,MESSAGE:'There is some issue executeTask.'};
  return new Promise(async function (result) {
    switch(obj.TASK){
      case 'getGame':
        msg = await game.getGameInfo();
        break;
      case 'generate':
        msg = await game.generateGame(obj.DATA);
        break;
      case 'result':
        msg = await game.generateResult(obj.DATA);
        break;
      case 'cancelBet':
        msg = await game.cancelAllBet(obj.DATA);
        break;
      case 'gameInfo':
        msg = await game.getGameInfo(obj.DATA);
        break;
    }
    result(msg);
  });
}


module.exports = sportsLib; 