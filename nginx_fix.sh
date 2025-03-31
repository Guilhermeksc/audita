#!/bin/bash
# Script para corrigir problemas de configuração do Nginx
set -e

echo "=== Iniciando diagnóstico do Nginx em $(date) ==="

# Verifica se o Docker está em execução
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker não está rodando. Inicie o serviço Docker primeiro."
  exit 1
fi

# Verifica o status dos containers
echo "Verificando status dos containers..."
if ! docker ps | grep -q webhook; then
  echo "⚠️ Container webhook não está em execução."
  WEBHOOK_MISSING=true
else
  echo "✅ Container webhook está em execução."
  # Verificar IP do webhook
  WEBHOOK_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' webhook)
  echo "IP do webhook: $WEBHOOK_IP"
fi

if ! docker ps | grep -q nginx; then
  echo "⚠️ Container nginx não está em execução."
  NGINX_MISSING=true
else
  echo "✅ Container nginx está em execução."
fi

# Verificar a rede
echo "Verificando configuração de rede..."
docker network ls | grep audita-net
echo "Containers na rede audita-net:"
docker network inspect audita-net | grep -A 10 "Containers"

# Verificar e extrair configuração atual do Nginx
echo "Extraindo configuração atual do Nginx..."
if ! $NGINX_MISSING; then
  docker cp nginx:/etc/nginx/nginx.conf ./nginx.conf.container
  echo "Arquivo nginx.conf extraído do container para ./nginx.conf.container"
  
  # Comparar com a configuração local
  echo "Comparando com configuração local..."
  if diff -q nginx.conf nginx.conf.container > /dev/null; then
    echo "✅ Configurações são idênticas."
  else
    echo "❌ Configurações são diferentes. Mostrando diferenças:"
    diff -u nginx.conf nginx.conf.container || true
  fi
  
  # Verificar se há erros na configuração
  echo "Verificando linha 62 que está causando o erro..."
  docker exec nginx cat /etc/nginx/nginx.conf | sed -n '62p'
  
  # Verificar se a upstream está definida
  echo "Verificando se o upstream webhook_server está definido:"
  if docker exec nginx grep -q "upstream webhook_server" /etc/nginx/nginx.conf; then
    echo "✅ upstream webhook_server está definido."
  else
    echo "❌ upstream webhook_server não está definido."
  fi
  
  # Verificar se o proxy_pass está correto
  echo "Verificando configuração de proxy_pass para webhook:"
  if docker exec nginx grep -q "proxy_pass http://webhook_server/" /etc/nginx/nginx.conf; then
    echo "✅ proxy_pass está configurado para usar webhook_server."
  else
    echo "❌ proxy_pass não está usando webhook_server."
    docker exec nginx grep -n "proxy_pass.*webhook" /etc/nginx/nginx.conf || true
  fi
fi

# Corrigir o problema
echo "Corrigindo a configuração do Nginx..."

# Criar uma nova configuração
cat > ./nginx.conf.fixed << EOF
worker_processes auto;

events {
  worker_connections 1024;
  multi_accept on;
}

http {
  include       mime.types;
  default_type  application/octet-stream;
  
  # Performance optimizations
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 65;
  types_hash_max_size 2048;
  server_tokens off;
  
  # Compression settings
  gzip on;
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_buffers 16 8k;
  gzip_http_version 1.1;
  gzip_min_length 256;
  gzip_types
    application/atom+xml
    application/javascript
    application/json
    application/ld+json
    application/manifest+json
    application/rss+xml
    application/vnd.geo+json
    application/vnd.ms-fontobject
    application/x-font-ttf
    application/x-web-app-manifest+json
    application/xhtml+xml
    application/xml
    font/opentype
    image/bmp
    image/svg+xml
    image/x-icon
    text/cache-manifest
    text/css
    text/plain
    text/vcard
    text/vnd.rim.location.xloc
    text/vtt
    text/x-component
    text/x-cross-domain-policy;

  # Buffer size for POST submissions
  client_body_buffer_size 10K;
  client_header_buffer_size 1k;
  client_max_body_size 8m;
  large_client_header_buffers 4 4k;

  # Define upstream servers
  upstream webhook_server {
    server webhook:9000;
  }

  # Redirecionamento HTTP → HTTPS
  server {
    listen 80;
    server_name auditapro.com.br www.auditapro.com.br;
    
    # Configuração para verificação Let's Encrypt
    location /.well-known/acme-challenge/ {
      root /var/www/certbot;
    }
    
    # Redirecionamento para HTTPS
    location / {
      return 301 https://\$host\$request_uri;
    }
  }

  # Servidor HTTPS com certificado Let's Encrypt
  server {
    listen 443 ssl;
    http2 on;
    server_name auditapro.com.br www.auditapro.com.br;

    # Configurações SSL
    ssl_certificate /etc/letsencrypt/live/auditapro.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auditapro.com.br/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Protocolos modernos
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers on;

    # Headers de segurança
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;
    
    # Diretório raiz do SPA
    root /usr/share/nginx/html;
    index index.html;

    # Arquivos estáticos do Django
    location ^~ /static/ {
      alias /opt/django/staticfiles/;
      access_log off;
      expires 30d;
      add_header Cache-Control "public, max-age=2592000";
    }

    # API do Django
    location /api/ {
      proxy_pass http://django:8000;
      proxy_set_header Host \$host;
      proxy_set_header X-Real-IP \$remote_addr;
      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto \$scheme;
      proxy_read_timeout 90s;
      client_max_body_size 10M;
    }

    # Admin do Django
    location /admin {
      proxy_pass http://django:8000;
      proxy_set_header Host \$host;
      proxy_set_header X-Real-IP \$remote_addr;
      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto \$scheme;
      proxy_read_timeout 90s;
      client_max_body_size 10M;
    }

    # Airflow
    location ^~ /airflow/ {
        proxy_pass http://airflow-webserver:8080/airflow/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_redirect off;
        proxy_read_timeout 300s;
        client_max_body_size 100M;
    }

    # Webhook
    location /webhook/ {
        proxy_pass http://webhook_server/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 10s;
        proxy_read_timeout 120s;
    }

    # Cache longo para JS e CSS com hash
    location ~* \.(?:js|css)$ {
      expires 1y;
      access_log off;
      add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Cache moderado para assets
    location /assets/ {
      expires 30d;
      access_log off;
      add_header Cache-Control "public, max-age=2592000";
    }

    # Não cachear index.html
    location = /index.html {
      expires -1;
      add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Roteamento SPA
    location / {
      try_files \$uri \$uri/ /index.html;
    }
    
    # Configuração para erros
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
      root /usr/share/nginx/html;
    }
  }
}
EOF

echo "Configuração corrigida criada em ./nginx.conf.fixed"

# Copiar para local
cp ./nginx.conf.fixed ./nginx.conf
echo "Arquivo local nginx.conf atualizado"

# Reinicie os serviços (somente se existirem)
if ! $NGINX_MISSING; then
  echo "Aplicando nova configuração ao nginx..."
  docker cp ./nginx.conf.fixed nginx:/etc/nginx/nginx.conf
  
  echo "Verificando nova configuração..."
  if docker exec nginx nginx -t; then
    echo "✅ Configuração válida! Reiniciando nginx..."
    docker restart nginx
  else
    echo "❌ Nova configuração inválida. Verificando logs..."
    docker logs nginx
  fi
fi

# Verifique se o webhook está funcionando
if $WEBHOOK_MISSING; then
  echo "Webhook não está em execução. Tentando iniciar..."
  docker-compose up -d webhook
  sleep 5
fi

# Reinicie os dois containers para garantir
echo "Reiniciando containers para garantir conectividade..."
docker-compose stop nginx webhook
docker-compose up -d webhook
sleep 5
docker-compose up -d nginx

echo "Aguardando inicialização completa (10s)..."
sleep 10

# Verificação final
echo "Verificação final do status dos containers:"
docker ps | grep -E 'webhook|nginx'

if docker ps | grep -q nginx; then
  echo "Verificando logs do nginx após reinicialização:"
  docker logs --tail 20 nginx
fi

echo "=== Diagnóstico concluído em $(date) ==="
echo "Se o problema persistir, experimente recriar todo o ambiente:"
echo "  docker-compose down -v"
echo "  docker-compose up -d" 