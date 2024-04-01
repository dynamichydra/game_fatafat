'use strict';

(function () {

  init();

  function init() {
    $('#pageTitle').html('Transaction History');
    getHistory();
    bindEvents();
  }

  function bindEvents() {
    
  }

  function getHistory(){
    backendSource.getObject('transaction_log', null, {
      where:[
        {'key':'user_id','operator':'is','value':auth.config.id}
      ],
      limit:{'start':0,'end':1000},
      order:{'by':'id','type':'DESC'},
      }, function (data) {
        if(data.SUCCESS){
          let htm = ``;
          for(const item of data.MESSAGE){
            let bgColor = item.type =='d'? 'style="background-color: #a9ffb6;"':'';

            htm += `<tr ${bgColor}>
            <td scope="col">${'T-'+item.id.toString().padStart(5, "0")}</td>
            <td scope="col">${moment(item.bdate).format('DD-MMM-YYYY')}</td>
            <td scope="col">${item.amt}</td>
            <td scope="col">${item.description}</td>
          </tr>`;
          }
          $('#tblMyHistory tbody').html(htm);
        }
      });
  }

})();
