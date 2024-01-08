const cron = require('node-cron');
const gameLib = require('../game/game.js');

const lib = new gameLib();



let task1 = cron.schedule('* * * * *', () => {
  console.log('Game generate log motka');
  lib.generateGame(['motka']);
});
task1.start();


// const task = cron.schedule('0 9,10,11,12,13,14,15,16,17,18,19,20 * * *', () => {
const task = cron.schedule('* * * * *', () => {
  lib.startGame(['fatafat']);
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});
task.start();


//cron job to generate a game at 6 AM morning
cron.schedule('0 6 * * *', () => {
  console.log('Game generate log');
  lib.generateGame(['fatafat']);
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

console.log('Cron job scheduled.');