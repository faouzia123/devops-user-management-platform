-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS `mon_app_db`;

-- Utiliser la base de données
USE `mon_app_db`;

-- Créer la table 'users' si elle n'existe pas
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer quelques données de test (optionnel)
INSERT INTO `users` (first_name, last_name) VALUES
('John', 'Doe'),
('Jane', 'Smith');
