from fastapi import FastAPI, File, UploadFile
import pickle
import pandas as pd
from contextlib import asynccontextmanager
from hand_detector import HandPointsDetector
import mlflow
from mlflow.models import infer_signature
from mlflow.exceptions import MlflowException
import time


MLFLOW_EXPERIMENT_NAME = "Sign Language Classificator"
DETECTOR = HandPointsDetector(min_detection_confidence=0.3, static_image_mode=True)
## mlflow connection
MLFLOW_AVAILABLE = True
try:
    mlflow.set_tracking_uri(uri="http://impostor-mlflow:8888")
    mlflow.set_experiment(MLFLOW_EXPERIMENT_NAME)
    print(f"Connected to MLFlow, experiment: {MLFLOW_EXPERIMENT_NAME}")
except Exception as e:
    MLFLOW_AVAILABLE = False
    print(f"Error, no connection to MLFlow on port 8888. Error: {e}")


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

    x_expanded = pd.DataFrame([x], columns=[f'x_{i}' for i in range(len(x))])
    y_expanded = pd.DataFrame([y], columns=[f'y_{i}' for i in range(len(y))])
    df = pd.concat([x_expanded, y_expanded], axis=1)
    return df

@app.post("/predict")
async def predict(file: UploadFile = File(...), label:str = ""):
    img_bytes = await file.read()
    
    if MLFLOW_AVAILABLE:
        run = mlflow.start_run()
        run_id = run.info.run_id

    df = detect_points(img_bytes)
        
    if df.empty:
        if MLFLOW_AVAILABLE:
            log_mlflow(run_id=run_id, df = df, model = model, pred_time=0, prediction = "")
        return {"message": "Hand not detected properly"}

    init = time.time()
    prediction = model.predict(df)
    end = time.time()

    if MLFLOW_AVAILABLE:
        log_mlflow(run_id=run_id, df = df, model = model, pred_time=end - init, prediction = prediction)

    return {"prediction": prediction[0]}
    

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
    with open("inputs.txt", "w") as f:
        f.write(str(df))
    mlflow.log_artifact("inputs.txt")
    
    mlflow.log_metric("prediction time", pred_time)

    
    with open("outputs.txt", "w") as f:
        f.write(str(prediction[0]))
    mlflow.log_artifact("outputs.txt")
    if run_id is not None:
        try:
            mlflow.end_run()
        except MlflowException as e:
            print(f"Error al finalizar el run de MLflow: {e}")
