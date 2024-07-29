'use strict';

(function () {
  const popup = document.getElementById("sitePopup");
  let matches = [];

  init();

  async function init() {
    DM_SPOTRS.generateSportsMenu();
    let opt = await DM_SPOTRS.getSportsOption();
    $('#mGame').html(opt);
    $('#mDate').val(moment().format('YYYY-MM-DD'));
    getMatch();
    bindEvents();
  }

  function bindEvents() {
    $('#sitePopup').off('click');
    $('.searchMatch').on('click',getMatch);
    $('.createMatch').on('click',matchPopup);
    $('#sitePopup').on('click','.saveBtn',saveMatch);
    $('#sitePopup').on('click','#closePopup',function(){
        popup.style.display = "none";
      });
    $('#tblMatch').on('click',`[data-editid]`,matchPopup);
    $('#tblMatch').on('click',`[data-statusid]`,statusPopup);
    $('#sitePopup').on('click','.statusSaveBtn',statusSave);
  }

  function getMatch(){
    DM_TEMPLATE.showBtnLoader(elq('.searchMatch'), true);
    let mName = $('#mDate').val();
    let mGame = $('#mGame').find(":selected").val();
    let mStatus = $('#mStatus').find(":selected").val();
    let whr = [
      {'key':'sports','operator':'is','value':mGame},
      {'key':'status','operator':'is','value':mStatus}
    ];
    if(uDate != ''){
      whr.push({'key':'mdate','operator':'higher','value':uDate})
    }
    
    backendSource.getObject('s_match', null, {where: whr,
    order:{'by':'mdate'}
  }, function (data) {
      if(data.SUCCESS){
        matches = data.MESSAGE;
        $('#tblMatch tbody').html('');
        if(data.MESSAGE.length>0){
          data.MESSAGE.map((e)=>{
            if(e.type != 'admin'){
              $('#tblMatch tbody').append(`
              <tr>
                <td style="display:none;">${e.id}</td>
                <td>${e.sports}</td>
                <td>${e.team_one}</td>
                <td>${e.team_two}</td>
                <td>${e.mdate}</td>
                <td style="display:flex;">
                  <span class="actionBtn" data-editid="${e.id}"><i class="bi bi-pencil-square"></i></span>
                  <span class="actionBtn" data-statusid="${e.id}"><i class="bi ${e.status==1?'bi-lock':'bi-unlock'}"></i></span>
                </td>
              </tr>
            `);
            }
            
          });
        }else{
          $('#tblMatch tbody').append(`
              <tr>
                <td colspan="6">No record found</td>
              </tr>
            `);
        }
      }
      DM_TEMPLATE.showBtnLoader(elq('.searchMatch'), false);
    });
  }

  async function matchPopup(){
    const id = $(this).attr('data-editid');
    const match = matches.find((e)=>{return e.id==id});
    let opt = await DM_SPOTRS.getSportsOption($('#mGame').find(":selected").val());
    $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Matches</h2>
        <div class="container">
          <div class="row">
            <div class="col-4 mt-3">Name</div>
            <div class="col-8 mt-3 input-container">
              <input type="text" class="uName" value="${match?team.name:''}"/>
              <i class="bi bi-person"></i>
            </div>
            <div class="col-4 mt-3">Game</div>
            <div class="col-8 mt-3 input-container">
              <select class="uGame">${opt}</select>
            </div>
            <div class="col-4 mt-3">Type</div>
            <div class="col-8 mt-3 input-container">
                <select class="uType">
                  <option ${team && team.type == 'International'?'selected':''} value="International">International</option>
                  <option ${team && team.type == 'Domestic'?'selected':''} value="Domestic">Domestic</option>
                </select>
            </div>
            <div class="col-4 mt-3">&nbsp;<input type="hidden" class="uId" value="${team?team.id:''}"/></div>
            <div class="col-8 mt-3"><span class="gameButton saveBtn"> Save </span></div>
          </div>
        </div>
      </div>`);

      popup.style.display = "block";
  }

  async function saveTeam(){
    let name = $('.uName').val().trim();
    if(name == ''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the team name.`);
      return;
    }
    DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), true);
    let id = $('.uId').val().trim();
    backendSource.saveObject('s_team', id != '' ? id : null, {
      name: $('.uName').val(),
      sports: $('.uGame').find(":selected").val(),
      type: $('.uType').find(":selected").val()
    }, function (data) {
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, `Team updated successfully.`);
        popup.style.display = "none";
        window.location.reload();
      }else{
        DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
      }
      DM_TEMPLATE.showBtnLoader(elq('.saveBtn'), false);
    });
  }

  function statusPopup(){
    const id = $(this).attr('data-statusid');
    const team = teams.find((e)=>{return e.id==id});
    $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Change status</h2>
        <div class="container">
          <div class="row">
            <div class="col-4 mt-3">Name</div>
            <div class="col-8 mt-3 input-container">${team?team.name:''}</div>
            <div class="col-4 mt-3">Game</div>
            <div class="col-8 mt-3 input-container">${team?team.sports:''}</div>
            <div class="col-4 mt-3">Status</div>
            <div class="col-8 mt-3 input-container">
            <select type="text" class="cStatus">
              <option ${team && team.status==1?'selected':''} value="1">Enable</option>
              <option ${team && team.status!=1?'selected':''} value="2">Disable</option>
            </select>
            <input type="hidden" class="uId" value="${team?team.id:''}"/>
            </div>
            <div class="col-4 mt-3">&nbsp;</div>
            <div class="col-8 mt-3"><span class="gameButton statusSaveBtn"> Save </span></div>
          </div>
        </div>
      </div>`);

      popup.style.display = "block";
  }

  async function statusSave(){
    DM_TEMPLATE.showBtnLoader(elq('.statusSaveBtn'), true);
    let id = $('.uId').val().trim();
    
    if(id != ''){
      backendSource.saveObject('s_team', id, {
        status: $('.cStatus').find(":selected").val()
      }, function (data) {
        DM_TEMPLATE.showBtnLoader(elq('.statusSaveBtn'), false);
        if(data.SUCCESS){
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
})();
