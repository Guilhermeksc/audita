FROM alpine

RUN apk add --no-cache curl bash git coreutils

# Copia template e script de entrada
COPY webhook.template.json /webhook.template.json
COPY entrypoint.sh /entrypoint.sh
COPY deploy.sh /deploy.sh

RUN chmod +x /entrypoint.sh /deploy.sh

ENTRYPOINT ["/entrypoint.sh"]