# Utiliser l'image officielle PHP avec Apache
FROM php:8.2-apache

# Installer les extensions PHP nécessaires pour MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Activer le module de réécriture d'URL d'Apache (mod_rewrite) si nécessaire pour des URLs propres
RUN a2enmod rewrite

# Copier les fichiers de l'application PHP dans le répertoire web d'Apache
# /var/www/html est le répertoire par défaut d'Apache pour les fichiers web
COPY . /var/www/html

# Définir le répertoire de travail
WORKDIR /var/www/html

# Exposer le port 80 (port par défaut d'Apache)
EXPOSE 80

# Apache démarre automatiquement avec l'image
# Pas besoin de commande CMD supplémentaire
