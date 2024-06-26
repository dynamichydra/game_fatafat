
const gameLib = function () {
  
}

gameLib.prototype.executeTask = function (obj) {
  let _ = this;
  let msg = {SUCCESS:false,MESSAGE:'There is some issue.'};
  return new Promise(async function (result) {
    if(obj.TYPE == 'fatafat'){
      msg = await _.gameFatafat(obj.TASK,obj.DATA);
    }else if(obj.TYPE == 'fatafatSuper'){
      msg = await _.gameFatafatSuper(obj.TASK,obj.DATA);
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
    }
  }
}

gameLib.prototype.generateGame = function (type) {
  for(let i in type){
    if(type[i] == 'fatafat'){
      this.gameFatafat('generate');
    }else if(type[i] == 'fatafatSuper'){
      this.gameFatafatSuper('generate');
    }
  }
}

gameLib.prototype.gameFatafat = function (task,data) {
  const cls = require('./fatafat.js');
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
    }
    result(msg);
  });
}
gameLib.prototype.gameFatafatSuper = function (task,data) {
  const cls = require('./fatafatSuper.js');
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
    }
    result(msg);
  });
}

module.exports = gameLib; 