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

# Setup healthcheck endpoint
mkdir -p /tmp/webhook
echo '{"status":"ok"}' > /tmp/webhook/healthz
cd /tmp/webhook

# Create hooks directory if it doesn't exist
mkdir -p /tmp/webhook/hooks

# Process template and create webhook configuration
echo "Configuring webhook with template"
envsubst < /webhook.template.json > /tmp/webhook/hooks.json

# Display webhook configuration (with secrets redacted)
cat /tmp/webhook/hooks.json | sed 's/"secret": "[^"]*"/"secret": "***REDACTED***"/g' | tee -a $LOG_DIR/startup.log

# Start webhook server
echo "Starting webhook server on port 9000"
exec webhook \
  -verbose \
  -hooks /tmp/webhook/hooks.json \
  -hotreload \
  -port 9000 \
  -urlprefix webhook \
  -secure-urlprefix webhook \
  -http-methods POST \
  -template \
  -header Content-Type=application/json
