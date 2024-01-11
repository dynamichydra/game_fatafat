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
    let phoneNumber = '+8801866824702';
    let whatsappLink = 'whatsapp://send?phone=' + phoneNumber;
    window.location.href = whatsappLink;
  }

})();