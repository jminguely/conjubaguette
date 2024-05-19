# VerboLoco!

## API

This is a simple Flask API that uses the verbecc library to conjugate French verbs. The API is hosted on a local server and can be accessed through a specific endpoint.

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### API Installation

You need to have Python installed on your machine.

1. Navigate into the project directory:
   `cd api`

2. Install the required Python packages:
   `pip install`

   `python3 -m venv venv`

   `. venv/bin/activate`

3. Running the Application
   To run the application, use the following command in the terminal:

`python -m uvicorn app:app --reloady`

The application will start running on http://0.0.0.0:8080.

### API Usage

The API has one endpoint, /conjugate/<verb>, which returns the conjugation of the given French verb.

Example:

`GET http://0.0.0.0:8080/conjugate/fr/manger`

### Deployment

Add additional notes about how to deploy this on a live system.

### Built With

Flask - The web framework used
verbecc - Library for conjugating French verbs
Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

### License

This project is licensed under the MIT License - see the LICENSE.md file for details

### Acknowledgments

Hat tip to anyone whose code was used
Inspiration
etc
