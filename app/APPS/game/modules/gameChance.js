'use strict';

(function () {
  let perUnitPrice = 1;
  let curGame = null;
  let playingGame = null;
  let allGame = null;
  let selectedGameType = 'single';
  let serverTime = null;
  let gameType = {
    'single':{name:'Single',text:'Game of Chance Single : 1 points win prize: 9 Points'}
  };
  let sortCutAmt = {
    'single':[{amt:5,txt:'5'},{amt:10,txt:'10'},{amt:20,txt:'20'},{amt:30,txt:'30'},{amt:50,txt:'50'},{amt:75,txt:'75'},{amt:100,txt:'100'},{amt:200,txt:'200'}]
  };

  const popup = document.getElementById("sitePopup");

  init();

  function init() {
    getGameDetails();
    $('#pageTitle').html('Game Of Chance');
    DM_COMMON.fetchUserData();
    bindEvents();
  }

  function bindEvents() {
    $('#gameList').on('click','.runningGame,.upcoming',gamePlay);
    
    $('#gamePlay').on('click','.resetPattiBtn',resetPattiBtn);
    $('#gamePlay').on('click','.pattiAddBtn',pattiAddBtn);
    $('#gamePlay').on('click','.pattiAddSaveBtn',pattiAddSaveBtn);
    $('#gamePlay').on('click','.deleteBet',deleteBet);
    $('#gamePlay').on('click','.pattiNumDiv',pattiNumDiv);
    $('#gamePlay').on('click','.saveBtn',saveBtn);

    $('#gamePlay').on('click','.amtBox',placeAmt);

    $('#sitePopup').on('click','.innerNum',setNumber);
    $('#sitePopup').on('click','#closePopup',function(){
      popup.style.display = "none";
    });
  }

  function placeAmt(){
    $('.cppatiAmount').val($(this).attr('data-amt')*perUnitPrice)
  }

  function gamePlay(){
    curGame = $(this).closest('.boxContainer').attr('data-gameid');
    if(!curGame){
      return false;
    }
    playingGame = allGame.find(e=>e.id==curGame);
    if(!playingGame){
      return false;
    }
    $('#gameList').hide();
    $('#gamePlay').html(``);
    $('#gamePlay').show();
    $('#gamePlay').html(`
    <div class="my-3">
      <div id="gameHead"></div>
      <div id="gameBody"></div>

      <div  class="container">
        <div class="row">
          <table id="gameItemBody">
            <thead>
              <tr>
                <td>Digit</td>
                <td>Amount</td>
                <td>Delete</td>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div class="col-12 mt-3"><button style="width:100%;" type="button" class="gameButton saveBtn">Play Game</button></div>
          <div class="col-12 mt-3"></div>
        </div>
      </div>
    </div>
    `);
    DM_COMMON.gameHead();
    loadSinglePattiHTML();

    const endTime = moment(playingGame.end, 'YYYY-MM-DD HH:mm:ss');
    const givenTime = moment(serverTime, 'YYYY-MM-DD HH:mm:ss');
    if (givenTime.isBefore(endTime)) {
      DM_COMMON.startTimer(endTime.diff(givenTime,'seconds'), $('#gamePlay .out .number'),{txt:playingGame.name,id:curGame}, () => {
        window.location.reload();
      });
    }else{
      window.location.reload();
    }
  }

  function deleteBet(){
    $(this).closest('tr').remove();
  }

  function saveBtn(){
    DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), true);

    let userData = DM_COMMON.getUserData();
    let arr = [];
    let betAmount = 0;
    $( "#gameItemBody tbody tr" ).each(function( idx ) {
      arr.push({n:$(this).attr('data-num'),a:$(this).attr('data-amt')});
      betAmount += parseInt($(this).attr('data-amt'));
    });
    
    if(arr.length == 0){
      DM_TEMPLATE.showSystemNotification(0, `Please select a number and amount.`);
      DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), false);
      return false;
    }
    if(betAmount > userData.balance){
      DM_TEMPLATE.showSystemNotification(0, `Insufficient balance.`);
      DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), false);
      return false;
    }
    
    backendSource.customRequest('bet',null,{
      game:'gameChance',
      type:'bet',
      data : {bet:arr,
        user_id:auth.config.id,
        type:gameType[selectedGameType].name,
        game_id:curGame}
    },function(data){
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, "Bet place successfully.");
        DM_COMMON.fetchUserData();
        $( "#gameItemBody tbody" ).html('')
      }else{
        DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
      }
      DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), false);
    });
  }

  function resetPattiBtn(){
    $('.pattiNum').html('');
    $('.cppatiAmount').val('');
  }

  function pattiNumDiv(){
    if($('.pattiNum.one').html()==''){
      $('.pattiNum.one').html($(this).attr('data-num'));
    }else if($('.pattiNum.two').html()==''){
      $('.pattiNum.two').html($(this).attr('data-num'));
    }else if($('.pattiNum.three').html()==''){
      $('.pattiNum.three').html($(this).attr('data-num'));
    }else{
      $('.pattiNum.four').html($(this).attr('data-num'));
    }
  }

  function pattiAddBtn(){
    let num = $('.pattiNum.one').html();
    num += $('.pattiNum.two').html();
    num += $('.pattiNum.three').html();
    num += $('.pattiNum.four').html();
    if(num.length!=4){
      DM_TEMPLATE.showSystemNotification(0, `Please provide all number.`);
      return;
    }
  
    let amt = $('.cppatiAmount').val();

    if(amt=='' || parseInt(amt)<perUnitPrice){
      DM_TEMPLATE.showSystemNotification(0, `Please provide proper amount.`);
      return;
    }

    drawBetAmount(num,amt);
    resetPattiBtn();
  }

  function pattiAddSaveBtn(){
    DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), true);
    let num = $('.pattiNum.one').html();
    num += $('.pattiNum.two').html();
    num += $('.pattiNum.three').html();
    num += $('.pattiNum.four').html();
    if(num.length!=4){
      DM_TEMPLATE.showSystemNotification(0, `Please provide all number.`);
      DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
      return;
    }
    let amt = $('.cppatiAmount').val();

    if(amt=='' || parseInt(amt)<perUnitPrice){
      DM_TEMPLATE.showSystemNotification(0, `Please provide proper amount.`);
      DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
      return;
    }

    drawBetAmount(num,amt,function(){
      resetPattiBtn();
      saveBtn();
      DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
    });
  }

  function loadSinglePattiHTML(){
    $('#gameBody').html(`
      <div class="container mt-3">
        <div class="row">
          <div class="col-1">&nbsp;</div>
            <div class="col-2">
              <div class="pattiNum one"></div>
            </div>
            <div class="col-2">
              <div class="pattiNum two"></div>
            </div>
            <div class="col-2">
              <div class="pattiNum three"></div>
            </div>
            <div class="col-2">
              <div class="pattiNum four"></div>
            </div>
            <div class="col-3">
              <button type="button" class="gameButton resetPattiBtn">Reset</button>
            </div>
          
          
          <div class="col-1"></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv red" data-num="1">1</div></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="2">2</div></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv blue" data-num="3">3</div></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv sky" data-num="4">4</div></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv yellow" data-num="5">5</div></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv purple" data-num="6">6</div></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv purple" data-num="7">7</div></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv red" data-num="8">8</div></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv sky" data-num="9">9</div></div>
          <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="0">0</div></div>

          <div class="col-6 mt-3"><input type="number" class="cppatiAmount" value="" placeholder="Amount"></div>
          <div class="col-3 mt-3"><button type="button" class="gameButton pattiAddBtn">Add</button></div>
          <div class="col-3 mt-3"><button type="button" class="gameButton pattiAddSaveBtn">Play</button></div>
          <div class="col-12 mt-3"></div>
          ${amtHtml()}
        </div>
      </div>
      `);
  }

  function amtHtml(){
    let htm = ``;
    for(let i in sortCutAmt[selectedGameType]){
      htm += `<div class="col-3">
        <div class="amtBox conBox" data-amt="${sortCutAmt[selectedGameType][i].amt}">${sortCutAmt[selectedGameType][i].txt}</div>
      </div>`;
    }
    return `<div class="col-12 row">${htm}</div>`;
  }

  function drawBetAmount(num,amt,cb){
    $('#gameItemBody tbody').append(`
        <tr data-num="${num}" data-amt="${amt}">
          <td>${num}</td>
          <td>${amt}</td>
          <td><span class="deleteBet">Delete</span></td>
        </tr>
    `);
    if(cb){
      cb();
    }
  }

  async function getGameDetails(){
    let toDay = moment().format('YYYY-MM-DD');
    let game = await DM_GENERAL.fetchInplayGame([
      {'key':'game_code','operator':'is','value':'gameChance'},
      {'key':'start','operator':'higher','value':toDay+' 00:00:00'},
      {'key':'end','operator':'lower','value':toDay+' 23:59:59'},
    ]);
    
    $('#gameList').html('');
    curGame = null;
    let htm = ``;
    if(game.SUCCESS){
      if(game.MESSAGE.length>0){
        allGame = game.MESSAGE;
        serverTime = game.current_time;
        
        game.MESSAGE.sort((a,b)=>a.start.localeCompare(b.start));

        for(let i in game.MESSAGE){
          htm += `<div class="boxContainer" data-gameid="${game.MESSAGE[i].id}">
                    <div class="boxElements" >
                      <p>${game.MESSAGE[i].name}</p>
                      <div class="startTime" style="display:none;">
                          <i class="bi bi-clock-fill"></i>
                          <span class="txt">Start Time : 00:30</span>
                      </div>
                      <div class="endTime">
                          <i class="bi bi-clock-fill"></i>
                          <span class="txt">End Time: ${moment(game.MESSAGE[i].end).format("HH:mm")}</span>
                      </div>
                      <div class="endTime">
                          <i class="bi bi-clock-fill"></i>
                          <span class="txt">Result: ${moment(game.MESSAGE[i].end).add(15, 'minutes').format("HH:mm")}</span>
                      </div>
                    </div>`;
          if(game.MESSAGE[i].status==1){
            htm += `
              <div class="live-img"><img src="whitelabel/game/img/live.gif"></div>
              <div class="game runningGame">PLAY GAME</div>
            `;
          }else if(game.MESSAGE[i].status==2){
            htm += `<div class="game completed">Completed</div>`;
          }else if(game.MESSAGE[i].status==3){
            htm += `<div class="game cancel">Cancel</div>`;
          }else{
            htm += `
            <div class="live-img"><img src="whitelabel/game/img/live.gif"></div>
            <div class="game upcoming">Upcoming</div>
            `;
          }
          htm += `</div>`;
        }
      }else{
        htm += `<div class="boxContainer">
      <div class="boxElements noGame">
          No game for now
        </div>
      </div>`;
      }
    }else{
      htm += `<div class="boxContainer">
      <div class="boxElements noGame">
          No game for now
        </div>
      </div>`;
    }
    $('#gameList').html(htm);
  }

  function setNumber(){
    let num = $(this).attr('data-num');
    $('.pattiNum').html('')
    if(num[0]){
      $('.pattiNum.one').html(num[0]);
    }
    if(num[1]){
      $('.pattiNum.two').html(num[1]);
    }
    if(num[2]){
      $('.pattiNum.three').html(num[2]);
    }
    if(num[3]){
      $('.pattiNum.four').html(num[3]);
    }
    popup.style.display = "none";
  }

})();
