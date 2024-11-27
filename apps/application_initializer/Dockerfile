FROM python:3.12-slim

# Install dependencies for cv2
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /apps/application_initializer
COPY application_initializer /apps/application_initializer

# Copy the db_connector package to the container
COPY db_connector /apps/db_connector
RUN pip install /apps/db_connector

# Copy the db_connector package to the container
COPY hand_detector /apps/hand_detector
RUN pip install /apps/hand_detector

# Install the dependencies
RUN pip install .

# Expose the port FastAPI is running on
EXPOSE 8000

# Command to run the FastAPI application
CMD ["python3", "src/main.py"]
