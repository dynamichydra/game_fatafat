'use strict';

(function () {
  
  init();

  function init() {
    $('#userType').html(auth.config.type);
    $('#userCommission').html(auth.config.percentage);
    if(!auth.config.type){
      window.location = '#/login';
    }
    bindEvents();
  }

  function bindEvents() {
    
  }

})();