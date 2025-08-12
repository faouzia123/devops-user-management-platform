<?php

require_once __DIR__ . "/config.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Permet les requêtes depuis n\\\'importe quel domaine (pour le développement)
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gérer les requêtes OPTIONS (pré-vol CORS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200 );
    exit();
}

$pdo = connectDB();

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
    case "GET":
        // Récupérer tous les utilisateurs
        $stmt = $pdo->query("SELECT id, first_name, last_name, created_at FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll();
        echo json_encode($users);
        break;

    case "POST":
        // Ajouter un nouvel utilisateur
        $data = json_decode(file_get_contents("php://input"), true);
        $firstName = $data["firstName"] ?? "";
        $lastName = $data["lastName"] ?? "";

        if (empty($firstName) || empty($lastName)) {
            http_response_code(400 );
            echo json_encode(["message" => "Le prénom et le nom sont requis."]);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name) VALUES (:first_name, :last_name)");
        if ($stmt->execute([":first_name" => $firstName, ":last_name" => $lastName])) {
            http_response_code(201 );
            echo json_encode(["message" => "Utilisateur ajouté avec succès.", "id" => $pdo->lastInsertId()]);
        } else {
            http_response_code(500 );
            echo json_encode(["message" => "Erreur lors de l\\\'ajout de l\\\'utilisateur."]);
        }
        break;

    case "DELETE":
        // Supprimer un utilisateur
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data["id"] ?? null;

        if (empty($id)) {
            http_response_code(400 );
            echo json_encode(["message" => "L\\\'ID de l\\\'utilisateur est requis."]);
            exit();
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
        if ($stmt->execute([":id" => $id])) {
            if ($stmt->rowCount() > 0) {
                http_response_code(200 );
                echo json_encode(["message" => "Utilisateur supprimé avec succès."]);
            } else {
                http_response_code(404 );
                echo json_encode(["message" => "Utilisateur non trouvé."]);
            }
        } else {
            http_response_code(500 );
            echo json_encode(["message" => "Erreur lors de la suppression de l\\\'utilisateur."]);
        }
        break;

    default:
        http_response_code(405 );
        echo json_encode(["message" => "Méthode non autorisée."]);
        break;
}

?>
