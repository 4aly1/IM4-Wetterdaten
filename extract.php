<?php
$get_city = $_GET['city'];

function fetchWeatherData($city) {
    $url_zurich = "https://api.open-meteo.com/v1/forecast?latitude=47.3667&longitude=8.55&minutely_15=temperature_2m,apparent_temperature,precipitation,wind_speed_10m&forecast_days=1";
    $url_rotterdam = "https://api.open-meteo.com/v1/forecast?latitude=51.9225&longitude=4.4792&minutely_15=temperature_2m,apparent_temperature,precipitation,wind_speed_10m&forecast_days=1";
    $url_berlin = "https://api.open-meteo.com/v1/forecast?latitude=52.5244&longitude=13.4105&minutely_15=temperature_2m,apparent_temperature,precipitation,wind_speed_10m&forecast_days=1";

    $current_url = '';

    if ($city == 'zurich') {
      $current_url = $url_zurich;
    } else if($city == 'rotterdam') {
      $current_url = $url_rotterdam;
    } else {
      $current_url = $url_berlin;
    }


    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($current_url);

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
   // return json_decode($response, true);
  // echo $response;
  return json_decode($response,true);

}

// Gibt die Daten zurück, wenn dieses Skript eingebunden ist
return fetchWeatherData($get_city);
?>
