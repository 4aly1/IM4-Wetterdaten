<?php
$get_city = $_GET['city'];

// Bindet das Skript 130_extract.php für Rohdaten ein
$data = include('extract.php');

// Initialize an array to store transformed data
$transformedData = [];

// Extract necessary information and transform
$temperatureCelsius = $data['minutely_15']['temperature_2m'][0]; // Assuming temperature data exists in the new structure
$date = $data['minutely_15']['time'][0]; // Assuming you want the temperature and time of the first day
$windSpeed = $data['minutely_15']['wind_speed_10m'][0]; // Assuming wind speed data exists in the new structure
$precipitation = $data['minutely_15']['precipitation'][0]; // Assuming precipitation data exists in the new structure
$apparentTemperature = $data['minutely_15']['apparent_temperature'][0]; // Assuming apparent temperature data exists in the new structure

// Add latitude, longitude, wind speed, precipitation, and apparent temperature to the transformation
$latitude = $data['latitude'];
$longitude = $data['longitude'];

// Construct the new structure with necessary fields
$transformedData = [
    'location' => $get_city,
    'latitude' => $latitude,
    'longitude' => $longitude,
    'temperature_celsius' => $temperatureCelsius,
    'wind_speed_10m' => $windSpeed,
    'precipitation' => $precipitation,
    'apparent_temperature' => $apparentTemperature,
    'date' => $date
];

// Encode transformed data to JSON
$jsonData = json_encode($transformedData, JSON_PRETTY_PRINT);
return $jsonData;

?>
