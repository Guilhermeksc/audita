#!/bin/sh
set -e

# Configure logging
LOG_DIR="/var/log/webhook"
mkdir -p $LOG_DIR
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "$TIMESTAMP - Webhook container starting up" | tee -a $LOG_DIR/startup.log

# Check if environment file exists
if [ ! -f "/env/.env" ]; then
  echo "ERROR: Environment file '/env/.env' not found" | tee -a $LOG_DIR/error.log
  exit 1
fi

# Export variables from .env file
echo "Loading environment variables from .env file"
set -o allexport
source /env/.env
set +o allexport

# Validate required environment variables
if [ -z "$WEBHOOK_SECRET" ]; then
  echo "ERROR: WEBHOOK_SECRET is not set in environment file" | tee -a $LOG_DIR/error.log
  exit 1
fi

# Setup healthcheck endpoint and webhook directory
mkdir -p /tmp/webhook
echo '{"status":"ok"}' > /tmp/webhook/healthz
cd /tmp/webhook

# Check Docker availability
if ! docker info >/dev/null 2>&1; then
  echo "WARNING: Docker daemon not accessible. The webhook may not be able to execute the deploy script." | tee -a $LOG_DIR/error.log
  # Not exiting here to allow the webhook to start regardless
fi

# Process template and create webhook configuration
echo "Configuring webhook with template"
envsubst < /webhook.template.json > /tmp/webhook/hooks.json

# Display webhook configuration (with secrets redacted)
cat /tmp/webhook/hooks.json | sed 's/"secret": "[^"]*"/"secret": "***REDACTED***"/g' | tee -a $LOG_DIR/startup.log

# Test webhook configuration
echo "Testing webhook configuration"
if ! webhook -hooks /tmp/webhook/hooks.json -test; then
  echo "WARNING: Webhook configuration test failed. Proceeding anyway." | tee -a $LOG_DIR/error.log
fi

# Make deploy script executable (just to be sure)
chmod +x /deploy.sh

# Start webhook server
echo "Starting webhook server on port 9000"
exec webhook \
  -verbose \
  -hooks /tmp/webhook/hooks.json \
  -hotreload \
  -port 9000 \
  -ip "0.0.0.0" \
  -urlprefix webhook \
  -secure-urlprefix webhook \
  -http-methods GET,POST \
  -template \
  -header Content-Type=application/json
