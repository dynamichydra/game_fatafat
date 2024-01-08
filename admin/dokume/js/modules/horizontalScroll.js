//https://alvarotrigo.com/blog/scroll-horizontally-with-mouse-wheel-vanilla-java/

'use strict';

var DM_SCROLL_TOOL = (function() {

  var scrollHorizontal = false;

  function initHorizontal(selector, showButton) {
    var scrollContainer = document.querySelector(selector);

    scrollContainer.addEventListener('wheel', (evt) => {
      if (scrollHorizontal) {
        evt.preventDefault();
        scrollContainer.scrollLeft += evt.deltaY;
      }
    });

    if (showButton) {
      showScrollToggleBTN();
    }
  }

  function showScrollToggleBTN() {
    if (elq('.DM_HORIZONTAL_SCROLL_TOGGLER').fallBackElement) {
      el('mainContent').insertAdjacentHTML('beforeend', `
      <button class="btn btn-secondary DM_HORIZONTAL_SCROLL_TOGGLER" onclick="DM_SCROLL_TOOL.toggleScrollDirection();" style="position: fixed; bottom: 20px;right: 20px"><i class="bi bi-arrow-down-up"></i></button>
      `);
    }
  }

  function toggleScrollDirection() {
    if (scrollHorizontal) {
      scrollHorizontal = false;
      elq('.DM_HORIZONTAL_SCROLL_TOGGLER').innerHTML = '<i class="bi bi-arrow-down-up"></i>'
    } else {
      scrollHorizontal = true;
      elq('.DM_HORIZONTAL_SCROLL_TOGGLER').innerHTML = '<i class="bi bi-arrow-left-right"></i>'
    }
  }

  return {initHorizontal, toggleScrollDirection}
})();