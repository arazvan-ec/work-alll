FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl pdo pdo_mysql zip opcache \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# PHP configuration
RUN echo "memory_limit=256M" >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini
RUN echo "date.timezone=UTC" >> /usr/local/etc/php/conf.d/docker-php-timezone.ini

# Allow running as non-root user
RUN usermod -u 1000 www-data

USER www-data

EXPOSE 9000
CMD ["php-fpm"]
