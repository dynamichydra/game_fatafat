'use strict';

(function () {
  
  init();

  function init() {
    $('#pageTitle').html('Customer Service');
    bindEvents();
  }

  function bindEvents() {
    $('.liveChat').on('click',liveChat);
  }

  function liveChat(){

  }

})();