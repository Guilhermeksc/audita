from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime


def ola_mundo():
    print("✅ Olá, mundo! DAG executada com sucesso.")


with DAG(
    dag_id="hello_world_dag",
    start_date=datetime(2024, 1, 1),
    schedule_interval=None,
    catchup=False,
    tags=["teste"],
) as dag:
    tarefa = PythonOperator(
        task_id="exibir_mensagem",
        python_callable=ola_mundo
    )
