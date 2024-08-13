from flask import Flask, request, jsonify
from asgiref.wsgi import WsgiToAsgi
from mlconjug3 import Conjugator

app = Flask(__name__)

# Wrap the Flask app with WsgiToAsgi
asgi_app = WsgiToAsgi(app)

@app.post('/conjugate/<lang>/<verb>')
def conjugate(lang, verb):
    data = request.json
    tenses = data.get('tenses', [])

    conjugator = Conjugator(language=lang, model=None)
    conjugated_verb = conjugator.conjugate(verb)

    infinitive = conjugated_verb.verb_info.infinitive
    template = conjugated_verb.verb_info.template
    root = conjugated_verb.verb_info.root

    response = {
        "verb": {
            "infinitive": infinitive,
            "template": template,
            "root": root,
        },
        "conjugation": {}
    }

    for tense_key, tense_value in tenses.items():
        if tense_value['mood'] in conjugated_verb.conjug_info and tense_value['name'] in conjugated_verb.conjug_info[tense_value['mood']]:
            response["conjugation"][tense_key] = conjugated_verb.conjug_info[tense_value['mood']][tense_value['name']]

    return jsonify(response)

@app.get('/test')
def test():
    conjugator = Conjugator(language="es", model=None)
    conjugated_verb = conjugator.conjugate("comer", subject='pronoun')

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

# Ensure the ASGI app is exposed
if __name__ == "__main__":
    import uvicorn
    import os
    ip = os.getenv('IP', '::')
    port = int(os.getenv('PORT', 8115))

    uvicorn.run(asgi_app, host=ip, port=port, lifespan="off")
