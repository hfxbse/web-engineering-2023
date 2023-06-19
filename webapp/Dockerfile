FROM httpd:2.4-alpine

LABEL org.opencontainers.image.source=https://github.com/hfxbse/web-engineering-2023
LABEL org.opencontainers.image.description="Apache server setup to deliever the frontend of the 2023 web engineering project."

COPY . /usr/local/apache2/htdocs/
RUN mv /usr/local/apache2/htdocs/httpd.conf /usr/local/apache2/conf/httpd.conf
