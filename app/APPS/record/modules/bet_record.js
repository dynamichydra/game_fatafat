'use strict';

(function () {

  init();

  function init() {
    $('#pageTitle').html('Bet History');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    $('#fDate').val(formattedDate);
    $('#tDate').val(formattedDate);
    getGameType();
    bindEvents();
  }

  function bindEvents() {
    $('.searchUser').on('click',getMyBet);
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
    });
  }

  function getMyBet(){
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), true);
    let fdate = $('#fDate').val();
    let tdate = $('#tDate').val();
    let cnd = [
      {'key':'user_id','operator':'is','value':auth.config.id}
    ];
    if(fdate && fdate !='' && tdate && tdate != ''){
      cnd.push({'key':'bdate','operator':'higher-equal','value':moment(fdate).format('YYYY-MM-DD')+" 00:00:00"})
      cnd.push({'key':'bdate','operator':'lower-equal','value':moment(tdate).format('YYYY-MM-DD')+" 23:59:59"})
    }
    let gameCode = $('#gameName').val();
    backendSource.getObject(gameCode, null, {
      where:cnd,
      order:{'by':'bdate','type':'DESC'},
      reference:[{obj:'game_inplay',a:'id',b:gameCode+'.game_id'}],
      select:"name,"+gameCode+".*"
      }, function (data) {
        if(data.SUCCESS){
          let htm = ``;
          if(data.MESSAGE.length>0){
            for(const item of data.MESSAGE){
              let bgColor = item.status ==1? 'style="background-color: #a9ffb6;"':'';
  
              htm += `<tr ${bgColor}>
              <td scope="col">${item.name}</br>${'2'+item.game_id.toString().padStart(5, "0")}</td>
              <td scope="col">${moment(item.bdate).format('DD.MMM.YYYY H:mm')}</td>
              <td scope="col">${item.type}</br>${item.number??''}</td>
              <td scope="col">${item.amt}</td>
              <td scope="col">${item.id}</td>
            </tr>`;
            }
          }else{
            htm += '<tr><td colspan="5">No record found</td></tr>'
          }
          
          $('#tblMyBet tbody').html(htm);
          DM_TEMPLATE.showBtnLoader(elq('.searchUser'), false);
        }
      });
  }

})();
