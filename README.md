# VerboLoco!

## API

The API is built using with python, FastAPI, and verbecc.

### Installation

You need to have Python installed on your machine.

1. Navigate into the project directory:
   `cd api`

2. Install the required Python packages:
   `pip install`

   `python3 -m venv venv`

   `. venv/bin/activate`

3. Running the Application
   To run the application, use the following command in the terminal:

`python -m uvicorn app:asgi_app --reload`

The application will start running on http://0.0.0.0:8080.

### API Usage

The API has one endpoint, /conjugate/<verb>, which returns the conjugation of the given French verb.

Example:

`GET http://0.0.0.0:8080/conjugate/fr/manger`

## APP

The app is built using vue.js and tailwindcss.

### Installation

`npm install`

### APP Usage

`npm run dev`
