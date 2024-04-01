
const gameLib = function () {
  
}

gameLib.prototype.executeTask = function (obj) {
  let _ = this;
  let msg = {SUCCESS:false,MESSAGE:'There is some issue.'};
  return new Promise(async function (result) {
    if(obj.TYPE == 'mumbaiSuper'){
      msg = await _.gameMumbaiSuper(obj.TASK,obj.DATA);
    }else if(obj.TYPE == 'motkaKing'){
      msg = await _.gameMotkaKing(obj.TASK,obj.DATA);
    }else if(obj.TYPE == 'thailandLottery'){
      msg = await _.gameThailandLottery(obj.TASK,obj.DATA);
    }
    result(msg);
  });
}

gameLib.prototype.startGame = function (type) {
  for(let i in type){
    if(type[i] == 'mumbaiSuper'){
      this.gameMumbaiSuper('start');
    }else if(type[i] == 'motkaKing'){
      this.gameMotkaKing('start');
    }else if(type[i] == 'thailandLottery'){
      this.gameThailandLottery('start');
    }
  }
}

gameLib.prototype.generateGame = function (type) {
  for(let i in type){
    if(type[i] == 'mumbaiSuper'){
      this.gameMumbaiSuper('generate');
    }else if(type[i] == 'motkaKing'){
      this.gameMotkaKing('generate');
    }else if(type[i] == 'thailandLottery'){
      this.gameThailandLottery('generate');
    }
  }
}

gameLib.prototype.gameMumbaiSuper = function (task,data) {
  const cls = require('./mumbaiSuper.js');
  let game = new cls();
  let msg = {SUCCESS:false,MESSAGE:'There is some issue.'};
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
gameLib.prototype.gameMotkaKing = function (task,data) {
  const cls = require('./motkaKing.js');
  let game = new cls();
  let msg = {SUCCESS:false,MESSAGE:'There is some issue.'};
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

gameLib.prototype.gameThailandLottery = function (task,data) {
  const cls = require('./thailandLottery.js');
  let game = new cls();
  let msg = {SUCCESS:false,MESSAGE:'There is some issue.'};
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