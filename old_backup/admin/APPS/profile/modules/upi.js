'use strict';

(function () {

  const popup = document.getElementById("sitePopup");

  let eImg = [
    {code:1,big:'1.png',small:'1_small.png'},
    {code:2,big:'2.png',small:'2_small.png'},
    {code:3,big:'3.png',small:'3_small.png'},
    {code:4,big:'4.png',small:'4_small.png'},
    {code:5,big:'5.png',small:'5_small.png'}
  ];
  
  let tDetail = {
    upi_acc : null,
    order_no : auth.config.id+'0'+Math.floor(Date.now() / 1000),
    amt : get_param1?parseInt(get_param1):1000
  };

  init();

  function init() {
    $('#pageTitle').html('Upi Pay');
    getUpiDetails();
    $('.amount').html(tDetail.amt);
    $('.orderNo').html(tDetail.order_no);
    generateExampleImg();
    bindEvents();
  }

  function bindEvents() {
    $('.saveBtn').on('click',saveBtnClk);
    $('.copyBtn').on('click',copyClipBoard);
    $('.imgWrapper').on('click','.exImg',imageClick);

    $('#sitePopup').on('click','#closePopup',function(){
      popup.style.display = "none";
    });
    window.addEventListener("click", (event) => {
      if (event.target === popup) {
        popup.style.display = "none";
      }
    });
  }

  function copyClipBoard(){
    navigator.clipboard.writeText(tDetail[$(this).attr('data-type')]);
    DM_TEMPLATE.showSystemNotification(1, `Copy to clipboard successfully.`);
  }

  function imageClick(){
    let code = $(this).attr('data-code');
    let img = eImg.find(e=>e.code==code);
    if(img){
      $(`#sitePopup`).html(`<div class="popup-content">
          <span class="close" id="closePopup">&times;</span>
          <img class="imgBig" src="whitelabel/${subdomain}/img/example/${img.big}"/>
        </div>`);
        popup.style.display = "block";
    }
  }

  function generateExampleImg(){
    let htm = ``;
    for(let i in eImg){
      htm += `<div class="col-6">
        <img class="exImg" data-code="${eImg[i].code}" src="whitelabel/${subdomain}/img/example/${eImg[i].small}"/>
      </div>`;
    }
    $('.imgWrapper').html(htm);
  }

  function getUpiDetails(){
    backendSource.getObject('settings', null, {
      select : "upi_acc,upi_qr"
    }, function (data) {
      if(data.SUCCESS && data.MESSAGE.length >0){
        $('.upiAccount').html(data.MESSAGE[0].upi_acc);
        tDetail.upi_acc = data.MESSAGE[0].upi_acc;
        $('.qrImg').attr('src','whitelabel/'+subdomain+'/img/'+data.MESSAGE[0].upi_qr)
      }else{
        DM_TEMPLATE.showSystemNotification(0, `There is some technical problem. Please try again.`);
      }
    })
  }

  function saveBtnClk(){
    let refNo = $('#refNo').val();
    if(!refNo || refNo==''){
      DM_TEMPLATE.showSystemNotification(0, `Please provide the reference number.`);
      return;
    }
    backendSource.saveObject('payment', null, {
      user_id: auth.config.id,
      type: 'upi',
      ref_no: refNo,
      pamt: tDetail.amt,
      upi_acc: tDetail.upi_acc,
      order_no: tDetail.order_no
    }, async function (data) {
      if(data.SUCCESS){
        DM_TEMPLATE.showSystemNotification(1, `Payment information updated successfully.`);
        $('#refNo').val('');
      }else{
        DM_TEMPLATE.showSystemNotification(0, `Unable to update. Please try again.`);
      }
    });
  }


})();