'use strict';

var DM_COMMON = (function () {

  let userData = null;

  function preSaleModal(){
    $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Presale Rule</h2>
        <p> In order to protect the legitimate rights and interests of users participating in the presale and maintain the normal cperation order of the presale, the rules are formulated in accordonce with relevant agreements and rules of national laws and regulations.Chapter 1 Definition1.1 Presale definition : refers to a sales model in which a merchant provides a product or service plan, gathers consumer orders through presale product tools, and provides goods and or services to cons umers according to prior agreement1.2 The presale model is a "dep os it" model. "Dep os it" refers to a fixed amount of presale commodity price predelivered. "The deposit" con participate in small games and have the opportunity to win more deposits. The depos it can be directy exchanged for commodities. The depos it is not redeemable.1.3 Presale products: refers to the product relecsed by merchants using presale product tools. Only the presale words are marked on the product title or product details page, ano the products thot do not use the pres ale product tools are not presale products.1.4 Presale system: Refers to the system product tools provided to support merchonts for presale model sales.1.5 Presale commodity price: refers to the selling price of presale commodity. The price of presale goods is composed of two parts: dep os it and final payment. </p>
      </div>`);
      const openPopupButton = document.getElementById("presaleBttn");
      const closePopupButton = document.getElementById("closePopup");
      const popup = document.getElementById("sitePopup");

      openPopupButton.addEventListener("click", () => {
        popup.style.display = "block";
      });

      closePopupButton.addEventListener("click", () => {
        popup.style.display = "none";
      });

      window.addEventListener("click", (event) => {
        if (event.target === popup) {
          popup.style.display = "none";
        }
      });
  }

  async function fetchUserData(){
    let data = await DM_GENERAL.userData(auth.config.id);
    if(data && data.SUCCESS){
      userData = data.MESSAGE;
      // const formattedCurrency = new Intl.NumberFormat('en-IN', {
      //   style: 'currency',
      //   currency: 'INR'
      // }).format(userData.balance);

      // const formattedCurrency = new Intl.NumberFormat('en-IN', { 
      //   maximumSignificantDigits: 3 
      //   }).format(userData.balance);

      // $('.walletBalance').html(Math.round(userData.balance));
      $('.moneytxt').html(Math.round(userData.balance));

      $('.profilePh').html('UID: '+userData.ph);
      $('.profileName').html(decodeURI(userData.name));
      $('.profileID').html('ID: 89'+auth.config.id.toString().padStart(6,"0"));
    }else{
      window.location = '#/login';
    }
  }

  function userProfileBlock(showHead=false){
    $('.profile').html(`
      ${showHead?`<div class="profileImg">
            <div>
              <img src="whitelabel/game/img/user.png" width="80px">
            </div>
            <div>
              <p class="profileName"></p>
              <p class="profileID" style="display:none;"></p>
              <p class="profilePh"></p>
            </div>
            <div>
              <span class="myProfileBtn"><i class="bi bi-chevron-double-right"></i></span>
            </div>
        </div>`:``}
      <div class="walletContainer">
        <div class="container">
          <div class="row">
            
            <div class="balance col-8">
                <div class="balanceTxt"> Balance </div>
                <div class="showBalance">
                    <span class="moneytxt">0</span>
                    <span class="refreshBalance">
                      <i class="bi bi-arrow-clockwise"></i>
                    </span>
                </div>
            </div>

            <div class="wallet col-4">
              <div class="txt">Wallets <i class="bi bi-chevron-double-right"></i></div>
            </div>
          </div>
        </div>
      </div>`);

      fetchUserData();
      $('.refreshBalance').unbind('click');
      $('.refreshBalance').on('click',updateUserBalance);
      $('.myProfileBtn').on('click',function(){
        window.location = '#/profile/myprofile'
      });
      $('.wallet').on('click',function(){
        window.location = '#/wallet'
      });
      
  }

  async function updateUserBalance(){
    DM_TEMPLATE.showBtnLoader(elq('.moneytxt'), true);
    let data = await DM_GENERAL.updateUserBalance(auth.config.id);
    if(data.SUCCESS){
      $('.moneytxt').html(Math.round(data.MESSAGE[0].bal));
    }else{
      $('.moneytxt').html(0);
    }
  }

  function getUserData(){
    return userData;
  }

  function gameHead(){
    $('#gameHead').html(`
    <div class="time-box c-row c-row-between m-b-10">
      <div class="info">
        <div class="txt"></div>
        <div class="number"></div>
      </div>
      <div class="out">
        <div class="txt"> Left time to buy </div>
        <div class="number c-row c-row-middle c-flew-end">
          <div class="item">0</div>
          <div class="item c-row-middle">:</div>
          <div class="item">0</div>
        </div>
      </div>
    </div>`);
  }

  function startTimer(duration, displayElement,info, onTimerEnd) {
    let timer = duration;
    const interval = 1000; 
    
    if(info.txt){
      $('#gameHead .info .txt').html(info.txt);
    }
    if(info.id){
      $('#gameHead .info .number').html('2'+info.id.toString().padStart(5, "0"));
    }
    
    if(timerInterval){
      clearInterval(timerInterval);
    }

    timerInterval = setInterval(function () {
      const hour = Math.floor(timer / 3600);
      const minutes = Math.floor((timer-(hour*3600)) / 60);
      const seconds = timer % 60;
      
      if(!info.template){
        $(displayElement).html(`
          ${hour>0?`
          <div class="item">${hour.toString().padStart(2, "0")}</div>
          <div class="item c-row c-row-middle">:</div>
          `:``}
          <div class="item secStore" data-src="${(hour*60*60)+(minutes*60)+seconds}">${minutes.toString().padStart(2, "0")}</div>
          <div class="item c-row c-row-middle">:</div>
          <div class="item">${seconds.toString().padStart(2, "0")}</div>
        `);
      }else if(info.template=='span'){
        $(displayElement).html(`
        ${hour>0?`
        <span class="item">${hour.toString().padStart(2, "0")}</span>
          <span class="item">:</span>
        `:``}
          <span class="item">${minutes.toString().padStart(2, "0")}</span>
          <span class="item">:</span>
          <span class="item">${seconds.toString().padStart(2, "0")}</span>
        `);
      }

      if(timer<=5){
        $(`#gameBody .mark-box`).show();
        $(`#gameBody .mark-box`).html(`
          <div class="item">0</div>
          <div class="item">${seconds}</div>
          `);
      }
      
      if (timer <= 0) {
        $(`#gameBody .mark-box`).hide();
        clearInterval(timerInterval);
        onTimerEnd();
      }
  
      timer--;
    }, interval);
  }

  function splitArray(arr, index) {
    return [arr.slice(0, index), arr.slice(index)];
  }

  return {
    preSaleModal,
    userProfileBlock,
    getUserData,
    gameHead,
    startTimer,
    fetchUserData,
    updateUserBalance,
    splitArray
  }

})();
