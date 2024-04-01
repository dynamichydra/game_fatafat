'use strict';

(function () {

  init();

  function init() {
    $('#pageTitle').html('Receive Record');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    $('#fDate').val(formattedDate);
    $('#tDate').val(formattedDate);
    getHistory();
    bindEvents();
  }

  function bindEvents() {
    $('.searchUser').on('click',getHistory);
  }

  function getHistory(){
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), true);
    backendSource.customRequest('report', null, {
      pId: auth.config.id,
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
            <tr ${e.type=='w'?'style="background-color:#b8ffa8;"':''}>
            <td>${e.id}</td>
            <td>${e.fph +' <i class="bi bi-arrow-right-short"></i> '+e.tph}</td>
            <td>${e.type=='t'?'D':e.type.toUpperCase()}</td>
            <td>${moment(e.tdate).format('DD.MMM.YYYY hh:mm')}</td>
            <td>${e.amt}</td>
          </tr>
            `);
          });
        }else{
          $('#tblHistory tbody').append(`
              <tr>
                <td colspan="5">No record found</td>
              </tr>
            `);
        }
        DM_TEMPLATE.showBtnLoader(elq('.searchUser'), false);
      }
    });
  }

})();
