#!/bin/bash
set -e

# Define o diretório base (raiz do repositório)
BASE_DIR="$(dirname "$(realpath "$0")")/.."
cd "$BASE_DIR"

# Atualiza o projeto via Git
echo "Atualizando o projeto..."
git pull || { echo "Erro ao atualizar o projeto."; exit 1; }

# Compila o frontend Angular
echo "Compilando o frontend Angular..."
cd "$BASE_DIR/frontend"

if [ ! -d "node_modules" ]; then
  echo "Instalando dependências do Angular (node_modules não encontrado)..."
  npm install
fi

# Mesmo que tenha node_modules, atualiza pacotes para garantir build correto
npm install

# Desativa prompt interativo do Angular CLI
npx ng config -g cli.interactive false

# Build de produção
npm run build -- --configuration=production

cd "$BASE_DIR"

# Remove containers, redes e volumes antigos
#echo "Removendo containers e volumes antigos..."
# docker-compose down -v

# Remove apenas o container antigo do Django (sem afetar volumes)
echo "Removendo container antigo do Django..."
docker-compose rm -f -s -v django || true

# Constrói e inicia os containers, removendo os órfãos
echo "Construindo e iniciando os containers..."
yes | docker-compose up -d --build --remove-orphans



# Executa as migrações e coleta de arquivos estáticos no container Django
echo "Aplicando migrações e coletando arquivos estáticos..."
docker exec django python manage.py migrate
docker exec django python manage.py collectstatic --noinput

# Reinicia os serviços necessários
echo "Reiniciando os serviços: nginx, django, airflow-webserver..."
docker restart nginx django airflow-webserver

# Testa se o domínio está respondendo corretamente
echo "Verificando o domínio https://auditapro.com.br..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://auditapro.com.br)
if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "Domínio respondendo corretamente (HTTP 200)."
else
  echo "Erro: domínio retornou HTTP $HTTP_STATUS."
fi
