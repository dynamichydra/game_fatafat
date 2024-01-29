var access_id, routingid, access_routingid = '';
var access_info;
var admin_id, isGroup;

var page_name, app_name;
var get_param1, get_param2, get_param3;


var LAST_LOADED_APP_CONFIG = null;

/* routing */
var DM_ROUTING = (function () {

  var pageTitle = el('pageTitle');

  var APP_LOCK = null;
  var APP_LOCK_WHITELIST = [];

  function init() {
    if (typeof cordova !== 'undefined') {
      document.addEventListener('deviceready', function () {
        initRoutes();
        initHasher();
      });
    } else {
      initRoutes();
      initHasher();
    }
  }

  function initRoutes() {
    
    //normale seiten
    crossroads.addRoute('{page}/:subPage:/:param1:/:param2:/:param3:', function (page, subPage, param1, param2, param3) {
      initRoute(null, null, page, subPage, param1, param2, param3);
    });

    //keine route passt
    crossroads.bypassed.add(function (request) {

      if (DM_CORE_CONFIG.AUTH_MODE === 'private' && DM_CONFIG && DM_CONFIG.STARTPAGE) {
        window.location = '#/' + DM_CONFIG.STARTPAGE;
      } else if (DM_CORE_CONFIG.LANDING_URL) {
        window.location = DM_CORE_CONFIG.LANDING_URL;
      } else {
        $("#mainContent").load(`APPS/dashboard_app/index.html`);
      }

    });
  }

  /*****************setup hasher*******************/
  function initHasher() {

    hasher.initialized.add(parseHash);
    //parse initial hash
    hasher.changed.add(parseHash);
  }

  function parseHash(newHash, oldHash) {
    crossroads.parse(newHash);
  }

  function changeHash(url, setGet_param1, setGet_param2) {
    hasher.changed.active = false;

    if (setGet_param1 || setGet_param1 === null) {
      get_param1 = setGet_param1;
    }

    if (setGet_param2 || setGet_param2 === null) {
      get_param2 = setGet_param2;
    }

    hasher.setHash(url);
    hasher.changed.active = true;
  }

  function initRoute(id, admin, page, subPage, param1, param2, param3) {

    if (access_id != id) {
      access_id = id;
    }

    el('mainContent').innerHTML = '';

    if (!id) {
      isGroup = null;

      access_info = null;
    }

    access_id = id;
    routingid = id ? `${access_id}/` : '';
    access_routingid = id ? `access/${access_id}/` : '';
    admin_id = admin;
    get_param1 = param1;
    get_param2 = param2;
    get_param3 = param3;
    app_name = page;

    if (!page) {
      
    } else if (!subPage) {
      page_name = page;
      getPage(page_name);
    } else {
      page_name = subPage;
      getPage(page_name, page);
    }

    if (page) {
      if(page=='home'){
        el('subNavbar').style.display = 'none';
        el('mainNavbar').style.display = 'block';
      }else{
        el('mainNavbar').style.display = 'none';
        el('subNavbar').style.display = 'block';
      }
      // pageTitle.innerHTML = page;

      if (page !== 'dashboard') {
        localStorage.setItem('lastpage', JSON.stringify({
          name: 'menu.' + page,
          link: window.location.href
        }));
      }
    } else {
      // pageTitle.innerHTML = '';
    }

  }

  function loadConfig(appUrl) {

    if (appUrl === LAST_LOADED_APP_CONFIG) {
      return false;
    }

    LAST_LOADED_APP_CONFIG = appUrl;

    el('mainContentHeader').innerHTML = '';
  }

  function getPage(url, appUrl) {

    if ($('.navbar-collapse.show, .sidebar').length > 0) {
      $('.navbar-collapse.show, .sidebar').collapse('hide');
    }

    loadPage(url, appUrl);
    loadConfig(appUrl ? appUrl : url);
  }

  function loadPage(url, appUrl) {
    let loadingUrl = appUrl !== undefined ? `APPS/${appUrl}/${url}.html` : `APPS/${url}/index.html`;
    loadingUrl += '?v=' + Date.now();
    
    if((!auth || !auth.config.id || auth.config.id == 'null' || auth.config.type !='user' || auth.config.change_pwd ==2) && app_name != 'login'){
      window.location = "#/login";
      return;
    }

    if(auth.config.change_pwd !=1 && page_name != 'changepwd' && app_name != 'login'){
      window.location = "#/profile/changepwd";
      return;
    }

    $('#mainContent').load(loadingUrl, function (response, status, xhr) {
      if (status === 'error') {
        el('mainContent').innerHTML = `
        <div class="container">
          <div id="notFoundANIM"></div>

          <h1 class="text-center mb-3">
            <span style="color:red;">Ohh.....</span>You requested a page that is no longer there
          </h1>
          <br>
          <div class="text-center">
            <a href="#/${access_routingid}dashboard_app" class="btn btn-lg btn-primary">Back to dashboard</a>
          </div>
        </div>`;

        if (typeof bodymovin !== 'undefined') {
          var animation = bodymovin.loadAnimation({
            container: document.getElementById('notFoundANIM'),
            path: 'https://assets6.lottiefiles.com/packages/lf20_c8szgzpw.json',
            renderer: 'svg',
            loop: true,
            autoplay: true,
            name: 'stopwatch'
          });
        }

      }
    });
  }

  function toggleAppLock(state, whitelist) {
    if (state) {
      APP_LOCK = true;
      APP_LOCK_WHITELIST = whitelist;
    } else {
      APP_LOCK = false;
    }
  }

  return {
    init,
    toggleAppLock,
    getPage,
    loadConfig,
    changeHash
  };
})();
