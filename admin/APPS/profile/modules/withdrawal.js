'use strict';

(function () {

  const popup = document.getElementById("sitePopup");
  let bankDetail = null;
  
  init();

  function init() {
    $('#pageTitle').html('Withdrawal');
    DM_COMMON.userProfileBlock(false);
    getBankInfo();
    generatePopUp();
    bindEvents();
  }

  function bindEvents() {
    $('.bankDetail').on('click','.add-bank,.editAcc',function(){
      popup.style.display = "block";
    });

    $('#sitePopup').on('click','.saveBankBtn',saveBank);
    $('#saveBtn').on('click',saveBtnClk);
    $('#sitePopup').on('click','#closePopup',function(){
      popup.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === popup) {
        popup.style.display = "none";
      }
    });
  }

  function saveBtnClk(){
    let pwd = $('#password').val();
    let amt = $('#wAmount').val();
    if(!bankDetail){
      DM_TEMPLATE.showSystemNotification(0, `Please create a bank account to make the withdrawal.`);
      return;
    }
    if(!amt || amt==''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the withdrawal amount.`);
      return;
    }
    if(parseInt(amt) < 110 || parseInt(amt) > 50000){
      DM_TEMPLATE.showSystemNotification(0, `Amount range is 110 to 50000.`);
      return;
    }
    if(!pwd || pwd==''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the password.`);
      return;
    }
  }

  function getBankInfo(){
    backendSource.getObject('user_bank', null, {where:[
      {'key':'user_id','operator':'is','value':auth.config.id}
      ]
    }, function (data) {
      if(data.SUCCESS && data.MESSAGE.length >0){
        bankDetail =data.MESSAGE[0];
        $('.bankDetail').html(`
          <div class="bank-view">
            <i class="bi bi-bank2"></i>
            <span class="px-3">${bankDetail.bank_name}</span>
            <spam class="editAcc"><i class="bi bi-pencil"></i></span>
          </div>
        `);
        $('.bankName').val(bankDetail.bank_name);
        $('.holderName').val(bankDetail.name);
        $('.accNumber').val(bankDetail.acc_no);
        $('.city').val(bankDetail.city);
        $('.ifsc').val(bankDetail.ifsc);
        $('.email').val(bankDetail.email);
        $('.phone').val(bankDetail.ph);
        $('.branch').val(bankDetail.branch);
      }else{
        $('.bankDetail').html(`
          <div class="add-bank">
            <i class="bi bi-plus-square-dotted"></i>
            <span class="px-3">Add BANK ACCOUNT </span>
          </div>
        `);
      }
      console.log(data);
    });
  }

  function saveBank(){
    let arr ={
      bank_name : $('.bankName').val(),
      name : $('.holderName').val(),
      acc_no : $('.accNumber').val(),
      city : $('.city').val(),
      ifsc : $('.ifsc').val(),
      email : $('.email').val(),
      ph : $('.phone').val(),
      branch : $('.branch').val(),
      user_id : auth.config.id
    };
    if(!arr.bank_name || arr.bank_name == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the bank name.`);
      return;
    }
    if(!arr.name || arr.name == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide account holder full name.`);
      return;
    }
    if(!arr.acc_no || arr.acc_no == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide account number.`);
      return;
    }
    if(!arr.city || arr.city == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the city name.`);
      return;
    }
    if(!arr.ifsc || arr.ifsc == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the IFSC code.`);
      return;
    }
    if(!arr.email || arr.email == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the email ID.`);
      return;
    }
    if(!arr.ph || arr.ph == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the phone number.`);
      return;
    }
    if(!arr.branch || arr.branch == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the branch name.`);
      return;
    }

    backendSource.saveObject('user_bank', bankDetail?bankDetail.id:null, arr, function (data) {
      if(data.SUCCESS){
        if(data.SUCCESS){
          DM_TEMPLATE.showSystemNotification(1, `Bank account updated successfully.`);
          getBankInfo();
          popup.style.display = "none";
        }else{
          DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
        }
      }else{
        DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
      }
    });
  }

  function generatePopUp(){
    $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Bank account detail</h2>
        <div class="container">
          <div class="row input-container">
            <div class="col-12">
              <label>Bank Name</label>
              <div class="input-wrapper">
                <i class="bi bi-bank2"></i>
                <input type="text" class="bankName" placeholder="Enter bank name"/>
              </div>
            </div>
            <div class="col-12">
              <label>Account Holder Name</label>
              <div class="input-wrapper">
                <i class="bi bi-person-fill-gear"></i>
                <input type="text" class="holderName" placeholder="Account holder name"/>
              </div>
            </div>
            <div class="col-12">
              <label>Account number</label>
              <div class="input-wrapper">
                <i class="bi bi-person-vcard"></i>
                <input type="text" class="accNumber" placeholder="Account number"/>
              </div>
            </div>
            <div class="col-12">
              <label>City</label>
              <div class="input-wrapper">
                <i class="bi bi-buildings"></i>
                <input type="text" class="city" placeholder="City name"/>
              </div>
            </div>
            <div class="col-12">
              <label>IFSC Code</label>
              <div class="input-wrapper">
                <i class="bi bi-upc"></i>
                <input type="text" class="ifsc" placeholder="IFSC Code"/>
              </div>
            </div>
            <div class="col-12">
              <label>Email</label>
              <div class="input-wrapper">
                <i class="bi bi-envelope"></i>
                <input type="email" class="email" placeholder="Email ID"/>
              </div>
            </div>
            <div class="col-12">
              <label>Phone Number</label>
              <div class="input-wrapper">
                <i class="bi bi-phone"></i>
                <input type="text" class="phone" placeholder="Phone number"/>
              </div>
            </div>
            <div class="col-12">
              <label>Branch Name</label>
              <div class="input-wrapper">
                <i class="bi bi-text-paragraph"></i>
                <input type="text" class="branch" placeholder="Branch Name"/>
              </div>
            </div>
            
            <div class="col-12 mt-3"><span class="gameButton saveBankBtn"> Update </span></div>
          </div>
        </div>
      </div>`);
  }

})();