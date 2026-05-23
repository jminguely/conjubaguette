from functools import lru_cache
import json
from pathlib import Path

from flask import Flask, request, jsonify
from asgiref.wsgi import WsgiToAsgi
from mlconjug3 import Conjugator

app = Flask(__name__)

# Wrap the Flask app with WsgiToAsgi
asgi_app = WsgiToAsgi(app)

SUPPORTED_LANGUAGES = {"fr", "es"}
VERB_DIFFICULTY_PATH = Path(__file__).resolve().parents[1] / "app" / "src" / "assets" / "data" / "verbDifficulty.json"

with VERB_DIFFICULTY_PATH.open(encoding="utf-8") as difficulty_file:
    VERB_DIFFICULTY = json.load(difficulty_file)


def error_response(message, status_code, details=None):
    payload = {"error": message}
    if details:
        payload["details"] = details
    return jsonify(payload), status_code


@lru_cache(maxsize=len(SUPPORTED_LANGUAGES))
def get_conjugator(lang):
    return Conjugator(language=lang, model=None)


def get_verb_difficulty(lang, infinitive):
    for level in ("hard", "medium"):
        for entry in VERB_DIFFICULTY.get(level, []):
            if entry.get(lang) == infinitive:
                return level

    return "easy"


def get_conjugation_forms(conjugated_verb, lang, infinitive, mood, name):
    if mood not in conjugated_verb.conjug_info:
        return None

    mood_block = conjugated_verb.conjug_info[mood]
    if name not in mood_block:
        return None

    forms = mood_block[name]

    # mlconjug3 may return imperative as {'': '...'} in some environments.
    # Build practical imperative person forms from other moods.
    if isinstance(forms, dict) and set(forms.keys()) <= {""}:
        if lang == "es" and mood == "Imperativo" and name.startswith("Imperativo"):
            return build_spanish_imperative_fallback(conjugated_verb, infinitive)
        if lang == "fr" and mood == "Imperatif" and name == "Imperatif Présent":
            return build_french_imperative_fallback(conjugated_verb, infinitive)

    return forms


def build_spanish_imperative_fallback(conjugated_verb, infinitive):
    indicative = conjugated_verb.conjug_info.get("Indicativo", {}).get("Indicativo presente", {})
    subjunctive = conjugated_verb.conjug_info.get("Subjuntivo", {}).get("Subjuntivo presente", {})

    fallback = {}

    irregular_tu = {
        "decir": "di",
        "hacer": "haz",
        "ir": "ve",
        "poner": "pon",
        "salir": "sal",
        "ser": "sé",
        "tener": "ten",
        "venir": "ven",
    }

    if infinitive in irregular_tu:
        fallback["2s"] = irregular_tu[infinitive]
    elif indicative.get("3s"):
        fallback["2s"] = indicative["3s"]

    if subjunctive.get("3s"):
        fallback["3s"] = subjunctive["3s"]
    if subjunctive.get("1p"):
        fallback["1p"] = subjunctive["1p"]
    if subjunctive.get("3p"):
        fallback["3p"] = subjunctive["3p"]

    if infinitive.endswith("ar"):
        fallback["2p"] = f"{infinitive[:-2]}ad"
    elif infinitive.endswith("er"):
        fallback["2p"] = f"{infinitive[:-2]}ed"
    elif infinitive.endswith("ir"):
        fallback["2p"] = f"{infinitive[:-2]}id"

    return fallback


def build_french_imperative_fallback(conjugated_verb, infinitive):
    indicative = conjugated_verb.conjug_info.get("Indicatif", {}).get("Présent", {})

    fallback = {}

    irregular = {
        "être": {"2s": "sois", "1p": "soyons", "2p": "soyez"},
        "avoir": {"2s": "aie", "1p": "ayons", "2p": "ayez"},
        "savoir": {"2s": "sache", "1p": "sachons", "2p": "sachez"},
        "vouloir": {"2s": "veuille", "1p": "veuillons", "2p": "veuillez"},
    }

    if infinitive in irregular:
        return irregular[infinitive]

    tu_present = indicative.get("2s") or indicative.get("tu")
    if tu_present:
        tu_form = tu_present
        # Regular -er imperative drops the trailing 's' (except special liaison cases).
        if infinitive.endswith("er") and tu_form.endswith("s"):
            tu_form = tu_form[:-1]
        fallback["2s"] = tu_form

    nous_present = indicative.get("1p") or indicative.get("nous")
    if nous_present:
        fallback["1p"] = nous_present

    vous_present = indicative.get("2p") or indicative.get("vous")
    if vous_present:
        fallback["2p"] = vous_present

    return fallback


def validate_conjugation_request(lang):
    if lang not in SUPPORTED_LANGUAGES:
        return None, error_response(
            "Unsupported language",
            400,
            {"supportedLanguages": sorted(SUPPORTED_LANGUAGES)},
        )

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return None, error_response("Expected a JSON object body", 400)

    tenses = data.get("tenses")
    if not isinstance(tenses, dict) or not tenses:
        return None, error_response("Expected a non-empty tenses object", 400)

    invalid_tenses = []
    for tense_key, tense_value in tenses.items():
        if not isinstance(tense_value, dict) or not tense_value.get("mood") or not tense_value.get("name"):
            invalid_tenses.append(tense_key)

    if invalid_tenses:
        return None, error_response(
            "Invalid tense payload",
            400,
            {"invalidTenses": invalid_tenses},
        )

    return tenses, None


@app.post('/conjugate/<lang>/<verb>')
def conjugate(lang, verb):
    tenses, validation_error = validate_conjugation_request(lang)
    if validation_error:
        return validation_error

    try:
        conjugated_verb = get_conjugator(lang).conjugate(verb)
    except Exception as exc:
        return error_response(
            "Unable to conjugate verb",
            422,
            {"verb": verb, "language": lang, "reason": str(exc)},
        )

    infinitive = conjugated_verb.verb_info.infinitive
    template = conjugated_verb.verb_info.template
    root = conjugated_verb.verb_info.root

    response = {
        "verb": {
            "infinitive": infinitive,
            "template": template,
            "root": root,
            "difficulty": get_verb_difficulty(lang, infinitive),
        },
        "conjugation": {},
        "availability": {}
    }

    missing_tenses = []
    for tense_key, tense_value in tenses.items():
        mood = tense_value["mood"]
        name = tense_value["name"]
        available_forms = get_conjugation_forms(conjugated_verb, lang, infinitive, mood, name)

        if available_forms:
            response["conjugation"][tense_key] = available_forms
            response["availability"][tense_key] = sorted(available_forms.keys())
        else:
            missing_tenses.append(tense_key)

    if missing_tenses:
        response["missingTenses"] = missing_tenses

    return jsonify(response)

@app.get('/health')
def health():
    return jsonify({"status": "ok"})

# Ensure the ASGI app is exposed
if __name__ == "__main__":
    import uvicorn
    import os
    ip = os.getenv('IP', '::')
    port = int(os.getenv('PORT', 8115))

    uvicorn.run(asgi_app, host=ip, port=port, lifespan="off")
