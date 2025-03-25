# dags/raspar_anos_dag.py
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
from utils.raspar_in_anos import raspar_anos_disponiveis

default_args = {
    "owner": "airflow",
    "start_date": datetime(2024, 1, 1),
    "retries": 1,
}

with DAG(
    dag_id="raspar_anos_dados_in",
    default_args=default_args,
    schedule=None,
    catchup=False,
    tags=["in.gov.br", "selenium"],
) as dag:
    tarefa = PythonOperator(
        task_id="raspar_anos",
        python_callable=raspar_anos_disponiveis,
    )
