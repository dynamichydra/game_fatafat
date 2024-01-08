'use strict';

(function () {
  
  init();

  function init() {
    $('#userType').html(auth.config.type);
    console.log(auth.config)
    $('#userCommission').html(auth.config.percentage);
    if(!auth.config.type){
      window.location = '#/login';
    }
    bindEvents();
  }

  function bindEvents() {
    
  }

})();