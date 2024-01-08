'use strict';

(function () {
  
  init();

  function init() {
    // $('#pageTitle').html('Change Password');
    bindEvents();
  }

  function bindEvents() {
    $('.gameButton').on('click',changePassword);
  }

  function changePassword(){
    let oPwd = $('#oldPassword').val();
    let nPwd = $('#newPassword').val();
    let cPwd = $('#confirmPassword').val();

    console.log({oPwd,nPwd,cPwd});

    if(!oPwd || oPwd=='' || !nPwd || nPwd=='' || !cPwd || cPwd==''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide all information!!!`);
      return false;
    }
    if(nPwd !== cPwd){
      DM_TEMPLATE.showSystemNotification(0, `New password and confirm password does not match!!!`);
      return false;
    }

    DM_GENERAL.changePassword(auth.config.id, oPwd,nPwd,cPwd, function (data) {
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, `Password change successfully!!!`);
      }else{
        DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
      }
      console.log(data)
    });

  }


})();