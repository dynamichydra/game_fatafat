'use strict';

const DM_GENERAL = (function () {

  let BANNER = null;
  let NOTIFICATION = null;
  let CATEGORY = null;
  let GAME = null;

  function fetchDefault() {
    backendSource.getObject('banner', null, {}, function (data) {
      if (!util.errorHandler(data)) return false;
      BANNER = data.MESSAGE;
    });
    backendSource.getObject('notification', null, {}, function (data) {
      if (!util.errorHandler(data)) return false;
      NOTIFICATION = data.MESSAGE;
    });
    backendSource.getObject('category', null, {}, function (data) {
      if (!util.errorHandler(data)) return false;
      CATEGORY = data.MESSAGE;
    });
    backendSource.getObject('game', null, {}, function (data) {
      if (!util.errorHandler(data)) return false;
      GAME = data.MESSAGE;
    });
  }

  function fetchInplayGame(arr){
    return new Promise(async function (result) {
      backendSource.getObject('game_inplay', null, {where:arr}, function (data) {
        result(data);
      });
    });
  }

  function userData(id,key){
    return new Promise(async function (result) {
      if(!id){
        result(null);
        return;
      }
      backendSource.getObject('user', null, {where:[
          {'key':key??'id','operator':'is','value':id}
        ],
        select:"balance,ph,email,name,type,pid,status,id"
      }, function (data) {
        result(data);
      });
    });
  }

  function updateUserBalance(id){
    return new Promise(async function (result) {
      if(!id){
        result(null);
        return;
      }

      backendSource.customRequest('auth', null, {
        user_id: id,
        grant_type: 'updateBalance'
      }, function (data) {
        result(data);
      });
    });
  }

  function changePassword(id,opwd,npwd,cpwd,cb){
    backendSource.customRequest('auth', id, {
      oPwd: opwd,
      nPwd: npwd,
      cPwd: cpwd,
      grant_type: 'changepassword'
    }, function (data) {

      if(cb){
        return cb(data);
      }
    });
  }

  function getBanner() {
    return BANNER;
  }

  function getNotification() {
    return NOTIFICATION;
  }

  function getCategory() {
    return CATEGORY;
  }

  function getGame() {
    return GAME;
  }

  function createTags(d, s, id, url) {
    var js, fjs = d.getElementsByTagName('script')[0]; 
    if (d.getElementById(id)) return;

    js = d.createElement(s);
    js.id = id;
    if (s === 'script') {
      js.src = url;
      js.defer = 'defer';
      js.async = false;
    } else {
      js.href = url;
      js.rel = 'stylesheet';
    }
    fjs.parentNode.insertBefore(js, fjs);
  }

  return {
    fetchDefault,
    fetchInplayGame,
    getBanner,
    getNotification,
    getCategory,
    createTags,
    userData,
    changePassword,
    updateUserBalance,
    getGame
  }

})();