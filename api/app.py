from functools import lru_cache
import json
import os
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from asgiref.wsgi import WsgiToAsgi

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "https://verbo.minguely.ch,http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

CORS(
    app,
    resources={r"/conjugate/*": {"origins": ALLOWED_ORIGINS}, r"/health": {"origins": "*"}},
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# Wrap the Flask app with WsgiToAsgi
asgi_app = WsgiToAsgi(app)

SUPPORTED_LANGUAGES = {"fr", "es"}
VERB_DIFFICULTY_PATHS = (
    Path(__file__).resolve().parent / "verbDifficulty.json",
    Path(__file__).resolve().parents[1] / "app" / "src" / "assets" / "data" / "verbDifficulty.json",
)

VERB_DIFFICULTY = {"hard": [], "medium": []}
for difficulty_path in VERB_DIFFICULTY_PATHS:
    if difficulty_path.exists():
        with difficulty_path.open(encoding="utf-8") as difficulty_file:
            VERB_DIFFICULTY = json.load(difficulty_file)
        break


def error_response(message, status_code, details=None):
    payload = {"error": message}
    if details:
        payload["details"] = details
    return jsonify(payload), status_code


@lru_cache(maxsize=len(SUPPORTED_LANGUAGES))
def get_conjugator(lang):
    try:
        from mlconjug3 import Conjugator
    except Exception as exc:
        raise RuntimeError(f"mlconjug3 import failed: {exc}") from exc

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

    if len(tenses) > 32:
        return None, error_response("Too many tenses", 400)

    invalid_tenses = []
    for tense_key, tense_value in tenses.items():
        if not isinstance(tense_value, dict) or any(
            not isinstance(tense_value.get(field), str) or not 0 < len(tense_value[field]) <= 100
            for field in ("mood", "name")
        ):
            invalid_tenses.append(tense_key)

    if invalid_tenses:
        return None, error_response(
            "Invalid tense payload",
            400,
            {"invalidTenses": invalid_tenses},
        )

    return tenses, None


def adjust_pronominal_forms(forms, lang, original_verb, mood, name):
    if not forms or not isinstance(forms, dict):
        return forms

    # Determine if original_verb is pronominal
    is_pronominal = False
    if lang == "es" and original_verb.endswith("se"):
        is_pronominal = True
    elif lang == "fr" and (original_verb.startswith("se ") or original_verb.startswith("s'") or original_verb.startswith("s’")):
        is_pronominal = True

    if not is_pronominal:
        return forms

    adjusted = {}
    for person, form in forms.items():
        if not form:
            adjusted[person] = form
            continue

        if lang == "es":
            # Spanish reflexive pronouns
            pronouns = {
                "1s": "me",
                "2s": "te",
                "3s": "se",
                "1p": "nos",
                "2p": "os",
                "3p": "se"
            }
            pronoun = pronouns.get(person)
            if not pronoun:
                adjusted[person] = form
                continue

            # Imperative mood check
            if mood == "Imperativo" and name.startswith("Imperativo"):
                # Pronoun is attached to the end
                # Drop final 's' for 1p (e.g. lavamos -> lavámonos)
                if person == "1p" and form.endswith("s"):
                    base_form = form[:-1]
                # Drop final 'd' for 2p (e.g. lavad -> lavaos)
                elif person == "2p" and form.endswith("d"):
                    base_form = form[:-1]
                else:
                    base_form = form

                adjusted[person] = f"{base_form}{pronoun}"
            else:
                # Indicative/Subjuntivo/Condicional: pronoun is prepositioned separate
                adjusted[person] = f"{pronoun} {form}"

        elif lang == "fr":
            # French reflexive pronouns
            if mood == "Imperatif" and name == "Imperatif Présent":
                pronouns = {
                    "2s": "toi",
                    "1p": "nous",
                    "2p": "vous"
                }
                pronoun = pronouns.get(person)
                if pronoun:
                    adjusted[person] = f"{form}-{pronoun}"
                else:
                    adjusted[person] = form
            else:
                # Check contraction if it starts with vowel or silent h
                is_vowel = form and form[0].lower() in "aeiouyéèàùâêîôûëïüÿh"
                if person == "1s":
                    adjusted[person] = f"m'{form}" if is_vowel else f"me {form}"
                elif person == "2s":
                    adjusted[person] = f"t'{form}" if is_vowel else f"te {form}"
                elif person == "3s":
                    adjusted[person] = f"s'{form}" if is_vowel else f"se {form}"
                elif person == "1p":
                    adjusted[person] = f"nous {form}"
                elif person == "2p":
                    adjusted[person] = f"vous {form}"
                elif person == "3p":
                    adjusted[person] = f"s'{form}" if is_vowel else f"se {form}"
                else:
                    adjusted[person] = form

    return adjusted


@app.post('/conjugate/<lang>/<verb>')
def conjugate(lang, verb):
    tenses, validation_error = validate_conjugation_request(lang)
    if validation_error:
        return validation_error

    if not 1 <= len(verb) <= 100 or not all(char.isalpha() or char in " '’-" for char in verb):
        return error_response("Invalid verb", 400)

    # Strip pronominal prefix/suffix for conjugation query
    conjugate_verb_query = verb
    is_pronominal = False
    if lang == "es" and verb.endswith("se") and len(verb) > 2:
        conjugate_verb_query = verb[:-2]
        is_pronominal = True
    elif lang == "fr" and len(verb) > 3:
        if verb.startswith("se "):
            conjugate_verb_query = verb[3:]
            is_pronominal = True
        elif verb.startswith("s'"):
            conjugate_verb_query = verb[2:]
            is_pronominal = True
        elif verb.startswith("s’"):
            conjugate_verb_query = verb[2:]
            is_pronominal = True

    try:
        conjugated_verb = get_conjugator(lang).conjugate(conjugate_verb_query)
    except RuntimeError:
        app.logger.exception("Conjugation service unavailable")
        return error_response(
            "Conjugation service unavailable",
            503,
        )
    except Exception:
        app.logger.exception("Unable to conjugate verb")
        return error_response(
            "Unable to conjugate verb",
            422,
            {"verb": verb, "language": lang},
        )

    template = conjugated_verb.verb_info.template
    root = conjugated_verb.verb_info.root

    response = {
        "verb": {
            "infinitive": verb,  # Keep the original requested verb (e.g. vestirse)
            "template": template,
            "root": root,
            "difficulty": get_verb_difficulty(lang, verb),
        },
        "conjugation": {},
        "availability": {}
    }

    missing_tenses = []
    for tense_key, tense_value in tenses.items():
        mood = tense_value["mood"]
        name = tense_value["name"]
        available_forms = get_conjugation_forms(conjugated_verb, lang, conjugate_verb_query, mood, name)

        if available_forms:
            if is_pronominal:
                available_forms = adjust_pronominal_forms(available_forms, lang, verb, mood, name)
            response["conjugation"][tense_key] = available_forms
            response["availability"][tense_key] = sorted(available_forms.keys())
        else:
            missing_tenses.append(tense_key)

    if missing_tenses:
        response["missingTenses"] = missing_tenses

    return jsonify(response)

@app.errorhandler(413)
def payload_too_large(_error):
    return error_response("Request body is too large", 413)


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
