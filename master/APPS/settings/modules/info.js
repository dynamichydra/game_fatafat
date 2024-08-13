'use strict';

(function () {
  let gameCode = null;
  let gameConfig = null;

  init();

  async function init() {
    DM_SETTINGS.generateSettingsMenu();
    getGameConfig();
    bindEvents();
  }

  function bindEvents() {
    $('.searchMatch').on('click',generateHtml);
    $('#saveInfo').on('click',saveInfo);
    $('#savePrice').on('click',savePrice);
  }

  function savePrice(){
    let val = $('#priceArea').find('.patti').val();
    if(val && val !=''){
      gameConfig.price[gameCode].patti = val;
    }
    val = $('#priceArea').find('.single').val();
    if(val && val !=''){
      gameConfig.price[gameCode].single = val;
    }
    
    backendSource.customRequest('settings', null, {
      grant_type: 'set_config',
      arr:{
        key : ['price', gameCode],
        val : gameConfig.price[gameCode]
      }
    }, function (data) {
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, `Data updated successfully.`);
      }else{
        DM_TEMPLATE.showSystemNotification(0, `Unable to updated data.`);
      }
    });
  }

  function saveInfo(){
    // let crnJson = {};
    // if(!gameConfig.job[gameCode])gameConfig.job[gameCode]=[];
    gameConfig.job[gameCode]=[];
    $('#infoArea').find('.itemWrapper').each(function(){
      const no = $(this).attr('data-no');
      if(no){
        let val = $(this).find('.startTime').val();
        if(val && val !=''){
          gameConfig.job[gameCode].push({time:val,game:gameCode});
          gameConfig.info[gameCode][parseInt(no)].start = val;
        }
        val = $(this).find('.endTime').val();
        if(val && val !=''){
          gameConfig.job[gameCode].push({time:val,game:gameCode});
          gameConfig.info[gameCode][parseInt(no)].end = val;
        }
        val = $(this).find('.duration').val();
        if(val && val !=''){
          gameConfig.info[gameCode][parseInt(no)].duration = val;
        }
        val = $(this).find('.monday').val();
        if(val && val !=''){
          gameConfig.info[gameCode][parseInt(no)].name.monday = val;
        }
        val = $(this).find('.tuesday').val();
        if(val && val !=''){
          gameConfig.info[gameCode][parseInt(no)].name.tuesday = val;
        }
        val = $(this).find('.wednesday').val();
        if(val && val !=''){
          gameConfig.info[gameCode][parseInt(no)].name.wednesday = val;
        }
        val = $(this).find('.thursday').val();
        if(val && val !=''){
          gameConfig.info[gameCode][parseInt(no)].name.thursday = val;
        }
        val = $(this).find('.friday').val();
        if(val && val !=''){
          gameConfig.info[gameCode][parseInt(no)].name.friday = val;
        }
        val = $(this).find('.saturday').val();
        if(val && val !=''){
          gameConfig.info[gameCode][parseInt(no)].name.saturday = val;
        }
        val = $(this).find('.sunday').val();
        if(val && val !=''){
          gameConfig.info[gameCode][parseInt(no)].name.sunday = val;
        }
      }
  
    });

    let finalCron = {};
    for(let i in gameConfig.job){
      if(gameConfig.job[i] && gameConfig.job[i].length>0){
        for(let j in gameConfig.job[i]){
          finalCron[gameConfig.job[i][j].time] = gameConfig.job[i][j].game;
        }
      }
    }
    
    backendSource.customRequest('settings', null, {
      grant_type: 'set_config',
      arr:{
        key : ['info', gameCode],
        val : gameConfig.info[gameCode]
      }
    }, function (data) {
      if(data.SUCCESS){
        backendSource.customRequest('settings', null, {
          grant_type: 'set_config',
          arr:{
            key : ['job', gameCode],
            val : gameConfig.job[gameCode]
          }
        }, function (data) {
          if(data.SUCCESS){
            backendSource.customRequest('settings', null, {
              grant_type: 'set_config',
              arr:{
                key : ['cron'],
                val : finalCron
              }
            }, function (data) {
              if(data.SUCCESS){
                  DM_TEMPLATE.showSystemNotification(1, `Data updated successfully.`);
                }else{
                  DM_TEMPLATE.showSystemNotification(0, `Unable to updated data.`);
                }
              });
          }else{
            DM_TEMPLATE.showSystemNotification(0, `Unable to updated data.`);
          }
        });
      }else{
        DM_TEMPLATE.showSystemNotification(0, `Unable to updated data.`);
      }
    });
  }

  function generateHtml(){
    gameCode = $('#mGame').val();
    let info = gameConfig.info[gameCode];
    let price = gameConfig.price[gameCode];

    $('.gameName').html($('#mGame option:selected').text());
    let htm = ``;
    for(let i in info){
      let nameHtm = '';
      for(let j in info[i].name){
        nameHtm += `<div class="infoAreaName">${j}:</div>
            <div class="infoAreaText"> 
              <input type="text" value="${info[i].name[j]}" class="itemName ${j}"/>
            </div>`
      }
      htm += `
        <div class="itemWrapper" data-no="${i}">
          <div class="gameNoTitle">Game no: ${parseInt(i)+1}</div>
          <div class="infoArea">
            <div class="infoAreaName">Start Time:</div>
            <div class="infoAreaText"> 
              <input type="text" value="${info[i].start}" class="startTime"/>
            </div>
            <div class="infoAreaName">End Time:</div>
            <div class="infoAreaText"> 
              <input type="text" value="${info[i].end}" class="endTime"/>
            </div>
            <div class="infoAreaName">Duration:</div>
            <div class="infoAreaText"> 
              <input type="text" value="${info[i].duration}" class="duration"/>
            </div>
            <div class="clr"></div>
            ${nameHtm}
            <div class="clr"></div>
          </div>
        </div>`;
    }
    $('#infoArea').html(htm);

    htm = '';
    for(let i in price){
      htm += `<div class="infoAreaName">${i}:</div>
      <div class="infoAreaText"> 
        <input type="text" value="${price[i]}" class="itemPrice ${i}"/>
      </div>`
    }
    $('#priceArea').html(htm);
  }

  function getGameType(){
    $('#mGame').html('');
    backendSource.getObject('game', null, {where:[
      {'key':'status','operator':'is','value':1}
    ]}, function (data) {
      data.MESSAGE.map(e=>{
        $('#mGame').append(`
          <option value="${e.code}">${e.name}</option>
        `);
      });
      generateHtml();
    });
  }

  function getGameConfig(){
    backendSource.customRequest('settings', null, {
      grant_type: 'get_config'
    }, function (data) {
      if(data.SUCCESS){
        gameConfig = data.MESSAGE;
        getGameType();
      }
    });
  }
})();
