'use strict';

var DM_TEMPLATE = (function () {

  var isInitTemplate = false;

  function init() {

    if (isInitTemplate) {
      return false;
    }

    isInitTemplate = true;

    bindEvents();
    initNotification();

  }

  function bindEvents() {
    
  }

  function initNotification() {

    if (typeof socket === 'undefined' || !socket) {
      setTimeout(initNotification, 100);
      return false;
    }

    bindEventsNotification();
  }

  function bindEventsNotification() {
    
  }

  function showSystemNotification(type, text, callback) {
    text = decodeURIComponent(text);
    text = text.replace(/<[^>]+>/g, '');

    if (type === 3) {
      //showStaticNotification(type, text, callback);
      return false;
    }

    var colorClass = 'bg-success text-white';

    if (type == 0) {
      colorClass = 'bg-danger text-white';
    } else if (type == 2) {
      colorClass = 'bg-info text-white';
    }

    el('DM_LIVE_TOAST_WRAPPER').innerHTML = `
    <div id="liveToast" class="toast ${colorClass}" role="alert" aria-live="assertive" aria-atomic="true">
      
      <!--<div class="toast-header">
        <!--<img src="..." class="rounded me-2" alt="...">
        <strong class="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
      </div>-->
      <div class="toast-body">
        <button type="button" class="btn-close btn-close-white pull-right" data-bs-dismiss="toast" aria-label="Close"></button>
        ${text}
        
        ${callback ? `<div class="mt-2 pt-2 border-top">
          <button id="DM_TOAST_ACTION_BTN" type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast" aria-label="Close">Mehr Info</button>
        </div>` : ''}
      </div>
    
    </div>`;

    if (callback) {
      el('DM_TOAST_ACTION_BTN').addEventListener('click', callback)
    }

    var toastLiveExample = document.getElementById('liveToast')
    var toast = new bootstrap.Toast(toastLiveExample)

    toast.show()
  }

  function setDesign(data) {
    if (!data) return false;

    if (data == '0') {
      elq('[data-bs-theme]').dataset.bsTheme = 'dark';
    } else {
      elq('[data-bs-theme]').dataset.bsTheme = 'light';
    }
  }

  function showLoader(selector, type, size) {
    if (type == 1) {
      elq(selector).innerHTML = `
      <tr>
        <td class="placeholder-glow" colspan="${size ?? 4}">
          <span class="placeholder col-7"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-7"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-3"></span>
          <span class="placeholder col-8"></span>
        </td>
      </tr>`;
    } else {
      elq(selector).innerHTML = `
      <div class="placeholder-glow" style="grid-column: span ${size ?? 3}; ">
        <span class="placeholder col-7"></span>
        <span class="placeholder col-4"></span>
        <span class="placeholder col-4"></span>
        <span class="placeholder col-6"></span>
        <span class="placeholder col-8"></span>
      </div>`
    }
  }

  function showBtnLoader(btn, show) {
    if (show) {
      btn.disabled = true;
      btn.insertAdjacentHTML('afterbegin', '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>');
    } else {
      btn.getElementsByClassName('spinner-border')[0].remove();
      btn.disabled = false;
    }
  }

  return {
    init: init,
    showPage: showPage,
    showSystemNotification: showSystemNotification,
    showLoader, showLoader,
    showBtnLoader: showBtnLoader,
    setDesign: setDesign
  };

})();


function createPicker(selector, time, date, humanFriendly, defaultDate) {
  if (!time) time = false;
  if (!date) date = false;

  var options = {
    enableTime: time,
    noCalendar: date,
    locale: 'de',
    time_24hr: true
  };

  if (humanFriendly) {
    options.altInput = true;
    options.altFormat = 'j. F Y';
    options.dateFormat = 'Y-m-d';
  }
  if (defaultDate) {
    options.defaultDate = defaultDate;
  }
  var picker = new flatpickr(selector, options);

  return picker;
}

function showPage(selector) {
  $('.pagetoggle').hide();
  $(selector).show();
}

function el(id) {
  var el = document.getElementById(id);
  if (!el) {
    return returnFallback(id);
  }
  return el;
}

function elq(selector) {
  var el = document.querySelector(selector);
  if (!el) {
    return returnFallback(selector);
  }
  return el;
}

function returnFallback(selector) {
  //throw new ReferenceError(id + " is not defined");
  return {
    fallBackElement: true,
    value: '',
    innerHTML: '',
    style: {
      display: ''
    },
    insertAdjacentHTML: function () {
      console.warn(selector + " is not defined");
    },
    addEventListener: function () {
      console.warn(selector + " is not defined");
    },
    classList: {
      add: function () {
        console.warn(selector + " is not defined");
      },
      remove: function () {
        console.warn(selector + " is not defined");
      }
    },
    dataset: {},
    notExisting: true,
    reset: function () {
      console.warn(selector + " is not defined");
    },
    getContext: function () {
      console.warn(selector + " is not defined");
    }
  }
}
