from pymongo import MongoClient
import pickle 
import os
from dotenv import load_dotenv
import string
import pandas as pd
import pickle
import logging

logging.basicConfig(level=logging.INFO)

def main():
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

    count = raw_images_collection.count_documents({})
    logging.info(f"Documents in the collection: {count}")

    if count == 0:
        # Download the dataset
        logging.info("Downloading the dataset")
        df = pd.read_parquet("hf://datasets/Marxulia/asl_sign_languages_alphabets_v03/data/train-00000-of-00001.parquet")

        # Create a mapping from numbers to letters
        label_mapping = {i: letter for i, letter in enumerate(string.ascii_uppercase)}

        df['label'] = df['label'].astype(int)
        df['label'] = df['label'].map(label_mapping)

        data_to_insert = df.to_dict(orient="records")
        result = raw_images_collection.insert_many(data_to_insert)

        logging.info(f"Inserted {len(result.inserted_ids)} elements")


if __name__ == "__main__":
    main()