from flask import Flask, jsonify, request
from verbecc import Conjugator

app = Flask(__name__)
cj = Conjugator("fr")

@app.route('/conjugate/<verb>', methods=['GET'])
def conjugate(verb):
    if not verb:
        return jsonify({'error': 'The verb parameter is required.'}), 400
    conjugation = cj.conjugate(verb)
    return jsonify(conjugation)

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=8080)
