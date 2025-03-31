#!/bin/bash
# Script para testar a integração entre webhook e nginx
set -e

echo "=== Iniciando teste de integração webhook+nginx em $(date) ==="

# Verifica se o Docker está em execução
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker não está rodando. Inicie o serviço Docker primeiro."
  exit 1
fi

# Remove containers existentes
echo "Removendo containers existentes..."
docker rm -f webhook nginx 2>/dev/null || true

# Recria os diretórios de log
echo "Criando diretórios de logs..."
mkdir -p logs/webhook logs/nginx /var/www/certbot
chmod -R 777 logs/

# Garante que a rede existe
docker network create audita-net 2>/dev/null || echo "Rede já existe"

# Passo 1: Construir e iniciar o webhook
echo "[1/3] Construindo e iniciando o webhook..."
docker build -t audita-webhook ./webhook

if [ $? -ne 0 ]; then
  echo "❌ Falha na construção da imagem webhook."
  exit 1
fi

echo "Iniciando container webhook..."
docker run -d --name webhook \
  --network audita-net \
  -p 9000:9000 \
  -v "$(pwd)/.env:/env/.env:ro" \
  -v "$(pwd)/webhook/deploy.sh:/deploy.sh:ro" \
  -v "$(pwd)/logs/webhook:/var/log/webhook" \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  audita-webhook

# Aguarda inicialização do webhook
echo "Aguardando inicialização do webhook (5s)..."
sleep 5

# Verifica se o webhook está em execução
if ! docker ps | grep -q webhook; then
  echo "❌ Falha ao iniciar o container webhook."
  docker logs webhook
  exit 1
fi

# Testa o endpoint de healthcheck do webhook
echo "Testando endpoint de healthcheck do webhook..."
if ! curl -s http://localhost:9000/healthz | grep -q "status.*ok"; then
  echo "❌ Webhook não está respondendo corretamente ao healthcheck."
  docker logs webhook
  exit 1
else
  echo "✅ Webhook está respondendo ao healthcheck corretamente."
fi

# Passo 2: Iniciar o nginx
echo "[2/3] Iniciando o nginx..."
docker run -d --name nginx \
  --network audita-net \
  -p 80:80 -p 443:443 \
  -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$(pwd)/frontend/dist/browser:/usr/share/nginx/html:ro" \
  -v "$(pwd)/logs/nginx:/var/log/nginx" \
  -v "/var/www/certbot:/var/www/certbot:ro" \
  nginx:latest

# Aguarda inicialização do nginx
echo "Aguardando inicialização do nginx (5s)..."
sleep 5

# Verifica se o nginx está em execução
if ! docker ps | grep -q nginx; then
  echo "❌ Falha ao iniciar o container nginx."
  docker logs nginx
  exit 1
else
  echo "✅ Nginx iniciado com sucesso."
fi

# Passo 3: Testar a comunicação entre nginx e webhook
echo "[3/3] Testando comunicação entre nginx e webhook..."

# Obter o IP do webhook
WEBHOOK_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' webhook)
echo "IP do webhook: $WEBHOOK_IP"

# Testar a conexão direta do host para o webhook
echo "Testando conexão direta do host para o webhook..."
if curl -s "http://localhost:9000/healthz" | grep -q "status.*ok"; then
  echo "✅ Host consegue se conectar diretamente ao webhook."
else
  echo "❌ Host não consegue se conectar diretamente ao webhook."
fi

# Testar se o nginx consegue se conectar ao webhook
echo "Testando conexão do nginx para o webhook..."
if docker exec nginx curl -s "http://$WEBHOOK_IP:9000/healthz" | grep -q "status.*ok"; then
  echo "✅ Nginx consegue se conectar ao webhook."
else
  echo "❌ Nginx não consegue se conectar ao webhook."
  echo "Tentando resolver problemas de conectividade..."
  
  # Verifique a configuração do nginx
  echo "Verificando configuração do nginx..."
  docker exec nginx cat /etc/nginx/nginx.conf | grep -A 3 "upstream webhook_server"
  
  # Se a configuração do webhook_server não estiver correta, corrija
  if ! docker exec nginx cat /etc/nginx/nginx.conf | grep -q "upstream webhook_server"; then
    echo "Configuração de upstream para webhook não encontrada. Corrigindo..."
    
    # Salve a configuração atual
    docker cp nginx:/etc/nginx/nginx.conf ./nginx.conf.current
    
    # Adicione a configuração do upstream
    sed -i '/# Buffer size for POST submissions/a\
  # Define upstream servers\n  upstream webhook_server {\n    server webhook:9000;\n  }' ./nginx.conf.current
    
    # Atualize a configuração do nginx
    docker cp ./nginx.conf.current nginx:/etc/nginx/nginx.conf
    
    # Recarregue o nginx
    docker exec nginx nginx -s reload
    
    echo "Configuração atualizada. Tentando novamente..."
    sleep 2
    
    if docker exec nginx curl -s "http://$WEBHOOK_IP:9000/healthz" | grep -q "status.*ok"; then
      echo "✅ Nginx agora consegue se conectar ao webhook."
    else
      echo "❌ Ainda não foi possível conectar o nginx ao webhook."
    fi
  fi
fi

echo "=== Teste de integração concluído ==="
echo "Para verificar logs, execute:"
echo "  docker logs webhook"
echo "  docker logs nginx" 