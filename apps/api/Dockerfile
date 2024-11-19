FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /apps/api
COPY api /apps/api

# Copy the db_connector package to the container
COPY db_connector /apps/db_connector
RUN pip install /apps/db_connector

# Install the dependencies
RUN pip install .

# Expose the port FastAPI is running on
EXPOSE 8000

# Command to run the FastAPI application
CMD ["fastapi", "run", "src/main.py"]
