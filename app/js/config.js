var DM_CORE_CONFIG = {
  SERVER_URL: 'http://localhost:3005/',
  BACKEND_URL: 'http://localhost:3005/',
  // SERVER_URL: 'https://api.fatafat247.com/',
  // BACKEND_URL: 'https://api.fatafat247.com/',
  URL_SUFIX: 'task/submit', 
  URL_GAME: 'game', 
  API_KEY: 'f2C7GwrWYK3hzOOnfnGmu7qqvXpdWoI6ZBitA2STwPhWUE4e1jbKp8B8wYCoDaBu',
  DOKUME_PLATFORM: 'private',
  SUBDOMAIN_WHITELABEL: true, // load a subdomain depending whitelabel
  AUTH_MODE: 'private', // private, landing, public, mix
  LANDING_URL: '#/home',
  AUTH_SUCCESS_URL: '#/home',
  LOGIN_CALLBACK: null,
  LOGOUT_CALLBACK: null,
  WEBSOCKET: 'wss://development.dokume.net',
  VERIFY_EMAIL: true,
  MODE: 'test',
  PLATFORM_NAME: 'Game APP',
  PLATFORM_TEMPLATE: 1,
  VERSION:'0.0000.15'
}

var str = window.location.href;
var arrValue = str.split("//");
var arrSecondValue = arrValue[1].split(".");
var subdomain = arrSecondValue[0];
var INDEXDB = null;
var SERVER_TYPE = 'local';
var DATA_SOURCE = 'mysql';

var timerInterval = null;

subdomain = 'game';