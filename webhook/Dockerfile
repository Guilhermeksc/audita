FROM alpine:latest

RUN apk add --no-cache curl bash git coreutils


COPY webhook.template.json /webhook.template.json
COPY entrypoint.sh /entrypoint.sh
COPY deploy.sh /deploy.sh

RUN chmod +x /entrypoint.sh /deploy.sh

ENTRYPOINT ["/entrypoint.sh"]



