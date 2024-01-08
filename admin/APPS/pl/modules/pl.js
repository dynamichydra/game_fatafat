'use strict';

(function () {

  let cUser = get_param1??auth.config.id;
  let cType = null;
  let selUserPar = null;
  let selUserParType = null;
  let paramType = null;
  let gameCode = null;
  let baji = {
    'fatafat':['All','Bazi1','MR2','MR3','MR4','MR5','MR6','MR7','MR8'],
    'fatafatSuper':['All','MS1','MS2','MS3','MS4','MS5','MS6','MS7','MS8']
  };

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
    $('.searchUser').on('click',getLog);
    $('#tblUser').on('click','.itemBtn',getCurUser);
    $('#backResult').on('click',backUser);
    $('#gameName').on('change',function(){
      gameCode = $('#gameName').val();
      generateBajiOpt();
    });
  }

  function getGameType(){
    $('#gameName').html('');
    backendSource.getObject('game', null, {where:[
      {'key':'status','operator':'is','value':1}
    ]}, function (data) {
      console.log(data);
      data.MESSAGE.map(e=>{
        $('#gameName').append(`
          <option value="${e.code}">${e.name}</option>
        `);
      });
      gameCode = $('#gameName').val();
      generateBajiOpt();
    });
  }

  function generateBajiOpt(){
    let htm = ``;
    for(let i in baji[gameCode]){
      htm += `<option value="${baji[gameCode][i]=='All'?'':baji[gameCode][i]}">${baji[gameCode][i]}</option>`;
    }
    $('#gameBaji').html(htm);
    getLog();
  }

  async function backUser(){
    cUser = selUserPar;
    cType = selUserParType;
    
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
    getLog();
  }

  async function getCurUser(){
    cUser = $(this).attr('data-id');
    cType = $(this).attr('data-type');
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
    getLog();
  }

  function getLog(){
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), true);
    let fdate = $('#fDate').val();
    let tdate = $('#tDate').val();
    
    backendSource.customRequest('report', null, {
      fdate: (fdate && fdate != '' ? fdate : ''),
      tdate: (tdate && tdate != '' ? tdate : ''),
      pType: cType,
      pId: cUser,
      gCode :gameCode,
      gName :$('#gameBaji').val(),
      grant_type: 'pl'
    }, function (data) {
      if(data.SUCCESS){
        console.log(data)
        $('#tblUser tbody').html('');
        if(data.MESSAGE.length>0){
          let arr = {};
          for(let i in data.MESSAGE){
            if(data.MESSAGE[i].u4id && data.MESSAGE[i].u4id != cUser){
              if(data.MESSAGE[i].u4id == cUser){
                if(!arr[data.MESSAGE[i].u3id]){
                  arr[data.MESSAGE[i].u3id] ={
                    id:data.MESSAGE[i].u3id,
                    name:data.MESSAGE[i].u3name,
                    type:data.MESSAGE[i].u3type,
                    amt:0,
                    price:0
                  }
                }
                arr[data.MESSAGE[i].u3id].amt += data.MESSAGE[i].amt;
                arr[data.MESSAGE[i].u3id].price += data.MESSAGE[i].price;
              }else{
                if(!arr[data.MESSAGE[i].u4id]){
                  arr[data.MESSAGE[i].u4id] ={
                    id:data.MESSAGE[i].u4id,
                    name:data.MESSAGE[i].u4name,
                    type:data.MESSAGE[i].u4type,
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
                    id:data.MESSAGE[i].u2id,
                    name:data.MESSAGE[i].u2name,
                    type:data.MESSAGE[i].u2type,
                    amt:0,
                    price:0
                  }
                }
                arr[data.MESSAGE[i].u2id].amt += data.MESSAGE[i].amt;
                arr[data.MESSAGE[i].u2id].price += data.MESSAGE[i].price;
              }else{
                if(!arr[data.MESSAGE[i].u3id]){
                  arr[data.MESSAGE[i].u3id] ={
                    id:data.MESSAGE[i].u3id,
                    name:data.MESSAGE[i].u3name,
                    type:data.MESSAGE[i].u3type,
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
                    id:data.MESSAGE[i].u1id,
                    name:data.MESSAGE[i].u1name,
                    type:data.MESSAGE[i].u1type,
                    amt:0,
                    price:0
                  }
                }
                arr[data.MESSAGE[i].u1id].amt += data.MESSAGE[i].amt;
                arr[data.MESSAGE[i].u1id].price += data.MESSAGE[i].price;
              }else{
                if(!arr[data.MESSAGE[i].u2id]){
                  arr[data.MESSAGE[i].u2id] ={
                    id:data.MESSAGE[i].u2id,
                    name:data.MESSAGE[i].u2name,
                    type:data.MESSAGE[i].u2type,
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
                  id:data.MESSAGE[i].u1id,
                  name:data.MESSAGE[i].u1name,
                  type:data.MESSAGE[i].u1type,
                  amt:0,
                  price:0
                }
              }
              arr[data.MESSAGE[i].u1id].amt += data.MESSAGE[i].amt;
              arr[data.MESSAGE[i].u1id].price += data.MESSAGE[i].price;
            }
          }
          console.log(arr)
          let totAmt= 0, totPrice = 0;
          for(const i in arr){
            $('#tblUser tbody').append(`
              <tr >
                <td>${arr[i].id}</td>
                ${arr[i].type!='user'?`
                <td style="color:blue;" class="itemBtn" data-id="${arr[i].id}" data-type="${arr[i].type}">${arr[i].name}</td>
                `:`
                <td >${arr[i].name}</td>
                `}
                
                <td>${arr[i].amt}</td>
                <td>${arr[i].price}</td>
                <td>${(arr[i].amt-arr[i].price)}</td>
              </tr>
            `);
            totAmt += arr[i].amt;
            totPrice += arr[i].price;
          }
          $('#tblUser tbody').append(`
              <tr >
                <td colspan="2"></td>
                <td>${totAmt}</td>
                <td>${totPrice}</td>
                <td>${(totAmt-totPrice)}</td>
              </tr>
            `);
          
        }else{
          $('#tblUser tbody').append(`
              <tr>
                <td colspan="5">No record found</td>
              </tr>
            `);
        }
      }
      DM_TEMPLATE.showBtnLoader(elq('.searchUser'), false);
    });
  }

})();
