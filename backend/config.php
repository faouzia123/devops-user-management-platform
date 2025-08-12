<?php

// Configuration de la base de données
define("DB_HOST", "database"); // Le nom du service de la base de données dans docker-compose.yml
define("DB_NAME", "mon_app_db");
define("DB_USER", "user");
define("DB_PASS", "user_password");

// Connexion à la base de données
function connectDB() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // En cas d\\'erreur de connexion, afficher un message d\\'erreur et arrêter le script
        http_response_code(500 );
        echo json_encode(["message" => "Erreur de connexion à la base de données: " . $e->getMessage()]);
        exit();
    }
}

?>
