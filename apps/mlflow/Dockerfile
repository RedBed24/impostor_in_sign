FROM python:3.12-slim

# Install the dependencies
RUN pip install mlflow==2.18.0

EXPOSE 8888

# Command to run the FastAPI application
CMD ["mlflow", "server", "--host", "0.0.0.0", "--port", "8888"]