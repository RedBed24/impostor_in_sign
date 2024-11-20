FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /apps/application_initializer
COPY application_initializer /apps/application_initializer

# Install the dependencies
RUN pip install .

# Expose the port FastAPI is running on
EXPOSE 8000

# Command to run the FastAPI application
CMD ["fastapi", "run", "src/main.py"]
