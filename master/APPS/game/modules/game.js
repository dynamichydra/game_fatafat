'use strict';

(function () {
  let gameSet = {
      'one':[1,100, 678, 777, 560, 470, 380, 290,119,137,236,146,669,579,399,588,489,245,155,227,344,335,128],
      'two':[2,200,345,444,570,480,390,660,129,237,336,246,679,255,147,228,499,688,778,138,156,110,589],
      'three':[3,300,120,111,580,490,670,238,139,337,157,346,689,355,247,256,166,599,148,788,445,229,779],
      'four':[4,400,789,888,590,130,680,248,149,347,158,446,699,455,266,112,356,239,338,257,220,770,167],
      'five':[5,500,456,555,140,230,690,258,159,357,799,267,780,447,366,113,122,177,249,339,889,348,168],
      'six':[6,600,123,222,150,330,240,268,169,367,448,899,178,790,466,358,880,114,556,259,349,457,277],
      'seven':[7,700,890,999,160,340,250,278,179,377,467,115,124,223,566,557,368,359,449,269,133,188,458],
      'eight':[8,800,567,666,170,350,260,288,189,116,233,459,125,224,477,990,134,558,369,378,440,279,468],
      'nine':[9,900,234,333,180,360,270,450,199,117,469,126,667,478,135,225,144,379,559,289,388,577,568],
      'zero':[0,'000',127,190,280,370,460,550,235,118,578,145,479,668,299,334,488,389,226,569,677,136,244]
    };
  let price = null;
  let curGame = null;
  let gameCode = null;
  const popup = document.getElementById("sitePopup");

  init();

  function init() {
    if(auth.config.type != 'admin'){
      window.location = '#/home';
      return;
    }
    document.getElementById('searchDate').valueAsDate = new Date();

    getGameType();
    bindEvents();
  }

  function bindEvents() {
    $('#sitePopup').off('click');
    $('.generateGame').on('click',generateGame);
    $('.searchGame').on('click',getGameDetails);
    $('#gameList').on('click','.changeStatus',popupStatus);
    $('#gameList').on('click','.makeResult',popupResult);
    $('#gameList').on('click','.deleteGame',deleteGame);
    $('#gameList').on('click','.balanceUpdate',balanceUpdate);
    $('#sitePopup').on('click','#closePopup',function(){
      popup.style.display = "none";
    });
    $('#sitePopup').on('click','.saveBtn',saveStatus);
    $('#sitePopup').on('click','.innerNum',saveResult);
    $('#sitePopup').on('click','.saveResultLottery',saveResultLottery);
    $('#sitePopup').on('click','.saveResultGameChance',saveResultGameChance);
    $('#gameName').on('change',function(){
      gameCode = $('#gameName').val();
      getGameInfo();
    });

    $('#sitePopup').on('click','.pattiNumDiv',pattiNumDiv);
    $('#sitePopup').on('click','.resetPattiBtn',resetPattiBtn);
  }

  function getGameType(){
    $('#gameName').html('');
    backendSource.getObject('game', null, {}, function (data) {
      data.MESSAGE.map(e=>{
        $('#gameName').append(`
          <option value="${e.code}">${e.name}</option>
        `);
      });
      gameCode = $('#gameName').val();
      getGameInfo();
    });
  }

  function getGameInfo(){
    backendSource.gameRequest(gameCode, 'gameInfo', {
      key : ['price']

    }, function (data) {
      if(data.MESSAGE)
      price = data.MESSAGE.price;
      getGameDetails();
    });
  }

  function saveResultGameChance(){
    let id = $('#sitePopup').find('.popup-content').attr('data-id');
    let one = $('#sitePopup').find('.gameChanceresultIn.one').val();
    let two = $('#sitePopup').find('.gameChanceresultIn.two').val();
    let three = $('#sitePopup').find('.gameChanceresultIn.three').val();
    let four = $('#sitePopup').find('.gameChanceresultIn.four').val();
    let five = $('#sitePopup').find('.gameChanceresultIn.five').val();
    let six = $('#sitePopup').find('.gameChanceresultIn.six').val();
    let seven = $('#sitePopup').find('.gameChanceresultIn.seven').val();
    let eight = $('#sitePopup').find('.gameChanceresultIn.eight').val();
    let nine = $('#sitePopup').find('.gameChanceresultIn.nine').val();
    let ten = $('#sitePopup').find('.gameChanceresultIn.ten').val();
    if(one.length !=4 || two.length !=4 || three.length !=4 || four.length !=4 || five.length !=4 || six.length !=4 || seven.length !=4 || eight.length !=4 || nine.length !=4 || ten.length !=4 ){
      DM_TEMPLATE.showSystemNotification(0, `Please provide all numbers properly.`);
      return;
    }
    let text = `Do you really make this win?\nNum - ${one}, ${two}, ${three}, ${four}, ${five}, ${six}, ${seven}, ${eight}, ${nine}, ${ten}.`;
    if (confirm(text) == true) {
      if(id){
        backendSource.gameRequest(gameCode, 'result', {
          id: id,
          num : one+","+two+","+three+","+four+","+five+","+six+","+seven+","+eight+","+nine+","+ten

        }, function (data) {
          if(data.SUCCESS){
            getGameDetails();
            DM_TEMPLATE.showSystemNotification(1, `Game result updated successfully.`);
            popup.style.display = "none";
          }else{
            DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
          }
        });
      }
    }
  }

  function generateGame(){
    DM_TEMPLATE.showBtnLoader(elq('.generateGame'), true);
    let toDay = moment($('#searchDate').val()).format('YYYY-MM-DD');
    backendSource.gameRequest(gameCode,'generate',{date:toDay},function(data){
      DM_TEMPLATE.showSystemNotification(1, `Game generated successfully.`);
      getGameDetails();
      DM_TEMPLATE.showBtnLoader(elq('.generateGame'), false);
    });
  }

  function saveStatus(){
    DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), true);
    let id = $(this).attr('data-id');
    if(id){
      let status = $('#changeStatus').val();
      backendSource.saveObject('game_inplay', id, {
        status: $('#changeStatus').val()
      }, function (data) {
        if(data.SUCCESS){
          if(parseInt(status)==3){
            backendSource.gameRequest(gameCode,'cancelBet',{id:id},function(data){
            
            });
          }
          
          getGameDetails();
            DM_TEMPLATE.showSystemNotification(1, `Game status updated successfully.`);
            popup.style.display = "none";
        }else{
          DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
        }
        DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), false);
      });
    }
  }

  function saveResult(){
    if($(this).hasClass('head')){
      return false;
    }
    let id = $(this).closest('.popup-content').attr('data-id');
    let num = $(this).attr('data-no');
    let single = $(this).attr('data-single');
    let amt = $(this).find('p').html();
    let text = `Do you really make this win?\nNum - ${num}, Single - ${single}.`;
    if (confirm(text) == true) {
      if(id){
        backendSource.gameRequest(gameCode, 'result', {
          id: id,
          num : num,
          single : single,

        }, function (data) {
          if(data.SUCCESS){
            getGameDetails();
            DM_TEMPLATE.showSystemNotification(1, `Game result updated successfully.`);
            popup.style.display = "none";
          }else{
            DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
          }
        });
      }
    }
  }

  function saveResultLottery(){
    let id = $('#sitePopup').find('.popup-content').attr('data-id');
    // let three = $('#sitePopup').find('.pattiNum.three').html();
    let two = $('#sitePopup').find('.pattiNum.two').html();
    let one = $('#sitePopup').find('.pattiNum.one').html();
    // let pre = $('#sitePopup').find('.preNo').val();
    let text = `Do you really make this win?\nNum - ${one}${two}.`;
    if (confirm(text) == true) {
      if(id){
        backendSource.gameRequest(gameCode, 'result', {
          id: id,
          // num : pre+""+one+""+two+""+three,
          // patti : one+""+two+""+three,
          jori : one+""+two,
          // single : three,
          // secondPrice: $('#sitePopup').find('.secondPrice').val(),
          // thirdPrice: $('#sitePopup').find('.thirdPrice').val(),
          // fourthPrice: $('#sitePopup').find('.fourthPrice').val(),
          // fifthPrice: $('#sitePopup').find('.fifthPrice').val(),

        }, function (data) {
          if(data.SUCCESS){
            getGameDetails();
            DM_TEMPLATE.showSystemNotification(1, `Game result updated successfully.`);
            popup.style.display = "none";
          }else{
            DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
          }
        });
      }
    }
  }

  function deleteGame(){
    let id = $(this).closest('.game').attr('data-gameid');
    if (confirm("Do you want to delete the game?") == true) {
      if (confirm("You can not role back the operation?") == true) {
        backendSource.deleteObject('game_inplay', id, function (data) {
          DM_TEMPLATE.showSystemNotification(0, `Game deleted successfully.`);
          getGameDetails();
        });
      }
    }
  }

  function balanceUpdate(){
    let id = $(this).closest('.game').attr('data-gameid');
    
    backendSource.customRequest('general', null, {
      id: id,
      game:$('#gameName').val(),
      grant_type:'balance_update'
    }, function (data) {
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, `User balance updated successfully.`);
        getGameDetails();
      }else{
        DM_TEMPLATE.showSystemNotification(0, `Unable to update user balance.`);
      }
    });
  }

  function resetPattiBtn(){
    $('.pattiNum').html('');
    $('.innerNumLottery,.innerNumGameChance').removeClass('highlight');
    $('.singlePrice').html('');
    $('.joriPrice').html('');
    $('.pattiPrice').html('');
    $('#totalPrice').html('');
  }

  function pattiNumDiv(){
    if($('.pattiNum.one').html()==''){
      $('.pattiNum.one').html($(this).attr('data-num'));
    }else {
      $('.pattiNum.two').html($(this).attr('data-num'));
      $('.innerNumLottery').removeClass('highlight');
      // $(`.innerNumLottery[data-no="${$('.pattiNum.two').html()+''+$('.pattiNum.three').html()}"]`).addClass('highlight');
      $(`.innerNumLottery[data-no="${$('.pattiNum.one').html()+''+$('.pattiNum.two').html()+''}"]`).addClass('highlight');

      // let single = $(`.innerNumLottery[data-no="${$('.pattiNum.three').html()}"]`).find('p').html();
      let jori = $(`.innerNumLottery[data-no="${$('.pattiNum.one').html()+''+$('.pattiNum.two').html()}"]`).find('p').html();
      // let patti = $(`.innerNumLottery[data-no="${$('.pattiNum.one').html()+''+$('.pattiNum.two').html()+''+$('.pattiNum.three').html()}"]`).find('p').html();
      
      jori = jori?parseFloat(jori)* parseFloat(price.jori):0;
      // $('.singlePrice').html('Price: <b>'+single+'</b>');
      $('.joriPrice').html('Price: <b>'+jori+'</b>');
      // $('.pattiPrice').html('Price: <b>'+patti+'</b>');

      $('#totalPrice').html('Price: <b>'+(jori)+'</b>');
    }
  }

  function gameChanceResult(id,cGame){
    let gameStatus = 'Upcoming';
    if(cGame.status==1){
      gameStatus = 'Running';
    }else if(cGame.status==2){
      gameStatus = 'Completed';
    }else if(cGame.status==3){
      gameStatus = 'Cancel';
    }
    let resArr = cGame.result_one?cGame.result_one.split(','):[];
    $(`#sitePopup`).html(`<div class="popup-content pattiList" style="width: 98%; max-width: 98%;" data-id="${cGame.id}">
          <span class="close" id="closePopup">&times;</span>
          <h2>Game: ${$('#gameName option:selected').text()} - ${cGame.name} <span>${gameStatus}</span></h2>
          <p>Game timing: ${moment(cGame.start).format("HH:mm")} to ${moment(cGame.end).format("HH:mm")}</p>
          <p>Total Game: <span id="totalBet">0</span> <span id="totalPrice"></span></p>
          <div class="container">
            <div class="row lotteryHtm" >
              <div class="lotteryResult">
                <div class="container mt-3">
                  <div class="row">
                    
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn one" placeholder="One" value="${resArr[0]??''}"/>
                    </div>
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn two" placeholder="Two" value="${resArr[1]??''}"/>
                    </div>
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn three" placeholder="Three" value="${resArr[2]??''}"/>
                    </div>
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn four" placeholder="Four" value="${resArr[3]??''}"/>
                    </div>
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn five" placeholder="Five" value="${resArr[4]??''}"/>
                    </div>
                    <div class="col-2"></div>
                    <div class="col-12">&nbsp;</div>
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn six" placeholder="Six" value="${resArr[5]??''}"/>
                    </div>
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn seven" placeholder="Seven" value="${resArr[6]??''}"/>
                    </div>
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn eight" placeholder="eight" value="${resArr[7]??''}"/>
                    </div>
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn nine" placeholder="Nine" value="${resArr[8]??''}"/>
                    </div>
                    <div class="col-2">
                      <input type="number" maxlength="4" class="gameChanceresultIn ten" placeholder="Ten" value="${resArr[9]??''}"/>
                    </div>
                    <div class="col-2">
                      <button type="button" class="gameButton saveResultGameChance">Save</button>
                    </div>
                    
                    <div class="col-12 mt-3"></div>
                    
                  </div>
                </div>
              </div>
              <div class="lotterySingleTotal"></div>
              <div class="lotterySingle"></div>
            </div>
          </div>
        </div>`);
        popup.style.display = "block";
      backendSource.getObject(gameCode, null, {where:[
        {'key':'game_id','operator':'is','value':id}
      ]}, function (data) {
      if(data.SUCCESS && data.MESSAGE.length>0){
        let tot = {'Single':0};
        let amt = {};
        for(let i in data.MESSAGE){
          if(!amt['n-'+data.MESSAGE[i].number])amt['n-'+data.MESSAGE[i].number]={amt:0,number:data.MESSAGE[i].number,type:data.MESSAGE[i].type};
          amt['n-'+data.MESSAGE[i].number].amt += data.MESSAGE[i].amt;
        }
        
        let item = [];
        for (let i in amt) {
          item.push([i, amt[i]]);
        }

        item.sort(function(a, b) {
            return a[1].amt - b[1].amt;
        });

        for(let i in item){
          tot[item[i][1].type] += item[i][1].amt;
          $(`.lottery`+item[i][1].type).append(`
              <div class="innerNumLottery" data-no="${item[i][1].number}">
              ${item[i][1].number}
              <p>${item[i][1].amt}</p>
              <div class="tooltiptext">Price: ${(item[i][1].amt * parseFloat(price[item[i][1].type.toLowerCase()]))}</div>
            </div>
          `);
        }
        $('.lotterySingleTotal').html(`Total Game Played: <b>${tot['Single']}</b><span class="singlePrice"></span>`);
        $('#totalBet').html(tot['Single']);
        
      }
    });
  }

  function popupResult(){
    let id = $(this).closest('.game').attr('data-gameid');
    if(curGame){
      let cGame = curGame.find((a)=>{return a.id==id;});
      if(cGame){
        if(gameCode=='gameChance'){
          gameChanceResult(id,cGame);
          return;
        }
        generateResultPopup(cGame);
        backendSource.getObject(gameCode, null, {where:[
            {'key':'game_id','operator':'is','value':id}
          ]}, function (data) {
          if(data.SUCCESS && data.MESSAGE.length>0){
            let tot = 0;
            for(let i in data.MESSAGE){
              let amt = $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).find('p').html();
              if(amt){
                amt = parseFloat(amt) + parseFloat(data.MESSAGE[i].amt);
                $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#f7ff00');
                if($(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).hasClass('head')){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).find('.tooltiptext').html('Price: '+(amt * parseFloat(price.single))+'</br>Bet: '+amt);
                }else{
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).find('.tooltiptext').html('Price: '+(amt * parseFloat(price.patti))+'</br>Bet: '+amt);
                }
                $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).find('p').html(amt);
              }
              tot += parseFloat(data.MESSAGE[i].amt);
            }
            $('#totalBet').html(tot);
          }
        });
      }
    }
  }

  function generateResultPopup(cGame){
    let gameStatus = 'Upcoming';
    if(cGame.status==1){
      gameStatus = 'Running';
    }else if(cGame.status==2){
      gameStatus = 'Completed';
    }else if(cGame.status==3){
      gameStatus = 'Cancel';
    }
    let htm = ``;
    for (const i in gameSet) {
      let htmT = ``;
      let c = 0;
      for(const j in gameSet[i]){
        htmT += `<div class="innerNum ${c++ ==0?'head':''}" data-single="${gameSet[i][0]}" data-no="${gameSet[i][j]}">
                  ${gameSet[i][j]}
                  <p>0</p>
                  <div class="tooltiptext">Price: 0</div>
                </div>`;
      }
      htm += `<div class="numWraper">
                  ${htmT}
            </div>`;
    }
    $(`#sitePopup`).html(`<div class="popup-content pattiList" style="width: 98%; max-width: 98%;" data-id="${cGame.id}">
          <span class="close" id="closePopup">&times;</span>
          <h2>Game: ${$('#gameName option:selected').text()} - ${cGame.name} <span>${gameStatus}</span></h2>
          <p>Game timing: ${moment(cGame.start).format("HH:mm")} to ${moment(cGame.end).format("HH:mm")}</p>
          <p>Total: <span id="totalBet">0</span></p>
          <div class="container">
            <div class="row">
              ${htm}
            </div>
          </div>
        </div>`);
        popup.style.display = "block";
  }

  function popupStatus(){
    let id = $(this).closest('.game').attr('data-gameid');
    
    if(curGame){
      let cGame = curGame.find((a)=>{return a.id==id;});
      if(cGame){
        let gameStatus = 'Upcoming';
        if(cGame.status==1){
          gameStatus = 'Running';
        }else if(cGame.status==2){
          gameStatus = 'Completed';
        }else if(cGame.status==3){
          gameStatus = 'Cancel';
        }

        $(`#sitePopup`).html(`<div class="popup-content">
          <span class="close" id="closePopup">&times;</span>
          <h2>Game: ${cGame.name}</h2>
          <p>Current status: ${gameStatus}</p>
          <p>Game timing: ${moment(cGame.start).format("HH:mm")} to ${moment(cGame.end).format("HH:mm")}</p>
          <div class="container">
            <div class="row">
              <div class="col-4 mt-3">Status</div>
              <div class="col-8 mt-3 input-container">
                <select id="changeStatus">
                  <option ${cGame.status==0?'selected':''} value="0">Upcoming</option>
                  <option ${cGame.status==1?'selected':''} value="1">Running</option>
                  <option ${cGame.status==2?'selected':''} value="2">Completed</option>
                  <option ${cGame.status==3?'selected':''} value="3">Cancel</option>
                </select>
              </div>
              
              <div class="col-4 mt-3">&nbsp;</div>
              <div class="col-8 mt-3"><span class="gameButton saveBtn" data-id="${cGame.id}"> Update </span></div>
            </div>
          </div>
        </div>`);
        popup.style.display = "block";
      }
    }
  }

  async function getGameDetails(){
    DM_TEMPLATE.showBtnLoader(elq('.searchGame'), true);
    let toDay = moment($('#searchDate').val()).format('YYYY-MM-DD');
    let game = await DM_GENERAL.fetchInplayGame([
      {'key':'game_code','operator':'is','value':gameCode},
      {'key':'start','operator':'higher','value':toDay+' 00:00:00'},
      {'key':'end','operator':'lower','value':toDay+' 23:59:59'},
    ]);
    
    $('#gameList').html('');
    let htm = ``;
    if(game.SUCCESS){
      if(game.MESSAGE.length>0){
        game.MESSAGE.sort((a,b)=>a.start.localeCompare(b.start));
        curGame = game.MESSAGE;
        for(let i in game.MESSAGE){
          htm += `<div class="boxContainer">
                    <div class="boxElements">
                      <p>${game.MESSAGE[i].name}</p>
                      <div class="startTime">
                          <i class="bi bi-clock-fill"></i>
                          <span class="txt">Game Time : ${moment(game.MESSAGE[i].start).format("HH:mm")} to ${moment(game.MESSAGE[i].end).format("HH:mm")}</span>
                      </div>
                      ${game.MESSAGE[i].result_one?`
                      <div class="winRes">
                        <i class="bi bi-trophy"></i>
                        <span class="txt">Result: ${game.MESSAGE[i].result_one}  ${game.MESSAGE[i].result_two?'| '+game.MESSAGE[i].result_two:''}</span>
                      </div>`:``}
                      
                    </div>`;
          if(game.MESSAGE[i].status==1){
            htm += `<div data-gameid="${game.MESSAGE[i].id}" class="game runningGame">
              Running Game 
              <span class="changeStatus">Change Status</span>
              <span class="makeResult">Make Result</span>
              <span class="deleteGame">Delete</span>
              </div>`;
          }else if(game.MESSAGE[i].status==2){
            htm += `<div data-gameid="${game.MESSAGE[i].id}" class="game completed">
              Completed 
              <span class="changeStatus">Change Status</span>
              <span class="makeResult">Make Result</span>
              <span class="deleteGame">Delete</span>
              ${game.MESSAGE[i].result_done==0?`<span class="balanceUpdate">Balance Update</span>`:``}
              </div>`;
          }else if(game.MESSAGE[i].status==3){
            htm += `<div data-gameid="${game.MESSAGE[i].id}" class="game cancel">
            Cancel <span class="changeStatus">Change Status</span>
            <span class="deleteGame">Delete</span>
            </div>`;
          }else{
            htm += `<div data-gameid="${game.MESSAGE[i].id}" class="game upcoming">
              Upcoming <span class="changeStatus">Change Status</span>
              <span class="deleteGame">Delete</span>
              </div>`;
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
    DM_TEMPLATE.showBtnLoader(elq('.searchGame'), false);
  }

})();
