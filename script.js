// Best Practice:
// - Fetch in eine Funktion packen
// - Fetch asynchron ausführen

let url = 'https://536620-3.web.fhgr.ch/php/unload.php';

//funktion erstellen für weiter unten = Daten holen von der URL und geben es mit return zurück
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
let currentTempChart = undefined;
let currentWindChart = undefined;
let currentPercChart = undefined;

function renderTempChart(dbData, title) {
  if (currentTempChart) {
    currentTempChart.destroy();
  }

  let data = dbData.map(d => ({ x: d.date, y: parseFloat(d.temperature_celsius) }))
  
  const groupedData = data.reduce((acc, { x, y }) => {
    acc[x] = acc[x] || [];
    acc[x].push(y);
    return acc;
  }, {});
  
  // Step 2: Calculate averages
  const averages = Object.keys(groupedData).map(date => ({
    x: date,
    y: groupedData[date].reduce((sum, curr) => sum + curr, 0) / groupedData[date].length
  }));

  let chartJsData = {
    datasets: [
      { data: averages, label: "Temperature (Celsius)" }
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
  let tempCanvas = document.getElementById("Temp_Chart")
  currentTempChart= new Chart(tempCanvas, config);

}

function renderWindChart(dbData, title) {
  if (currentWindChart) {
    currentWindChart.destroy();
  }

  let data = dbData.map(d => ({ x: d.date, y: parseFloat(d.wind_speed_10m) }))
  const groupedData = data.reduce((acc, { x, y }) => {
    acc[x] = acc[x] || [];
    acc[x].push(y);
    return acc;
  }, {});
  
  // Step 2: Calculate averages
  const averages = Object.keys(groupedData).map(date => ({
    x: date,
    y: groupedData[date].reduce((sum, curr) => sum + curr, 0) / groupedData[date].length
  }));
  
  let chartJsData = {
    datasets: [
      { data: averages, label: "Wind Speed (km/h)" }
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
  let tempCanvas = document.getElementById("Wind_Chart")
  currentWindChart= new Chart(tempCanvas, config);

}
function renderPercChart(dbData, title) {
  if (currentPercChart) {
    currentPercChart.destroy();
  }

  let data = dbData.map(d => ({ x: d.date, y: parseFloat(d.precipitation) }))
  const groupedData = data.reduce((acc, { x, y }) => {
    acc[x] = acc[x] || [];
    acc[x].push(y);
    return acc;
  }, {});
  
  // Step 2: Calculate averages
  const averages = Object.keys(groupedData).map(date => ({
    x: date,
    y: groupedData[date].reduce((sum, curr) => sum + curr, 0) / groupedData[date].length
  }));
  
  
  let chartJsData = {
    datasets: [
      { data: averages, label: "Precipitation (mm)"  }
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
  let tempCanvas = document.getElementById("Perc_Chart")
  currentPercChart= new Chart(tempCanvas, config);

}
//Aktuelle Daten werden abgefragt und ins HTML geschrieben
function renderLiveData(dbData, city) {
  let zurichNow = dbData[dbData.length - 1]
  document.getElementById("Temperature").innerHTML = zurichNow.temperature_celsius
  document.getElementById("ApparentTemperature").innerHTML = zurichNow.apparent_temperature
  document.getElementById("Prec").innerHTML = zurichNow.precipitation
  document.getElementById("Wind").innerHTML = zurichNow.wind_speed_10m
  let imageSrc = ""
  if (city === "Zurich") {
    imageSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Altstadt_Z%C3%BCrich_2015.jpg/1024px-Altstadt_Z%C3%BCrich_2015.jpg"
  } else if (city == "Berlin"){
    imageSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Cityscape_Berlin.jpg/1024px-Cityscape_Berlin.jpg"
  } else {
    imageSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/De_Zalmhaven_I%2C_II_and_III_-_Rotterdam_-_View_from_the_Veerhaven.jpg/1920px-De_Zalmhaven_I%2C_II_and_III_-_Rotterdam_-_View_from_the_Veerhaven.jpg"
  }
  document.getElementById("city-img").src = imageSrc
  document.getElementById("city-title").innerHTML = city
}
//Hier werden alle Datensätze abgefragt und nach gewünschten Daten gefiltert und die Funktion aufzurufen um es ins HTML zu schreiben
async function init() {
  loadCity("Zurich")
}

function updateButtonStates(city) {
  let btnZh = document.getElementById("btn-zurich")
  btnZh.classList.remove("btn-primary", "btn-light")
 
  let btnRot = document.getElementById("btn-rotterdam")
  btnRot.classList.remove("btn-primary", "btn-light")

  let btnBerlin = document.getElementById("btn-berlin")
  btnBerlin.classList.remove("btn-primary", "btn-light")
  
  if(city === "Zurich") {
    btnZh.classList.add("btn-primary")
    btnRot.classList.add("btn-light")
    btnBerlin.classList.add("btn-light")
  } else if (city === "Rotterdam") {
    btnRot.classList.add("btn-primary")
    btnBerlin.classList.add("btn-light")
    btnZh.classList.add("btn-light")
  } else {
    btnBerlin.classList.add("btn-primary")
    btnRot.classList.add("btn-light")
    btnZh.classList.add("btn-light")
  }
}

async function loadCity(city) {
  let dbData = await fetchData(url);
  let cityLast14Days = dbData
      .filter(d => d.location.toLowerCase() === city.toLowerCase() && new Date(d.date) > new Date(Date.now() - 12096e5));
  
  renderLiveData(cityLast14Days, city)
  renderTempChart(cityLast14Days, `Temperatur last 14 days`);
  renderWindChart(cityLast14Days, `Wind speed last 14 days`);
  renderPercChart(cityLast14Days, `Perception last 14 days`);
  updateButtonStates(city);
}


init();