<?php
// Transformations-Skript als '230_transform.php' einbinden
$jsonData = include('transform.php');

require_once 'config.php'; // Bindet die Datenbankkonfiguration ein

$dataArray = json_decode($jsonData, true);

// Check if decoding was successful
if ($dataArray === null) {
    die("Error decoding JSON data");
}

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query mit Platzhaltern für das Einfügen von Daten
    $sql = "INSERT INTO wetterdaten (location, temperature_celsius, date) VALUES (?, ?, ?)";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Fügt die Daten in die Datenbank ein
    $stmt->execute([
        $dataArray['location'],
        $dataArray['latitude'],
        $dataArray['longitude'],
        $dataArray['temperature_celsius'],
        $dataArray['wind_speed_10m'],
        $dataArray['precipitation'],
        $dataArray['apparent_temperature'],
        $dataArray['date']
    ]);

    echo "Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}
?>

