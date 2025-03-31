#!/bin/sh
set -e

# Exporta variáveis do .env se necessário
export $(grep -v '^#' /env/.env | xargs)

# Substitui a secret no webhook.json
envsubst < /webhook.template.json > /webhook.json

# Inicia o webhook
exec webhook -verbose -hooks /webhook.json -hotreload
