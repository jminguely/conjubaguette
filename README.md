# VerboLoco

French and Spanish verb conjugation trainer with a Vue frontend and a Flask + `mlconjug3` API.

## Stack

- `app/`: Vue 3, Vite, Pinia, Tailwind CSS, Vitest
- `api/`: Flask wrapped as ASGI, Uvicorn, `mlconjug3`, Pytest

## Local Development

### API

```sh
python3 -m venv .venv
. .venv/bin/activate
.venv/bin/pip install -r api/requirements.txt
.venv/bin/python -m uvicorn api.app:asgi_app --reload --host 127.0.0.1 --port 8115
```

Health check:

```sh
curl http://127.0.0.1:8115/health
```

### Frontend

```sh
cd app
npm install
npm run dev
```

The frontend proxy defaults to `http://127.0.0.1:8115`. Override it with `VITE_API_PROXY_TARGET` if needed.

Example:

```sh
cd app
cp .env.example .env.local
```

## Tests

Frontend:

```sh
cd app
npm run lint
npm run test:unit -- --run
npm run build
```

API:

```sh
.venv/bin/pytest api/test_app.py
```

## API

Main endpoint:

```txt
POST /conjugate/<lang>/<verb>
```

Example body:

```json
{
  "tenses": {
    "present-tense": {
      "mood": "Indicatif",
      "name": "Présent"
    }
  }
}
```
