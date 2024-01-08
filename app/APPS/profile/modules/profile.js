'use strict';

(function () {

  let gameSet = {
    1:[1,100, 678, 777, 560, 470, 380, 290,119,137,236,146,669,579,399,588,489,245,155,227,344,335,128],
    2:[2,200,345,444,570,480,390,660,129,237,336,246,679,255,147,228,499,688,778,138,156,110,589],
    3:[3,300,120,111,580,490,670,238,139,337,157,346,689,355,247,256,166,599,148,788,445,229,779],
    4:[4,400,789,888,590,130,680,248,149,347,158,446,699,455,266,112,356,239,338,257,220,770,167],
    5:[5,500,456,555,140,230,690,258,159,357,799,267,780,447,366,113,122,177,249,339,889,348,168],
    6:[6,600,123,222,150,330,240,268,169,367,448,899,178,790,466,358,880,114,556,259,349,457,277],
    7:[7,700,890,999,160,340,250,278,179,377,467,115,124,223,566,557,368,359,449,269,133,188,458],
    8:[8,800,567,666,170,350,260,288,189,116,233,459,125,224,477,990,134,558,369,378,440,279,468],
    9:[9,900,234,333,180,360,270,450,199,117,469,126,667,478,135,225,144,379,559,289,388,577,568],
    0:[0,'000',127,190,280,370,460,550,235,118,578,145,479,668,299,334,488,389,226,569,677,136,244]
  };
  const popup = document.getElementById("sitePopup");
  
  init();

  function init() {
    $('#pageTitle').html('Dashboard');
    DM_COMMON.userProfileBlock(true);
    bindEvents();
  }

  function bindEvents() {
    $('.statement').on('click',function(){
      window.location = '#/wallet/statement';
    });
    $('.security').on('click',function(){
      window.location = '#/profile/changepwd';
    });
    $('.profileMenu .about').on('click',function(){
      window.location = '#/page/about';
    });
    $('.profileMenu .tutorial').on('click',function(){
      window.location = '#/page/beginners';
    });
    $('.profileMenu .service').on('click',function(){
      window.location = '#/page/service';
    });
    $('.profileMenu .pattiList').on('click',pattiList);
    $('#sitePopup').on('click','#closePopup,.closePattiList',function(){
      popup.style.display = "none";
    });
    el('logoutBTN').addEventListener('click', function (e) {
      e.preventDefault();
      DM_CORE.logout();
    });
  }

  function pattiList(){
    let htm = ``;
    for (const i in gameSet) {
      let htmT = ``;
      let c = 0;
      for(const j in gameSet[i]){
        htmT += `<div class="innerNum ${c++ ==0?'head':''}" data-num="${gameSet[i][j]}">
                  ${gameSet[i][j]}
                </div>`;
      }
      htm += `<div class="numWraper">
                  ${htmT}
            </div>`;
    }
    popup.innerHTML = `
    <div class="popup-content">
      <span class="close" id="closePopup">&times;</span>
      <h2>Patti List</h2>
      <div class="container">
        ${htm}
        <div style="clear:both;"></div>
        <button style="width:100%;margin:20px auto;" type="button" class="gameButton closePattiList">Close</button>
        </div>
      </div>`;
    popup.style.display = "block";
  }


})();