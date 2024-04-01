'use strict';

(function () {

  let transUID = get_param1??auth.config.id;

  init();

  async function init() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    $('#fDate').val(formattedDate);
    $('#tDate').val(formattedDate);
    let usr = await DM_GENERAL.userData(transUID);
    $('#transUser').html(usr.MESSAGE.ph);
    getTransfer();
    bindEvents();
  }

  function bindEvents() {
    $('.searchUser').on('click',getTransfer);
  }

  function getTransfer(){
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), true);
    // let fid = $('#fId').val();
    // let tid = $('#tId').val();
    let fdate = $('#fDate').val();
    let tdate = $('#tDate').val();
    
    backendSource.customRequest('report', null, {
      fdate: (fdate && fdate != '' ? fdate : ''),
      tdate: (tdate && tdate != '' ? tdate : ''),
      pType: auth.config.type,
      pId: transUID,
      grant_type: 'transfer'
    }, function (data) {
      if(data.SUCCESS){
        $('#tblUser tbody').html('');
        if(data.MESSAGE.length>0){
          data.MESSAGE.map((e)=>{
            $('#tblUser tbody').append(`
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
