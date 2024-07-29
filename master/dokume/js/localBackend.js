(function() {
  'use strict';

  var DokuMe_LocalBackend = function(server, token, refreshOauthFN) {

    this.server = server;
    this.ACCESSID = null;
    this.PROFILEID = null;
    this.headers = null;
    this.accesstoken = token;
    this.timezone = null;
    this.refreshOauthFN = refreshOauthFN;

    this.failedRequests = [];
    this.customArr = ["participant_fields"];
  };

  DokuMe_LocalBackend.prototype.gameRequest = function(object,task, params, callback) {
    if (!object) return false;
    let _ = this;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "TYPE": object,
      "TASK": task,
      "DATA": params
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    _.executeRequest(DM_CORE_CONFIG.SERVER_URL+DM_CORE_CONFIG.URL_GAME, requestOptions, callback, 'getObject');
  };

  DokuMe_LocalBackend.prototype.sportsRequest = function(object,task, params, callback) {
    if (!object) return false;
    let _ = this;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "TYPE": object,
      "TASK": task,
      "DATA": params
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    _.executeRequest(DM_CORE_CONFIG.SERVER_URL+DM_CORE_CONFIG.URL_SPORTS, requestOptions, callback, 'getObject');
  };

  DokuMe_LocalBackend.prototype.getObject = function(object, instance, params, callback) {
    if (!object) return false;
    var _ = this;

    // params = _.prepareParams(params);
    if(instance){
      let condition = {key:'id', operator:'is',value:instance};
      if(params && params.where){
        params.where.push(condition);
      }else if(params){
        params.where = [condition];
      }else{
        params = {where:[condition]};
      }
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "TYPE": object,
      "TASK": "get",
      "DATA": params
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    _.executeRequest(DM_CORE_CONFIG.SERVER_URL+DM_CORE_CONFIG.URL_SUFIX, requestOptions, callback, 'getObject');
  };

  DokuMe_LocalBackend.prototype.saveObject = function(object, instanceId, json, callback, specialHeaders) {
    if (!object || !json) {
      console.warn('Object ID is not defined. Can\'t save object');
      return false;
    }
    var _ = this;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (instanceId)
      json["id"] = instanceId;
    var raw = JSON.stringify({
      "TYPE": object,
      "TASK": "set",
      "DATA": json
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    _.executeRequest(DM_CORE_CONFIG.SERVER_URL+DM_CORE_CONFIG.URL_SUFIX, requestOptions, callback, 'saveObject');
  };

  DokuMe_LocalBackend.prototype.customRequest = function(object, instanceId, json, callback, specialHeaders) {
    if (!object || !json) {
      console.warn('Object ID is not defined. Can\'t save object');
      return false;
    }
    let _ = this;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    json = json??{};
    if (instanceId) json["id"] = instanceId;
    let raw = JSON.stringify({
      "TYPE": object,
      "DATA": json
    });
    
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    _.executeRequest(DM_CORE_CONFIG.SERVER_URL+DM_CORE_CONFIG.URL_SUFIX, requestOptions, callback, 'customRequest');
  };

  DokuMe_LocalBackend.prototype.deleteObject = function(object, instanceId, callback) {
    if (!object || !instanceId) return false;
    var _ = this;
    var json = null;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (Array.isArray(instanceId)) {
      json = instanceId;
    }else{
      json = {"id":instanceId};
    }
    var raw = JSON.stringify({
      "TYPE": object,
      "TASK": "delete",
      "DATA": json
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    _.executeRequest(DM_CORE_CONFIG.SERVER_URL+DM_CORE_CONFIG.URL_SUFIX, requestOptions, callback, 'deleteObject');
  };

  DokuMe_LocalBackend.prototype.replaceObject = function (object, json, keyfields, callback) {
    if (!object || !keyfields || !json) {
      console.warn('Object ID is not defined. Can\'t save object');
      return false;
    }

    var _ = this;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "TYPE": object,
      "TASK": _.customArr.includes(object)?"custom":"put",
      "DATA": {dm_keyfield:keyfields,data:json}
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    _.executeRequest(DM_CORE_CONFIG.SERVER_URL+DM_CORE_CONFIG.URL_SUFIX, requestOptions, callback, 'replaceObject');
  };

  DokuMe_LocalBackend.prototype.patch = function(object, json, callback) {
    if (!object || !json) {
      console.warn('Object ID is not defined. Can\'t save object');
      return false;
    }
    var _ = this;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "TYPE": object,
      "TASK": "patch",
      "DATA": json
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    _.executeRequest(DM_CORE_CONFIG.SERVER_URL+DM_CORE_CONFIG.URL_SUFIX, requestOptions, callback, 'patch');
  };

  DokuMe_LocalBackend.prototype.executeRequest = function(url, options, callback, method) {
    var _ = this;

    fetch(url, options)
    .then(function(response) {
      if (response.headers.get('Content-Type').includes('json')) {
        return response.json();
      } else if (response.headers.get('Content-Type').includes('openxmlformats')) {
        return response.blob();
      } else if (response.headers.get('Content-Type').includes('xml')) {
        return response.text();
      } else {
        return response.blob();
      }
    })
    .then(function(data) {
      
      if (data.SUCCESS === false && data.MESSAGE === 'OAuth verification failed') {
        console.log('oAuth error done - i will retry the request');

        _.failedRequests.push({
          url: url,
          options: options,
          callback: callback,
          method: _.getObject
        });

        if (_.refreshOauthFN) { 
          _.refreshOauthFN(true);

          // dont do the callback, because we will retry the request after getting a new token
          return false;
        }

        // dont do the callback, because we will retry the request after getting a new token
        return false;
      }

      _.executeCallback(callback, data, method);
    }).catch(function(data) {
      _.failedRequestHandler(data, url, options, callback);
    })
  };

  DokuMe_LocalBackend.prototype.failedRequestHandler = function(data, url, options, callback) {
    console.trace(data);
    
    try {
      data = JSON.parse(data.responseText);

      if (data.SUCCESS === false && data.MESSAGE === 'OAuth verification failed') {
        console.log('oAuth error fail');
      }
    } catch (err) {
      //return false;
      console.log(err);
    }
  };

  DokuMe_LocalBackend.prototype.prepareParams = function (params) {

    if (params && params.where && typeof params.where === 'object') {
      params.where = JSON.stringify(params.where);
    }

    if (!params) {
      params = {
        include_data: true
      };
    }

    if (params.include_data === undefined) {
      params.include_data = true;
    }

    if (params && params.references && typeof params.references === 'object') {
      params.references = JSON.stringify(params.references);
    }

    if (params && params.limit && typeof params.limit === 'object') {
      params.limit = JSON.stringify(params.limit);
    }

    if (params && params.fields && typeof params.fields === 'object') {
      params.fields = JSON.stringify(params.fields);
    }

    if (params && params.shared && typeof params.shared === 'object') {
      //params.shared = JSON.stringify(params.shared);
      if (typeof params.shared.grouped != 'undefined') {
        params['shared[grouped]'] = params.shared.grouped;
      } 
      
      if (typeof params.shared.type != 'undefined') {
        params['shared[type]'] = params.shared.type;
      }
      
      if (typeof params.shared.grouped != 'undefined' || typeof params.shared.type != 'undefined') {
        params.shared = null;
      }
    }

    return params;
  };
  

  /*
   * check if callback is defined, else console info
   */
  DokuMe_LocalBackend.prototype.executeCallback = function(callback, data, name) {
    if (typeof callback === 'function') {
      callback(data);
    } else {
      console.info("Define callback for " + name);
    }
  };

  //expose FileStorage to window
  window.DokuMe_LocalBackend = DokuMe_LocalBackend;
})();
