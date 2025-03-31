#!/bin/bash
# Script para testar o container webhook
set -e

echo "=== Iniciando teste do webhook em $(date) ==="

# Verifica se o Docker está em execução
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker não está rodando. Inicie o serviço Docker primeiro."
  exit 1
fi

# Verifica se o container webhook já existe, se sim, remove
if docker ps -a | grep -q webhook; then
  echo "Removendo container webhook existente..."
  docker rm -f webhook || true
fi

# Recria os diretórios de log
echo "Criando diretórios de logs..."
mkdir -p logs/webhook
chmod -R 777 logs/

# Tenta construir a imagem webhook
echo "Construindo imagem webhook..."
docker build -t audita-webhook ./webhook

# Verifica se a construção foi bem-sucedida
if [ $? -ne 0 ]; then
  echo "❌ Falha na construção da imagem webhook."
  exit 1
fi

# Garante que a rede existe
docker network create audita-net 2>/dev/null || echo "Rede já existe"

# Inicia o container webhook isoladamente
echo "Iniciando container webhook..."
docker run -d --name webhook \
  --network audita-net \
  -p 9000:9000 \
  -v "$(pwd)/.env:/env/.env:ro" \
  -v "$(pwd)/webhook/deploy.sh:/deploy.sh:ro" \
  -v "$(pwd)/logs/webhook:/var/log/webhook" \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  audita-webhook

# Verifica se o container está em execução
if ! docker ps | grep -q webhook; then
  echo "❌ Falha ao iniciar o container webhook."
  docker logs webhook
  exit 1
fi

# Aguarda inicialização completa
echo "Aguardando inicialização do webhook (5s)..."
sleep 5

# Testa o endpoint de healthcheck
echo "Testando endpoint de healthcheck..."
if curl -s http://localhost:9000/healthz | grep -q "status.*ok"; then
  echo "✅ Webhook está respondendo ao healthcheck corretamente."
else
  echo "❌ Webhook não está respondendo corretamente ao healthcheck."
  docker logs webhook
  exit 1
fi

echo "=== Teste do webhook concluído com sucesso! ==="
echo "Para verificar logs do webhook, execute: docker logs webhook" 