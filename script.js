// Best Practice:
// - Fetch in eine Funktion packen
// - Fetch asynchron ausführen

let url = 'https://536620-3.web.fhgr.ch/php/unload.php';

//funktion erstellen für weiter unten = Daten holen von der URL und geben es mit return zurück
async function fetchData(url) {
  try {
    let response = await fetch(url, {
      mode:  'no-cors',
    });
    let dbData = await response.json();
    return (dbData);
  }
  catch (error) {
    console.log(error);
  }
}
//DBData wird übergeben inkl. title, canvas ID wo es hinkommt
//Chart.js Teil
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
//Ab hier wird die Daten ins Html geschrieben
  let Wetterdaten = document.getElementById(canvasId)
  new Chart(Wetterdaten, config);

}
//Aktuelle Daten werden abgefragt und ins HTML geschrieben
function renderLiveData(dbData, city) {
  let zurichNow = dbData[dbData.length - 1]
  document.getElementById(city +"_Temperature").innerHTML = zurichNow.temperature_celsius
  document.getElementById(city +"_ApparentTemperature").innerHTML = zurichNow.apparent_temperature
  document.getElementById(city +"_Prec").innerHTML = zurichNow.precipitation
  document.getElementById(city +"_Wind").innerHTML = zurichNow.wind_speed_10m
}
//Hier werden alle Datensätze abgefragt und nach gewünschten Daten gefiltert und die Funktion aufzurufen um es ins HTML zu schreiben
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