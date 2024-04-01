'use strict';

(function () {

  let startYear = 2023;
  let startMonth ="November";
  let monthNameList = {"December":'12',"November":'11',"October":'10',"September":'09',"August":'08',"July":'07', "June":'06',  "May":'05',  "April":'04',  "March":'03',   "February":'02', "January":'01' };
  let lotteryData = null;
  const popup = document.getElementById("sitePopup");

  init();

  function init() {
    getLiveResult();
    generateOldMonth();
    bindEvents();
  }

  function bindEvents() {
    $('#liveResult').on('click',getLiveResult);
    $('#gameName').on('change',getLiveResult);
    $('#oldResult').on('click','.monthResult',getMonthlyResult);
    $('#resultArea').on('click','.lotteryPopup',plotLotteryPopup);
    $('#sitePopup').on('click','#closePopup,.closePattiList',function(){
      popup.style.display = "none";
    });
  }

  function getLiveResult(){
    console.log(typeof DM_GENERAL)
    if(typeof DM_GENERAL == 'undefined'){
      setTimeout(getLiveResult,1000);
      return;
    }
    console.log(DM_GENERAL)
    $('#resultArea').html('');
    if(gameCode == 'thailandLottery'){
      let toDay = moment().format('YYYY-MM-DD');
      getLotteryResult(gameCode,toDay+' 00:00:00',toDay+' 23:59:59');
    }else{
      getFatafatLiveResult(gameCode);
    }
  }

  function generateOldMonth(){
    const d = new Date();
    let year = d.getFullYear();
    let htm = ``;
    const currentYear = moment().year();
    const currentMonth = moment().month()+1;
    let monthBreak = 1

    while(year >= startYear){
      for(let i in monthNameList){
        if (year === currentYear && parseInt(monthNameList[i]) > currentMonth)continue;
        if(year == startYear){
          if(monthBreak==1){
            htm += `<div class="conBox my-2 monthResult" data-month="${monthNameList[i]}" data-year="${year}">${i}&nbsp;${year} results</div>`;
            if(i == startMonth)monthBreak=0;
          }
        }else{
          htm += `<div class="conBox my-2 monthResult" data-month="${monthNameList[i]}" data-year="${year}">${i}&nbsp;${year} results</div>`;
        }
      }
      year--;
    }
    $('#oldResult').html(htm);
  }

  function scrollToResult(){
    $("html, body").animate({
      scrollTop: $("#resultArea").offset().top - 100
    }, 1000);
  }

  function getMonthlyResult(){
    $('#resultArea').html('');
    let month = $(this).attr('data-month');
    let year = $(this).attr('data-year');
    if(gameCode == 'thailandLottery'){
      getLotteryResult(gameCode,year+'-'+month+'-01 00:00:00',year+'-'+month+'-31 23:59:59');
    }else{
      getFatafatMonthResult(gameCode,month,year);
    }
    
  }

  function getFatafatMonthResult(gameCode,month,year){
    let htm = `<p>No data found.</p>`;
    let gameName = gameCode=='mumbaiSuper'?'MS':'MK';
    backendSource.getObject('game_inplay', null, {where:[
      {'key':'game_code','operator':'is','value':gameCode},
      {'key':'start','operator':'higher','value':year+'-'+month+'-01 00:00:00'},
      {'key':'end','operator':'lower','value':year+'-'+month+'-31 23:59:59'},
    ],
    order:{'by':'id','type':'DESC'}}, function (game) {
      if(game.SUCCESS){
        if(game.MESSAGE.length>0){
          let arr = {};
          for(let i in game.MESSAGE){
            if(!arr['key'+moment(game.MESSAGE[i].end).format('DD')]){
              arr['key'+moment(game.MESSAGE[i].end).format('DD')] = {key:moment(game.MESSAGE[i].end).format('DD'),val:[]};
            }
            arr['key'+moment(game.MESSAGE[i].end).format('DD')].val.push(game.MESSAGE[i]);
          }
          htm = '';
          
          const keyValueArray = Object.entries(arr);
          keyValueArray.sort((a, b) => b[0].localeCompare(a[0]));
          arr = Object.fromEntries(keyValueArray);
          
          for(let i in arr){
            let patti = ``, single=``;
            for(let j in arr[i].val){
              patti = `<td class="item${i%2}">${arr[i].val[j].result_one??'-'}</td>`+patti;
              single = `<td class="item${i%2}">${arr[i].val[j].result_two??'-'}</td>`+single;
            }
            htm += `<table>
                  <tr>
                    <td colspan="8" class="resultBg">${moment(year+'-'+month+'-'+arr[i].key).format('DD MMMM YYYY')}</td>
                  </tr>
                  <tr>
                    <td class="resultBg">${gameName}1</td>
                    <td class="resultBg">${gameName}2</td>
                    <td class="resultBg">${gameName}3</td>
                    <td class="resultBg">${gameName}4</td>
                    <td class="resultBg">${gameName}5</td>
                    <td class="resultBg">${gameName}6</td>
                    <td class="resultBg">${gameName}7</td>
                    <td class="resultBg">${gameName}8</td>
                  </tr>
                  <tr>
                    ${patti}
                  </tr>
                  <tr>
                    ${single}
                  </tr>
                </table>`;
          }
        }
      }
      $('#resultArea').html(htm);
      scrollToResult();
    });
  }

  

  async function plotLotteryPopup(){
    let id = $(this).attr('data-id');
    let curGame = lotteryData.find(e=>e.id==id);
    if(curGame && curGame.status==2){
      let res = await DM_GENERAL.getTableData('lottery_result',[
        {'key':'game_id','operator':'is','value':curGame.id}
      ]);
      popup.innerHTML = `
      <div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Thailand Lottery Result</h2>
        <div class="container">
          <canvas id="resultView"></canvas>
          <div style="clear:both;"></div>
          <button style="width:100%;margin:20px auto;" type="button" class="gameButton closePattiList">Close</button>
          </div>
        </div>`;
        let canvas = document.getElementById('resultView'),
        ctx = canvas.getContext('2d');

        let img = new Image();
        img.src = 'https://app.uniplay.co.in/whitelabel/game/img/result.jpeg';
        img.onload = function(){
          let screenWidth = window.innerWidth;
          if(screenWidth<500){
            forLotteryMobile(canvas,ctx,img,curGame,res);
          }else{
            let newWidth = img.width;
            let newHeight = img.height;
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            ctx.font = '30px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.fillText('Date: ', 20, 182);
            ctx.fillText('Time: ', (canvas.width / 2)+20, 182);
            ctx.fillStyle = 'red';
            ctx.fillText(moment(curGame.end).format('DD-MM-YYYY'), 100, 182);
            ctx.fillText(moment(curGame.end).format('HH:mm'), 400, 182);

            let curY = 250;
            for(let item of res.MESSAGE){
              if(item.place==1){
                ctx.font = '40px Arial';
                ctx.fillStyle = 'black';
                ctx.fillText('1st Price', 100, curY);
                ctx.fillStyle = 'red';
                ctx.fillText(item.num, 300, curY+1);
              }else if(item.place==2){
                curY += 70;
                ctx.font = '30px Arial';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText('2nd Price', canvas.width / 2, curY);
                ctx.fillStyle = 'red';
                curY += 40;
                ctx.fillText(item.num, canvas.width / 2, curY);

              }else{
                curY += 60;
                ctx.font = '30px Arial';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                let txt = item.place==3?'3rd':item.place+'th';
                ctx.fillText(txt+' Price', canvas.width / 2, curY);
                ctx.fillStyle = 'red';
                let arr = item.num.split(',');
                arr = DM_COMMON.splitArray(arr,5);
                console.log(arr)
                if(arr[0]){
                  curY += 30;
                  ctx.fillText(arr[0], canvas.width / 2, curY);
                }
                if(arr[1]){
                  curY += 30;
                  ctx.fillText(arr[1], canvas.width / 2, curY);
                }
              }
            }
          }
          
        }
    }else{
      popup.innerHTML = `
      <div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Thailand Lottery</h2>
        <div class="container">
            <div style="margin:30px 0px;">The result is not available for this game.</div>
          <div style="clear:both;"></div>
          <button style="width:100%;margin:20px auto;" type="button" class="gameButton closePattiList">Close</button>
          </div>
        </div>`;
    }
    popup.style.display = "block";
  }

  function forLotteryMobile(canvas,ctx,img,curGame,res){
    let scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    let newWidth = img.width* scale;
    let newHeight = img.height* scale;
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    ctx.font = '15px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.fillText('Date: ', 20, 92);
    ctx.fillText('Time: ', (canvas.width / 2)+20, 92);
    ctx.fillStyle = 'red';
    ctx.fillText(moment(curGame.end).format('DD-MM-YYYY'), 70, 92);
    ctx.fillText(moment(curGame.end).format('HH:mm'), 220, 92);

    let curY = 125;
    for(let item of res.MESSAGE){
      if(item.place==1){
        ctx.font = '22px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('1st Price', 40, curY);
        ctx.fillStyle = 'red';
        ctx.fillText(item.num, 140, curY+1);
      }else if(item.place==2){
        curY += 40;
        ctx.font = '18px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('2nd Price', canvas.width / 2, curY);
        ctx.fillStyle = 'red';
        curY += 20;
        ctx.fillText(item.num, canvas.width / 2, curY);

      }else{
        curY += 30;
        ctx.font = '15px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        let txt = item.place==3?'3rd':item.place+'th';
        ctx.fillText(txt+' Price', canvas.width / 2, curY);
        ctx.fillStyle = 'red';
        let arr = item.num.split(',');
        arr = DM_COMMON.splitArray(arr,5);
        console.log(arr)
        if(arr[0]){
          curY += 20;
          ctx.fillText(arr[0], canvas.width / 2, curY);
        }
        if(arr[1]){
          curY += 20;
          ctx.fillText(arr[1], canvas.width / 2, curY);
        }
      }
    }
  }

  async function getLotteryResult(gameCode,frm, to){
    let htm = '<p>No data found.</p>';
    lotteryData = null;
    let game = await DM_GENERAL.fetchInplayGame([
      {'key':'game_code','operator':'is','value':gameCode},
      {'key':'start','operator':'higher','value':frm},
      {'key':'end','operator':'lower','value':to},
      ],{"by":"DATE_FORMAT(start, '%M %d %Y')","type":"DESC"},
      {"by":"name","type":"ASC"});

    let dtArr = {};
    if(game.MESSAGE.length>0){
      htm = '';
      lotteryData = game.MESSAGE;
      for(let item of game.MESSAGE){
        let mD = moment(item.start).format('MM_DD');
        if(!dtArr[mD]){
          dtArr[mD] = [];
        }
        dtArr[mD].push(item);
      }
    }

    for(let i in dtArr){
      htm += `<div class="lotteryWrapper">
        <h2>${moment(dtArr[i][0].start).format('DD MMMM YYYY')}</h2>`;
      for(let item of dtArr[i]){
        htm += `<h3 class="lotteryPopup" data-id="${item.id}">${item.name} - <span ${item.status==2?`class="blinkMe"`:``}>${moment(item.end).format('HH:mm')}</span></h3>`;
      }
      htm += `</div>`;
    }
    $('#resultArea').html(htm);
  }

  async function getFatafatLiveResult(gameCode){
    let toDay = moment().format('YYYY-MM-DD');
    
    let gameName = gameCode=='mumbaiSuper'?'MS':'MK';
    let game = await DM_GENERAL.fetchInplayGame([
      {'key':'game_code','operator':'is','value':gameCode},
      {'key':'start','operator':'higher','value':toDay+' 00:00:00'},
      {'key':'end','operator':'lower','value':toDay+' 23:59:59'},
    ]);
    let patti = ``, single=``;
    let bTmp = `
      <td class="item0">-</td>
      <td class="item1">-</td>
      <td class="item0">-</td>
      <td class="item1">-</td>
      <td class="item0">-</td>
      <td class="item1">-</td>
      <td class="item0">-</td>
      <td class="item1">-</td>
    `;
    
    if(game.SUCCESS){
      if(game.MESSAGE.length>0){
        
        for(let i in game.MESSAGE){
          patti += `<td class="item${i%2}">${game.MESSAGE[i].result_one??'-'}</td>`
          single += `<td class="item${i%2}">${game.MESSAGE[i].result_two??'-'}</td>`
        }
      }else{
        patti  = single =  bTmp;
      }
    }else{
      patti  = single = bTmp;
    }
    let htm = `<table>
        <tr>
          <td colspan="8" class="resultBg">${moment().format('DD MMMM YYYY')}</td>
        </tr>
        <tr>
          <td class="resultBg">${gameName}1</td>
          <td class="resultBg">${gameName}2</td>
          <td class="resultBg">${gameName}3</td>
          <td class="resultBg">${gameName}4</td>
          <td class="resultBg">${gameName}5</td>
          <td class="resultBg">${gameName}6</td>
          <td class="resultBg">${gameName}7</td>
          <td class="resultBg">${gameName}8</td>
        </tr>
        <tr>
          ${patti}
        </tr>
        <tr>
          ${single}
        </tr>
      </table>`;
    $('#resultArea').html(htm);
    scrollToResult();
  }

})();
