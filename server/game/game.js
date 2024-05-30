
const gameLib = function () {
  
}

gameLib.prototype.executeTask = function (obj) {
  const cls = require('./'+obj.TYPE+'.js');
  let game = new cls();
  let msg = {SUCCESS:false,MESSAGE:'There is some issue executeGameRequest.'};
  return new Promise(async function (result) {
    switch(obj.TASK){
      case 'start':
        msg = await game.startGame();
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

gameLib.prototype.startGame = function (type) {
  for(let i in type){
    if(type[i] == 'fatafat'){
      this.gameFatafat('start');
    }else if(type[i] == 'fatafatSuper'){
      this.gameFatafatSuper('start');
    }else if(type[i] == 'gameChance'){
      this.gameGameChance('start');
    }
  }
}

gameLib.prototype.generateGame = function (type) {
  for(let i in type){
    if(type[i] == 'fatafat'){
      this.gameFatafat('generate');
    }else if(type[i] == 'fatafatSuper'){
      this.gameFatafatSuper('generate');
    }else if(type[i] == 'gameChance'){
      this.gameGameChance('generate');
    }
  }
}

gameLib.prototype.removeOldData = function (days) {
  const cls = require('./general.js');
  let obj = new cls();
  return new Promise(async function (result) {
     let msg = await obj.removeOldData(days);
     result(msg);
  })
}

gameLib.prototype.gameFatafat = function (task,data) {
  const cls = require('./fatafat.js');
  let game = new cls();
  let msg = {SUCCESS:false,MESSAGE:'There is some issue in game fatafat.'};
  return new Promise(async function (result) {
    switch(task){
      case 'start':
        msg = await game.startGame();
        break;
      case 'generate':
        msg = await game.generateGame(data);
        break;
      case 'result':
        msg = await game.generateResult(data);
        break;
      case 'cancelBet':
        msg = await game.cancelAllBet(data);
        break;
    }
    result(msg);
  });
}

module.exports = gameLib; 