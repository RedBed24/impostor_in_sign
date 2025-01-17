import time
import pickle
import pandas as pd
from fastapi import FastAPI, File, UploadFile, BackgroundTasks, background
from contextlib import asynccontextmanager
from hand_detector import HandPointsDetector
from db_connector import MongoDBConnector
import mlflow
from mlflow.models import infer_signature
from mlflow.exceptions import MlflowException
from hashlib import md5
import logging
import os

logging.basicConfig(level=logging.INFO)
MLFLOW_EXPERIMENT_NAME = "Sign Language Classificator"
DETECTOR = HandPointsDetector(min_detection_confidence=0.3, static_image_mode=True)
## mlflow connection
MLFLOW_AVAILABLE = True
try:
    mlflow_tracking_uri = os.getenv("MLFLOW_TRACKING_URI")
    if mlflow_tracking_uri:
        mlflow.set_tracking_uri(uri=mlflow_tracking_uri)
    else:
        raise ValueError("MLFLOW_TRACKING_URI environment variable is not set")
    mlflow.set_experiment(MLFLOW_EXPERIMENT_NAME)
    logging.info(f"=========Connected to MLFlow, experiment: {MLFLOW_EXPERIMENT_NAME}")
except Exception as e:
    MLFLOW_AVAILABLE = False
    logging.error(f"=========Error, no connection to MLFlow on port 8888. Error: {e}")


# executed only when the server is initialized
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model when the server starts and delete it when the server stops"""
    global model
    model = pickle.load(open("/shared-data/pickles/random_forest_model.pkl", "rb"))
    yield # pause method execution
    del model

app = FastAPI(title="Sign Language Classificator", lifespan=lifespan)

@app.get("/iamalive")
async def iamalive():
    return {"message": True}

def detect_points(img_bytes: bytes) -> pd.DataFrame:
    points = DETECTOR.process_image(img_bytes)
    if points is None:
        return pd.DataFrame()

    x, y = points
    if len(x) != 21 or len(y) != 21:
        return pd.DataFrame()

    columns = [f'{axis}_{i}' for axis in ('x', 'y') for i in range(21)]
    data = x + y
    df = pd.DataFrame([data], columns=columns)
    return df

@app.post("/predict")
async def predict(background_tasks: BackgroundTasks, file: UploadFile = File(...), label:str = ""):
    img_bytes = await file.read()

    df = detect_points(img_bytes)
    if df.empty:
        return {"message": "Hand not detected properly"}

    if MLFLOW_AVAILABLE:
        run = mlflow.start_run(nested=True)
        run_id = run.info.run_id
        logging.info(f"=========Run ID: {run_id}")

    init = time.time()
    prediction = model.predict(df)
    end = time.time()

    if MLFLOW_AVAILABLE:
        background_tasks.add_task(log_mlflow, run_id=run_id, df = df, model = model, pred_time=end - init, prediction = prediction)
        background_tasks.add_task(send_to_db, df, prediction, label, img_bytes)
        
    if not MLFLOW_AVAILABLE:
        logging.info(f"=========Prediction: {prediction[0]}, Time: {end - init}")
    return {"prediction": prediction[0]}
    
def send_to_db(df: pd.DataFrame, prediction: str, label: str, img_bytes: bytes) -> None:
    """ Send the image to the database """
    if prediction[0] != label:
        db = MongoDBConnector().get_db()
        real_images = db["raw_images"] 
        real_images.insert_one({"_id": md5(img_bytes).hexdigest(), "image.bytes": img_bytes, 
                                "label": f"real_{label}", "prediction": prediction[0]})
        logging.info(f"=========Image inserted in the database")    

def log_mlflow(run_id, df: pd.DataFrame, model, pred_time:float, prediction) -> None:
    """ Log the model and the input data to MLFlow """

    mlflow.log_param("dataframe size", df.size)
    mlflow.log_params(model.get_params())
    mlflow.set_tag("Objective", "Sign Language Classification")
    signature = infer_signature(df, model.predict(df))
    mlflow.sklearn.log_model(
        sk_model=model,
        artifact_path="model",
        signature=signature,
        input_example=df,
        registered_model_name="SignLanguageModel",
    )
    d = {str(k): v for k, v in df.to_dict().items()}
    mlflow.log_dict(d, "input_data.json")
    mlflow.log_dict({"prediction": prediction[0]}, "output_data.json")

    mlflow.log_metric("prediction time", pred_time)
    
    if run_id is not None:
        try:
            mlflow.end_run()
            logging.info(f"=========Run {run_id} finalizado")
        except MlflowException as e:
            logging.error(f"Error al finalizar el run de MLflow: {e}")
