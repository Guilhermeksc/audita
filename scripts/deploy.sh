#!/bin/bash
set -e

# Atualiza o projeto (assumindo repositório Git)
echo "Atualizando projeto..."
git pull || { echo "Erro ao atualizar o projeto."; exit 1; }

# Constrói e inicia os containers
echo "Executando docker-compose..."
docker-compose up -d --build

# Executa migrações e coleta de arquivos estáticos no Django
echo "Aplicando migrações e coletando arquivos estáticos..."
docker exec django python manage.py migrate
docker exec django python manage.py collectstatic --noinput

# Reinicia os containers dos serviços
echo "Reiniciando os serviços: nginx, django, airflow-webserver..."
docker restart nginx django airflow-webserver

# Testa se o domínio está respondendo corretamente
echo "Testando o domínio https://auditapro.com.br..."
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" https://auditapro.com.br)
if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "Domínio respondendo corretamente (HTTP 200)."
else
  echo "Erro: domínio não respondeu corretamente (HTTP $HTTP_STATUS)."
fi
