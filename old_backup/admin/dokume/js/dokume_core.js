
var DM_CONFIG = null;

var DM_CORE = (function() {

  function init() {

    loginCheck();
  }

  function loginCheck() {

    if (auth.loggedIn === 'isLoggingIn') {
      return false;
    }

    auth.loggedIn = 'isLoggingIn';

    if (auth.config.refresh && auth.config.refresh !== null) {
      auth.refresh_token(function(data) {

        if (data === false) {

          auth.loggedIn = false;

          window.location = '#/login';
          
          return false;
        }

      });
    } else {
      window.location = '#/login';
    }
  }

  return {
    init,
    loginCheck
  };

})();
