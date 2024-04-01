'use strict';

(function () {

  init();

  function init() {
    showWhiteLabel();
    bindEvents();

    el('dmLoadingDIV').style.display = 'none';
  }

  function bindEvents() {

    el('loginForm').addEventListener('submit', reset);
    el('resendMail').addEventListener('click', resendMail);
  }

  function showWhiteLabel() {
    el('loginLogo').src = elq('.navbar-brand img').src;
    
    if (DM_WHITELABEL.initLogin) {
      DM_WHITELABEL.initLogin();
    }
  }

  function reset(e) {
    e.preventDefault();

    var btn = elq('.loginDIV #loginBTN');
    btn.disabled = true;
    btn.insertAdjacentHTML('afterbegin', '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>');

    if (el('email').value.trim() === '') {
      btn.getElementsByClassName('spinner-border')[0].remove();
      btn.disabled = false;
      return false;
    }

    if (!el('agbCheck').checked) {
      showErrorMsg(i18next.t('signup.acceptTerms'));
      btn.getElementsByClassName('spinner-border')[0].remove();
      btn.disabled = false;
      return false;
    }
  }

  function resendMail(e) {
    
  }

  function showErrorMsg(msg) {
    el('errorMsg').innerHTML = msg;
    el('errorMsg').style.display = 'block';
    el('loginDIV').classList.add('shake');
    el('loginDIV').addEventListener('animationend', function () {
      el('loginDIV').classList.remove('shake');
    });
  }

})();