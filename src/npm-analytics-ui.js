(function() {
  /* global moment,Chart,http */
  /* eslint-disable */
  var stats = [];
  var chartData = {};
  /* eslint-enable */

  document.ready(() => {
    document.querySelector("#start").value = moment().add(-7, "day").format("YYYY-MM-DD");
    document.querySelector("#end").value = moment().add(-1, "day").format("YYYY-MM-DD");
    var lastSearch = localStorage.getItem("lastSearch");
    /* eslint-disable */
    if (lastSearch != null) {
      /* eslint-enable */
      lastSearch = JSON.parse(lastSearch);
      document.querySelector("#typeSearch").value = lastSearch.typeSearch;
      document.querySelector("#search").value = lastSearch.search;
      updateGraphics();
    }

    document.querySelector("#btnOk").onclick = updateGraphics;
  });

  function createColorsArrays(nb) {
    var inc = nb % 255;
    var arr = [];
    for (var i = 0; i <= nb; i++) {
      arr.push("rgba(" + (255 - i * inc) + "," + ((100 + i * inc) % 255) + "," + (i * inc) + ",0.9)");
    }
    return arr;
  }

  function updateGraphics() {
    var urlCorsBypass = "https://cors-anywhere.herokuapp.com/";
    var start = document.querySelector("#start").value;
    var end = document.querySelector("#end").value;
    var typeSearch = document.querySelector("#typeSearch").value;
    var search = document.querySelector("#search").value;
    var startDate = moment(start);
    var endDate = moment(end);
    localStorage.setItem("lastSearch", JSON.stringify({ typeSearch: typeSearch, search: search }));
    if (typeSearch === "User") {
      http.getJSON(urlCorsBypass + "https://api.npms.io/v2/search?q=maintainer:" + search)
        .then(data => {
          var packages = data.results.map(x => x.package);
          var promises = packages.map(
            x => http.getJSON(urlCorsBypass +
              ["https://api.npmjs.org/downloads/range/", startDate.format("YYYY-MM-DD"), ":", endDate.format("YYYY-MM-DD"), "/", x.name].join("")));
          stats = [];
          chartData = {};
          Promise.all(promises).then(function(response) {
            stats = response.filter(function(n) { return n !== null });
            redraw();
          });
        });
    } else if (typeSearch === "Package") {
      var urlNpm = ["https://api.npmjs.org/downloads/range/",
        startDate.format("YYYY-MM-DD"),
        ":",
        endDate.format("YYYY-MM-DD"),
        "/",
        search
      ].join("");
      http.getJSON(urlCorsBypass + urlNpm).then(data => {
        stats = [data];
        redraw();
      })
    }
  }

  function redrawArray() {
    var datasets = [];
    var total = 0;
    if (stats.length > 0) {
      for (var i = 0; i < stats.length; i++) {
        var dataset = {
          label: stats[i].package,
          downloads: stats[i].downloads.reduce((accu, cur) => accu += cur.downloads, 0)
        };
        total += dataset.downloads;
        datasets.push(dataset);
      }
    }
    var st = "";
    for (var d of datasets) {
      st += ["<tr><td>", d.label, "</td><td class=num>", d.downloads, "</td></tr>"].join("");
    }
    st += ["<tr><td>", "Total", "</td><td class=num>", total, "</td></tr>"].join("");
    document.getElementById("myData").html(st);
  }

  var chart = null;

  function redraw() {
    if (stats.length) {
      var colors = createColorsArrays(stats.length);
      redrawArray();
      chartData.labels = stats[0].downloads.map(x => x.day);
      chartData.datasets = [];
      for (var i = 0; i < stats.length; i++) {
        var dataset = {
          label: stats[i].package,
          data: stats[i].downloads.map(x => x.downloads),
          backgroundColor: colors[i]
        }
        chartData.datasets.push(dataset);
      }
    }
    if (chart === null) {
      var ctx = document.getElementById("myChart");
      chart = new Chart(ctx, {
        type: "bar",
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          title: {
            display: true,
            text: "Stats"
          },
          legend: {
            display: true,
            position: "bottom"
          }
        }
      });
    }
    chart.data.datasets = chartData.datasets;
    chart.data.labels = chartData.labels;
    chart.update();
  }

})();