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
  let price = {'fatafat':{'patti':100,'single':9},'fatafatSuper':{'patti':125,'single':9.1}};
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
    $('#sitePopup').on('click','#closePopup',function(){
      popup.style.display = "none";
    });
    $('#sitePopup').on('click','.saveBtn',saveStatus);
    $('#sitePopup').on('click','.innerNum',saveResult);
    $('#gameName').on('change',function(){
      gameCode = $('#gameName').val();
      getGameDetails();
    });
  }

  function getGameType(){
    $('#gameName').html('');
    backendSource.getObject('game', null, {where:[
      {'key':'status','operator':'is','value':1}
    ]}, function (data) {
      data.MESSAGE.map(e=>{
        $('#gameName').append(`
          <option value="${e.code}">${e.name}</option>
        `);
      });
      gameCode = $('#gameName').val();
      getGameDetails();
    });
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
      backendSource.saveObject('game_inplay', id, {
        status: $('#changeStatus').val()
      }, function (data) {
        if(data.SUCCESS){
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

  function popupResult(){
    let id = $(this).closest('.game').attr('data-gameid');
    if(curGame){
      let cGame = curGame.find((a)=>{return a.id==id;});
      if(cGame){
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
                if(amt >= 100000){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#ff7676');
                }else if(amt >= 75000){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#ffa5a5');
                }else if(amt >= 50000){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#ff76d0');
                }else if(amt >= 25000){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#ffaeea');
                }else if(amt >= 10000){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#977cff');
                }else if(amt >= 5000){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#bcacf8');
                }else if(amt >= 1000){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#96c5ff');
                }else if(amt >= 500){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#e0ff00');
                }else if(amt >= 100){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#e7f679');
                }else{
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).css('background-color','#d4ffea');
                }
                
                if($(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).hasClass('head')){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).find('.tooltiptext').html('Price: '+(amt*price[gameCode].single)+'</br>Bet: '+amt);
                }else{
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).find('.tooltiptext').html('Price: '+(amt*price[gameCode].patti)+'</br>Bet: '+amt);
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
        game.MESSAGE.sort((a,b)=>a.name.localeCompare(b.name));
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
                        <span class="txt">Result: ${game.MESSAGE[i].result_one} | ${game.MESSAGE[i].result_two}</span>
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
