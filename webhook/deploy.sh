#!/bin/bash
set -e

# Configuração de log
LOG_FILE="/tmp/deploy_hook.log"
exec >> $LOG_FILE 2>&1
echo "=== Deploy iniciado em $(date) ==="

# Diretório do projeto
BASE_DIR="/root/audita"
cd "$BASE_DIR" || { echo "Erro: Diretório $BASE_DIR não encontrado"; exit 1; }

# Função para exibir mensagens de erro e sair
error_exit() {
  echo "❌ ERRO: $1" >&2
  echo "Deploy abortado em $(date). Consulte o log em $LOG_FILE para mais detalhes."
  exit 1
}

# Função para testar a conexão com serviços
test_service() {
  local service=$1
  local port=$2
  echo "Testando conexão com $service na porta $port..."
  timeout 5 bash -c "cat < /dev/null > /dev/tcp/$service/$port" 2>/dev/null || 
    error_exit "Não foi possível conectar ao serviço $service:$port"
}

# Criar backup do estado atual
echo "[1/7] Criando backup do estado atual..."
BACKUP_DIR="/root/audita_backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r .env docker-compose.yml nginx.conf "$BACKUP_DIR" || echo "Aviso: Backup parcial criado"

# Atualizar código
echo "[2/7] Atualizando código via git..."
git fetch || error_exit "Falha ao buscar atualizações do repositório"
git status

# Salvar alterações locais (se houver)
if ! git diff --quiet; then
  echo "Alterações locais detectadas, salvando em stash..."
  git stash || echo "Aviso: Não foi possível salvar alterações locais"
fi

# Atualizar código
git pull || error_exit "Falha ao atualizar o código via git pull"

# Compilar frontend
echo "[3/7] Compilando frontend Angular..."
cd "$BASE_DIR/frontend" || error_exit "Diretório frontend não encontrado"

# Verificar se Node.js está instalado
if ! command -v npm &> /dev/null; then
  error_exit "Node.js não está instalado. Instale-o para compilar o frontend."
fi

# Instalar dependências e compilar
npm ci || npm install || error_exit "Falha ao instalar dependências do Angular"
npm run build -- --configuration=production || error_exit "Falha ao compilar o frontend Angular"

cd "$BASE_DIR" || error_exit "Não foi possível retornar ao diretório base"

# Reconstruir e iniciar containers
echo "[4/7] Reconstruindo containers com Docker..."
docker-compose down --remove-orphans || echo "Aviso: Falha ao parar containers, continuando..."
yes | docker-compose up -d --build --remove-orphans || error_exit "Falha ao iniciar containers Docker"

# Verificar se os containers principais estão em execução
echo "Verificando containers essenciais..."
docker ps | grep -E 'postgres|django|nginx|airflow-webserver' || error_exit "Nem todos os containers essenciais estão em execução"

# Aguardar inicialização completa dos serviços
echo "Aguardando inicialização dos serviços (10s)..."
sleep 10

# Aplicar migrações e coletar arquivos estáticos
echo "[5/7] Aplicando migrações e coletando arquivos estáticos..."
docker exec django python manage.py migrate || error_exit "Falha ao aplicar migrações"
docker exec django python manage.py collectstatic --noinput || error_exit "Falha ao coletar arquivos estáticos"

# Reiniciar serviços específicos
echo "[6/7] Reiniciando serviços..."
for service in nginx django airflow-webserver; do
  echo "Reiniciando $service..."
  docker restart $service || error_exit "Falha ao reiniciar $service"
  sleep 3  # Aguardar inicialização
done

# Testar a disponibilidade do site
echo "[7/7] Testando domínio..."
MAX_RETRIES=5
retry=0
while [ $retry -lt $MAX_RETRIES ]; do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 10 https://auditapro.com.br)
  
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
      # Não abortar deploy aqui, apenas registrar o erro
    fi
  fi
done

# Verificar logs para possíveis erros
echo "Verificando logs de serviços para detectar erros..."
for service in nginx django airflow-webserver; do
  echo "Últimas 10 linhas de log do $service:"
  docker logs --tail 10 $service
done

echo "=== Deploy concluído em $(date) ==="
