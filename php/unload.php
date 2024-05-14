
<?php

// Datenbankkonfiguration einbinden
require_once 'config.php';

// Header setzen, um JSON-Inhaltstyp zurückzugeben
header('Content-Type: application/json');


try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query, um Daten basierend auf dem Standort auszuwählen, sortiert nach Zeitstempel
    // Verwende ein Fragezeichen (?) anstelle eines benannten Parameters
    $sql = "SELECT * FROM wetterdaten ORDER BY date";
 
    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Führt die Abfrage mit der Standortvariablen aus, die in einem Array übergeben wird
    // Die Standortvariable ersetzt das erste Fragezeichen in der SQL-Anweisung
    $stmt->execute();

    // Holt alle passenden Einträge
    $results = $stmt->fetchAll();

      // Holt alle passenden Einträge und konstruiert JSON-Nodes
      while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Füge den aktuellen Datensatz als Knoten hinzu
        $nodes[] = $row;
    }

    // Gibt die Ergebnisse im JSON-Format zurück
  //  echo json_encode($results);
//} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
  //  echo json_encode(['error' => $e->getMessage()]);

  echo json_encode($results, JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
    echo json_encode(['error' => $e->getMessage()]);
}

