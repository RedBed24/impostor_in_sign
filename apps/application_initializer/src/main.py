"""Script to process the dataset and upload it to the database."""

import pickle
from time import time
import os
from dotenv import load_dotenv
import string
import pandas as pd
import logging
from hashlib import md5
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from scipy.stats import randint
from sklearn.metrics import accuracy_score

from hand_detector.src.hand_detector import HandPointsDetector
from db_connector.src.db_connector import MongoDBConnector

load_dotenv()
logging.basicConfig(level=logging.INFO)
DETECTOR = HandPointsDetector(min_detection_confidence=0.3, static_image_mode=True)
PICKLES_FOLDER = "pickles"


def upload_to_database(df: pd.DataFrame) -> None:
    """Upload the processed data to the database.
    :param df: DataFrame with the processed images."""
    db = MongoDBConnector().get_db()
    
    raw_images_collection = db["raw_images"] # Create collection
    count = raw_images_collection.find_one() # Check if the collection is empty
    if count is None:
        stats = raw_images_collection.insert_many(df.to_dict('records'))
        logging.info(f"Uploaded {len(stats.inserted_ids)} images to the database")
    logging.info("Database created")

def process_row(row) -> pd.DataFrame:
    """Process the image and return the points or an empty DataFrame if no hand is detected.
    The DataFrame contains the x and y coordinates of the 21 hand points, id and label.

    :param row: row of the DataFrame with the image data.
    :return: DataFrame with the points or an empty DataFrame if no hand is detected.
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
    """Create points from the images and drop the empty ones.
    
    :param df_images: DataFrame with the raw images.
    :return: DataFrame with the processed points.
    """
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
    
    with open(PICKLES_FOLDER + "processed_points_data.pkl", "wb") as f:
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

    :return: DataFrame with the dataset.
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

    with open(PICKLES_FOLDER+ "raw_data.pkl", "wb") as f:
        pickle.dump(df, f)

    logging.info("Saved the raw data")
    return df

def train_evaluate(model, X, y):
    """Train the model and evaluate it on the test set.
    Returns the accuracy and the best model found.

    :param model: model to train
    :param X: features
    :param y: target
    :return: accuracy and best model
    """

    logging.info("Training the model")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)

    # Hyperparameter search
    param_dist_random = {
        'n_estimators': randint(50, 200),
        'max_depth': [None, 5, 10, 15, 20, 30],
        'min_samples_split': randint(2, 8),
        'min_samples_leaf': randint(1, 5)
    }
    random_search = RandomizedSearchCV(estimator=model, param_distributions=param_dist_random,
                                    n_iter=50, cv=5, n_jobs=-1, verbose=2, scoring='f1_macro', refit=True)
    # Fit the Random Search model
    random_search.fit(X_train, y_train)
    best_model = random_search.best_estimator_
    logging.info("Finished training the model")

    # Evaluate on the test set
    y_pred = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    logging.info(f"Accuracy on test set: {accuracy}")
    return accuracy, best_model


def create_model(dataset: pd.DataFrame, target_str: str = 'label') -> None:
    """Creates a Random Forest Classifier model, trains it and if the accuracy is above 0.5, saves it.
    
    :param dataset: DataFrame with the processed points.
    :param target_str: target column name.
    """
    model =  RandomForestClassifier(class_weight='balanced')
    X = dataset.drop(columns=[target_str], axis=1)
    accuracy = 0
    while accuracy < 0.5:
        accuracy, best_model = train_evaluate(model, X, dataset[target_str])
    
    with open(PICKLES_FOLDER + "random_forest_model.pkl", "wb") as f:
        pickle.dump(best_model, f)
    logging.info("Model saved")


def main():
    if os.path.exists(PICKLES_FOLDER + "raw_data.pkl"):
        with open(PICKLES_FOLDER + "raw_data.pkl", "rb") as f:
            df_raw = pickle.load(f)
    else:
        df_raw = download_dataset() # Download the dataset if it doesn't exist
    df_raw.dropna(inplace=True)

    if os.path.exists(PICKLES_FOLDER + "processed_points_data.pkl"):
        with open(PICKLES_FOLDER + "processed_points_data.pkl", "rb") as f:
            df_points = pickle.load(f)
    else:
        df_points = process_raw_images(df_raw) # Process the images if they don't exist

    # Filter the original dataset with the processed points
    df_processed = df_raw.loc[df_raw['_id'].isin(df_points['id'])]
    with open(PICKLES_FOLDER + "processed_data.pkl", "wb") as f:
        pickle.dump(df_processed, f)
    
    upload_to_database(df_processed)
    
    # If the model doesn't exist, create it
    if not os.path.exists(PICKLES_FOLDER + "random_forest_model.pkl"):
        df_points.set_index('id', inplace=True)
        create_model(df_points)

if __name__ == "__main__":
    main()