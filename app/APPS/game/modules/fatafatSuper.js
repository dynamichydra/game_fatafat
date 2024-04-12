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
  let curGame = null;
  let playingGame = null;
  let allGame = null;
  let selectedGameType = null;
  let serverTime = null;
  let gameType = {
    'single':{name:'Single',text:'Siliguri Fatafat Single : 1 points win prize: 9.1 Points'},
    'patti':{name:'Patti', text: 'Siliguri Fatafat Patti: 1 points win prize: 125 Points'}
  };
  let sortCutAmt = {
    'single':[{amt:10,txt:'10'},{amt:50,txt:'50'},{amt:100,txt:'100'},{amt:250,txt:'250'},{amt:500,txt:'500'},{amt:1000,txt:'1k'},{amt:3000,txt:'3k'},{amt:5000,txt:'5k'}],
    'patti':[{amt:5,txt:'5'},{amt:10,txt:'10'},{amt:15,txt:'15'},{amt:20,txt:'20'},{amt:25,txt:'25'},{amt:30,txt:'30'},{amt:40,txt:'40'},{amt:50,txt:'50'}]
  };

  const popup = document.getElementById("sitePopup");

  init();

  function init() {
    getGameDetails();
    $('#pageTitle').html('Siliguri Fatafat');
    DM_COMMON.fetchUserData();
    bindEvents();
  }

  function bindEvents() {
    $('#gameList').on('click','.runningGame,.upcoming',chooseType);
    $('#gameType').on('click','.boxContainer',gamePlay);

    $('#gamePlay').on('click','.resetPattiBtn',resetPattiBtn);
    $('#gamePlay').on('click','.pattiList',pattiList);
    $('#gamePlay').on('click','.pattiAddBtn',pattiAddBtn);
    $('#gamePlay').on('click','.pattiAddSaveBtn',pattiAddSaveBtn);
    $('#gamePlay').on('click','.deleteBet',deleteBet);
    $('#gamePlay').on('click','.cppatiBtn',cppatiBtn);
    $('#gamePlay').on('click','.pattiNumDiv',pattiNumDiv);
    $('#gamePlay').on('click','.saveBtn',saveBtn);

    $('#gamePlay').on('click','.amtBox',placeAmt);

    $('#sitePopup').on('click','.innerNum',setNumber);
    $('#sitePopup').on('click','#closePopup,.closePattiList',function(){
      popup.style.display = "none";
    });
  }

  function placeAmt(){
    $('.cppatiAmount').val($(this).attr('data-amt'))
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
    if(selectedGameType=='cppatti'){
      loadCppattiHTML();
    }else{
      loadSinglePattiHTML();
    }


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

    if(selectedGameType == 'single'){
      $( "#gameBody .inputAmt" ).each(function( idx ) {
        let amt = $(this).val();
        if(amt != '' && amt != '0' && parseInt(amt)<5000 ){
          drawBetAmount($(this).attr('data-no'),amt);
        }
      });
    }

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
      game:'fatafatSuper',
      type:'bet',
      data : {bet:arr,
        user_id:auth.config.id,
        type:gameType[selectedGameType].name,
        game_id:curGame}
    },function(data){
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, "Bet place successfully.");
        DM_COMMON.fetchUserData();
        $( "#gameItemBody tbody" ).html('');
        $( "#gameBody .inputAmt" ).val('');
      }else{
        DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
      }
      DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), false);
    });
  }

  function cppatiBtn(){
    let num = $('.cppatiNum').val();
    let amt = $('.cppatiAmount').val();
    
    if(num.length!=3 && num.length!=4){
      DM_TEMPLATE.showSystemNotification(0, `Please provide 3/4 digit number.`);
      return;
    }
    if(amt=='' || parseInt(amt)<5){
      DM_TEMPLATE.showSystemNotification(0, `Please provide proper amount.`);
      return;
    }

    let results = [];
    for(let i in gameSet){
      for(let j in gameSet[i]){
        let score = 0;
        for(let k = 0; k<num.length;k++){
          if(gameSet[i][j].toString().search(num[k].toString())!=-1){
            score++;
          }
        }
        if(score>2){
          results.push(gameSet[i][j]);
        }
      }
    }
    $('#gameItemBody tbody').html('');
    if(results.length>0){
      results.sort();
      for(let i in results){
        drawBetAmount(results[i],amt);
      }
    }else{
      DM_TEMPLATE.showSystemNotification(0, `Combination not found.`);
    }
    $('.cppatiNum').val('');
    $('.cppatiAmount').val('');
  }

  function loadCppattiHTML(){
    $('#gameBody').html(`
      <div class="container mt-3">
        <div class="row">
          <div class="col-6">Digit</div>
          <div class="col-6"><input type="number" class="cppatiNum" value="" placeholder="3-4 digit number"></div>
          <div class="col-6 mt-3">Amount</div>
          <div class="col-6 mt-3"><input type="number" class="cppatiAmount" value="" placeholder="Amount"></div>
          <div class="col-12">&nbsp;</div>
          ${amtHtml()}
          <div class="col-6">&nbsp;</div>
          <div class="col-6 mt-3"><button type="button" class="gameButton cppatiBtn">Add</button></div>
        </div>
      </div>
      `);
  }

  function resetPattiBtn(){
    $('.pattiNum').html('');
    $('.cppatiAmount').val('');
  }

  function pattiNumDiv(){
    if(selectedGameType == 'single'){
      $('.pattiNum').html($(this).attr('data-num'));
    }else{
      if($('.pattiNum.one').html()==''){
        $('.pattiNum.one').html($(this).attr('data-num'));
      }else if($('.pattiNum.two').html()==''){
        $('.pattiNum.two').html($(this).attr('data-num'));
      }else{
        $('.pattiNum.three').html($(this).attr('data-num'));

        let num =  $('.pattiNum.one').html()+$('.pattiNum.two').html()+$('.pattiNum.three').html();
        let found = false;
        for(let i in gameSet){
          if(found) continue;
          for(let j in gameSet[i]){
            if(found) continue;
            if(parseInt(gameSet[i][j])==parseInt(num)){
              found = true;
            }
          }
        }
        if(!found){
          DM_TEMPLATE.showSystemNotification(0, `Wrong Patti.`);
          $('.pattiNum.three').html('');
        }
        
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
      
    }else{
      num += $('.pattiNum.two').html();
      num += $('.pattiNum.three').html();
      if(num.length!=3){
        DM_TEMPLATE.showSystemNotification(0, `Please provide all number.`);
        return;
      }
    }
    let amt = $('.cppatiAmount').val();

    if(amt=='' || parseInt(amt)<5){
      DM_TEMPLATE.showSystemNotification(0, `Please provide proper amount.`);
      return;
    }

    if(selectedGameType == 'single' && parseInt(amt)>100000){
      DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 100000 for Single.`);
      return;
    }else if(selectedGameType != 'single' && parseInt(amt)>10000){
      DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 10000 for Patti.`);
      return;
    }

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
    
    let found = false;
    for(let i in gameSet){
      if(found) continue;
      for(let j in gameSet[i]){
        if(found) continue;
        if(parseInt(gameSet[i][j])==parseInt(num)){
          found = true;
        }
      }
    }
    if(!found){
      DM_TEMPLATE.showSystemNotification(0, `Wrong Patti.`);
      return;
    }
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

    if(amt=='' || parseInt(amt)<5){
      DM_TEMPLATE.showSystemNotification(0, `Please provide proper amount.`);
      DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
      return;
    }

    if(selectedGameType == 'single' && parseInt(amt)>100000){
      DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 100000 for Single.`);
      DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
      return;
    }else if(selectedGameType != 'single' && parseInt(amt)>10000){
      DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 10000 for Patti.`);
      DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
      return;
    }

    let timeRemain = $('#gameHead').find('.secStore').attr('data-src');
    if(parseInt(timeRemain) < 600){
      if(selectedGameType == 'single' && parseInt(amt)>500){
        DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 100 for Single.`);
        DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
        return;
      }else if(selectedGameType != 'single' && parseInt(amt)>30){
        DM_TEMPLATE.showSystemNotification(0, `Maximum bet amount is 10 for Patti.`);
        DM_TEMPLATE.showBtnLoader(elq('.pattiAddSaveBtn'), false);
        return;
      }
    }
    
    let found = false;
    for(let i in gameSet){
      if(found) continue;
      for(let j in gameSet[i]){
        if(found) continue;
        if(parseInt(gameSet[i][j])==parseInt(num)){
          found = true;
        }
      }
    }
    if(!found){
      DM_TEMPLATE.showSystemNotification(0, `Wrong Patti.`);
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
    let htm = ``; 
    
    if(selectedGameType=='single'){
      htm += `

      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv red" data-num="1">1</div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="2">2</div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv blue" data-num="3">3</div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv sky" data-num="4">4</div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv blue" data-num="5">5</div></div>
      
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="1" value=""/></div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="2" value=""/></div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="3" value=""/></div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="4" value=""/></div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="5" value=""/></div></div>
      
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv sky" data-num="6">6</div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="7">7</div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv red" data-num="8">8</div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv sky" data-num="9">9</div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="0">0</div></div>

      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="6" value=""/></div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="7" value=""/></div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="8" value=""/></div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="9" value=""/></div></div>
      <div class="numbtn col-2" style="padding: 0px 5px;"><div class="pattiNumInput"><input type="number" class="inputAmt" placeholder="0" data-no="0" value=""/></div></div>
      
        `;
    }else{
      htm += `<div class="col-2">&nbsp;</div>
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
      <div class="col-2 pattiList" style="font-size: 30px;color: #f94b55;display:none;"><i class="bi bi-postcard-heart-fill"></i></div>


      <div class="col-1"></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv red" data-num="1">1</div></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="2">2</div></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv blue" data-num="3">3</div></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv sky" data-num="4">4</div></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv blue" data-num="5">5</div></div>
      <div class="col-1"></div>
      <div class="col-1"></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv sky" data-num="6">6</div></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="7">7</div></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv red" data-num="8">8</div></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv sky" data-num="9">9</div></div>
      <div class="col-2" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="0">0</div></div>

      <div class="col-6 mt-3"><input type="number" class="cppatiAmount" value="" placeholder="Amount"></div>
      <div class="col-3 mt-3"><button type="button" class="gameButton pattiAddBtn">Add</button></div>
      <div class="col-3 mt-3"><button type="button" class="gameButton pattiAddSaveBtn">Play</button></div>
      <div class="col-12 mt-3"></div>

      ${amtHtml()}
      `;
    }

    $('#gameBody').html(`
      <div class="container mt-3">
        <div class="row">
          ${htm}
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
      {'key':'game_code','operator':'is','value':'fatafatSuper'},
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
      <h2>Select a number</h2>
      <div class="container">
        ${htm}
        <div style="clear:both;"></div>
        <button style="width:100%;margin:20px auto;" type="button" class="gameButton closePattiList">Close</button>
        </div>
      </div>`;
    popup.style.display = "block";
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
