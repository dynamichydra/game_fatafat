'use strict';

(function () {

  const popup = document.getElementById("sitePopup");
  let cUser = [];
  let users = [];
  let uType = ['admin','master','super','distributer','user'];
  let transStatus = 0;
  let selectUser = auth.config.id;
  let selUserPar = null;

  init();

  async function init() {
    cUser = await DM_GENERAL.userData(auth.config.id);
    $('#mainUser').html(cUser.MESSAGE.ph);
    if(cUser.MESSAGE.status != 1){
      $('.createUser').hide();
    }
    getUsers();
    bindEvents();
  }

  function bindEvents() {
    $('#sitePopup').off('click');
    $('#tblUser').on('click',`[data-moneyid]`,transferPopup);
    $('#tblUser').on('click',`[data-editid]`,userPopup);
    $('#tblUser').on('click',`[data-statusid]`,statusPopup);
    $('.createUser').on('click',userPopup);
    $('.searchUser').on('click',getUsers);
    $('#sitePopup').on('click','#closePopup',function(){
      popup.style.display = "none";
    });
    $('#sitePopup').on('click','.saveBtn',saveUser);
    $('#sitePopup').on('click','.statusSaveBtn',statusSave);
    $('#sitePopup').on('click','.transferBtn',transferSave);
    $('#sitePopup').on('click','.withdrawBtn',withdrawSave);
    $('#sitePopup').on('change','.uType',typeChange);
    $('#tblUser').on('click','.itemBtn',getCurUser);
    $('#backResult').on('click',backUser);
  }

  async function backUser(){
    selectUser = selUserPar;
    let usr = await DM_GENERAL.userData(selectUser);
    $('#mainUser').html(usr.MESSAGE.ph);
    if(selectUser == auth.config.id){
      selUserPar = null;
      $('#backResult').hide();
    }else{
      selUserPar = usr.MESSAGE.pid;
      $('#backResult').show();
    }
    getUsers();
  }

  async function getCurUser(){
    selectUser = $(this).attr('data-id');
    let usr = await DM_GENERAL.userData(selectUser);
    $('#mainUser').html(usr.MESSAGE.ph);
    if(selectUser == auth.config.id){
      selUserPar = null;
      $('#backResult').hide();
    }else{
      selUserPar = usr.MESSAGE.pid;
      $('#backResult').show();
    }
    getUsers();
  }

  function typeChange(){
    if($(this).val()=='user'){
      $('.typePCT').hide();
      $('.uPer').val('0')
    }else{
      $('.typePCT').show();
    }
  }

  async function transferSave(){
    if(transStatus==1)return;

    cUser = await DM_GENERAL.userData(auth.config.id);
    if(cUser.MESSAGE.status != 1){
      DM_TEMPLATE.showSystemNotification(0, 'Penal is suspend, please contact upline.');
      transStatus =0;
      return false;
    }

    DM_TEMPLATE.showBtnLoader(elq('.transferBtn'), true);
    transStatus =1;
    let id = $('.uId').val();
    let status = $('.uStatus').val();
    
    if(id && id.trim() != ''){
      let amt = parseFloat($('.trnsAmt').val());
      let pwd = $('.uPwd').val();
      if(parseInt(status) != 1){
        DM_TEMPLATE.showSystemNotification(0, 'Penal is suspend');
        DM_TEMPLATE.showBtnLoader(elq('.transferBtn'), false);
        transStatus =0;
        return false;
      }
      if(!amt || amt > cUser.MESSAGE.balance){
        DM_TEMPLATE.showSystemNotification(0, 'Please enter a proper amount');
        DM_TEMPLATE.showBtnLoader(elq('.transferBtn'), false);
        transStatus =0;
        return false;
      }
      if(!pwd || pwd ==''){
        DM_TEMPLATE.showSystemNotification(0, 'Please provide your password');
        DM_TEMPLATE.showBtnLoader(elq('.transferBtn'), false);
        transStatus =0;
        return false;
      }
      
      backendSource.customRequest('auth', null, {
        amt: amt,
        fid: auth.config.id,
        tid: id,
        pwd: pwd,
        grant_type: 'fundtransfer'
      }, async function (data) {
        DM_TEMPLATE.showBtnLoader(elq('.transferBtn'), false);
        transStatus =0;
        if (data.SUCCESS !== true) {
          DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
          return false;
        }
        DM_TEMPLATE.showSystemNotification(1, 'Data updated successfully');
        popup.style.display = "none";
        window.location.reload();
      });
    }
  }

  async function withdrawSave(){
    if(transStatus==1)return;

    cUser = await DM_GENERAL.userData(auth.config.id);
    if(cUser.MESSAGE.status != 1){
      DM_TEMPLATE.showSystemNotification(0, 'Penal is suspend, please contact upline.');
      transStatus =0;
      return false;
    }

    DM_TEMPLATE.showBtnLoader(elq('.withdrawBtn'), true);
    transStatus =1;
    let id = $('.uId').val();
    let bal = parseFloat($('.uBal').val());
    let status = $('.uStatus').val();
    
    if(id && id.trim() != ''){
      let amt = parseFloat($('.trnsAmt').val());
      let pwd = $('.uPwd').val();
      if(parseInt(status) != 1){
        DM_TEMPLATE.showSystemNotification(0, 'Penal is suspend, please contact upline.');
        DM_TEMPLATE.showBtnLoader(elq('.withdrawBtn'), false);
        transStatus =0;
        return false;
      }
      if(!amt || amt > bal){
        DM_TEMPLATE.showSystemNotification(0, 'Please enter a proper amount');
        DM_TEMPLATE.showBtnLoader(elq('.withdrawBtn'), false);
        transStatus =0;
        return false;
      }
      if(!pwd || pwd ==''){
        DM_TEMPLATE.showSystemNotification(0, 'Please provide your password');
        DM_TEMPLATE.showBtnLoader(elq('.withdrawBtn'), false);
        transStatus =0;
        return false;
      }

      setTimeout(function(){
        backendSource.customRequest('auth', null, {
          amt: amt,
          tid: auth.config.id,
          fid: id,
          pwd: pwd,
          grant_type: 'fundwithdraw'
        }, async function (data) {
          DM_TEMPLATE.showBtnLoader(elq('.withdrawBtn'), false);
          transStatus =0;
          if (data.SUCCESS !== true) {
            DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
            return false;
          }
          DM_TEMPLATE.showSystemNotification(1, 'Data updated successfully');
          popup.style.display = "none";
          window.location.reload();
        });

      },5000);
    }
  }

  async function statusSave(){
    if(transStatus==1)return;

    cUser = await DM_GENERAL.userData(auth.config.id);
    if(cUser.MESSAGE.status != 1){
      DM_TEMPLATE.showSystemNotification(0, 'Penal is suspend, please contact upline.');
      transStatus =0;
      return false;
    }

    DM_TEMPLATE.showBtnLoader(elq('.statusSaveBtn'), true);
    transStatus =1;
    let id = $('.uId').val();
    
    if(id && id.trim() != ''){

      backendSource.customRequest('auth', null, {
        id: id,
        status:  $('.cStatus').find(":selected").val(),
        grant_type: 'statuschange'
      }, async function (data) {
        transStatus =0;
        DM_TEMPLATE.showBtnLoader(elq('.statusSaveBtn'), false);
        if(data.SUCCESS){
          // getUsers();
          DM_TEMPLATE.showSystemNotification(1, `Status updated successfully.`);
          popup.style.display = "none";
          setTimeout(function(){
            window.location.reload();
          },1000);
        }else{
          DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
        }
      });

    }
  }

  async function saveUser(){
    if(transStatus==1)return;
    cUser = await DM_GENERAL.userData(auth.config.id);
    if(cUser.MESSAGE.status != 1){
      DM_TEMPLATE.showSystemNotification(0, 'Penal is suspend, please contact upline.');
      transStatus =0;
      return false;
    }
    let pct = parseInt($('.uPer').val());
    let uPct = auth.config.type=='admin'?100: parseInt(auth.config.percentage);
    if(pct <0 || pct >uPct){
      DM_TEMPLATE.showSystemNotification(0, 'Percentage should be in between 0 and '+uPct);
      transStatus =0;
      return false;
    }
    DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), true);
    transStatus =1;
    let id = $('.uId').val();
    
    if(id && id.trim() != ''){
      
      backendSource.saveObject('user', id, {
        name: $('.uName').val(),
        
        percentage: pct,
        email: $('.uEmail').val()
      }, function (data) {
        if(data.SUCCESS){
          let pwd = $('.uPwd').val();
          if(pwd && pwd.trim() != ''){
            backendSource.customRequest('auth', id, {
              pwd: pwd,
              grant_type: 'changepasswordadmin'
            }, function (data) {
        
              if(!data.SUCCESS){
                DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
               }
            });
          }
          transStatus =0;
          // getUsers();
          DM_TEMPLATE.showSystemNotification(1, `Profile updated successfully.`);
          popup.style.display = "none";
          window.location.reload();
        }else{
          DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
        }
        DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), false);
      });
    }else{
      backendSource.customRequest('auth', null, {
        name: $('.uName').val(),
        ph: $('.uPh').val(),
        email: $('.uEmail').val(),
        pwd: $('.uPwd').val(),
        type: $('.uType').val(),
        percentage: pct,
        pid: auth.config.id,
        grant_type: 'register'
      }, function (data) {
        DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), false);
        transStatus =0;
        if (data.SUCCESS !== true) {
          DM_TEMPLATE.showSystemNotification(0, data.MESSAGE);
          return false;
        }
        // getUsers();
        DM_TEMPLATE.showSystemNotification(1, 'Data updated successfully');
        popup.style.display = "none";
        window.location.reload();
      });
    }
  }

  function statusPopup(){
    const uid = $(this).attr('data-statusid');
    const user = users.find((e)=>{return e.id==uid});
    $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Change status</h2>
        <div class="container">
          <div class="row">
            <div class="col-4 mt-3">Name</div>
            <div class="col-8 mt-3 input-container">${user?user.name:''}</div>
            <div class="col-4 mt-3">UID</div>
            <div class="col-8 mt-3 input-container">${user?user.ph:''}</div>
            <div class="col-4 mt-3">Status</div>
            <div class="col-8 mt-3 input-container">
            <select type="text" class="cStatus">
              <option ${user && user.status==1?'selected':''} value="1">Enable</option>
              <option ${user && user.status!=1?'selected':''} value="2">Disable</option>
            </select>
            <input type="hidden" class="uId" value="${user?user.id:''}"/>
            </div>
            <div class="col-4 mt-3">&nbsp;</div>
            <div class="col-8 mt-3"><span class="gameButton statusSaveBtn"> Save </span></div>
          </div>
        </div>
      </div>`);

      popup.style.display = "block";
  }

  function userPopup(){
    const uid = $(this).attr('data-editid');
    const user = users.find((e)=>{return e.id==uid});
    let uType = auth.config.type=='admin'?'master':(auth.config.type=='master'?'super':(auth.config.type=='super'?'distributer':'user'));

    $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Users</h2>
        <div class="container">
          <div class="row">
            <div class="col-4 mt-3">Name</div>
            <div class="col-8 mt-3 input-container">
              <input type="text" class="uName" value="${user?user.name:''}"/>
              <i class="bi bi-person"></i>
            </div>
            <div class="col-4 mt-3">User Name</div>
            <div class="col-8 mt-3 input-container">
            ${user?`
            <b>${user.ph}</b>
              `:`
              <input type="text" class="uPh" value=""/>
              <i class="bi bi-person"></i>
              `}
            </div>
            <div class="col-4 mt-3">Phone</div>
            <div class="col-8 mt-3 input-container">
              <input type="text" class="uEmail" value="${user?user.email:''}"/>
              <i class="bi bi-phone"></i>
            </div>
            <div class="col-4 mt-3">Type</div>
            <div class="col-8 mt-3 input-container">
            ${user?`
            <b>${user.type}</b>
            `:`
            <input type="text" class="uType" value="${uType}" readonly/>
              
              <i class="bi bi-person"></i>
            `}
            </div>
            <div class="col-4 mt-3 typePCT" ${(user && user.type=='user') || auth.config.type =='distributer'?'style="display:none;"':''}>Percentage</div>
            <div class="col-8 mt-3 input-container typePCT" ${(user && user.type=='user') || auth.config.type =='distributer'?'style="display:none;"':''}>
              <input type="number" class="uPer" min="0" max="100" value="${user?user.percentage:0}"/>
              <i class="bi bi-percent"></i>
            </div>
            <div class="col-4 mt-3">Password</div>
            <div class="col-8 mt-3 input-container">
              <input type="password" class="uPwd"/>
              <i class="bi bi-lock"></i>
              <input type="hidden" class="uId" value="${user?user.id:''}"/>
            </div>
            <div class="col-4 mt-3">&nbsp;</div>
            <div class="col-8 mt-3"><span class="gameButton saveBtn"> Save </span></div>
          </div>
        </div>
      </div>`);

      popup.style.display = "block";
  }

  function transferPopup(){
    const uid = $(this).attr('data-moneyid');
    const user = users.find((e)=>{return e.id==uid});
    
    if(user){
      $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Transfer points</h2>
        <div class="container">
          <div class="row">
            <div class="col-6 mt-3">Your Balance</div>
            <div class="col-6 mt-3 font-weight-bold">${cUser.MESSAGE.balance}</div>
            <div class="col-6 mt-3">User/account</div>
            <div class="col-6 mt-3 font-weight-bold">${user.name}</div>
            <div class="col-6 mt-3">User Balance</div>
            <div class="col-6 mt-3 font-weight-bold">${user.balance}</div>
            <div class="col-4 mt-3">Points</div>
            <div class="col-8 mt-3 input-container">
              <input type="text" class="trnsAmt"/>
              <i class="bi bi-cash-coin"></i>
            </div>
            <div class="col-4 mt-3">Password</div>
            <div class="col-8 mt-3 input-container">
              <input type="password" class="uPwd"/>
              <i class="bi bi-lock"></i>
              <input type="hidden" class="uId" value="${user.id}"/>
              <input type="hidden" class="uStatus" value="${user.status}"/>
              <input type="hidden" class="uBal" value="${user.balance}"/>
            </div>
            <div class="col-6 mt-3"><span class="gameButton withdrawBtn"> Withdraw </span></div>
            <div class="col-6 mt-3"><span class="gameButton transferBtn"> Transfer </span></div>
          </div>
        </div>
      </div>`);

      popup.style.display = "block";
    }
    
  }

  function getUsers(){
    DM_TEMPLATE.showBtnLoader(elq('.searchUser'), true);
    let uId = $('#uId').val();
    let uName = $('#uName').val();
    let uPh = $('#uPhone').val();
    let uStatus = $('#uStatus').find(":selected").val();

    backendSource.customRequest('report', null, {
      uId: (uId && uId != '' ? uId : ''),
      uName: (uName && uName != '' ? uName : ''),
      uPh: (uPh && uPh != '' ? uPh : ''),
      uStatus: (uStatus && uStatus != '' ? uStatus : ''),
      pId: selectUser,
      grant_type: 'user_simple'
    }, function (data) {
      if(data.SUCCESS){
        users = data.MESSAGE;
        $('#tblUser tbody').html('');
        if(data.MESSAGE.length>0){
          data.MESSAGE.map((e)=>{
            if(e.type != 'admin'){
              $('#tblUser tbody').append(`
              <tr>
                <td style="display:none;">${e.id}</td>
                <td>${e.name}</td>
                ${e.type!='user'?`
                <td style="color:blue;" class="itemBtn" data-id="${e.id}">${e.ph}</td>
                `:`
                <td >${e.ph}</td>
                `}
                <td>${e.type}</td>
                <td class="${e.status==1?'enable':'disable'}">${e.status==1?'Enable':'Disable'}</td>
                <td>${e.type=='user'?'-':e.percentage}</td>
                <td>${e.balance}</td>
                <td style="display:flex;">
                  <a class="actionBtn" href="#/report/transfer/${e.id}"><i class="bi bi-arrow-left-right"></i></a>
                  <a class="actionBtn" href="#/pl/index/${e.id}"><i class="bi bi-graph-up-arrow"></i></a>
                  ${selectUser==auth.config.id ?`
                  <span class="actionBtn" data-moneyid="${e.id}"><i class="bi bi-cash-stack"></i></span>
                  <span class="actionBtn" data-editid="${e.id}"><i class="bi bi-pencil-square"></i></span>
                  <span class="actionBtn" data-statusid="${e.id}"><i class="bi ${e.status==1?'bi-lock':'bi-unlock'}"></i></span>
                  `:``}
                  
                </td>
              </tr>
            `);
            }
            
          });
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
