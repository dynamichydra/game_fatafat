'use strict';

var DM_WHITELABEL = (function() {

  function init(tenant) {

    if (typeof DM_CORE_CONFIG != 'undefined' && DM_CORE_CONFIG.DOKUME_PLATFORM === 'app') {
      subdomain = tenant;
    }

    $.getScript(`${typeof DM_CORE_CONFIG == 'undefined' ? '../' : ''}whitelabel/${tenant}/config.js`);
  }


  return {init}
})();