'use strict';

(function () {
  let gameCode = null;
  let gameConfig = null;

  init();

  async function init() {
    DM_SETTINGS.generateSettingsMenu();
    getGameInfo();
    bindEvents();
  }

  function bindEvents() {
    // $('.searchMatch').on('click',generateHtml);
    $('#saveInfo').on('click',saveInfo);
    // $('#savePrice').on('click',savePrice);
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
    let json = [];
    $('#infoArea').find('.itemWrapper').each(function(){
      const id = $(this).attr('data-id');
      json.push({
        BACKEND_ACTION:'update',
        ID_RESPONSE:'update_'+id,
        id : id,
        name : $(this).find('.gameName').val(),
        sort_text : $(this).find('.gameText').val(),
        status : $(this).find('.gameStatus').val()
      });
    });
    
    backendSource.patch('game', json, function (data) {
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, `Data updated successfully.`);
      }else{
        DM_TEMPLATE.showSystemNotification(0, `Unable to updated data.`);
      }
    });
  }

  function generateHtml(arr){
    let htm = ``;
    for(let i in arr){
      htm += `
        <div class="itemWrapper" data-id="${arr[i].id}">
          <div class="infoArea">
            <div class="infoAreaName">Name:</div>
            <div class="infoAreaText"> 
              <input type="text" value="${arr[i].name}" class="gameName"/>
            </div>
            <div class="infoAreaName">Text:</div>
            <div class="infoAreaText"> 
              <input type="text" value="${arr[i].sort_text}" class="gameText"/>
            </div>
            <div class="infoAreaName">Status:</div>
            <div class="infoAreaText"> 
              <select class="gameStatus">
                <option ${arr[i].status==1?'selected':''} value="1">Enable</option>
                <option ${arr[i].status==0?'selected':''} value="0">Disable</option>
              </select>
            </div>
            <div class="clr"></div>
          </div>
        </div>`;
    }
    $('#infoArea').html(htm);
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

  function getGameInfo(){
    backendSource.getObject('game', null, {}, function (data) {
      if(data.SUCCESS){
        generateHtml(data.MESSAGE);
      }
    });
  }
})();
