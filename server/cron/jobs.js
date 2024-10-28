const cron = require('node-cron');
const game = require('../game/game.js');
const libFunc = require('../lib/func.js');
const moment =  require('moment');
const func = new libFunc();

// const task = cron.schedule('0 9,10,11,12,13,14,15,16,17,18,19,20 * * *', () => {
const task = cron.schedule('* * * * *', async () => {
  console.log('cron')
  const cronJson = await func.readGameJson('config/game.json',null,{key:['cron']});
  
  if(cronJson.SUCCESS){
    let curTime = moment().format("HH:mm:ss");
    if(cronJson.MESSAGE.cron[curTime]){
      const gObj = new game();
      gObj.executeTask({TYPE:cronJson.MESSAGE.cron[curTime],TASK:'start'}).then(function(result){
      }).catch(function(error){
          console.log(error);
      });
    }
  }
  
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

task.start();

function initializeServer() {
  const gObj = new game();
  gObj.executeTask({TYPE:'motka',TASK:'generate'}).then(function(result){});
}

// Start the server
initializeServer();