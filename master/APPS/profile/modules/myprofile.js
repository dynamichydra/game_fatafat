'use strict';

(function () {

  let userData = null;
  const popup = document.getElementById("sitePopup");

  init();

  async function init() {
    generatePopUp();
    $('#pageTitle').html('My Profile');
    let data = await DM_GENERAL.userData(auth.config.id);
    if(data.SUCCESS){
      userData = data.MESSAGE;
    }else{
      window.location = '#/login';
      return;
    }
    setProfile();
    bindEvents();
  }

  function bindEvents() {
    $('.myProfileEdit').on('click',function(){
      popup.style.display = "block";
    });
    $('#sitePopup').on('click','.saveBtn',saveProfile);
    $('#sitePopup').on('click','#closePopup',function(){
      popup.style.display = "none";
    });
    $('.profileMenu .service').on('click',function(){
      window.location = '#/page/service';
    });

    window.addEventListener("click", (event) => {
      if (event.target === popup) {
        popup.style.display = "none";
      }
    });
  }

  function saveProfile(){
    backendSource.saveObject('user', auth.config.id, {
      name: $('.nickNameTxt').val(),
      email: $('.emailTxt').val()
    }, async function (data) {
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, `Profile updated successfully.`);
        let data = await DM_GENERAL.userData(auth.config.id);
        if(data.SUCCESS){
          userData = data.MESSAGE;
          setProfile();
          popup.style.display = "none";
        }
      }else{
        DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
      }
    });
  }

  function generatePopUp(){
    $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Edit profile</h2>
        <div class="container">
          <div class="row">
            <div class="col-4 mt-3">Nick Name</div>
            <div class="col-8 mt-3 input-container">
              <input type="text" class="nickNameTxt"/>
              <i class="bi bi-person-badge"></i>
            </div>
            <div class="col-4 mt-3">Email</div>
            <div class="col-8 mt-3 input-container">
              <input type="text" class="emailTxt"/>
              <i class="bi bi-envelope-at"></i>
            </div>
            <div class="col-4 mt-3">&nbsp;</div>
            <div class="col-8 mt-3"><span class="gameButton saveBtn"> Update </span></div>
          </div>
        </div>
      </div>`);
  }

  function setProfile(){
    $('.myProfileId').html(auth.config.id.toString().padStart(6,"0"));
    $('.myProfileNickName').html(decodeURI(userData.name));
    $('.mtProfileMobile').html(userData.ph);
    $('.myProfileEmail').html(userData.email);
    $('.nickNameTxt').val(userData.name);
    $('.emailTxt').val(userData.email);
  }


})();