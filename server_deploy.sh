#!/bin/bash
# Script de implantação para ambiente Ubuntu na Hostinger
set -e

# Configuração de log
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_DIR="/root/audita_logs"
LOG_FILE="$LOG_DIR/deploy_$TIMESTAMP.log"
mkdir -p "$LOG_DIR"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== Iniciando deploy em $(date) ==="

# Diretório do projeto
BASE_DIR="/root/audita"
cd "$BASE_DIR" || { echo "Erro: Diretório $BASE_DIR não encontrado"; exit 1; }

# Função para exibir mensagens de erro e sair
error_exit() {
  echo "❌ ERRO: $1" >&2
  echo "Deploy abortado em $(date). Consulte o log em $LOG_FILE para mais detalhes."
  exit 1
}

# Verificar se o Docker está instalado e em execução
if ! command -v docker &> /dev/null; then
  error_exit "Docker não está instalado. Instale-o primeiro."
fi

if ! docker info &> /dev/null; then
  error_exit "Docker não está em execução. Inicie o serviço."
fi

# Verificar se docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
  echo "docker-compose não está instalado. Instalando..."
  curl -L "https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
  ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
  echo "docker-compose instalado com sucesso."
fi

# Criar backup do estado atual
echo "[1/8] Criando backup do estado atual..."
BACKUP_DIR="/root/audita_backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r .env docker-compose.yml nginx.conf "$BACKUP_DIR" || echo "⚠️ Aviso: Backup parcial criado"

# Criar diretórios necessários
echo "Criando diretórios necessários..."
mkdir -p logs/webhook logs/nginx /var/www/certbot
chmod -R 777 logs/

# Atualizar código
echo "[2/8] Atualizando código via git..."
git fetch || error_exit "Falha ao buscar atualizações do repositório"
git status

# Salvar alterações locais (se houver)
if ! git diff --quiet; then
  echo "Alterações locais detectadas, salvando em stash..."
  git stash || echo "⚠️ Aviso: Não foi possível salvar alterações locais"
fi

# Atualizar código
git pull || error_exit "Falha ao atualizar o código via git pull"

# Instalar/atualizar dependências
echo "[3/8] Verificando dependências..."
if ! command -v node &> /dev/null; then
  echo "Node.js não encontrado. Instalando..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
fi

# Compilar frontend
echo "[4/8] Compilando frontend Angular..."
cd "$BASE_DIR/frontend" || error_exit "Diretório frontend não encontrado"

# Instalar dependências e compilar
npm ci || npm install || error_exit "Falha ao instalar dependências do Angular"
npm run build -- --configuration=production || error_exit "Falha ao compilar o frontend Angular"

cd "$BASE_DIR" || error_exit "Não foi possível retornar ao diretório base"

# Verificar configuração do SSL/certbot
echo "[5/8] Verificando configuração do SSL..."
if [ ! -d "/etc/letsencrypt/live/auditapro.com.br" ]; then
  echo "Certificado SSL não encontrado. Verifique se o Certbot está configurado corretamente."
  echo "Para instalar o Certbot e obter um certificado, execute:"
  echo "apt-get update && apt-get install -y certbot"
  echo "certbot certonly --standalone -d auditapro.com.br -d www.auditapro.com.br"
  
  read -p "Deseja continuar o deploy sem certificado SSL? (s/n): " ssl_response
  if [ "$ssl_response" != "s" ]; then
    error_exit "Deploy abortado. Configure o SSL primeiro."
  else
    echo "⚠️ Continuando sem SSL. O site NÃO funcionará corretamente via HTTPS."
  fi
fi

# Reconstruir e iniciar containers
echo "[6/8] Reconstruindo containers com Docker..."
docker-compose down --remove-orphans || echo "⚠️ Aviso: Falha ao parar containers, continuando..."

# Garantir que a rede existe
docker network create audita-net || echo "Rede já existe"

# Iniciar containers em ordem adequada
echo "Iniciando Postgres..."
docker-compose up -d postgres
echo "Aguardando inicialização do Postgres (30s)..."
sleep 30

echo "Iniciando Django e Airflow..."
docker-compose up -d django airflow-init airflow-webserver airflow-scheduler
echo "Aguardando inicialização dos serviços (20s)..."
sleep 20

echo "Iniciando Webhook..."
docker-compose up -d webhook
echo "Aguardando inicialização do Webhook (5s)..."
sleep 5

echo "Iniciando Nginx..."
docker-compose up -d nginx
echo "Aguardando inicialização do Nginx (5s)..."
sleep 5

# Verificar se os containers principais estão em execução
echo "Verificando containers essenciais..."
for service in postgres django nginx airflow-webserver webhook; do
  if ! docker ps | grep -q $service; then
    echo "⚠️ Container $service não está em execução. Verificando logs..."
    docker-compose logs $service | tail -50
    echo "Tentando reiniciar $service..."
    docker-compose up -d $service
  else
    echo "✅ Container $service está em execução."
  fi
done

# Aplicar migrações e coletar arquivos estáticos
echo "[7/8] Aplicando migrações e coletando arquivos estáticos..."
docker exec django python manage.py migrate || error_exit "Falha ao aplicar migrações"
docker exec django python manage.py collectstatic --noinput || error_exit "Falha ao coletar arquivos estáticos"

# Testar a disponibilidade do site
echo "[8/8] Testando domínio..."
MAX_RETRIES=5
retry=0
while [ $retry -lt $MAX_RETRIES ]; do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 10 https://auditapro.com.br || echo "000")
  
  if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ Domínio respondendo corretamente (HTTP 200)."
    break
  else
    retry=$((retry+1))
    echo "⚠️ Tentativa $retry de $MAX_RETRIES: domínio retornou HTTP $HTTP_STATUS."
    
    if [ $retry -lt $MAX_RETRIES ]; then
      echo "Aguardando 5 segundos antes de tentar novamente..."
      sleep 5
    else
      echo "❌ Erro: domínio não está respondendo corretamente após $MAX_RETRIES tentativas."
      echo "Executando script de diagnóstico..."
      bash webhook_fix.sh
    fi
  fi
done

# Verificar logs para possíveis erros
echo "Verificando logs de serviços para detectar erros..."
for service in nginx django airflow-webserver webhook; do
  echo "Últimas 10 linhas de log do $service:"
  docker logs --tail 10 $service
done

echo "=== Deploy concluído em $(date) ==="
echo "Para monitorar os serviços, use: docker-compose ps"
echo "Para ver logs detalhados, use: docker-compose logs [serviço]" 