from flask import Flask, request, jsonify
from asgiref.wsgi import WsgiToAsgi
from mlconjug3 import Conjugator

app = Flask(__name__)

asgi_app = WsgiToAsgi(app)

@app.post('/conjugate/<lang>/<verb>')
def conjugate(lang, verb):
    # Extract the JSON body from the POST request
    data = request.json
    tenses = data.get('tenses', [])  # Default to an empty list if 'tenses' is not provided

    conjugator = Conjugator(language=lang, model=None)

    # Assuming you have a function to conjugate the verb for the given tenses
    conjugated_verb = conjugator.conjugate(verb)  # This is a placeholder for your conjugation logic

    # Extracting verb information
    infinitive = conjugated_verb.verb_info.infinitive
    template = conjugated_verb.verb_info.template
    root = conjugated_verb.verb_info.root

    # Constructing the response dictionary
    response = {
        "verb": {
            "infinitive": infinitive,
            "template": template,
            "root": root,
        },
        "conjugation": {}
    }

    # Adding the requested tenses to the response
    print(tenses);
    for tense_key, tense_value in tenses.items():
        if tense_value['mood'] in conjugated_verb.conjug_info and tense_value['name'] in conjugated_verb.conjug_info[tense_value['mood']]:
            response["conjugation"][tense_key] = conjugated_verb.conjug_info[tense_value['mood']][tense_value['name']]

    return jsonify(response)

@app.get('/test')
def test():
    conjugator = Conjugator(language="fr", model=None)
    conjugated_verb = conjugator.conjugate("manger", subject='pronoun')  # This is a placeholder for your conjugation logic

    infinitive = conjugated_verb.verb_info.infinitive
    template = conjugated_verb.verb_info.template
    root = conjugated_verb.verb_info.root

    return jsonify({
      "verb": {
        "infinitive": infinitive,
        "template": template,
        "root": root,
      },
      "conjugation": conjugated_verb.conjug_info
    })
