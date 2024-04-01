'use strict';

(function () {

  init();

  async function init() {
    if(get_param1){
      $('#uId').val(get_param1);
      getLog();
    }
    bindEvents();
  }

  function bindEvents() {
    $('.searchUser').on('click',getLog);
  }

  function getLog(){
    let uId = $('#uId').val();
    if(!uId || uId == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the user ID.`);
      return;
    }
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), true);
    
    backendSource.customRequest('report', null, {
      uId: uId ,
      grant_type: 'user_log'
    }, function (data) {
      if(data.SUCCESS){
        $('#tblUser tbody').html('');
        if(data.MESSAGE.length>0){
          let totAmt = 0;
          data.MESSAGE.map((e)=>{
            totAmt += parseFloat(e.cr)-parseFloat(e.de);
            $('#tblUser tbody').append(`
              <tr>
                <td>${e.id}</td>
                <td>${e.name}</td>
                <td>${e.ph}</td>
                <td>${moment(e.dt).format('DD.MMM.YYYY hh:mm')}</td>
                <td>${e.de>0?e.de:'-'}</td>
                <td>${e.cr>0?e.cr:'-'}</td>
                <td>${totAmt}</td>
                <td>${e.note}</td>
              </tr>
            `);
          });
          
        }else{
          $('#tblUser tbody').append(`
              <tr>
                <td colspan="8">No record found</td>
              </tr>
            `);
        }
      }
      DM_TEMPLATE.showBtnLoader(elq('.searchUser'), false);
    });
  }

})();
