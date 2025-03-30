# 🚀 Deploy automatizado com Webhook + Docker

Este projeto está configurado para realizar **deploy automático** no servidor Hostinger ao receber um **push no GitHub**, utilizando Docker + webhook.

---

## ✅ Fluxo de Deploy

1. Você faz um `git push` para a branch principal (ex: `main`)
2. O GitHub envia um evento `push` para o endpoint `/webhook/` do servidor
3. O container `webhook` executa o script `/deploy.sh`
4. O script:
   - Atualiza o repositório local (via `git pull`)
   - Reconstrói os containers (`docker-compose up -d --build`)
   - Executa `migrate` e `collectstatic`
   - Reinicia os serviços

---

## ⚙️ Configuração do Webhook no GitHub

1. Vá em: `Settings > Webhooks > Add Webhook`
2. Preencha:
   - **Payload URL**: `https://auditapro.com.br/webhook/`
   - **Content type**: `application/json`
   - **Secret**: *(mesma usada no `webhook.json`)*
3. Marque:
   - [x] Just the `push` event
4. Clique em **Add webhook**

---

## 📁 Estrutura dos arquivos relevantes

```
audita/
├── scripts/
│   └── deploy.sh             # Script de deploy automatizado
├── webhook/
│   └── Dockerfile            # Build local do serviço webhook
├── webhook.json              # Configuração de gatilhos
├── docker-compose.yml        # Serviço webhook incluído
```

---

## 🔐 `webhook.json`

```json
[
  {
    "id": "deploy",
    "execute-command": "/deploy.sh",
    "command-working-directory": "/",
    "response-message": "Deploy iniciado.",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha1",
        "secret": "SUA_CHAVE_SECRETA_AQUI",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
```

> Substitua `"SUA_CHAVE_SECRETA_AQUI"` pela mesma usada no webhook do GitHub.

---

## 🛠️ Permissões

Dê permissão de execução ao script:

```bash
chmod +x ./scripts/deploy.sh
```

---

## 🐳 docker-compose.yml (trecho)

```yaml
  webhook:
    build: ./webhook
    container_name: webhook
    volumes:
      - ./webhook.json:/etc/webhook.json:ro
      - ./scripts/deploy.sh:/deploy.sh:ro
    ports:
      - "9000:9000"
    networks:
      - audita-net
```

---

## 🧪 Teste

1. Faça um `git push` no repositório remoto
2. Acompanhe os logs:
   ```bash
   docker logs -f webhook
   ```
3. Verifique se o sistema atualizou e o site responde normalmente:
   ```bash
   curl -I https://auditapro.com.br
   ```

---

## 🧩 Alias útil

Adicione ao seu `~/.bashrc`:

```bash
alias webhook-log='docker logs -f webhook'
```

---

## 📌 Requisitos

- Docker e docker-compose instalados
- Git instalado no servidor
- DNS configurado para `auditapro.com.br`
- Certificado SSL via Let's Encrypt já ativo

---

## 👤 Manutenção

Se precisar atualizar manualmente:

```bash
cd ~/audita
bash ./scripts/deploy.sh
```

---