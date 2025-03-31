#!/bin/bash
# Script para corrigir rapidamente o erro de "host not found in upstream webhook:9000"
set -e

echo "=== Iniciando correção rápida do Nginx em $(date) ==="

# Verificar os containers em execução
echo "Verificando containers..."
docker ps | grep -E 'webhook|nginx'

# Verificar a linha específica que está causando o erro
echo "Verificando configuração atual do nginx..."
if docker exec nginx cat /etc/nginx/nginx.conf | grep -n "upstream"; then
  echo "Configuração de upstream encontrada."
else
  echo "Upstream não encontrada, vamos adicionar."
fi

if docker exec nginx cat /etc/nginx/nginx.conf | grep -n "proxy_pass.*webhook"; then
  echo "Linha de proxy_pass encontrada. Verificando formato..."
fi

# Extrair a configuração atual
echo "Copiando configuração atual do nginx..."
docker cp nginx:/etc/nginx/nginx.conf ./nginx.current.conf

# Verificar e corrigir a configuração
echo "Corrigindo a configuração..."

# 1. Verificar se existe a definição de upstream
if ! grep -q "upstream webhook_server" ./nginx.current.conf; then
  echo "Adicionando upstream webhook_server..."
  sed -i '/large_client_header_buffers/a \
\
  # Define upstream servers\
  upstream webhook_server {\
    server webhook:9000;\
  }' ./nginx.current.conf
fi

# 2. Corrigir a linha de proxy_pass
echo "Corrigindo proxy_pass..."
sed -i 's|proxy_pass http://webhook:9000/;|proxy_pass http://webhook_server/;|g' ./nginx.current.conf

# 3. Corrigir a configuração de HTTP/2 se necessário
if grep -q "listen 443 ssl http2;" ./nginx.current.conf; then
  echo "Corrigindo configuração de HTTP/2 moderna..."
  sed -i 's|listen 443 ssl http2;|listen 443 ssl;\n    http2 on;|g' ./nginx.current.conf
fi

# Aplicar a configuração corrigida
echo "Aplicando configuração corrigida..."
docker cp ./nginx.current.conf nginx:/etc/nginx/nginx.conf

# Testar a configuração
echo "Testando configuração do nginx..."
if docker exec nginx nginx -t; then
  echo "✅ Configuração válida! Reiniciando nginx..."
  docker restart nginx
  
  # Aguardar reinicialização
  echo "Aguardando reinicialização (5s)..."
  sleep 5
  
  # Verificar logs após reinicialização
  echo "Verificando logs do nginx após reinicialização:"
  docker logs --tail 20 nginx
else
  echo "❌ Configuração inválida após correções."
  exit 1
fi

# Verificar status do webhook
echo "Verificando status do webhook..."
if ! docker ps | grep -q webhook; then
  echo "⚠️ Webhook não está em execução. Iniciando..."
  docker-compose up -d webhook
  sleep 5
fi

# Verificar rede
echo "Verificando rede entre containers..."
WEBHOOK_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' webhook)
echo "IP do webhook: $WEBHOOK_IP"

echo "Testando conexão do nginx para o webhook..."
if docker exec nginx ping -c 1 webhook; then
  echo "✅ Conexão de rede OK."
else
  echo "❌ Problema de rede entre nginx e webhook."
  echo "Verificando configuração de rede..."
  docker network inspect audita-net | grep -A 20 "Containers"
  
  echo "Reconectando containers à rede..."
  docker network disconnect audita-net webhook || true
  docker network disconnect audita-net nginx || true
  docker network connect audita-net webhook
  docker network connect audita-net nginx
  
  echo "Reiniciando containers..."
  docker restart webhook nginx
fi

echo "=== Correção concluída em $(date) ==="
echo "Para verificar logs:"
echo "  docker logs nginx"
echo "  docker logs webhook" 