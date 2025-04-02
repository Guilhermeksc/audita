FROM apache/airflow:2.9.5-python3.12

ENV AIRFLOW_HOME=/opt/airflow

USER root
RUN apt-get update && apt-get install -y gcc g++ libpq-dev curl && apt-get clean

USER airflow
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt
