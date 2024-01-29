'use strict';

(function () {

  init();

  function init() {
    $('#pageTitle').html('M.Rocket Bet Record');
    getMyBet();
    bindEvents();
  }

  function bindEvents() {
    
  }

  function getMyBet(){
    backendSource.getObject('rocket_bet', null, {
      where:[
        {'key':'user_id','operator':'is','value':auth.config.id}
      ],
      limit:{'start':0,'end':100},
      order:{'by':'bdate','type':'DESC'},
      }, function (data) {
        if(data.SUCCESS){
          let htm = ``;
          for(const item of data.MESSAGE){
            let bgColor = item.status ==1? 'style="background-color: #a9ffb6;"':'';

            htm += `<tr ${bgColor}>
            <td scope="col">${'2'+item.game_id.toString().padStart(5, "0")}</td>
            <td scope="col">${item.number??''}</td>
            <td scope="col">${moment(item.bdate).format('DD-MMM-YYYY')}</td>
            <td scope="col">${item.amt}</td>
            <td scope="col">${item.price}</td>
          </tr>`;
          }
          $('#tblMyBet tbody').html(htm);
        }
      });
  }

})();
