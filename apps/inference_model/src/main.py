from fastapi import FastAPI, File, UploadFile
import pickle
import pandas as pd
from contextlib import asynccontextmanager
from hand_detector import HandPointsDetector
import mlflow
from mlflow.models import infer_signature
import time


MLFLOW_EXPERIMENT_NAME = "Sign Language Classificator"
DETECTOR = HandPointsDetector(min_detection_confidence=0.3, static_image_mode=True)
## mlflow connection
mlflow.set_tracking_uri(uri="http://impostor-mlflow:8888")
mlflow.set_experiment(MLFLOW_EXPERIMENT_NAME)

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
    with mlflow.start_run():
        df = detect_points(img_bytes)
        

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
        if df.empty:
            return {"message": "Hand not detected properly"}
        
        ##############
        init = time.time()
        prediction = model.predict(df)
        end = time.time()
        ###############
        mlflow.log_metric("prediction time", end - init)

        
        with open("outputs.txt", "w") as f:
            f.write(str(prediction[0]))
        mlflow.log_artifact("outputs.txt")

        return {"prediction": prediction[0]}
