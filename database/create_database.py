"""Script to process the dataset and upload it to the database."""

import pickle
from time import time
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import string
import pandas as pd
import logging
from hashlib import md5

from utils.hand_points_detection import HandPointsDetector


logging.basicConfig(level=logging.INFO)
DETECTOR = HandPointsDetector(min_detection_confidence=0.3, static_image_mode=True)

def upload_to_database():
    load_dotenv()
    USERNAME = os.getenv('MONGO_INITDB_ROOT_USERNAME')
    PASSWORD = os.getenv('MONGO_INITDB_ROOT_PASSWORD')

    if not USERNAME or not PASSWORD:
        logging.error("Please set the environment variables MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD")
        return
    
    logging.info("Connecting to the database")
    client = MongoClient("mongodb://localhost:27017/", username = USERNAME, password=PASSWORD) 
    db = client["impostor_sign"] #schema

    # Create collection
    raw_images_collection = db["raw_images"]
    raw_images_collection.drop() #si existe la borra
    count = raw_images_collection.count_documents({})
    logging.info(f"Documents in the collection: {count}")

def process_row(row) -> pd.DataFrame:
    """Process the image and return the points or an empty DataFrame if no hand is detected.
    The DataFrame contains the x and y coordinates of the 21 hand points, id and label.
    """
    points = DETECTOR.process_image(row['image.bytes'])
    if points is None:
        return pd.DataFrame()

    x, y = points
    if len(x) != 21 or len(y) != 21:
        return pd.DataFrame()

    x_expanded = pd.DataFrame([x], columns=[f'x_{i}' for i in range(len(x))])
    y_expanded = pd.DataFrame([y], columns=[f'y_{i}' for i in range(len(y))])
    df = pd.concat([x_expanded, y_expanded], axis=1)
    df['label'] = row['label']
    df['id'] = row['_id']
    return df


def process_raw_images(df_images: pd.DataFrame) -> pd.DataFrame:
    """Create points from the images and drop the empty ones."""
    results = []
    for i in range(0, len(df_images), 1000): # Process the images in batches of 1000
        init = time()
        batch = df_images.iloc[i:i+1000]
        batch_results = [process_row(row) for row in batch.to_dict('records')]
        # if the result is empty, it will be dropped
        valid_batch_results = [res for res in batch_results if not res.empty]
        results.append(pd.concat(valid_batch_results, ignore_index=True))
        logging.info(f"Processed {len(valid_batch_results)} images in {time()-init} seconds")
    
    df = pd.concat(results, ignore_index=True)
    
    with open("processed_points_data.pkl", "wb") as f:
        pickle.dump(df, f)
    logging.info("Saved the processed data")
    return df


def download_dataset() -> pd.DataFrame:
    """Downloads the dataset and saves it as a pickle file.
        Structure of the dataset:
        - _id: md5 hash of the image
        - image.bytes: bytes of the image
        - image.path: name of the image
        - label: letter of the alphabet
    """
    init = time()
    logging.info("Downloading the dataset")
    df = pd.read_parquet("hf://datasets/Marxulia/asl_sign_languages_alphabets_v03/data/train-00000-of-00001.parquet")
    logging.info(f"Dataset downloaded in {time()-init:.2f} seconds")

    df['_id'] = df['image.bytes'].apply(lambda x: md5(x).hexdigest())
    # Create a mapping from numbers to letters
    label_mapping = {i: letter for i, letter in enumerate(string.ascii_uppercase)}

    df['label'] = df['label'].astype(int)
    df['label'] = df['label'].map(label_mapping)

    with open("raw_data.pkl", "wb") as f:
        pickle.dump(df, f)

    logging.info("Saved the raw data")
    return df

def main():
    if os.path.exists("raw_data.pkl"):
        with open("raw_data.pkl", "rb") as f:
            df_raw = pickle.load(f)
    else:
        df_raw = download_dataset() # Download the dataset if it doesn't exist
    df_raw.dropna(inplace=True)

    if os.path.exists("processed_points_data.pkl"):
        with open("processed_points_data.pkl", "rb") as f:
            df_points = pickle.load(f)
    else:
        df_points = process_raw_images(df_raw) # Process the images if they don't exist


if __name__ == "__main__":
    main()