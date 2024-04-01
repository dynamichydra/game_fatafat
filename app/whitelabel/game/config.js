'use strict';

(function() {
  elq('.navbar-brand img').src = 'whitelabel/game/img/logo.png';

  create('link', 'whitelabel/game/style.css');
  DM_GENERAL.updateUserInfo();
  function create(s, url) {
    let head = document.getElementsByTagName('HEAD')[0]; 
    
    let js = document.createElement(s);
    if (s === 'script') {
      js.src = url;
      js.defer = 'defer';
      js.async = false;
    } else {
      js.href = url;
      js.type = 'text/css';
      js.rel = 'stylesheet';
    }
    head.appendChild(js); 
  }
})();