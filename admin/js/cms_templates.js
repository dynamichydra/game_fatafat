"use strict";

var CMS_TEMPLATE = (function () {
  function getCreator(type) {
    return templates.find((a) => a.TYPE === type);
  }

  function setCreator(type, callback) {
    var creator = templates.find((a) => a.TYPE === type);
    if (!creator) {
      creator = {
        TYPE: type,
        HTML: callback,
      };

      templates.push(creator);
    }

    creator.HTML = callback;
  }

  var showMenu = function (data) {
    return `
    <li class="nav-item">
      <a class="nav-link active" aria-current="page" href="#/${data.URL}">${data.TITLE}</a>
    </li>`;
  };

  var showFooter = function (data) {
    return `
    <li class="nav-item">
      <a class="nav-link active" aria-current="page" href="#/${data.URL}">${data.TITLE}</a>
    </li>
    `;
  };

  var showImageContent = function (data) {
    var html = "";

    return html;
  };

  var showFeed = function (data) {
    var html = "";

    var CONTENT = JSON.parse(data.CONTENT);

    for (var idx in CONTENT) {
      html += `
    <div class="container">
      <div class="row featurette">
          <div class="col-md-7">
            <h2 class="featurette-heading">${
              data.TITLE
            }. <span class="text-muted">${data.TYPE}</span>
            </h2>
            <p class="lead">${CMS.decodeString(CONTENT[idx].content)}</p>
          </div>
          <div class="col-md-5">
            <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500"
              height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice" focusable="false">
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text>
            </svg>

          </div>
        </div>

        <hr class="featurette-divider">
      </div>
    </div>`;
    }

    return html;
  };

  var showHTML = function (data) {
    var html = "";
    if (data.NAME != "map_search") {
      var CONTENT = JSON.parse(data.CONTENT);

      for (var idx in CONTENT) {
        html += CMS.decodeString(CONTENT[idx].html);
      }
    } else {
      html += `
    <section id="map-search" class="map-search">
  <div id="mapsrch">
  <h4>Wo möchtest du nach einem Judo Event suchen?</h4>
  <input type="text" placeholder="Gib hier eine Stadt ein ..." name="map_search_text" id="map_search_text">`;
      CMS.getEvents(function (data) {
        var eventdata = data.MESSAGE;
        for (var idx in eventdata) {
          // if (idx === 3) { break; }
          console.log("idx" + idx);
          html += `<div class="map-location-box">
    <h2>Međunarodni judo kup Labinska Republika</h2>
    <p><b>Datum: </b>03-02-2023</p>
    <p><b>Stadt: </b>Rijeka</p>
    <p><b>Ausschreibung: </b>Website</p>
    <div>`;
        }
      });

      html += `
  
  </div>
      </section>
    `;
    }

    return html;
  };

  var showEVENT = function (arr) {
    let catOpt = '<option value="">-Any-</option>';
    if (arr.cat) {
      for (let i in arr.cat)
        catOpt += `<option value="${arr.cat[i].ID}">${arr.cat[i].NAME}</option>`;
    }

    // console.log(arr);

    const d = new Date();
    let year = d.getFullYear();
    let yearOpt = '<option value="">-Any-</option>';
    for (let i = 2016; i < year + 5; i++)
      yearOpt += `<option ${
        i == year ? "selected" : ""
      } value="${i}">${i}</option>`;

    let countryOpt = `<option value="">- Any -</option>`;
    if (arr.coun) {
      for (let i in arr.coun) {
        if (arr.coun[i].COUNTRY_SHORT && arr.coun[i].COUNTRY_LONG)
          countryOpt += `<option value="${arr.coun[i].COUNTRY_SHORT}">${arr.coun[i].COUNTRY_LONG}</option>`;
      }
    }
    let html = `
      <section id="termine-sec" class="termine-section">
        
        <div class="event_filter_wrap row">
          <div class="form-group">
            <label for="eventSearchInput">Suche:</label>
            <input type="text" id="eventSearchInput" class="form-control" placeholder="Suche hier nach einem Event, Land oder Ort...">
          </div>

          <div class="form-group advance-search col-sm-3">
            <label for="jahr">Jahr:</label>
            <select id="jahr" class="event-filter form-control">${yearOpt}</select>
          </div>

          <div class="form-group advance-search col-sm-3">
            <label for="monat">Monat:</label>
            <select id="monat" class="event-filter form-control">
              <option value="">- Any -</option>
              <option value="1">Januar</option>
              <option value="2">Februar</option>
              <option value="3">März</option>
              <option value="4">April</option>
              <option value="5">Mai</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Dezember</option>
            </select>
          </div>

          <div class="form-group advance-search col-sm-3">
            <label for="country">Country:</label>
            <select id="country" class="event-filter form-control">${countryOpt}</select>
          </div>

          <div class="form-group advance-search col-sm-3">
            <label for="kategorie">Kategorie:</label>
            <select id="kategorie" class="event-filter form-control">${catOpt}</select>
          </div>

          <div class="entry-share clearfix">
            <div class="entry-button mt-4 mb-4">
                <a class="button arrow" id="advance_search" href="javascript:void(0);">Nutze weitere Suchfilter<i class="fa fa-angle-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
        <div id="eventWrapper"></div>
        
      </section>`;

    return html;
  };

  var showEventItem = function (data) {
    let monthGroups = [];

    for (let i in data) {
      if (data[i].CALENDAR_YEARPLAN.length === 0) {
        continue;
      }

      if (!monthGroups[moment(data[i].STARTDATE).format("YYYYMM")]) {
        monthGroups[moment(data[i].STARTDATE).format("YYYYMM")] = [];
      }

      monthGroups[moment(data[i].STARTDATE).format("YYYYMM")].push(data[i]);
    }

    // console.log(monthGroups);

    let events = "";

    for (let i in monthGroups) {
      // events += `<div class="card">
      //             <div class="card-header">
      //               <h3>${moment(i, "YYYYMM").format("MMMM YYYY")} </h3>
      //             </div>
      //             <ul class="list-group">`;
      events += `<div class="card">
                  <div class="card-header">
                    <h3>${moment(i, "YYYYMM").format("MMMM YYYY")} </h3>
                  </div>
                  <ul class="list-group">`;

      for (let j in monthGroups[i]) {
        let obj = monthGroups[i][j];

        let dateObj = CMS.formatTime(
          moment(obj.STARTDATE),
          moment(obj.ENDDATE),
          obj.ALLDAY
        );

        // setTimeout(() => {
        //   console.log(
        //     document.querySelector("#eventWrapper .card ul").children.length
        //   );
        // }, 500);

        if (obj.LATITUDE !== null) {
          events += `<li class="event list-group-item" data-eventid="${
            obj.ID
          }" data-title='${obj.TITLE}' data-date="${dateObj.fromDate}" >
                      <div class="row">
                        <div class="col-sm-2">${dateObj.fromDate}<br>${
            dateObj.untilDate
          }</div>
  
                        <div class="col-sm-5">
                          <span class="title ${
                            obj.NOTE !== "" ||
                            (obj.CALENDAR_FILE_ATTACHEMENT &&
                              obj.CALENDAR_FILE_ATTACHEMENT.length > 0)
                              ? "hasDetails"
                              : ""
                          }">
                            ${obj.TITLE}
                          <span>
                        </div>
  
                        <div class="col-sm-1">
                        ${
                          obj.COUNTRY_SHORT
                            ? `<span class="flagWrap"><i class="fi fi-${obj.COUNTRY_SHORT.toLowerCase()}"></i></span>`
                            : " "
                        }
                        ${
                          obj.COUNTRY_SHORT !== "" ? obj.COUNTRY_SHORT : ""
                        }</div>
  
                        <div class="col-sm-1">
                        ${CMS.showCategories(obj.CALENDAR_YP_CAT_ASSIGNMENT)} 
                            <span>
                          </div>
                        <div class="col-sm-3">
                          <span class="title"${
                            obj.NOTE !== "" ||
                            (obj.CALENDAR_FILE_ATTACHEMENT &&
                              obj.CALENDAR_FILE_ATTACHEMENT.length > 0)
                              ? " hasDetails"
                              : ""
                          }">
                            ${obj.LOCATION}
                          <span>
                        </div>
                      </div>
                    </li>`;
        } else if (obj.LATITUDE == null) {
          setTimeout(() => {
            // if (
            //   document.querySelector("#eventWrapper .card ul").children
            //   .length == 0
            //   ) {
            //   document.querySelector("#eventWrapper .card").style.display =
            //     "none";
            // }
            // console.log(document.querySelectorAll("#eventWrapper .card ul")[0].children.length);
            for (
              i = 0;
              i < document.querySelectorAll("#eventWrapper .card ul").length;
              i++
            ) {
              if (
                document.querySelectorAll("#eventWrapper .card ul")[i].children
                  .length == 0
              ) {
                document.querySelectorAll("#eventWrapper .card")[
                  i
                ].style.display = "none";
              }
            }
          }, 1);
        }
      }

      events += "</ul></div>";
    }
    return events;
  };

  var showMap = function (arr) {
    const d = new Date();
    let year = d.getFullYear();
    let catOpt = '<option value="">-Any-</option>';
    if (arr.cat) {
      for (let i in arr.cat) {
        catOpt += `<option value="${arr.cat[i].ID}">${arr.cat[i].NAME}</option>`;
      }
    }
    let yearOpt = '<option value="">-Any-</option>';
    for (let i = 2016; i < year + 7; i++)
      yearOpt += `<option ${
        i == year ? "selected" : ""
      } value="${i}">${i}</option>`;
    let countryOpt = `<option value="">- Any -</option>`;
    if (arr.coun) {
      for (let i in arr.coun) {
        if (arr.coun[i].COUNTRY_SHORT && arr.coun[i].COUNTRY_LONG)
          countryOpt += `<option value="${arr.coun[i].COUNTRY_SHORT}">${arr.coun[i].COUNTRY_LONG}</option>`;
      }
    }
    let html = `
      <section id="termine-sec" class="termine-section">
        <h4>Aktuelle und zukünftige Events</h4>
        <div class="event_filter_wrap row">

          <div class="form-group advance-search col-sm-3">
            <label for="jahr">Jahr:</label>
            <select id="jahr" class="event-filter form-control">${yearOpt}</select>
          </div>

          <div class="form-group advance-search col-sm-3">
            <label for="monat">Monat:</label>
            <select id="monat" class="event-filter form-control">
              <option value="">- Any -</option>
              <option value="1">Januar</option>
              <option value="2">Februar</option>
              <option value="3">März</option>
              <option value="4">April</option>
              <option value="5">Mai</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Dezember</option>
            </select>
          </div>
          <div class="form-group advance-search col-sm-3">
            <label for="country">Country:</label>
            <select id="country" class="event-filter-country form-control">${countryOpt}</select>
          </div>

          <div class="form-group advance-search col-sm-3">
            <label for="kategorie">Kategorie:</label>
            <select id="kategorie" class="event-filter form-control">${catOpt}</select>
          </div>
          
          <div class="entry-share clearfix">
            <div class="entry-button mt-4 mb-4">
                <a class="button arrow" id="advance_search" href="javascript:void(0);">Nutze Filter, um dein gewünschtes Event zu finden<i class="fa fa-angle-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>

        <div id="map-sec" class="map-section mt-4" >
              <div id="eventMap" style="width: 100%; height: 60vh;"></div>
        </div>
      </section>`;
    return html;
  };

  var showImageGallery = function (data) {
    var html = `<section class="our-clients-2 white-bg page-section-ptb">
  <div class="container">
  <div class="row">
      `;

    var CONTENT = JSON.parse(data.CONTENT);

    for (var idx in CONTENT) {
      html += `
          
          <div class="col-lg-6 col-md-6 col-sm-12 text-center  mb-30">
         <div class="clients-box h-100">
             <img src="${CONTENT[idx].url}" alt="" style=width:100px;height:100px;>
           <div class="clients-info">
             <h5>${CONTENT[idx].title}</h5>
             <a href="#"> <i class="fa fa-link"></i> ${CONTENT[idx].title}</a>
             <p>Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. lorem ipsum dolor sit amet, of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. </p>
           </div>
         </div>
      </div>`;
    }

    html += `
      </div>
      </div>
    </section>
    `;

    return html;
  };

  var showBanner = function (data) {
    var html = "";

    var CONTENT = JSON.parse(data.CONTENT);

    for (var idx in CONTENT) {
      html += `<img src="${CONTENT[idx].src}">`;
      continue;
      for (var idx2 in CONTENT[idx].image) {
        html += `<img src="${CONTENT[idx].image[idx2].src}">`;
      }
    }

    return html;
  };

  var showContent = function (data) {
    let html = "";
    let CONTENT = JSON.parse(data.CONTENT);
    for (let i in CONTENT) {
      html += DM_CONTENT.decodeString(CONTENT[i].text);
    }
    return html;
  };

  var showRow = function (data) {
    return `<div id="row${data.ID}" class="row"></div>`;
  };

  var showContentLeftRight = function (data) {
    return;
  };

  function getImageGalleryItems(data) {
    var html = "";

    for (var idx in data) {
      html += `
      <div class="carousel-item ${idx == 0 ? "active" : ""}">
        ${
          data[idx].URL
            ? `<img src="${data[idx].URL}" class="d-block w-100" alt="...">`
            : `
        <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
          <rect width="100%" height="100%" fill="#777" />
        </svg>`
        }

        <div class="container">
          <div class="carousel-caption text-start">
            <h1>${data[idx].TITLE}</h1>
            <p>${data[idx].TYPE}</p>
            <p><a class="btn btn-lg btn-primary" href="#">${
              data[idx].URL
            }</a></p>
          </div>
        </div>
      </div>`;
    }

    return html;
  }

  /*************** */

  var templates = [
    {
      TYPE: "row",
      HTML: showRow,
    },
    {
      TYPE: "top",
      HTML: showMenu,
    },
    {
      TYPE: "footer",
      HTML: showFooter,
    },
    {
      TYPE: "content",
      HTML: showContent,
    },
    {
      TYPE: "image_content",
      HTML: showImageContent,
    },
    {
      TYPE: "html",
      HTML: showHTML,
    },
    {
      TYPE: "image_gallery",
      HTML: showImageGallery,
    },
    {
      TYPE: "feed",
      HTML: showFeed,
    },
    {
      TYPE: "default_banner",
      HTML: showBanner,
    },
    {
      TYPE: "42",
      HTML: showContentLeftRight,
    },
    {
      TYPE: "events",
      HTML: showEVENT,
    },
    {
      TYPE: "event_item",
      HTML: showEventItem,
    },
    {
      TYPE: "maps",
      HTML: showMap,
    },
  ];

  return { getCreator, setCreator };
})();
