"""Module to connect to the MongoDB database."""

import logging
import os

from pymongo import MongoClient


class MongoDBConnector:
    """Singleton class"""

    _instance = None  # Singleton instance
    _client = None  # MongoDB client

    def __new__(cls):
        """Makes sure that only one instance of the class is created."""
        if cls._instance is None:
            cls._instance = super(MongoDBConnector, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        """Initializes the MongoDB connection."""
        if not self._client:
            USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME")
            PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
            URL = os.getenv("MONGO_DB_URL")

            if not USERNAME or not PASSWORD or not URL:
                logging.error(
                    "Please set the environment variables MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD and MONGO_DB_URL"
                )
                raise ValueError(
                    "Please set the environment variables MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD and MONGO_DB_URL"
                )

            logging.info("Connecting to the database")
            self._client = MongoClient(URL, username=USERNAME, password=PASSWORD)
        self.db = self._client["impostor_sign"]

    @staticmethod
    def close_connection():
        """Closes the MongoDB connection."""
        if MongoDBConnector._client:
            logging.info("Closing the database connection")
            MongoDBConnector._client.close()
            MongoDBConnector._client = None

    @staticmethod
    def get_db() -> MongoClient:
        """Returns the database connection."""
        return MongoDBConnector().db


__all__ = ["MongoDBConnector"]
