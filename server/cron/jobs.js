const cron = require('node-cron');
const gameLib = require('../game/game.js');

const lib = new gameLib();



let task1 = cron.schedule('* * * * *', () => {
  lib.generateGame(['motka']);
});
task1.start();


// const task = cron.schedule('0 9,10,11,12,13,14,15,16,17,18,19,20 * * *', () => {
const task = cron.schedule('* * * * *', () => {
  lib.startGame(['mumbaiSuper']);
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});
task.start();


//cron job to generate a game at 6 AM morning
cron.schedule('0 6 * * *', () => {
  lib.generateGame(['mumbaiSuper']);
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});
