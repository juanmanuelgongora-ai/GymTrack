<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1", "root", "");
    echo "Connected successfully to MySQL\n";
    $stmt = $pdo->query("SHOW DATABASES");
    while ($row = $stmt->fetch()) {
        echo $row[0] . "\n";
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
