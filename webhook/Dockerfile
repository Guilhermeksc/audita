FROM alpine:3.18

# Install required packages
RUN apk add --no-cache \
    curl \
    bash \
    git \
    coreutils \
    docker \
    docker-cli-compose \
    jq \
    gettext \
    tzdata \
    ca-certificates \
    wget \
    sudo

# Install webhook (release 2.8.1 or check for the latest)
RUN wget -O webhook.tar.gz https://github.com/adnanh/webhook/releases/download/2.8.1/webhook-linux-amd64.tar.gz && \
    tar -xzf webhook.tar.gz --strip-components=1 -C /usr/local/bin webhook-linux-amd64/webhook && \
    rm webhook.tar.gz && \
    chmod +x /usr/local/bin/webhook

# Set timezone
ENV TZ=America/Sao_Paulo

# Create directories
RUN mkdir -p /var/www/html /var/log/webhook /tmp/webhook && \
    echo '{"status":"ok"}' > /var/www/html/healthz && \
    echo '{"status":"ok"}' > /tmp/webhook/healthz

# Copy configuration files
COPY webhook.template.json /webhook.template.json
COPY entrypoint.sh /entrypoint.sh
COPY deploy.sh /deploy.sh

# Setup permissions
RUN chmod +x /entrypoint.sh /deploy.sh && \
    # Create webhook user (docker group already exists in Alpine with docker package)
    adduser -S webhook && \
    adduser webhook docker && \
    # Allow webhook user to run docker commands and deploy script
    echo "webhook ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose, /deploy.sh" > /etc/sudoers.d/webhook && \
    chmod 0440 /etc/sudoers.d/webhook && \
    # Set proper ownership
    chown -R webhook:docker /var/www/html /var/log/webhook /tmp/webhook

# Expose webhook port
EXPOSE 9000

# Set working directory
WORKDIR /home/webhook

# Define healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:9000/healthz || exit 1

# Run entrypoint script
ENTRYPOINT ["/entrypoint.sh"] 