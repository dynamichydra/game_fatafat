'use strict';

const DM_SPOTRS = (function () {
  let games = null;

  init();

  function init(){
    fetchSportsGame();
  }

  function generateSportsMenu() {
    let menu = ``;
    if(auth.config.type == 'admin'){
      menu += `<div><a href="#/sports/team">Team</a></div>`;
      menu += `<div><a href="#/sports/match">Match</a></div>`;
    }
    menu += ``;
    $('#sportsMenu').html(menu);
  }

  function fetchSportsGame(cb){
    if(typeof backendSource == 'undefined'){
      setTimeout(function(){
        fetchSportsGame(cb);
      },100);
      return;
    }
    backendSource.sportsRequest('general', 'getGame', null, function (data) {
      if(data.SUCCESS){
        games = data.MESSAGE;
      }
      if(cb){
        cb(games)
      }
    });
  }

  function getSportsOption(sel){
    return new Promise(async function (result) {
      let htm =``;
      if(!games){
        fetchSportsGame(function(data){
          for(let i in games){
            htm += `<option ${sel == games[i]?'selected':''} value="${games[i]}">${games[i]}</option>`;
          }
          result(htm);
        });
      }else{
        for(let i in games){
          htm += `<option ${sel == games[i]?'selected':''} value="${games[i]}">${games[i]}</option>`;
        }
        result(htm);
      }
      
    });
  }

  function getSports(){
    if(!games){
      setTimeout(getSports,100);
      return;
    }
    return games;
  }


  return {
    generateSportsMenu,
    getSports,
    getSportsOption
  }

})();