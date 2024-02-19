FROM php:7.4-alpine

LABEL org.opencontainers.image.source=https://github.com/hfxbse/web-engineering-2023
LABEL org.opencontainers.image.description="The provided backend file service for the 2023 web engineering project."

COPY . /app
COPY upload.ini /usr/local/etc/php/conf.d/upload.ini

WORKDIR /app

EXPOSE 8080

ENTRYPOINT ["php", "-S", "0.0.0.0:8080", "router.php"]
