'use strict';

(function () {
  let curGame = null;
  let betTimes = 1;
  let betName = null;
  let betType = null;
  let betMoney = 1;
  let timeOut = null;

  init();

  function init() {
    getGameDetails();
    $('#pageTitle').html('Motka');
    DM_COMMON.preSaleModal();
    DM_COMMON.gameHead();
    DM_COMMON.fetchUserData();
    bindEvents();
  }

  function bindEvents() {
    $('.betButton').on('click',betClick);
    $('.xItem').on('click',xItemClick);
    $('.betMoney').on('click',betMoneyClick);
    $('.multipleChange').on('click',multipleChangeClick);
    $('.cancelButton').on('click',cancelButtonClick);
    $('.betTimes').on('click',betTimesClick);
    $('.betSubmitButton').on('click',betSubmitButton);
    $('.showWin').on('click',function(){
      $('#tblBetWin').show();
      $('#tblMyWin').hide();
    });
    $('.showMyWin').on('click',function(){
      $('#tblMyWin').show();
      $('#tblBetWin').hide();
    });
  }

  function getBetWin(){
    backendSource.getObject('game_inplay', null, {
      where: [{'key':'game_code','operator':'is','value':'motka'},
      {'key':'status','operator':'is','value':2}],
      limit:{'start':0,'end':20},
      order:{'by':'id','type':'DESC'},
      }, function (data) {
        if(data.SUCCESS){
          let htm = ``;
          let count = 0;
          for(const item of data.MESSAGE){
            if(item.result_one && item.result_two && item.result_three){
              const colorArr = item.result_two.split(",");
              htm += `<tr>
                <td scope="col">${'2'+item.id.toString().padStart(5, "0")}</td>
                <td scope="col">${item.result_one}</td>
                <td scope="col">${item.result_three}</td>
                <td scope="col">
                  <div class="betColor ${colorArr[0]}"></div>
                  ${colorArr[1]?`<div class="betColor ${colorArr[1]}"></div>`:``}
                </td>
              </tr>`;

              if(count==0){
                $(`#gameBody .result-box`).html(`
                  <div class="item ${colorArr[0]}">
                    <div class="itemInner ${colorArr[1]??''}">
                      <span class="number">${item.result_one}</span>
                      <span class="type">${item.result_three}</span>
                    </div>
                  </div>
                  `);
                $(`#gameBody .result-box`).fadeIn(1000);

                $(`#gameHead .lastWin`).html(`
                  <div class="txt">${item.result_one}  ${item.result_three}</div>
                  <div class="txt">
                  <div class="betColor ${colorArr[0]}"></div>
                  ${colorArr[1]?`<div class="betColor ${colorArr[1]}"></div>`:``}</div>
                  `);
              }
              count++;
            }
            
          }
          $('#tblBetWin tbody').html(htm);
          setTimeout(() => {
            $(`#gameBody .result-box`).fadeOut(1000);
          }, 3000);
        }
      });
  }

  function getMyWin(){
    backendSource.getObject('motka', null, {
      where:[
        {'key':'user_id','operator':'is','value':auth.config.id},
        {'key':'status','operator':'is','value':'1'},
      ],
      limit:{'start':0,'end':20},
      order:{'by':'id','type':'DESC'},
      }, function (data) {
        if(data.SUCCESS){
          let htm = ``;
          for(const item of data.MESSAGE){
            let colorArr = [];
            if(item.color)
            colorArr = item.color.split(",");
            htm += `<tr>
            <td scope="col">${'2'+item.game_id.toString().padStart(5, "0")}</td>
            <td scope="col">${item.number??''}</td>
            <td scope="col">${item.size??''}</td>
            <td scope="col">
              ${colorArr[0]?`<div class="betColor ${colorArr[0]}"></div>`:``}
              ${colorArr[1]?`<div class="betColor ${colorArr[1]}"></div>`:``}
            </td>
            <td scope="col">${item.amt}</td>
            <td scope="col">${item.price}</td>
          </tr>`;
          }
          $('#tblMyWin tbody').html(htm);
        }
      });
  }

  function betSubmitButton(){
    let userData = DM_COMMON.getUserData();
    if(!$('#agreePresale').is(":checked")){
      DM_TEMPLATE.showSystemNotification(0, `You have to accept the Presale rules.`);
      return false;
    }
    console.log(userData)
    let betAmount  = parseInt(betTimes)*parseInt(betMoney);
    if(betAmount > userData.balance){
      DM_TEMPLATE.showSystemNotification(0, `Insufficient balance.`);
      cancelButtonClick();
      return false;
    }
    if(!curGame)return;
    let arr = {
      user_id : auth.config.id,
      game_id : curGame.MESSAGE[0].id,
      amt : betMoney*betTimes,
      bname : betName,
      btype : betType
    };
    if(betType == "number"){
      arr['number'] = parseInt(betName);
      if(arr['number']<5){
        arr['size'] = 'small';
      }else{
        arr['size'] = 'big';
      }
      if(arr['number']==0){
        arr['color'] = 'red,violet';
      }else if(arr['number']==5){
        arr['color'] = 'green,violet';
      }else if(arr['number']==2 || arr['number']==4 || arr['number']==6 || arr['number']==8){
        arr['color'] = 'red';
      }else{
        arr['color'] = 'green';
      }
    }else if(betType == "color"){
      arr['color'] = betName;
    }else{
      arr['size'] = betName;
    }
    backendSource.customRequest('bet',null,{
      game:'motka',
      type:'bet',
      data : arr
    },function(data){
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, "Bet place successfully.");
        cancelButtonClick();
        DM_COMMON.fetchUserData();
      }else{
        DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
      }
    });
  }

  function cancelButtonClick(){
    $('.van-popup').hide();
    betTimes = 1;
    betName = null;
    betType = null;
    betMoney = 1;
    $('#betMultiple').val(betTimes);
    $('.betMoney').removeClass('active');
    $('.betMoney[data-money="1"]').addClass('active');
    calculateBetAmount();
  }

  function xItemClick(){
    $('.xItem').removeClass('active');
    $(this).addClass('active');
    betTimes = $(this).attr('data-times');
  }

  function betMoneyClick(){
    $('.betMoney').removeClass('active');
    $(this).addClass('active');
    betMoney = $(this).attr('data-money');
    calculateBetAmount();
  }

  function multipleChangeClick(){
    let sign = $(this).attr('data-sign');
    if(sign){
      if(sign=='+'){
        betTimes++;
      }else if(betTimes>1){
        betTimes--;
      }
    }
    $('[data-sign="-"]').removeClass('active');
    if(betTimes>1){
      $('[data-sign="-"]').addClass('active');
    }

    $('.betTimes').removeClass('active');
    $(`.betTimes[data-times="${betTimes}"]`).addClass('active');

    $('#betMultiple').val(betTimes);
    calculateBetAmount();
  }

  function betTimesClick(){
    betTimes = $(this).attr('data-times');
    multipleChangeClick();
    calculateBetAmount();
  }

  function calculateBetAmount(){
    console.log({betMoney,betTimes});
    const formattedCurrency = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(betMoney*betTimes);

    $('.totalPrice').html(formattedCurrency);
    
  }

  function betClick(){
    if(!curGame)return;
    betType = $(this).attr('data-type');
    betName = $(this).attr('data-name');
    let betColor = $(this).attr('data-color');

    $('.van-popup').find('.betting-mark').attr('data-bettype','bet'+betName);
    $('.van-popup').find('.betting-mark').attr('data-color',betColor);
    $('.betting-mark').find('.color').html('Select '+betName);

    $('.van-popup').show();
    multipleChangeClick();
  }

  async function getGameDetails(){
    if(page_name!='motka')return;
    curGame = await DM_GENERAL.fetchInplayGame([
        {'key':'game_code','operator':'is','value':'motka'},
        {'key':'status','operator':'is','value':1}
      ]);
    if(timeOut){
      clearTimeout(timeOut);
      timeOut = null;
    }
    if(curGame.MESSAGE.length>0){
      const startTime = moment(curGame.MESSAGE[0].start,'YYYY-MM-DD HH:mm:ss');
      const endTime = moment(curGame.MESSAGE[0].end, 'YYYY-MM-DD HH:mm:ss');
      const givenTime = moment(curGame.current_time, 'YYYY-MM-DD HH:mm:ss');
      
      if (givenTime.isBetween(startTime, endTime)) {
        $(`#gameBody .mark-box`).hide();
        $('.gameDuration').html(curGame.MESSAGE[0].duration+' minutes')
        DM_COMMON.startTimer(endTime.diff(givenTime,'seconds'), $('.container .out .number'),{txt:curGame.MESSAGE[0].duration+' minutes',id:curGame.MESSAGE[0].id}, () => {
          timeOut = setTimeout(getGameDetails,2000);
        });
      } else {
        
        $(`#gameBody .mark-box`).show();
        DM_TEMPLATE.showSystemNotification(0, `Game already expire.`);
        timeOut = setTimeout(getGameDetails,2000);
        curGame = null;
      }
    }else{
      $(`#gameBody .mark-box`).show();
      timeOut = setTimeout(getGameDetails,2000);
    }

    getBetWin();
    getMyWin();
  }

})();