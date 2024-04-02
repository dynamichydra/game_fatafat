'use strict';

(function () {
  let perUnitPrice = 10;
  let curGame = null;
  let playingGame = null;
  let allGame = null;
  let selectedGameType = null;
  let serverTime = null;
  let gameType = {
    'jori':{name:'Jori',text:'SENseX : 1 points win prize: 100 Points'}
  };
  let sortCutAmt = {
    'jori':[{amt:1,txt:'1X'},{amt:3,txt:'3X'},{amt:5,txt:'5X'},{amt:10,txt:'10X'},{amt:15,txt:'15X'},{amt:25,txt:'25X'},{amt:50,txt:'50X'},{amt:100,txt:'100X'}]
  };

  const popup = document.getElementById("sitePopup");

  init();

  function init() {
    getGameDetails();
    $('#pageTitle').html('SENSEX');
    DM_COMMON.fetchUserData();
    bindEvents();
  }

  function bindEvents() {
    $('#gameList').on('click','.runningGame,.upcoming',chooseType);
    $('#gameType').on('click','.boxContainer',gamePlay);

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
    
    if(!curGame){
      return false;
    }
    playingGame = allGame.find(e=>e.id==curGame);
    if(!playingGame){
      return false;
    }
    $('#gameType').hide();
    selectedGameType = $(this).attr('data-type');
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

    // const startTime = moment(playingGame.start,'YYYY-MM-DD HH:mm:ss');
    const endTime = moment(playingGame.end, 'YYYY-MM-DD HH:mm:ss');
    const givenTime = moment(serverTime, 'YYYY-MM-DD HH:mm:ss');
    
    if (givenTime.isBefore(endTime)) {
      DM_COMMON.startTimer(endTime.diff(givenTime,'seconds'), $('#gamePlay .out .number'),{txt:playingGame.name+' - '+gameType[selectedGameType].name,id:curGame}, () => {
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
      game:'sensex',
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
    if(selectedGameType == 'single'){
      $('.pattiNum').html($(this).attr('data-num'));
    }else if(selectedGameType == 'jori'){
      if($('.pattiNum.one').html()==''){
        $('.pattiNum.one').html($(this).attr('data-num'));
      }else {
        $('.pattiNum.two').html($(this).attr('data-num'));
      }
    }else{
      if($('.pattiNum.one').html()==''){
        $('.pattiNum.one').html($(this).attr('data-num'));
      }else if($('.pattiNum.two').html()==''){
        $('.pattiNum.two').html($(this).attr('data-num'));
      }else{
        $('.pattiNum.three').html($(this).attr('data-num'));
      }
    }
  }

  function pattiAddBtn(){
    let num = $('.pattiNum.one').html();
    if(selectedGameType == 'single'){
      if(num.length!=1){
        DM_TEMPLATE.showSystemNotification(0, `Please provide the number.`);
        return;
      }
      
    }else if(selectedGameType == 'jori'){
      num += $('.pattiNum.two').html();
      if(num.length!=2){
        DM_TEMPLATE.showSystemNotification(0, `Please provide all number.`);
        return;
      }
    }else{
      num += $('.pattiNum.two').html();
      num += $('.pattiNum.three').html();
      if(num.length!=3){
        DM_TEMPLATE.showSystemNotification(0, `Please provide all number.`);
        return;
      }
    }
    let amt = $('.cppatiAmount').val();

    if(amt=='' || parseInt(amt)<perUnitPrice){
      DM_TEMPLATE.showSystemNotification(0, `Please provide proper amount.`);
      return;
    }

    // if(selectedGameType == 'single' && parseInt(amt)>5000){
    //   DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 5000 for Single.`);
    //   return;
    // }else if(selectedGameType != 'single' && parseInt(amt)>100){
    //   DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 50 for Patti.`);
    //   return;
    // }

    // let timeRemain = $('#gameHead').find('.secStore').attr('data-src');
    // if(parseInt(timeRemain) < 600){
    //   if(selectedGameType == 'single' && parseInt(amt)>500){
    //     DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 100 for Single.`);
    //     return;
    //   }else if(selectedGameType != 'single' && parseInt(amt)>30){
    //     DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 10 for Patti.`);
    //     return;
    //   }
    // }
    
    drawBetAmount(num,amt);
    resetPattiBtn();
  }

  function pattiAddSaveBtn(){
    DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), true);
    let num = $('.pattiNum.one').html();
    if(selectedGameType == 'single'){
      if(num.length!=1){
        DM_TEMPLATE.showSystemNotification(0, `Please provide the number.`);
        DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
        return;
      }
      
    }else if(selectedGameType == 'jori'){
      num += $('.pattiNum.two').html();
      if(num.length!=2){
        DM_TEMPLATE.showSystemNotification(0, `Please provide the number.`);
        DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
        return;
      }
      
    }else{
      num += $('.pattiNum.two').html();
      num += $('.pattiNum.three').html();
      if(num.length!=3){
        DM_TEMPLATE.showSystemNotification(0, `Please provide all number.`);
        DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
        return;
      }
    }
    let amt = $('.cppatiAmount').val();

    if(amt=='' || parseInt(amt)<perUnitPrice){
      DM_TEMPLATE.showSystemNotification(0, `Please provide proper amount.`);
      DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
      return;
    }

    // if(selectedGameType == 'single' && parseInt(amt)>5000){
    //   DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 5000 for Single.`);
    //   DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
    //   return;
    // }else if(selectedGameType != 'single' && parseInt(amt)>100){
    //   DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 50 for Patti.`);
    //   DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
    //   return;
    // }

    // let timeRemain = $('#gameHead').find('.secStore').attr('data-src');
    // if(parseInt(timeRemain) < 600){
    //   if(selectedGameType == 'single' && parseInt(amt)>500){
    //     DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 100 for Single.`);
    //     DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
    //     return;
    //   }else if(selectedGameType != 'single' && parseInt(amt)>30){
    //     DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 10 for Patti.`);
    //     DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
    //     return;
    //   }
    // }
    
    
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
          ${selectedGameType=='single'?`
            <div class="col-4">&nbsp;</div>
            <div class="col-3">
              <div class="pattiNum one">&nbsp;</div>
            </div>
            <div class="col-5">&nbsp;</div>
          `:`
          ${selectedGameType=='jori'?`
            <div class="col-2">&nbsp;</div>
            <div class="col-3">
              <div class="pattiNum one"></div>
            </div>
            <div class="col-3">
              <div class="pattiNum two"></div>
            </div>
            <div class="col-4">
              <button type="button" class="gameButton resetPattiBtn">Reset</button>
            </div>
          `:`
          <div class="col-2">&nbsp;</div>
            <div class="col-2">
              <div class="pattiNum one"></div>
            </div>
            <div class="col-2">
              <div class="pattiNum two"></div>
            </div>
            <div class="col-2">
              <div class="pattiNum three"></div>
            </div>
            <div class="col-4">
              <button type="button" class="gameButton resetPattiBtn">Reset</button>
            </div>
          `}`}
          
          
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

  function chooseType(){
    $('#gameList').hide();
    $('#gameType').show();
    $('#gameType').html(``);
    curGame = $(this).closest('.boxContainer').attr('data-gameid');
    playingGame = allGame.find(e=>e.id==curGame);
    selectedGameType = null;
    let htm = `
      <div class="my-3" style="text-align:center;">
        <h3>${playingGame.name}</h3>
        <p><i class="bi bi-hourglass-split"></i>&nbsp;&nbsp;&nbsp;
        <span class="number"></span>
        </p>
      </div>
      `;
    for(let i in gameType){
      htm += `<div class="boxContainer" data-type="${i}">
              <div class="box">
                ${gameType[i].name}
                <p>${gameType[i].text}</p>
              </div>
            </div>`;
    }
    $('#gameType').html(htm);
    
    const endTime = moment(playingGame.end, 'YYYY-MM-DD HH:mm:ss');
    const givenTime = moment();
    if (givenTime.isBefore(endTime)) {
      $('#gameType .number').html('End - '+moment(playingGame.end).format('HH:mm')+', Result - '+moment(playingGame.end).add(18, 'minutes').format('HH:mm'));
    }else{
      $('#gameType .number').html('close');

    }
  }

  async function getGameDetails(){
    let toDay = moment().format('YYYY-MM-DD');
    let game = await DM_GENERAL.fetchInplayGame([
      {'key':'game_code','operator':'is','value':'sensex'},
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
        
        game.MESSAGE.sort((a,b)=>a.name.localeCompare(b.name));

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
    popup.style.display = "none";
  }

})();
