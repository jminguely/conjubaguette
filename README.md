# VerboLoco

French and Spanish verb conjugation trainer with a Vue frontend and a Flask + `mlconjug3` API.

## Stack

- `app/`: Vue 3, Vite, Pinia, Tailwind CSS, Vitest
- `api/`: Flask wrapped as ASGI, Uvicorn, `mlconjug3`, Pytest

## Local Development

### API

```sh
python3.12 -m venv .venv
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
npm ci
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

## Production and maintenance

Use Python 3.12 and Node 22.12 or newer. Serve `app/dist/` as static files and run the API through Uvicorn behind an HTTPS reverse proxy. The Vite development proxy is not part of the production build: either route `/conjugate` to the API on the same origin or provide `VITE_API_BASE_URL` at build time. Configure `ALLOWED_ORIGINS` for the deployed frontend origin and apply request rate limits at the reverse proxy.

`/health` reports process health, not model warm-up. The first conjugation request loads the model. Client requests time out after 20 seconds and can be retried.

Pull requests run lint, unit tests, the production build, API tests, and Playwright browser tests. Browser tests use deterministic API fixtures; Pytest also exercises the real conjugator. Run `npm run test:e2e` from `app/` after `npx playwright install chromium`.

Typography and layout tokens live in `app/src/assets/css/tailwind.css`. Google Fonts are optional enhancements; system fonts are available as fallbacks.

Known upstream limitation: mlconjug3 4.0.1 requires scikit-learn 1.8+ but bundles models serialized with 1.6.1. Real-conjugation tests pass, though scikit-learn emits model-version warnings. Keep the supported dependency constraint; do not silence these warnings or downgrade below mlconjug3’s requirement without validating a compatible upstream release.
