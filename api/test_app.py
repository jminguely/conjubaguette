import pytest

from app import app, get_conjugator


class FakeVerbInfo:
    infinitive = "manger"
    template = "aim:er"
    root = "mang"


class FakeConjugatedVerb:
    verb_info = FakeVerbInfo()
    conjug_info = {
        "Imperativo": {
            "Imperativo Afirmativo": {
                "2s": "come",
                "3s": "coma",
                "1p": "comamos",
                "2p": "comed",
                "3p": "coman",
            }
        },
        "Indicatif": {
            "Présent": {
                "je": "mange",
                "tu": "manges",
            }
        }
    }


class FakeConjugator:
    def conjugate(self, verb):
        if verb == "unknown":
            raise ValueError("verb not found")
        return FakeConjugatedVerb()


class FakeSpanishImperativeFallbackVerbInfo:
    infinitive = "encender"
    template = "def:ender"
    root = "enc"


class FakeSpanishImperativeFallbackVerb:
    verb_info = FakeSpanishImperativeFallbackVerbInfo()
    conjug_info = {
        "Imperativo": {
            "Imperativo Afirmativo": {
                "": "enciendan",
            }
        },
        "Indicativo": {
            "Indicativo presente": {
                "1s": "enciendo",
                "2s": "enciendes",
                "3s": "enciende",
                "1p": "encendemos",
                "2p": "encendéis",
                "3p": "encienden",
            }
        },
        "Subjuntivo": {
            "Subjuntivo presente": {
                "1s": "encienda",
                "2s": "enciendas",
                "3s": "encienda",
                "1p": "encendamos",
                "2p": "encendáis",
                "3p": "enciendan",
            }
        },
    }


class FakeSpanishImperativeFallbackConjugator:
    def conjugate(self, verb):
        return FakeSpanishImperativeFallbackVerb()


class FakeFrenchImperativeFallbackVerbInfo:
    infinitive = "travailler"
    template = "aim:er"
    root = "travaill"


class FakeFrenchImperativeFallbackVerb:
    verb_info = FakeFrenchImperativeFallbackVerbInfo()
    conjug_info = {
        "Imperatif": {
            "Imperatif Présent": {
                "": "travaillez",
            }
        },
        "Indicatif": {
            "Présent": {
                "je": "travaille",
                "tu": "travailles",
                "il (elle, on)": "travaille",
                "nous": "travaillons",
                "vous": "travaillez",
                "ils (elles)": "travaillent",
            }
        },
    }


class FakeFrenchImperativeFallbackConjugator:
    def conjugate(self, verb):
        return FakeFrenchImperativeFallbackVerb()


@pytest.fixture(autouse=True)
def fake_conjugator(monkeypatch):
    get_conjugator.cache_clear()
    monkeypatch.setattr("app.get_conjugator", lambda lang: FakeConjugator())


@pytest.fixture()
def client():
    app.config.update(TESTING=True)
    return app.test_client()


def test_health(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_conjugate_preflight_allows_frontend_origin(client):
    response = client.options(
        "/conjugate/es/sentarse",
        headers={
            "Origin": "https://verbo.minguely.ch",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers.get("Access-Control-Allow-Origin") == "https://verbo.minguely.ch"


def test_conjugate_returns_requested_tense(client):
    response = client.post(
        "/conjugate/fr/manger",
        json={"tenses": {"present-tense": {"mood": "Indicatif", "name": "Présent"}}},
    )

    assert response.status_code == 200
    assert response.get_json()["conjugation"]["present-tense"]["je"] == "mange"
    assert response.get_json()["availability"]["present-tense"] == ["je", "tu"]
    assert response.get_json()["verb"]["difficulty"] == "easy"


def test_conjugate_rejects_unsupported_language(client):
    response = client.post(
        "/conjugate/de/machen",
        json={"tenses": {"present-tense": {"mood": "Indicatif", "name": "Présent"}}},
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "Unsupported language"


def test_conjugate_rejects_missing_json_body(client):
    response = client.post("/conjugate/fr/manger")

    assert response.status_code == 400
    assert response.get_json()["error"] == "Expected a JSON object body"


def test_conjugate_rejects_invalid_tense_payload(client):
    response = client.post("/conjugate/fr/manger", json={"tenses": {"present-tense": {}}})

    assert response.status_code == 400
    assert response.get_json()["details"]["invalidTenses"] == ["present-tense"]


def test_conjugate_reports_missing_tenses(client):
    response = client.post(
        "/conjugate/fr/manger",
        json={"tenses": {"future-tense": {"mood": "Indicatif", "name": "Futur"}}},
    )

    assert response.status_code == 200
    assert response.get_json()["missingTenses"] == ["future-tense"]


def test_conjugate_reports_unknown_verb(client):
    response = client.post(
        "/conjugate/fr/unknown",
        json={"tenses": {"present-tense": {"mood": "Indicatif", "name": "Présent"}}},
    )

    assert response.status_code == 422
    assert response.get_json()["error"] == "Unable to conjugate verb"


def test_conjugate_supports_spanish_imperative(client):
    response = client.post(
        "/conjugate/es/comer",
        json={
            "tenses": {
                "imperative-present": {
                    "mood": "Imperativo",
                    "name": "Imperativo Afirmativo",
                }
            }
        },
    )

    assert response.status_code == 200
    assert response.get_json()["conjugation"]["imperative-present"]["2s"] == "come"


def test_conjugate_builds_spanish_imperative_fallback_when_library_returns_empty_key(client, monkeypatch):
    monkeypatch.setattr("app.get_conjugator", lambda lang: FakeSpanishImperativeFallbackConjugator())

    response = client.post(
        "/conjugate/es/encender",
        json={
            "tenses": {
                "imperative-present": {
                    "mood": "Imperativo",
                    "name": "Imperativo Afirmativo",
                }
            }
        },
    )

    assert response.status_code == 200
    imperative = response.get_json()["conjugation"]["imperative-present"]
    assert imperative["2s"] == "enciende"
    assert imperative["3s"] == "encienda"
    assert imperative["1p"] == "encendamos"
    assert imperative["2p"] == "encended"
    assert imperative["3p"] == "enciendan"


def test_conjugate_builds_french_imperative_fallback_when_library_returns_empty_key(client, monkeypatch):
    monkeypatch.setattr("app.get_conjugator", lambda lang: FakeFrenchImperativeFallbackConjugator())

    response = client.post(
        "/conjugate/fr/travailler",
        json={
            "tenses": {
                "imperative-present": {
                    "mood": "Imperatif",
                    "name": "Imperatif Présent",
                }
            }
        },
    )

    assert response.status_code == 200
    imperative = response.get_json()["conjugation"]["imperative-present"]
    assert imperative["2s"] == "travaille"
    assert imperative["1p"] == "travaillons"
    assert imperative["2p"] == "travaillez"
