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
    document.getElementById('searchDate').valueAsDate = new Date();

    getGameType();
    bindEvents();
  }

  function bindEvents() {
    $('#sitePopup').off('click');
    $('.searchGame').on('click',getGameDetails);
    $('#gameList').on('click','.makeResult',popupResult);
    $('#sitePopup').on('click','#closePopup',function(){
      popup.style.display = "none";
    });
    $('#sitePopup').on('click','.pctCalCk',function(){
      recalculateResult(this.checked);
    });
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

  function recalculateResult(ck){
    for (const i in gameSet) {
      for(const j in gameSet[i]){
        let amt = parseInt($(`.innerNum[data-no="${gameSet[i][j]}"]`).attr('data-amt'));
        let amtAll = parseInt($(`.innerNum[data-no="${gameSet[i][j]}"]`).attr('data-amtall'));
        if(amt>0){
          if(!ck){
            amt = amtAll
          }
          if($(`.innerNum[data-no="${gameSet[i][j]}"]`).hasClass('head')){
            $(`.innerNum[data-no="${gameSet[i][j]}"]`).find('.tooltiptext').html('Price: '+(amt*price[gameCode].single)+'</br>Bet: '+amt);
          }else{
            $(`.innerNum[data-no="${gameSet[i][j]}"]`).find('.tooltiptext').html('Price: '+(amt*price[gameCode].patti)+'</br>Bet: '+amt);
          }
          $(`.innerNum[data-no="${gameSet[i][j]}"]`).find('p').html(amt);
        }
      }
    }
    if(!ck){
      $('#totalBet').html(Math.round($('#totalBet').attr('data-amtall')));
    }else{
      $('#totalBet').html(Math.round($('#totalBet').attr('data-amt')));
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
          <p>Total Game: <span id="totalBet">0</span></p>
          <div class="container">
            <div class="row lotteryHtm" >
              
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
        $('.lotterySingleTotal').html(`Single Total Game: <b>${tot['Single']}</b>`);
        $('.lotteryJoriTotal').html(`Jori Total Game: <b>${tot['Jori']}</b>`);
        $('.lotteryPattiTotal').html(`Patti Total Game: <b>${tot['Patti']}</b>`);
        $('#totalBet').html(tot['Single']+tot['Jori']+tot['Patti']);
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
        backendSource.customRequest('report', null, {
          gId: id,
          gCode :gameCode,
          pType: auth.config.type,
          pId: auth.config.id,
          grant_type: 'bet_log'
        }, function (data) {
          if(data.SUCCESS && data.MESSAGE.length>0){
            // let pct = 100 - auth.config.percentage;
            let tot = 0;
            let totAll = 0;
            for(let i in data.MESSAGE){
              let pct = auth.config.percentage>0?auth.config.percentage:100;
              let amt = $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).attr('data-amt');
              let amtAll = $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).attr('data-amtall');
              // let pctTmp = 0;
              if(auth.config.type == 'master'){
                if(data.MESSAGE[i].u3id != 0 && data.MESSAGE[i].u3id != auth.config.id){
                  pct = pct - data.MESSAGE[i].u3percentage;
                }
              }else if(auth.config.type == 'super'){
                if(data.MESSAGE[i].u2id != 0 && data.MESSAGE[i].u2id != auth.config.id){
                  pct = pct - data.MESSAGE[i].u2percentage;
                }
              }
              
              let amtTmp = (parseFloat(data.MESSAGE[i].amt)*pct)/100;
              if(amt){
                amt = Math.round(parseFloat(amt) + parseFloat(amtTmp));
                amtAll = Math.round(parseFloat(amtAll) + parseFloat(data.MESSAGE[i].amt));
                if($(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).hasClass('head')){
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).find('.tooltiptext').html('Price: '+(amt*price[gameCode].single)+'</br>Bet: '+amt);
                }else{
                  $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).find('.tooltiptext').html('Price: '+(amt*price[gameCode].patti)+'</br>Bet: '+amt);
                }
                $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).find('p').html(amt);
                $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).attr('data-amt',amt);
                $(`.innerNum[data-no="${data.MESSAGE[i].number}"]`).attr('data-amtall',amtAll);
              }
              tot += amtTmp;
              totAll += parseFloat(data.MESSAGE[i].amt);
            }
            $('#totalBet').html(Math.round(tot));
            $('#totalBet').attr('data-amt',tot);
            $('#totalBet').attr('data-amtall',totAll);
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
        htmT += `<div class="innerNum ${c++ ==0?'head':''}" data-single="${gameSet[i][0]}" data-no="${gameSet[i][j]}" data-amt="0" data-amtall="0">
                  ${gameSet[i][j]}
                  <p>0</p>
                  <div class="tooltiptext">Price: 0</div>
                </div>`;
      }
      htm += `<div class="numWraper">
                  ${htmT}
            </div>`;
    }
    $(`#sitePopup`).html(`<div class="popup-content pattiList" data-id="${cGame.id}">
          <span class="close" id="closePopup">&times;</span>
          <h2>Game: ${$('#gameName option:selected').text()} - ${cGame.name} <span>${gameStatus}</span></h2>
          <p>Game timing: ${moment(cGame.start).format("HH:mm")} to ${moment(cGame.end).format("HH:mm")} <span style="float:right;"><input type="checkbox" class="pctCalCk" value="1" checked>&nbsp;Calculate All</span></p>
          <p>Total: <span id="totalBet">0</span></p>
          <div class="container">
            <div class="row">
              ${htm}
            </div>
          </div>
        </div>`);
        popup.style.display = "block";
      //   $('.pctCalCk').change(function() {
      //     popupResult(this.checked);     
      // });
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
              <span class="makeResult">Analysis</span>
              </div>`;
          }else if(game.MESSAGE[i].status==2){
            htm += `<div data-gameid="${game.MESSAGE[i].id}" class="game completed">
              Completed 
              <span class="makeResult">Analysis</span>
              </div>`;
          }else if(game.MESSAGE[i].status==3){
            htm += `<div data-gameid="${game.MESSAGE[i].id}" class="game cancel">
            Cancel
            <span class="makeResult">Analysis</span>
            </div>`;
          }else{
            htm += `<div data-gameid="${game.MESSAGE[i].id}" class="game upcoming">
              Upcoming
              <span class="makeResult">Analysis</span>
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
