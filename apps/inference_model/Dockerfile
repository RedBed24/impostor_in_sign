FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /apps/inference_model
COPY inference_model /apps/inference_model

# Copy the db_connector package to the container
COPY db_connector /apps/db_connector
RUN pip install /apps/db_connector

# Install curl
RUN apt-get update && apt-get install -y curl

# Install the dependencies
RUN pip install .

EXPOSE 8000

# Command to run the FastAPI application
CMD ["python3", "src/main.py"]
