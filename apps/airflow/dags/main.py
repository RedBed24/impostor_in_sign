from airflow import DAG
from airflow.operators.empty import EmptyOperator
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from airflow.models.baseoperator import BaseOperator
from airflow.operators.email import EmailOperator
import logging
import requests
import os
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
API_URL = os.getenv("API_URL")

class APIOperator(BaseOperator):
    def __init__(self, api_url:str , **kwargs):
        super().__init__(**kwargs)
        self.api_url = api_url

    def execute(self, context):
        logging.info(f"Calling API: {self.api_url} for label real_")
        response = requests.get(self.api_url)
        logging.info(response.json())


default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
    "start_date": datetime(year=2024, month=12, day=15),
}

dag = DAG(
    dag_id="check_images",
    default_args=default_args,
    schedule_interval='@daily',  
    catchup=False,  
)
init = EmptyOperator(task_id="init", dag=dag)
end = EmptyOperator(task_id="end", dag=dag)

date = BashOperator(task_id="print_date", dag = dag, bash_command="date")

get_images = APIOperator(task_id="get_images", dag=dag, api_url=API_URL+"/api/img/label/real_")

init >> date >> get_images  >> end
