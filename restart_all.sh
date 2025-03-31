#!/bin/bash
# Script para reiniciar todos os serviços e corrigir problemas conhecidos
set -e

echo "=== Iniciando reinicialização completa em $(date) ==="

# Verificar se o Docker está em execução
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker não está rodando. Inicie o serviço Docker primeiro."
  exit 1
fi

# Criar diretórios necessários
echo "Criando diretórios necessários..."
mkdir -p logs/webhook logs/nginx /var/www/certbot
chmod -R 777 logs/

# Verificar se a rede existe
echo "Verificando rede Docker..."
if ! docker network ls | grep -q audita-net; then
  echo "Criando rede audita-net..."
  docker network create audita-net
else
  echo "✅ Rede audita-net já existe."
fi

# Parar todos os containers
echo "Parando todos os containers..."
docker-compose down --remove-orphans

# Verificar se há containers parados
if docker ps -a | grep -q -E 'webhook|nginx'; then
  echo "Removendo containers parados..."
  docker rm -f $(docker ps -a -q -f name=webhook -f name=nginx) 2>/dev/null || true
fi

# Reconstruir webhook
echo "Reconstruindo webhook..."
cd webhook
if ! docker build -t audita-webhook .; then
  echo "❌ Falha na construção do webhook. Verificando Dockerfile..."
  cat Dockerfile
  exit 1
else
  echo "✅ Webhook reconstruído com sucesso."
fi
cd ..

# Verificar configuração do nginx
echo "Verificando configuração do nginx..."
cat nginx.conf | grep -n "upstream webhook_server" || {
  echo "❌ Upstream webhook_server não encontrado. Corrigindo..."
  
  # Adicionar upstream
  sed -i '/large_client_header_buffers/a \
\
  # Define upstream servers\
  upstream webhook_server {\
    server webhook:9000;\
  }' nginx.conf
  
  echo "✅ Upstream adicionado."
}

# Verificar proxy_pass
cat nginx.conf | grep -n "proxy_pass.*webhook" || echo "⚠️ Não foi encontrada linha de proxy_pass para webhook."

# Corrigir proxy_pass se necessário
if grep -q "proxy_pass http://webhook:9000/" nginx.conf; then
  echo "❌ Referência direta ao webhook encontrada. Corrigindo..."
  sed -i 's|proxy_pass http://webhook:9000/;|proxy_pass http://webhook_server/;|g' nginx.conf
  echo "✅ Referência corrigida."
fi

# Iniciar os serviços de forma ordenada
echo "[1/5] Iniciando Postgres..."
docker-compose up -d postgres
echo "Aguardando inicialização do Postgres (30s)..."
sleep 30

echo "[2/5] Iniciando Django e serviços do Airflow..."
docker-compose up -d django airflow-init airflow-webserver airflow-scheduler
echo "Aguardando inicialização dos serviços (15s)..."
sleep 15

echo "[3/5] Iniciando webhook de forma independente..."
# Iniciar o webhook como container independente
docker run -d --name webhook \
  --network audita-net \
  -p 9000:9000 \
  -v "$(pwd)/.env:/env/.env:ro" \
  -v "$(pwd)/webhook/deploy.sh:/deploy.sh:ro" \
  -v "$(pwd)/logs/webhook:/var/log/webhook" \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  audita-webhook

echo "Aguardando inicialização do webhook (5s)..."
sleep 5

# Verificar se o webhook está em execução
if ! docker ps | grep -q webhook; then
  echo "❌ Falha ao iniciar o container webhook."
  docker logs webhook || true
  exit 1
fi

# Testar o endpoint de healthcheck do webhook
echo "Testando endpoint de healthcheck do webhook..."
if curl -s http://localhost:9000/healthz | grep -q "status.*ok"; then
  echo "✅ Webhook está respondendo ao healthcheck corretamente."
else
  echo "❌ Webhook não está respondendo corretamente ao healthcheck."
  docker logs webhook
  echo "⚠️ Continuando mesmo assim..."
fi

echo "[4/5] Iniciando nginx..."
docker-compose up -d nginx
echo "Aguardando inicialização do nginx (5s)..."
sleep 5

# Verificar logs do nginx
echo "Verificando logs do nginx..."
docker logs nginx | tail -20

# Verificar se o nginx está em execução
if ! docker ps | grep -q nginx; then
  echo "❌ Nginx não iniciou corretamente. Tentando iniciar manualmente..."
  
  # Copiar a configuração do nginx para o container
  docker run -d --name nginx \
    --network audita-net \
    -p 80:80 -p 443:443 \
    -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" \
    -v "$(pwd)/frontend/dist/browser:/usr/share/nginx/html:ro" \
    -v "$(pwd)/logs/nginx:/var/log/nginx" \
    -v "/var/www/certbot:/var/www/certbot:ro" \
    nginx:latest
  
  echo "Aguardando inicialização do nginx (5s)..."
  sleep 5
  
  if ! docker ps | grep -q nginx; then
    echo "❌ Ainda não foi possível iniciar o nginx."
    exit 1
  fi
fi

echo "[5/5] Verificando conectividade entre containers..."
# Obter IP do webhook
WEBHOOK_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' webhook)
echo "IP do webhook: $WEBHOOK_IP"

# Testar a conexão do nginx para o webhook
echo "Testando conexão do nginx para o webhook..."
if docker exec nginx ping -c 1 webhook; then
  echo "✅ Conexão de rede OK."
else
  echo "❌ Problema de rede entre nginx e webhook."
  echo "Reconectando containers à rede..."
  docker network disconnect audita-net webhook || true
  docker network disconnect audita-net nginx || true
  docker network connect audita-net webhook
  docker network connect audita-net nginx
  docker restart nginx
  echo "Containers reconectados e reiniciados."
fi

echo "=== Verificação final dos containers ==="
docker ps

echo "=== Reinicialização completa concluída em $(date) ==="
echo "Se encontrar problemas, execute os scripts de diagnóstico:"
echo "  ./nginx_fix.sh - Para problemas específicos do Nginx"
echo "  ./test_webhook.sh - Para testar o webhook isoladamente"
echo "  ./test_nginx_webhook.sh - Para testar a comunicação entre Nginx e Webhook" 