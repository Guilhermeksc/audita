#!/bin/bash
set -e

exec >> /tmp/deploy_hook.log 2>&1
echo "=== Deploy iniciado em $(date) ==="

BASE_DIR="/root/audita"
cd "$BASE_DIR"

echo "[1/5] Atualizando código via git..."
git pull || { echo "Erro ao atualizar o projeto."; exit 1; }

echo "[2/5] Compilando frontend Angular..."
cd "$BASE_DIR/frontend"

if [ ! -d "node_modules" ]; then
  echo "Instalando dependências do Angular..."
  npm install
fi

npm install
npm run build -- --configuration=production

cd "$BASE_DIR"

echo "[3/5] Reconstruindo containers com Docker..."
docker-compose down -v
yes | docker-compose up -d --build --remove-orphans

echo "[4/5] Aplicando migrações e coletando arquivos estáticos..."
docker exec django python manage.py migrate
docker exec django python manage.py collectstatic --noinput

echo "[5/5] Reiniciando serviços..."
docker restart nginx django airflow-webserver

echo "[✔] Testando domínio..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://auditapro.com.br)
if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✅ Domínio respondendo corretamente (HTTP 200)."
else
  echo "❌ Erro: domínio retornou HTTP $HTTP_STATUS."
fi
