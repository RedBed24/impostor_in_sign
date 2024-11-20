from fastapi import FastAPI, File, UploadFile
import pickle
import pandas as pd
from contextlib import asynccontextmanager
from apps.hand_detector.src.hand_detector import HandPointsDetector

DETECTOR = HandPointsDetector(min_detection_confidence=0.3, static_image_mode=True)


# executed only when the server is initialized
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model when the server starts and delete it when the server stops"""
    global model
    model = pickle.load(open("random_forest_model.pkl", "rb"))
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

@app.get("/predict")
async def predict(file: UploadFile = File(...)):
    """¿que en predict le mandemos una imagen, la procese y nos devuelva la letra que es?"""
    img_bytes = await file.read()
    df = detect_points(img_bytes)
    if df.empty:
        return {"message": "Hand not detected properly"}
    
    prediction = model.predict(df)
    return {"prediction": prediction[0]}
