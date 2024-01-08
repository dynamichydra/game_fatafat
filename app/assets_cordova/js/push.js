//https://github.com/chemerisuk/cordova-plugin-firebase-messaging
var DM_MOBILE_PUSHNOTIFICATION = (function() {

  var FCM_TOKEN = null;

  function init() {

    if (typeof cordova === 'undefined') return false;
    
    if (!cordova.plugins || !cordova.plugins.firebase === 'undefined') {
      setTimeout(init, 1000);
      return false;
    }

    cordova.plugins.firebase.messaging.requestPermission().then(function() {

      getToken();

      cordova.plugins.firebase.messaging.onMessage(function(payload) {
        
        console.log("New foreground FCM message: ", payload);
        let patloadJSON = {
          ID: payload.id,
          TITLE: device.platform == 'iOS' ? payload.aps.alert.title : payload.gcm.title,
          BODY: device.platform == 'iOS' ? payload.aps.alert.body : payload.gcm.body,
          CATEGORIES: payload.categories ? JSON.parse(payload.categories) : []
        }
        localStorage.setItem('patload', JSON.stringify(patloadJSON));

      });

      cordova.plugins.firebase.messaging.onBackgroundMessage(function(payload) {
        console.log("New background FCM message: ", payload);
        if (payload.url) {
          window.location = '#' + payload.url;
        } else {
          window.location = `#/news/detail/${payload.id}`;
        }
      });

      if (cordova.plugins.firebase.messaging.registerActions) {
        cordova.plugins.firebase.messaging.registerActions("reply", [{
          id: 'reply',
          title: 'Antworten',
          emptyText: 'Nachricht eingeben',
          type: 'input'
        }]);
      }

    });
  }

  function getToken() {

    console.log("Push messaging is allowed");
    //cordova.plugins.firebase.messaging.subscribe('user-' + auth.config.id);

    cordova.plugins.firebase.messaging.getToken().then(function(token) {
      console.log("Got device token: ", token);
      FCM_TOKEN = token;
    });
  }



  function unregister(callback) {


    if (typeof cordova !== 'undefined') {
      cordova.plugins.firebase.messaging.unsubscribe('user-' + auth.config.id);
    }


    if (!FCM_TOKEN) {
      if (callback) {
        callback();
      }

    } 

  }

  return {
    init,
    unregister
  };

})();
