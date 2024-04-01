'use strict';

(function () {

  let payMethod = 'upi';
  
  init();

  function init() {
    $('#pageTitle').html('Recharge');
    DM_COMMON.userProfileBlock(false);
    bindEvents();
  }

  function bindEvents() {
    $('.methodBox').on('click',methodBoxClk);
    $('.amtBox').on('click',amtBoxClk);
    $('#saveBtn').on('click',saveBtnClk);
  }

  function methodBoxClk(){
    $('.methodBox').removeClass('active');
    $(this).addClass('active');
    payMethod = $(this).attr('data-type');
  }

  function amtBoxClk(){
    $('.amtBox').removeClass('active');
    $(this).addClass('active');
    $('#amt').val($(this).attr('data-amt'));
  }

  function saveBtnClk(){
    let amt = $('#amt').val();
    if(!amt || amt==''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the deposit amount.`);
      return;
    }
    if(parseInt(amt) < 100 || parseInt(amt) > 100000){
      DM_TEMPLATE.showSystemNotification(0, `Amount range is 100 to 100000.`);
      return;
    }
    if(payMethod=='upi'){
      window.location = '#/profile/upi/'+amt;
    }else{

    }
  }


})();