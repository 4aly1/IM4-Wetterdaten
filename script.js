// Best Practice:
// - Fetch in eine Funktion packen
// - Fetch asynchron ausführen

let url = 'https://536620-3.web.fhgr.ch/php/unload.php';

async function fetchData(url) {
  try {
    let response = await fetch(url);
    let dbData = await response.json();
    return (dbData);
  }
  catch (error) {
    console.log(error);
  }
}

function renderChart(dbData, title, canvasId) {
  let data = dbData.map(d => ({ x: d.date, y: parseFloat(d.temperature_celsius) }))
  console.log(data)
  let chartJsData = {
    datasets: [
      { data: data }
    ]
  };

  const config = {
    type: 'line',
    data: chartJsData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: title
        }
      }
    },
  };

  let Wetterdaten = document.getElementById(canvasId)
  new Chart(Wetterdaten, config);

}

function renderLiveData(dbData, city) {
  let zurichNow = dbData[dbData.length - 1]
  document.getElementById(city + "_Temperature").innerHTML = zurichNow.temperature_celsius
  document.getElementById(city +"_ApparentTemperature").innerHTML = zurichNow.apparent_temperature
  document.getElementById(city +"_Prec").innerHTML = zurichNow.precipitation
  document.getElementById(city +"_Wind").innerHTML = zurichNow.wind_speed_10m
}

async function init() {
  let dbData = await fetchData(url);
  let zurichLast14Days = dbData
      .filter(d => d.location === "zurich" && new Date(d.date) > new Date(Date.now() - 12096e5));

  renderChart(zurichLast14Days, 'Zürich letzte 14 Tage', 'Zurich_Wetterdaten_Chart');
  renderLiveData(zurichLast14Days, 'Zurich')

  let berlinLast14Days = dbData
      .filter(d => d.location === "berlin" && new Date(d.date) > new Date(Date.now() - 12096e5));

  renderChart(berlinLast14Days, 'Berlin letzte 14 Tage', 'Berlin_Wetterdaten_Chart');
  renderLiveData(berlinLast14Days, 'Berlin')
}

init();