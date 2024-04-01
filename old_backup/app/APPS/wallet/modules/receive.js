'use strict';

(function () {

  init();

  function init() {
    $('#pageTitle').html('Receive Record');
    // getHistory();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    $('#fDate').val(formattedDate);
    $('#tDate').val(formattedDate);
    bindEvents();
  }

  function bindEvents() {
    $('.searchUser').on('click',getHistory);
  }

  function getHistory(){
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), true);
    backendSource.customRequest('report', null, {
      tid: auth.config.id,
      fdate: $('#fDate').val(),
      tdate: $('#tDate').val(),
      pType: 'user',
      grant_type: 'transfer'
    }, function (data) {
      if(data.SUCCESS){
        $('#tblHistory tbody').html('');
        if(data.MESSAGE.length>0){
          data.MESSAGE.map((e)=>{
            $('#tblHistory tbody').append(`
              <tr>
                <td>${'T-'+e.id.toString().padStart(5, "0")}</td>
                <td>${e.fph}</td>
                <td>${moment(e.tdate).format('DD.MMM.YYYY H:mm')}</td>
                <td>${e.amt}</td>
              </tr>
            `);
          });
        }else{
          $('#tblHistory tbody').append(`
              <tr>
                <td colspan="4">No record found</td>
              </tr>
            `);
        }
        DM_TEMPLATE.showBtnLoader(elq('.searchUser'), false);
      }
    });
  }

})();
