# About

This is the REST API for the project.

## Running the API

### Production

Use the docker-compose file in the root of the project to run the API in production mode.

### Development

1. Make an virtual environment:

   Should be at the root of the project.

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Install the dependencies:

   Inside the `apps/db_connector` directory:

   ```bash
   pip install -e .
   ```

   Inside the `apps/api` directory:

   ```bash
   pip install -e .
   ```

3. Set the environment variables:

   ```bash
   export MONGO_DB_URL="mongodb://localhost:27017"
   export MONGO_INITDB_ROOT_USERNAME="example"
   export MONGO_INITDB_ROOT_PASSWORD="example"
   ```

4. Have a running instance of the database:

    ```bash
    docker run --name mongodb -p 27017:27017 -d mongo:8.0.3
    ```

5. Run the API:

   Inside the `apps/api` directory:

   ```bash
   fastapi dev --no-reload src/main.py
   ```
