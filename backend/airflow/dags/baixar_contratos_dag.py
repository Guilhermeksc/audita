import json
import requests
from pathlib import Path
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.python_operator import PythonOperator

def baixar_contratos():
    url = "https://contratos.comprasnet.gov.br/api/contrato/unidades"
    # O arquivo será salvo na mesma pasta do DAG; ajuste se necessário
    caminho_saida = Path(__file__).parent / "contratos_ativos_uasg.json"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        dados = response.json()
        with open(caminho_saida, "w", encoding="utf-8") as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
        print("✅ Arquivo baixado e salvo com sucesso.")
    except requests.exceptions.RequestException as e:
        print(f"💥 Erro na requisição: {e}")

default_args = {
    "owner": "airflow",
    "start_date": datetime(2023, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(minutes=5)
}

with DAG(
    dag_id="baixar_contratos_dag",
    default_args=default_args,
    schedule_interval="@daily",
    catchup=False,
    description="DAG para baixar o arquivo de contratos ativos UASG"
) as dag:

    tarefa_baixar_contratos = PythonOperator(
        task_id="baixar_contratos",
        python_callable=baixar_contratos
    )

tarefa_baixar_contratos
