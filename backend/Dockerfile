FROM php:8.2-fpm

# Installer dépendances à la construction nécessaires + libonig-dev pour mbstring
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    libonig-dev \
    libpq-dev \
    libzip-dev \
    unzip \
    git \
    curl \
  && docker-php-ext-install pdo pdo_pgsql mbstring zip bcmath \
  && rm -rf /var/lib/apt/lists/*

# Copier composer depuis l'image officielle
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Installer dépendances Laravel (si tu veux le faire dans l'image)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Permissions (ajuste si besoin)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 9000

# Lancement (dev). En prod tu utiliseras php-fpm + nginx
CMD php artisan serve --host=0.0.0.0 --port=9000