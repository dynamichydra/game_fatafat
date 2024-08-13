'use strict';

(function () {

  let cUser = get_param1??auth.config.id;
  let cType = null;
  let selUserPar = null;
  let selUserParType = null;
  let paramType = null;
  let gameCode = null;
  init();

  async function init() {
    let usr = await DM_GENERAL.userData(cUser);
    paramType = usr.MESSAGE.type;
    $('#transUser').html(usr.MESSAGE.ph);
    cType = paramType??auth.config.type;
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    $('#fDate').val(formattedDate);
    $('#tDate').val(formattedDate);

    getGameType();
    
    bindEvents();
  }

  function bindEvents() {
    $('.searchUser').on('click',getChartData);
    $('#backResult').on('click',backUser);
    $('#gameName').on('change',function(){
      gameCode = $('#gameName').val();
    });
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
      gameCode = $('#gameName').val();
    });
  }

  async function getChartData(){
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), true);
    let fdate = $('#fDate').val();
    let tdate = $('#tDate').val();
    let reportOn = $('#report').val();
    let type = $('#type').val();
    let arr = [];
    if(reportOn=='pl'){
      arr = await getPlData(fdate,tdate);
      dm_chart.pl_chart(arr,type,function(data){
        getCurUser(data.label);
      });
    }else if(reportOn=='pl_d'){
      cUser = get_param1??auth.config.id;
      cType = paramType??auth.config.type;
      arr = await getPl_d_Data(fdate,tdate);
      dm_chart.pl_chart(arr,type);
    }else if(reportOn=='pl_g'){
      cUser = get_param1??auth.config.id;
      cType = paramType??auth.config.type;
      arr = await getPl_g_Data(fdate,tdate);
      dm_chart.pl_chart(arr,type);
    }

    
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), false);
  }

  function getPl_g_Data(fdate,tdate){
    return new Promise(async function (result) {
      backendSource.customRequest('report', null, {
        fdate: (fdate && fdate != '' ? fdate : ''),
        tdate: (tdate && tdate != '' ? tdate : ''),
        pType: cType,
        pId: cUser,
        gCode :gameCode,
        grant_type: 'bet_log_name'
      }, function (data) {
        if(data.SUCCESS){
          if(data.MESSAGE.length>0){
            let arr = {labels : [],dataOne : [],dataTwo : [],dataThree : []}
            for(let i in data.MESSAGE){
              arr.labels.push(data.MESSAGE[i].name);
              arr.dataOne.push(data.MESSAGE[i].amt);
              arr.dataTwo.push(data.MESSAGE[i].price);
              arr.dataThree.push(data.MESSAGE[i].price-data.MESSAGE[i].amt);
            }
            result(arr);
          }else{
            result(null);
          }
        }
      });
    });
  }

  function getPl_d_Data(fdate,tdate){
    return new Promise(async function (result) {
      backendSource.customRequest('report', null, {
        fdate: (fdate && fdate != '' ? fdate : ''),
        tdate: (tdate && tdate != '' ? tdate : ''),
        pType: cType,
        pId: cUser,
        gCode :gameCode,
        grant_type: 'bet_log_dt'
      }, function (data) {
        if(data.SUCCESS){
          if(data.MESSAGE.length>0){
            let arr = {labels : [],dataOne : [],dataTwo : [],dataThree : []}
            for(let i in data.MESSAGE){
              arr.labels.push(data.MESSAGE[i].dt);
              arr.dataOne.push(data.MESSAGE[i].amt);
              arr.dataTwo.push(data.MESSAGE[i].price);
              arr.dataThree.push(data.MESSAGE[i].price-data.MESSAGE[i].amt);
            }
            result(arr);
          }else{
            result(null);
          }
        }
      });
    });
  }

  async function getCurUser(ph){
    let usr = await DM_GENERAL.userData(ph,'ph');
    usr = usr.MESSAGE[0];
    if(usr.type=='user')return;
    cUser = usr.id;
    cType = usr.type;
    $('#transUser').html(usr.ph);
    if(cUser == auth.config.id){
      selUserPar = null;
      selUserParType = null;
      $('#backResult').hide();
    }else{
      selUserPar = usr.pid;
      let pdetail = await DM_GENERAL.userData(selUserPar);
      selUserParType = pdetail.type;
      $('#backResult').show();
    }
    getChartData();
  }

  async function backUser(){
    cUser = selUserPar;
    cType = selUserParType;
    if(!cUser)return;
    let usr = await DM_GENERAL.userData(cUser);
    $('#transUser').html(usr.MESSAGE.ph);
    if(cUser == auth.config.id){
      selUserPar = null;
      selUserParType = null;
      $('#backResult').hide();
    }else{
      selUserPar = usr.MESSAGE.pid;
      let pdetail = await DM_GENERAL.userData(selUserPar);
      selUserParType = pdetail.MESSAGE.type;
      $('#backResult').show();
    }
    getChartData();
  }

  function getPlData(fdate,tdate){
    return new Promise(async function (result) {
      backendSource.customRequest('report', null, {
        fdate: (fdate && fdate != '' ? fdate : ''),
        tdate: (tdate && tdate != '' ? tdate : ''),
        pType: cType,
        pId: cUser,
        gCode :gameCode,
        grant_type: 'pl'
      }, function (data) {
        if(data.SUCCESS){
          if(data.MESSAGE.length>0){
            let arr = {};
            
            for(let i in data.MESSAGE){
              if(data.MESSAGE[i].u4id && data.MESSAGE[i].u4id != cUser){
                if(data.MESSAGE[i].u4id == cUser){
                  if(!arr[data.MESSAGE[i].u3id]){
                    arr[data.MESSAGE[i].u3id] ={
                      name:data.MESSAGE[i].u3name,
                      amt:0,
                      price:0
                    }
                  }
                  arr[data.MESSAGE[i].u3id].amt += data.MESSAGE[i].amt;
                  arr[data.MESSAGE[i].u3id].price += data.MESSAGE[i].price;
                }else{
                  if(!arr[data.MESSAGE[i].u4id]){
                    arr[data.MESSAGE[i].u4id] ={
                      name:data.MESSAGE[i].u4name,
                      amt:0,
                      price:0
                    }
                  }
                  arr[data.MESSAGE[i].u4id].amt += data.MESSAGE[i].amt;
                  arr[data.MESSAGE[i].u4id].price += data.MESSAGE[i].price;
                }
                
              }else if(data.MESSAGE[i].u3id){
                if(data.MESSAGE[i].u3id == cUser){
                  if(!arr[data.MESSAGE[i].u2id]){
                    arr[data.MESSAGE[i].u2id] ={
                      name:data.MESSAGE[i].u2name,
                      amt:0,
                      price:0
                    }
                  }
                  arr[data.MESSAGE[i].u2id].amt += data.MESSAGE[i].amt;
                  arr[data.MESSAGE[i].u2id].price += data.MESSAGE[i].price;
                }else{
                  if(!arr[data.MESSAGE[i].u3id]){
                    arr[data.MESSAGE[i].u3id] ={
                      name:data.MESSAGE[i].u3name,
                      amt:0,
                      price:0
                    }
                  }
                  arr[data.MESSAGE[i].u3id].amt += data.MESSAGE[i].amt;
                  arr[data.MESSAGE[i].u3id].price += data.MESSAGE[i].price;
                }
                
              }else if(data.MESSAGE[i].u2id){
                if(data.MESSAGE[i].u2id == cUser){
                  if(!arr[data.MESSAGE[i].u1id]){
                    arr[data.MESSAGE[i].u1id] ={
                      name:data.MESSAGE[i].u1name,
                      amt:0,
                      price:0
                    }
                  }
                  arr[data.MESSAGE[i].u1id].amt += data.MESSAGE[i].amt;
                  arr[data.MESSAGE[i].u1id].price += data.MESSAGE[i].price;
                }else{
                  if(!arr[data.MESSAGE[i].u2id]){
                    arr[data.MESSAGE[i].u2id] ={
                      name:data.MESSAGE[i].u2name,
                      amt:0,
                      price:0
                    }
                  }
                  arr[data.MESSAGE[i].u2id].amt += data.MESSAGE[i].amt;
                  arr[data.MESSAGE[i].u2id].price += data.MESSAGE[i].price;
                }
                
              }else{
                if(!arr[data.MESSAGE[i].u1id]){
                  arr[data.MESSAGE[i].u1id] ={
                    name:data.MESSAGE[i].u1name,
                    amt:0,
                    price:0
                  }
                }
                arr[data.MESSAGE[i].u1id].amt += data.MESSAGE[i].amt;
                arr[data.MESSAGE[i].u1id].price += data.MESSAGE[i].price;
              }
            }

            let labels = [];
            let dataOne = [];
            let dataTwo = [];
            let dataThree = [];
            for(let i in arr){
              labels.push(arr[i].name);
              dataOne.push(arr[i].amt);
              dataTwo.push(arr[i].price);
              dataThree.push(arr[i].price-arr[i].amt);
            }
            
            result({labels:labels,dataOne:dataOne,dataTwo:dataTwo,dataThree:dataThree});
            
          }else{
            result(null);
          }
        }
      });
    });
  }

})();
