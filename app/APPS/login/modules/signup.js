'use strict';

(function () {

  var passwordVisible = false;

  init();

  function init() {

    showWhiteLabel();
    auth.loggedIn = 'isLoginPage';
    page_name = 'login';
    bindEvents();

    el('dmLoadingDIV').style.display = 'none';
  }

  function showWhiteLabel() {
    el('loginLogo').src = elq('.navbar-brand img').src;
  }

  function bindEvents() {
    el('loginForm').addEventListener('submit', signup);

    el('showPassword').addEventListener('click', function () {

      if (!passwordVisible) {
        el('pass').type = 'text';
        passwordVisible = true;
        el('showPassword').innerHTML = '<i class="bi bi-eye-slash"></i>';
      } else {
        el('pass').type = 'password';
        passwordVisible = false;
        el('showPassword').innerHTML = '<i class="bi bi-eye"></i>';
      }
    });

    el('cancleBTN').addEventListener('click', function () {
      if (typeof DM_CORE_CONFIG !== 'undefined' && DM_CORE_CONFIG.LANDING_URL) {
        window.location = DM_CORE_CONFIG.LANDING_URL;
      }
    });
  }

  function signup(e) {
    e.preventDefault();
    e.stopPropagation();
    el('errorMsg').style.display = 'block';
    var btn = elq('.loginDIV #signupBTN');
    btn.disabled = true;
    btn.insertAdjacentHTML('afterbegin', '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>');

    if (!el('agbCheck').checked) {
      el('errorMsg').innerHTML = 'Please accept terms and condition';
      el('errorMsg').style.display = 'block';
      el('loginDIV').classList.add('shake');
      el('loginDIV').addEventListener('animationend', function () {
        el('loginDIV').classList.remove('shake');
      });
      btn.getElementsByClassName('spinner-border')[0].remove();
      btn.disabled = false;
      return false;
    }

    backendSource.customRequest('auth', null, {
      name: el('name').value,
      ph: el('phone').value,
      email: el('email').value,
      pwd: el('pass').value,
      grant_type: 'register'
    }, function (data) {
      console.log(data);
      btn.getElementsByClassName('spinner-border')[0].remove();
      btn.disabled = false;
      if (data.SUCCESS !== true) {
        
        el('errorMsg').innerHTML = data.MESSAGE;
        el('errorMsg').style.display = 'block';
        el('loginDIV').classList.add('shake');
        el('loginDIV').addEventListener('animationend', function () {
          el('loginDIV').classList.remove('shake');
        });
        return false;
      }
      login();
    });
  }

  function login() {

    auth.login(el('phone').value, el('pass').value, function (data) {
      console.log(data)
      if (!data.access_token) {

        el('errorMsg').style.display = 'block';
        el('loginDIV').classList.add('shake');
        el('loginDIV').addEventListener('animationend', function () {
          el('loginDIV').classList.remove('shake');
        });
        return false;
      }

      auth.loggedIn = true;

      if (window.location.hash.indexOf('index') < 0) {

        hasher.setHash(DM_CORE_CONFIG.AUTH_SUCCESS_URL.replace('#/', ''));
        window.location = DM_CORE_CONFIG.AUTH_SUCCESS_URL;
      } else {
        var redirect = window.location.hash.split('||');

        if (redirect.length > 1) {
          redirect = redirect[1].replace(/\|/g, '/');
        } else {
          redirect = '#/home';
        }
      }
      console.log('here')
      if (typeof DM_CORE !== 'undefined') {
        DM_CORE.authCheck();
      }

    });
  }

})();
