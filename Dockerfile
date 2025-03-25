# Usar a imagem base do Airflow com Python 3.11
FROM apache/airflow:2.8.1-python3.11

USER root

# Instalar Python 3.13.2 (para Django)
RUN apt-get update && apt-get install -y \
    python3.13 \
    python3.13-venv \
    python3.13-dev \
    python3-pip

RUN python3.13 -m pip install --upgrade pip

RUN python3.13 -m venv /opt/django-venv

# Instalar Django e dependências do projeto no virtualenv do Django
ENV PATH="/opt/django-venv/bin:${PATH}"
RUN pip install django==5.1.7
COPY backend/django/requirements.txt /opt/django/requirements.txt
RUN pip install -r /opt/django/requirements.txt

# Restaurar o PATH para o ambiente do Airflow (Python 3.11)
ENV PATH="/opt/airflow/venv/bin:${PATH}"
COPY backend/airflow/requirements.txt /opt/airflow/requirements.txt
RUN pip install -r /opt/airflow/requirements.txt

# Instalar Chrome, JQ e outras dependências
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    jq \
    curl \
    gnupg \
    ca-certificates \
    apt-transport-https \
    lsb-release \
    fonts-liberation \
    libu2f-udev \
    xdg-utils && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && apt-get install -y google-chrome-stable

# Copiar os códigos das aplicações
COPY backend/airflow /opt/airflow/airflow
COPY backend/django /opt/django

# Instalar o supervisor para gerenciar os processos
RUN apt-get install -y supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Mudar para o usuário do Airflow para instalar o Selenium e o Chromedriver
USER airflow

# Instalar selenium e chromedriver compatível com o Chrome instalado
RUN pip install --no-cache-dir selenium && \
    CHROME_VERSION=$(google-chrome-stable --version | grep -oP '\d+\.\d+\.\d+') && \
    CHROMEDRIVER_URL=$(curl -s "https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json" \
        | jq -r --arg ver "$CHROME_VERSION" '.channels.Stable.downloads.chromedriver[] | select(.platform == "linux64") | .url') && \
    wget -O /tmp/chromedriver.zip "$CHROMEDRIVER_URL" && \
    unzip /tmp/chromedriver.zip -d /tmp/ && \
    mv /tmp/chromedriver-linux64/chromedriver /home/airflow/.local/bin/chromedriver && \
    chmod +x /home/airflow/.local/bin/chromedriver && \
    rm -rf /tmp/chromedriver.zip /tmp/chromedriver-linux64

CMD ["/usr/bin/supervisord", "-n"]