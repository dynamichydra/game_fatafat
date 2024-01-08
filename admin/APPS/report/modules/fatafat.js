'use strict';

(function () {

  init();

  async function init() {
    // getLog();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    $('#fDate').val(formattedDate);
    $('#tDate').val(formattedDate);
    getGameType();
    bindEvents();
  }

  function bindEvents() {
    $('.searchUser').on('click',getLog);
  }

  function getGameType(){
    $('#gCode').html('');
    backendSource.getObject('game', null, {where:[
      {'key':'status','operator':'is','value':1}
    ]}, function (data) {
      console.log(data);
      data.MESSAGE.map(e=>{
        $('#gCode').append(`
          <option value="${e.code}">${e.name}</option>
        `);
      });
    });
  }

  function getLog(){
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), true);
    let uId = $('#uId').val();
    let uName = $('#uName').val();
    let gCode = $('#gCode').val();
    let status =  $('#uStatus').find(":selected").val();
    let fdate = $('#fDate').val();
    let tdate = $('#tDate').val();
    
    backendSource.customRequest('report', null, {
      uId: (uId && uId != '' ? uId : ''),
      uName: (uName && uName != '' ? uName : ''),
      gCode: (gCode && gCode != '' ? gCode : 'fatafat'),
      status: (status && status != '' ? status : ''),
      fdate: (fdate && fdate != '' ? fdate : ''),
      tdate: (tdate && tdate != '' ? tdate : ''),
      pType: auth.config.type,
      pId: auth.config.id,
      grant_type: 'bet_log'
    }, function (data) {
      if(data.SUCCESS){
        $('#tblUser tbody').html('');
        if(data.MESSAGE.length>0){
          let totAmt = 0;
          let totPrice = 0;
          data.MESSAGE.map((e)=>{
            $('#tblUser tbody').append(`
              <tr ${e.status==1?'style="background-color:#00e800;"':''}>
                <td>${e.id}</td>
                <td>${e.ph}</td>
                <td>${e.gname} - ${'2'+e.game_id.toString().padStart(5, "0")}</td>
                <td>${e.type} - ${e.number}</td>
                <td>${moment(e.bdate).format('DD.MMM.YYYY hh:mm')}</td>
                <td>${e.amt}</td>
                <td>${e.price}</td>
              </tr>
            `);
            totAmt += e.amt;
            totPrice += e.price;
          });
          $('#tblUser tbody').append(`
              <tr>
                <td colspan="5">Total</td>
                <td>${totAmt}</td>
                <td>${totPrice}</td>
              </tr>
            `);
        }else{
          $('#tblUser tbody').append(`
              <tr>
                <td colspan="9">No record found</td>
              </tr>
            `);
        }
      }
      DM_TEMPLATE.showBtnLoader(elq('.searchUser'), false);
    });
  }

})();
