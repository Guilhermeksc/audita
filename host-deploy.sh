#!/bin/bash
echo "[HOST-DEPLOY] Iniciando deploy..." >> /var/log/deploy.log

# Executa o script dentro do container host (como root)
bash /root/audita/scripts/deploy.sh >> /var/log/deploy.log 2>&1
