# About

This is the online inference model for the project.

## Running the Model

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

   Inside the `apps/inference_model` directory:

   ```bash
   pip install -e .
   ```

   Inside the `apps/hand_detector` directory:

   ```bash
   pip install -e .
   ```

3. Run the API:

   Inside the `apps/inference_model` directory:

   ```bash
   fastapi dev --no-reload src/main.py
   ```
