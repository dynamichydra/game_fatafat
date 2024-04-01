'use strict';

(function () {
  
  init();

  function init() {
    $('#pageTitle').html('About');
    $('.version').html('V '+DM_CORE_CONFIG.VERSION);
    bindEvents();
  }

  function bindEvents() {
    $('.privacyPolicy').on('click',function(){
      window.location = '#/page/privacy';
    });
    $('.riskAgreement').on('click',function(){
      window.location = '#/page/risk';
    });
  }

})();