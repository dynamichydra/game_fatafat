'use strict';

const DM_SETTINGS = (function () {
  
  init();

  function init(){
    
  }

  function generateSettingsMenu() {
    let menu = ``;
    if(auth.config.type == 'admin'){
      menu += `<div><a href="#/settings/info">Game Data</a></div>`;
      menu += `<div><a href="#/settings/detail">Game Detail</a></div>`;
      // menu += `<div><a href="#/settings/corn">Corn Job</a></div>`;
    }
    menu += `<div><a href="#/profile/changepwd">Password</a></div>`;
    $('#settingsMenu').html(menu);
  }


  return {
    generateSettingsMenu
  }

})();