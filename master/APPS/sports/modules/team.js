'use strict';

(function () {
  const popup = document.getElementById("sitePopup");
  let teams = [];

  init();

  async function init() {
    DM_SPOTRS.generateSportsMenu();
    let opt = await DM_SPOTRS.getSportsOption();
    $('#uGame').html(opt);
    getTeams();
    bindEvents();
  }

  function bindEvents() {
    $('#sitePopup').off('click');
    $('.searchTeam').on('click',getTeams);
    $('.createTeam').on('click',teamPopup);
    $('#sitePopup').on('click','.saveBtn',saveTeam);
    $('#sitePopup').on('click','#closePopup',function(){
        popup.style.display = "none";
      });
    $('#tblTeam').on('click',`[data-editid]`,teamPopup);
    $('#tblTeam').on('click',`[data-statusid]`,statusPopup);
    $('#sitePopup').on('click','.statusSaveBtn',statusSave);
  }

  function getTeams(){
    DM_TEMPLATE.showBtnLoader(elq('.searchTeam'), true);
    let uName = $('#uName').val();
    let uType = $('#uType').find(":selected").val();
    let uGame = $('#uGame').find(":selected").val();
    let uStatus = $('#uStatus').find(":selected").val();
    let whr = [
      {'key':'sports','operator':'is','value':uGame},
      {'key':'status','operator':'is','value':uStatus}
    ];
    if(uName != ''){
      whr.push({'key':'name','operator':'like','value':uName})
    }
    if(uType != ''){
      whr.push({'key':'name','operator':'is','value':uType})
    }
    backendSource.getObject('s_team', null, {where: whr,
    order:{'by':'name'}
  }, function (data) {
      if(data.SUCCESS){
        teams = data.MESSAGE;
        $('#tblTeam tbody').html('');
        if(data.MESSAGE.length>0){
          data.MESSAGE.map((e)=>{
            if(e.type != 'admin'){
              $('#tblTeam tbody').append(`
              <tr>
                <td style="display:none;">${e.id}</td>
                <td>${e.name}</td>
                <td>${e.sports}</td>
                <td>${e.type}</td>
                <td class="${e.status==1?'enable':'disable'}">${e.status==1?'Enable':'Disable'}</td>
                <td style="display:flex;">
                  <span class="actionBtn" data-editid="${e.id}"><i class="bi bi-pencil-square"></i></span>
                  <span class="actionBtn" data-statusid="${e.id}"><i class="bi ${e.status==1?'bi-lock':'bi-unlock'}"></i></span>
                </td>
              </tr>
            `);
            }
            
          });
        }else{
          $('#tblTeam tbody').append(`
              <tr>
                <td colspan="6">No record found</td>
              </tr>
            `);
        }
      }
      DM_TEMPLATE.showBtnLoader(elq('.searchTeam'), false);
    });
  }

  async function teamPopup(){
    const id = $(this).attr('data-editid');
    const team = teams.find((e)=>{return e.id==id});
    let opt = await DM_SPOTRS.getSportsOption($('#uGame').find(":selected").val());
    $(`#sitePopup`).html(`<div class="popup-content">
        <span class="close" id="closePopup">&times;</span>
        <h2>Teams</h2>
        <div class="container">
          <div class="row">
            <div class="col-4 mt-3">Name</div>
            <div class="col-8 mt-3 input-container">
              <input type="text" class="uName" value="${team?team.name:''}"/>
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
