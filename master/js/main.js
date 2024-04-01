'use strict';

var DM_MAIN = (function () {

  init();

  function init() {

    DM_TEMPLATE.init();

    DM_CORE_CONFIG.LOGIN_CALLBACK = login;
    DM_CORE_CONFIG.LOGOUT_CALLBACK = logout;

    elq('.navbar-brand').href = DM_CORE_CONFIG.LANDING_URL;
    elq('.navbar-brand-sm').href = DM_CORE_CONFIG.LANDING_URL;

    bindEvents();

    DM_CORE.start();
  }

  function bindEvents() {
    el('toggleAppMenu').addEventListener('click', function () {
      el('appMenu').classList.toggle('visible');
    });

    el('goBackBTN').addEventListener('click', function () {
      history.back()
    })
  }

  function login(callback) {
    el('loginBTN').style.display = 'none';
    el('logoutBTN').style.display = 'block';
    $('.loggedInOnly').show();
    
    if (DM_CONFIG.STARTPAGE) {
      elq('.navbar-brand').href = '#/' + DM_CONFIG.STARTPAGE;
      elq('.navbar-brand-sm').href = '#/' + DM_CONFIG.STARTPAGE;
    }

    if (typeof callback === 'function') {
      callback();
    }
  }

  function logout() {

    el('logoutBTN').style.display = 'none';
    $('.loggedInOnly').hide();
    el('loginBTN').style.display = 'block';

    if (DM_CORE_CONFIG.AUTH_MODE === 'private') {
      window.location = '#/login';
    } else if (window.location.hash === DM_CORE_CONFIG.LANDING_URL) {
      location.reload();
    } else {
      window.location = DM_CORE_CONFIG.LANDING_URL;
    }
  }

  return {
    logout
  }

})();

var systemNotification = null;

function showSystemNotification(type, text, callback) {
  if (systemNotification) {
    clearTimeout(systemNotification);
  }

  text = decodeURIComponent(text);
  text = text.replace(/<[^>]+>/g, '');

  if (type === 3) {
    //showStaticNotification(type, text, callback);
    return false;
  }

}

function showToastNotification(type, text, callback) {
  console.log('turn off');
}

util.setShowFeedback(showToastNotification);
