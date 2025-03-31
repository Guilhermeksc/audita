#!/bin/bash
set -e

# Substitui a variável ${WEBHOOK_SECRET} no template
echo "🔐 Gerando webhook.json com WEBHOOK_SECRET..."
export WEBHOOK_SECRET=${WEBHOOK_SECRET}
envsubst < /webhook.template.json > /webhook.json

echo "✅ webhook.json gerado:"
cat /webhook.json

echo "🚀 Iniciando webhook listener..."
exec webhook -verbose -hooks /webhook.json -hotreload
