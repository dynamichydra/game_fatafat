'use strict';

(function () {

  const popup = document.getElementById("sitePopup");
  let cUser = null;
  init();

  function init() {
    $('#pageTitle').html('Wallet');
    DM_COMMON.fetchUserData();
    userTotalWithdraw();
    bindEvents();
  }

  function bindEvents() {
    $('#sitePopup').off('click')
    $('.transferRecord').on('click',function(){
      window.location = '#/wallet/transfer';
    });
    $('.receiveRecord').on('click',function(){
      window.location = '#/wallet/receive';
    });
    $('.refreshBalance').on('click',DM_COMMON.fetchUserData);
    $('.transferBtn').on('click',transferPopup);
    $('#sitePopup').on('click','#closePopup',function(){
      popup.style.display = "none";
    });
    $('#sitePopup').on('click','.transferNowBtn',transferSave);

    $('#sitePopup').on('blur','.trnsId',fetchUser);
  }

  function fetchUser(){
    let id = $(this).val();
    $('.userDetails').html('');
      backendSource.getObject('user', null, {where:[
        {'key':'ph','operator':'is','value':id}
      ],
      select:"balance,ph,email,name,id"
    }, function (data) {
      if(data.SUCCESS && data.MESSAGE.length>0){
        $('.userDetails').html(data.MESSAGE[0].name);
        $('.trnsUidId').val(data.MESSAGE[0].id);
      }
    });
    
  }

  function transferSave(){
    DM_TEMPLATE.showBtnLoader(elq('.transferNowBtn'), true);
      let id = $('.trnsUidId').val();
      let amt = parseFloat($('.trnsAmt').val());
      let pwd = $('.uPwd').val();
      if(!amt || amt > cUser.balance){
        DM_TEMPLATE.showSystemNotification(0, 'Please enter a proper amount');
        DM_TEMPLATE.showBtnLoader(elq('.transferNowBtn'), false);
        return false;
      }
      if(!id || id ==''){
        DM_TEMPLATE.showSystemNotification(0, 'Please provide the proper user ID where to transfer');
        DM_TEMPLATE.showBtnLoader(elq('.transferNowBtn'), false);
        return false;
      }
      if(!pwd || pwd ==''){
        DM_TEMPLATE.showSystemNotification(0, 'Please provide your password');
        DM_TEMPLATE.showBtnLoader(elq('.transferNowBtn'), false);
        return false;
      }
      
      backendSource.customRequest('auth', null, {
        amt: amt,
        fid: auth.config.id,
        tid: id,
        // tid: parseInt(id.slice(2)),
        pwd: pwd,
        grant_type: 'fundtransfer'
      }, async function (data) {
        DM_TEMPLATE.showBtnLoader(elq('.transferNowBtn'), false);
        if (data.SUCCESS !== true) {
          DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
          return false;
        }
        DM_COMMON.fetchUserData();
        userTotalWithdraw();
        DM_TEMPLATE.showSystemNotification(1, 'Data updated successfully');
        popup.style.display = "none";
      });
  }

  function transferPopup(){
    cUser = DM_COMMON.getUserData();
    $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Transfer points</h2>
        <div class="container">
          <div class="row">
            <div class="col-4 mt-3">Balance</div>
            <div class="col-8 mt-3 font-weight-bold">${cUser.balance}</div>
            <div class="col-4 mt-3">User Id</div>
            <div class="col-8 mt-3 input-container">
              <input type="text" class="trnsId"/>
              <input type="hidden" class="trnsUidId"/>
              <i class="bi bi-person"></i>
            </div>
            <div class="col-4"></div>
            <div class="col-8 userDetails"></div>
            <div class="col-4 mt-3">Points</div>
            <div class="col-8 mt-3 input-container">
              <input type="text" class="trnsAmt"/>
              <i class="bi bi-cash-coin"></i>
            </div>
            
            <div class="col-4 mt-3">Password</div>
            <div class="col-8 mt-3 input-container">
              <input type="password" class="uPwd"/>
              <i class="bi bi-lock"></i>
            </div>
            <div class="col-4 mt-3">&nbsp;</div>
            <div class="col-8 mt-3"><span class="gameButton transferNowBtn"> Transfer </span></div>
          </div>
        </div>
      </div>`);

      popup.style.display = "block";
  }

  function userTotalWithdraw(){
    backendSource.getObject('transfer_log', null, {
      where:[
        {'key':'tid','operator':'is','value':auth.config.id}
      ],
      select:"SUM(amt) as tot"
      }, function (data) {
        if(data.SUCCESS && data.MESSAGE.length>0){
          // const formattedCurrency = new Intl.NumberFormat('en-IN', { 
          //   maximumSignificantDigits: 3 
          //   }).format(data.MESSAGE[0].tot);
          $('.todayWithdrawtxt').html(Math.round(data.MESSAGE[0].tot));
        }
      });
    backendSource.getObject('transfer_log', null, {
      where:[
        {'key':'fid','operator':'is','value':auth.config.id}
      ],
      select:"SUM(amt) as tot"
      }, function (data) {
        if(data.SUCCESS && data.MESSAGE.length>0){
          // const formattedCurrency = new Intl.NumberFormat('en-IN', { 
          //   maximumSignificantDigits: 3 
          //   }).format(data.MESSAGE[0].tot);
          $('.totalWithdrawtxt').html(Math.round(data.MESSAGE[0].tot));
        }
      });   
  }

})();