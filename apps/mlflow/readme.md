# About

Package to deploy a MLflow server.

## Running the Server

### Production

Use the docker-compose file in the root of the project to run the model in production mode.

### Development

1. Make an virtual environment:

   Should be at the root of the project.

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Install the dependencies:

   Inside the `apps/mlflow` directory:

   ```bash
   pip install -e .
   ```

3. Run the server:

   Inside the `apps/mlflow` directory:

   ```bash
   mlflow server --host 0.0.0.0 --port 8888
   ```
