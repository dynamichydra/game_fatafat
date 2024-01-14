'use strict';

(function () {
  let slideIndex = 0;
  let category = null;
  // let gameStartDate = new Date("January 1, 2023 00:00:00").getTime();

  init();

  function init() {
    DM_GENERAL.fetchDefault();
    if(!auth.config.id){
      window.location = '#/login';
    }
    drawBanner();
    drawNotification();
    drawCategory();
    bindEvents();
  }

  function bindEvents() {
    $(`#homeCategory`).on('click','.cat-wrapper',showGame);
    $(`#homeGame`).on('click','.game-wrapper',function(){
      window.location = '#/game/'+$(this).attr('data-gameid');
    });
    $('#whatsappBtn').on('click',whatsappBtn);
    $('#shareBtn').on('click',shareBtn);
  }

  async function shareBtn(){
    let urlToShare = 'https://www.fatafat247.com/.com/';
    let whatsappLink = 'whatsapp://send?text=' + encodeURIComponent(urlToShare);
    window.location.href = whatsappLink;
  }

  function whatsappBtn(){
    // let phoneNumber = '+918167492476';
    let phoneNumber = '+8801866824702';
    let whatsappLink = 'whatsapp://send?phone=' + phoneNumber;
    window.location.href = whatsappLink;
  }

  function drawCategory(){
    category = DM_GENERAL.getCategory();
    if(!category){
      setTimeout(drawCategory,100);
      return false;
    }
    if(category.length>0){
      displayGame(category[0].id);
    }
  }

  function showGame(){
    let catId = $(this).attr('data-catid');
    $('.cat-img').removeClass('active');
    $(`[data-catid="${catId}"] .cat-img`).addClass('active');
    displayGame(catId);
  }

  function displayGame(catId){
    let game = DM_GENERAL.getGame();
    if(!game){
      setTimeout(function(){
        displayGame(catId);
      },100);
      return false;
    }
    let cat = category.find(a => a.id == catId);
    if(cat){
      let htm = `<h5 style="display:none;">
        ${cat.small_icon && cat.small_icon!=''?`<img src="${cat.small_icon}"/>`:''}
        ${cat.name}
        </h5>
        <div class="row">`;
      for(let i in game){
        if(game[i].category == catId){
          htm += `<div class="col-${cat.show_count} game-wrapper" data-gameid="${game[i].code}">`;
          if(game[i].bg_type=='css'){
            htm += `<div class="${game[i].bg}">
                      <img class="game-logo" src="whitelabel/${subdomain}/img/${game[i].logo}"/>
              </div>`;
          }else{
            htm += `<div class="game-img"><img src="whitelabel/${subdomain}/img/${game[i].bg}"/></div>
            <div class="game-name">${game[i].name}</div>`;
          }
          htm += `</div>`;
        }
        
      }
      htm += `</div>`;
      el('homeGame').innerHTML = htm;
    }
  }

  function drawNotification(){
    let notification = DM_GENERAL.getNotification();
    if(!notification){
      setTimeout(drawNotification,100);
      return false;
    }
    if(notification.length>0){
      el('homeNotification').innerHTML = `<marquee>${notification[0].notification}</marquee>`;
    }
  }

  function drawBanner(){
    let banner = DM_GENERAL.getBanner();
    if(!banner){
      setTimeout(drawBanner,100);
      return false;
    }
    if(banner.length>0){
      let htm = '', dotHtm='';
      for(let i in banner){
        htm += `<div class="mySlides fade">
              <img src="whitelabel/${subdomain}/img/${banner[i].path}" style="width:100%">
            </div>`;
        dotHtm += `<span class="dot"></span> `;
      }
      htm += `<div class="dotWraper">${dotHtm}</div>`;
      el('homeBanner').innerHTML = htm;
      showSlides();
    }
  }
  
  function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if(slides && slides.length>0){
      let dots = document.getElementsByClassName("dot");
      if(dots && dots.length>0){
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";  
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}    
        for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex-1].style.display = "block";  
        dots[slideIndex-1].className += " active";
        setTimeout(showSlides, 3000);
      }
    }
  }

})();