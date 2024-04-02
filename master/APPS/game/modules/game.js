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
  let price = {'fatafat':{'patti':100,'single':9},
        'fatafatSuper':{'patti':125,'single':9.1},
        'nifty':{'jori':100},
        'sensex':{'jori':100}
      };
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
    $('#sitePopup').on('click','.saveResultLottery',saveResultLottery);
    $('#gameName').on('change',function(){
      gameCode = $('#gameName').val();
      getGameDetails();
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
    let three = $('#sitePopup').find('.pattiNum.three').html();
    let two = $('#sitePopup').find('.pattiNum.two').html();
    let one = $('#sitePopup').find('.pattiNum.one').html();
    let pre = $('#sitePopup').find('.preNo').val();
    let text = `Do you really make this win?\nNum - ${pre}-${one}${two}${three}.`;
    if (confirm(text) == true) {
      if(id){
        backendSource.gameRequest(gameCode, 'result', {
          id: id,
          num : pre+""+one+""+two+""+three,
          patti : one+""+two+""+three,
          jori : two+""+three,
          single : three,
          secondPrice: $('#sitePopup').find('.secondPrice').val(),
          thirdPrice: $('#sitePopup').find('.thirdPrice').val(),
          fourthPrice: $('#sitePopup').find('.fourthPrice').val(),
          fifthPrice: $('#sitePopup').find('.fifthPrice').val(),

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

  function resetPattiBtn(){
    $('.pattiNum').html('');
    $('.innerNumLottery').removeClass('highlight');
    $('.singlePrice').html('');
    $('.joriPrice').html('');
    $('.pattiPrice').html('');
    $('#totalPrice').html('');
  }

  function pattiNumDiv(){
    if($('.pattiNum.one').html()==''){
      $('.pattiNum.one').html($(this).attr('data-num'));
    }else if($('.pattiNum.two').html()==''){
      $('.pattiNum.two').html($(this).attr('data-num'));
    }else{
      $('.pattiNum.three').html($(this).attr('data-num'));

      $('.innerNumLottery').removeClass('highlight');
      $(`.innerNumLottery[data-no="${$('.pattiNum.three').html()}"]`).addClass('highlight');
      $(`.innerNumLottery[data-no="${$('.pattiNum.two').html()+''+$('.pattiNum.three').html()}"]`).addClass('highlight');
      $(`.innerNumLottery[data-no="${$('.pattiNum.one').html()+''+$('.pattiNum.two').html()+''+$('.pattiNum.three').html()}"]`).addClass('highlight');

      let single = $(`.innerNumLottery[data-no="${$('.pattiNum.three').html()}"]`).find('p').html();
      let jori = $(`.innerNumLottery[data-no="${$('.pattiNum.two').html()+''+$('.pattiNum.three').html()}"]`).find('p').html();
      let patti = $(`.innerNumLottery[data-no="${$('.pattiNum.one').html()+''+$('.pattiNum.two').html()+''+$('.pattiNum.three').html()}"]`).find('p').html();
      
      single = single?parseFloat(single)*price[gameCode].single:0;
      jori = jori?parseFloat(jori)*price[gameCode].jori:0;
      patti = patti?parseFloat(patti)*price[gameCode].patti:0;
      $('.singlePrice').html('Price: <b>'+single+'</b>');
      $('.joriPrice').html('Price: <b>'+jori+'</b>');
      $('.pattiPrice').html('Price: <b>'+patti+'</b>');

      $('#totalPrice').html('Price: <b>'+(single+jori+patti)+'</b>');
    }
  }

  function lotteryResult(id,cGame){
    let gameStatus = 'Upcoming';
    if(cGame.status==1){
      gameStatus = 'Running';
    }else if(cGame.status==2){
      gameStatus = 'Completed';
    }else if(cGame.status==3){
      gameStatus = 'Cancel';
    }
    
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
                    <div class="col-2">1st Price:</div>
                    <div class="col-3"><input type="text" class="preNo" value="" placeholder="Pre Number"/></div>
                    <div class="col-1">
                      <div class="pattiNum one"></div>
                    </div>
                    <div class="col-1">
                      <div class="pattiNum two"></div>
                    </div>
                    <div class="col-1">
                      <div class="pattiNum three"></div>
                    </div>
                    <div class="col-2">
                      <button type="button" class="gameButton resetPattiBtn">Reset</button>
                    </div>
                    <div class="col-2">
                      <button type="button" class="gameButton saveResultLottery">Save</button>
                    </div>


                    <div class="col-1"></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="1">1</div></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="2">2</div></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="3">3</div></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="4">4</div></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="5">5</div></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="6">6</div></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="7">7</div></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="8">8</div></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="9">9</div></div>
                    <div class="col-1" style="padding: 0px 5px;"><div class="pattiNumDiv green" data-num="0">0</div></div>

                    <div class="col-3"><input type="text" class="secondPrice" value="" placeholder="2nd Price"/></div>
                    <div class="col-3"><input type="text" class="thirdPrice" value="" placeholder="3rd Price"/></div>
                    <div class="col-3"><input type="text" class="fourthPrice" value="" placeholder="4th Price"/></div>
                    <div class="col-3"><input type="text" class="fifthPrice" value="" placeholder="5th Price"/></div>
                  </div>
                </div>
              </div>
              <div class="lotterySingleTotal"></div>
              <div class="lotterySingle"></div>
              <div class="lotteryJoriTotal"></div>
              <div class="lotteryJori"></div>
              <div class="lotteryPattiTotal"></div>
              <div class="lotteryPatti"></div>
            </div>
          </div>
        </div>`);
        popup.style.display = "block";
      lotteryResultDisplay(id);
      backendSource.getObject(gameCode, null, {where:[
        {'key':'game_id','operator':'is','value':id}
      ]}, function (data) {
      if(data.SUCCESS && data.MESSAGE.length>0){
        let tot = {'Single':0,'Jori':0,'Patti':0};
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
              <div class="tooltiptext">Price: ${(item[i][1].amt*price[gameCode][item[i][1].type.toLowerCase()])}</div>
            </div>
          `);
        }
        $('.lotterySingleTotal').html(`Single Total Game: <b>${tot['Single']}</b><span class="singlePrice"></span>`);
        $('.lotteryJoriTotal').html(`Jori Total Game: <b>${tot['Jori']}</b><span class="joriPrice"></span>`);
        $('.lotteryPattiTotal').html(`Patti Total Game: <b>${tot['Patti']}</b><span class="pattiPrice"></span>`);
        $('#totalBet').html(tot['Single']+tot['Jori']+tot['Patti']);
      }
    });
  }

  function lotteryResultDisplay(id){
    backendSource.getObject('lottery_result', null, {where:[
      {'key':'game_id','operator':'is','value':id}
    ]}, function (data) {
      if(data.SUCCESS && data.MESSAGE.length>0){
        for(let item of data.MESSAGE){
          if(item.place==2){
            $('.secondPrice').val(item.num);
          }else if(item.place==3){
            $('.thirdPrice').val(item.num);
          }else if(item.place==4){
            $('.fourthPrice').val(item.num);
          }else if(item.place==5){
            $('.fifthPrice').val(item.num);
          }else{
            let [strOne, strTwo] = DM_COMMON.splitString(item.num, 5);
            $('.preNo').val(strOne);
            $(".pattiNum.one").html(strTwo[0]);
            $(".pattiNum.two").html(strTwo[1]);
            $(".pattiNum.three").html(strTwo[2]);
          }
        }
        pattiNumDiv();
      }else{
        let figit5 = DM_COMMON.generateUniqueRandomNumbers(11,1000,99999,5);
        let figit4 = DM_COMMON.generateUniqueRandomNumbers(20,100,9999,4);
        let [arrOne, arrTwo] = DM_COMMON.splitArray(figit5, 1);
        let [arrThree, arrFour] = DM_COMMON.splitArray(figit4, 10);
        $('.secondPrice').val(arrOne.join(", "));
        $('.thirdPrice').val(arrTwo.join(", "));
        $('.fourthPrice').val(arrThree.join(", "));
        $('.fifthPrice').val(arrFour.join(", "));
      }
    });
  }

  function popupResult(){
    let id = $(this).closest('.game').attr('data-gameid');
    if(curGame){
      let cGame = curGame.find((a)=>{return a.id==id;});
      if(cGame){
        if(gameCode == 'nifty' || gameCode=='sensex'){
          lotteryResult(id,cGame);
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
