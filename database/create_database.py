import pickle
from time import time
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import string
import pandas as pd
import logging
from hashlib import md5


logging.basicConfig(level=logging.INFO)

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
    # Delete collection

def download_dataset() -> pd.DataFrame:
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



if __name__ == "__main__":
    main()