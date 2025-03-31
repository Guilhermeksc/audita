#!/bin/bash
# Script para verificar e corrigir problemas com o webhook e o NGINX
set -e

echo "=== Iniciando diagnóstico do ambiente em $(date) ==="

# Verifica se o Docker está em execução
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker não está rodando. Inicie o serviço Docker primeiro."
  exit 1
fi

# Cria diretórios de log necessários
echo "Criando diretórios de logs..."
mkdir -p logs/webhook logs/nginx
chmod -R 777 logs/

# Verifica se os containers estão em execução
echo "Verificando status dos containers..."
if ! docker ps | grep -q webhook; then
  echo "⚠️ Container webhook não está em execução."
  WEBHOOK_MISSING=true
else
  echo "✅ Container webhook está em execução."
fi

if ! docker ps | grep -q nginx; then
  echo "⚠️ Container nginx não está em execução."
  NGINX_MISSING=true
else
  echo "✅ Container nginx está em execução."
fi

# Se o webhook não estiver rodando, tenta iniciá-lo separadamente
if [ "$WEBHOOK_MISSING" = true ]; then
  echo "Tentando iniciar o webhook separadamente..."
  docker-compose up -d webhook
  sleep 5
  
  if ! docker ps | grep -q webhook; then
    echo "❌ Falha ao iniciar o webhook. Verificando logs..."
    docker-compose logs webhook
  else
    echo "✅ Webhook iniciado com sucesso."
  fi
fi

# Se o nginx não estiver rodando, verifica se o webhook está ok antes de tentar
if [ "$NGINX_MISSING" = true ]; then
  if docker ps | grep -q webhook; then
    echo "Verificando se o webhook está respondendo antes de iniciar o nginx..."
    
    # Verifica se o webhook está respondendo
    if docker exec webhook curl -s http://localhost:9000/healthz > /dev/null; then
      echo "✅ Webhook está respondendo. Tentando iniciar o nginx..."
      
      # Força a recriação do container nginx
      docker-compose up -d --force-recreate nginx
      sleep 5
      
      if ! docker ps | grep -q nginx; then
        echo "❌ Falha ao iniciar o nginx. Verificando logs..."
        docker-compose logs nginx
      else
        echo "✅ Nginx iniciado com sucesso."
      fi
    else
      echo "❌ Webhook não está respondendo ao healthcheck. Verifique a configuração."
    fi
  fi
fi

# Verifica as redes Docker
echo "Verificando redes Docker..."
if ! docker network ls | grep -q audita-net; then
  echo "❌ Rede 'audita-net' não encontrada. Criando..."
  docker network create audita-net
  echo "✅ Rede criada. Reiniciando containers..."
  docker-compose down
  docker-compose up -d
else
  echo "✅ Rede 'audita-net' encontrada."
  
  # Verifica se os containers estão na mesma rede
  echo "Verificando conectividade entre containers..."
  WEBHOOK_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' webhook)
  NGINX_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx)
  
  echo "IP do webhook: $WEBHOOK_IP"
  echo "IP do nginx: $NGINX_IP"
  
  if [ -n "$WEBHOOK_IP" ] && [ -n "$NGINX_IP" ]; then
    echo "Testando conectividade do nginx para o webhook..."
    if docker exec nginx curl -s "http://$WEBHOOK_IP:9000/healthz" > /dev/null; then
      echo "✅ Nginx consegue se conectar ao webhook."
    else
      echo "❌ Nginx não consegue se conectar ao webhook. Verificando configuração de rede..."
      
      # Reconecta os containers à rede
      echo "Reconectando containers à rede 'audita-net'..."
      docker network disconnect audita-net webhook || true
      docker network disconnect audita-net nginx || true
      docker network connect audita-net webhook
      docker network connect audita-net nginx
      
      echo "Containers reconectados. Reiniciando..."
      docker restart webhook nginx
    fi
  fi
fi

# Verifica a configuração do nginx
echo "Verificando configuração do nginx..."
docker exec nginx nginx -t || {
  echo "❌ Configuração do nginx tem erros. Corrigindo..."
  
  # Backup da configuração atual
  docker cp nginx:/etc/nginx/nginx.conf nginx.conf.bak
  
  # Injeta a definição do upstream no nginx.conf
  grep -q "upstream webhook_server" nginx.conf || {
    echo "Adicionando definição de upstream para o webhook..."
    sed -i '/# Buffer size for POST submissions/a\
  # Define upstream servers\n  upstream webhook_server {\n    server webhook:9000;\n  }' nginx.conf
  }
  
  # Atualiza a configuração HTTP/2
  sed -i 's/listen 443 ssl http2;/listen 443 ssl;\n    http2 on;/' nginx.conf
  
  # Atualiza a configuração do webhook
  sed -i 's|proxy_pass http://webhook:9000/;|proxy_pass http://webhook_server/;|' nginx.conf
  
  # Copia a configuração atualizada para o container
  docker cp nginx.conf nginx:/etc/nginx/nginx.conf
  
  # Recarrega a configuração do nginx
  docker exec nginx nginx -s reload || docker restart nginx
}

echo "Diagnóstico concluído em $(date)"
echo "Para verificar os logs, execute:"
echo "  docker-compose logs webhook"
echo "  docker-compose logs nginx"

# Sugere ação final caso ainda haja problemas
if ! docker ps | grep -q webhook || ! docker ps | grep -q nginx; then
  echo "⚠️ Ainda há problemas com os containers. Tente recriar todo o ambiente:"
  echo "  docker-compose down -v"
  echo "  docker-compose up -d"
fi 