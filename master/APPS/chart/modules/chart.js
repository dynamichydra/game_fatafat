'use strict';

var dm_chart = (function () {

  const ctx = document.getElementById('myChart');
  let myChart = null;

  function generateChart(config,cb){
    if(myChart){
      myChart.destroy();
    }

    const findLabel = (labels, evt) => {
      let found = false;
      let res = null;
    
      labels.forEach(l => {
        l.labels.forEach((label, index) => {
          if (evt.x > label.x && evt.x < label.x2 && evt.y > label.y && evt.y < label.y2) {
            res = {
              label: label.label,
              index
            };
            found = true;
          }
        });
      });
    
      return [found, res];
    };
    
    const getLabelHitboxes = (scales) => (Object.values(scales).map((s) => ({
      scaleId: s.id,
      labels: s._labelItems.map((e, i) => ({
        x: e.translation[0] - s._labelSizes.widths[i],
        x2: e.translation[0] + s._labelSizes.widths[i] / 2,
        y: e.translation[1] - s._labelSizes.heights[i] / 2,
        y2: e.translation[1] + s._labelSizes.heights[i] / 2,
        label: e.label,
        index: i
      }))
    })));

    const plugin = {
      id: 'customHover',
      afterEvent: (chart, event, opts) => {
        const evt = event.event;
    
        if (evt.type !== 'click') {
          return;
        }
    
        const [found, labelInfo] = findLabel(getLabelHitboxes(chart.scales), evt);
    
        if (found) {
          if(cb){
            cb(labelInfo)
          }
        }
    
      }
    }
    Chart.register(plugin);
    myChart = new Chart(ctx, config);
  }

  function pl_chart (arr,type,cb){
    if(!arr){
      return false;
    }
    
    const config = {
      type: type,
      data: {
        labels: arr.labels,
        datasets: [
          {
            label: 'Total Played',
            data: arr.dataOne,
            borderColor: "rgba(0, 68, 233)",
            backgroundColor: "rgba(0, 68, 233, 0.5)",
          },
          {
            label: 'Total Price',
            data: arr.dataTwo,
            borderColor: "rgba(255, 0, 73)",
            backgroundColor: "rgba(255, 0, 73,0.5)",
          },
          {
            label: 'Total Win / loss',
            data: arr.dataThree,
            borderColor: "rgba(255, 193, 7)",
            backgroundColor: "rgba(255, 193, 7,0.5)",
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        onClick: (e, activeEls) => {
          let datasetIndex = activeEls[0].datasetIndex;
          let dataIndex = activeEls[0].index;
          let datasetLabel = e.chart.data.datasets[datasetIndex].label;
          let value = e.chart.data.datasets[datasetIndex].data[dataIndex];
          let label = e.chart.data.labels[dataIndex];
          console.log("In click", datasetLabel, label, value);
        }
      },
    };
    generateChart(config,cb);
  }
  

  return {
    pl_chart
  }

})();
