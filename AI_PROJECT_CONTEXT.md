# ConjuBaguette / VerboLoco Project Context

Last reviewed: 2026-05-05

## Product Summary

VerboLoco is a lightweight French/Spanish verb conjugation trainer. The user chooses a training direction, a set of verbs, and one or more tenses. The app then picks a random verb and person, asks for the conjugated form, accepts answers without accents as partially correct, and tracks a daily completion counter in browser cookies.

## Repository Shape

- `app/`: Vue 3 single-page application built with Vite, Pinia, Tailwind CSS, Axios, and `js-cookie`.
- `api/`: Python conjugation service. Despite the README mentioning FastAPI, the current implementation is Flask wrapped as ASGI with `asgiref.wsgi.WsgiToAsgi` and served by Uvicorn.
- `.github/workflows/`: separate deployment workflows for frontend and API.
- `venv/`: a Python virtual environment is currently tracked in git. This should be removed from version control.

## Frontend Architecture

Entry point:

- `app/src/main.js` creates the Vue app, installs Pinia, mounts `App.vue`, and imports global Tailwind/CSS.

Main interaction:

- `app/src/App.vue` owns most runtime behavior:
  - Shows the current translation prompt.
  - Randomly selects one checked verb and one subject/person.
  - Builds a `tenses` payload from `app/src/assets/data/tenses.json`.
  - Posts to `/conjugate/:language/:verb`.
  - Stores API response in `fullVerb`.
  - Derives `correctAnswers` for each selected tense.
  - Compares user input against exact and accent-stripped answers.
  - Increments the daily counter once all visible answers are correct.

State:

- `app/store/session.js`: daily goal, daily counter, last update date, language direction. Stored in cookies.
- `app/store/verbs.js`: checked verb list. Stored in cookies.
- `app/store/tenses.js`: checked tense keys. Stored in cookies.

Static learning data:

- `app/src/assets/data/verbs.json`: French/Spanish verb pairs and optional labels.
- `app/src/assets/data/tenses.json`: app-level tense keys mapped to `mlconjug3` mood/name labels per language.
- `app/src/assets/data/subjects.json`: subject labels used to index returned conjugation tables.

UI components:

- `SiteHeader.vue`: settings and verbs buttons.
- `ModalBox.vue`: modal shell and dynamic settings tabs.
- `GeneralSettings.vue`: language direction and daily goal.
- `TenseSettings.vue`: selected tense toggles, with at least one tense enforced.
- `VerbsSettings.vue`: selected verb toggles, plus check/uncheck all.
- `TenseDisplay.vue`: optional full solution display.
- `SiteFooter.vue`: shuffle button.

## API Architecture

Main file:

- `api/app.py`

Routes:

- `POST /conjugate/<lang>/<verb>`
  - Reads JSON body.
  - Expects a `tenses` object keyed by frontend tense id.
  - Creates a new `mlconjug3.Conjugator(language=lang, model=None)` for each request.
  - Calls `conjugator.conjugate(verb)`.
  - Returns verb metadata and only the requested tense tables.

- `GET /test`
  - Debug endpoint for `fr/manger`.
  - Prints to stdout and returns `conjugated_verb.iterate()`.
  - Should not be exposed in production.

The frontend depends directly on `mlconjug3` output labels. If the mood/name strings in `tenses.json` do not exactly match `conjugated_verb.conjug_info`, `fullVerb.value.conjugation[tense]` can be missing and `App.vue` can crash when deriving `correctAnswers`.

## Runtime Flow

1. User opens the SPA.
2. Pinia stores initialize from cookies, with fallback defaults.
3. `App.vue` calls `shuffle()` on mount.
4. `shuffle()` picks a verb from `verbsStore.checkedVerbs`.
5. `prepareVerb()` posts selected tenses to `/conjugate/:lang/:verb`.
6. API returns conjugation tables for requested tenses.
7. App picks a random person and builds expected answers by indexing:
   - `fullVerb.conjugation[tense][subjects[language][selectedPerson]]`
8. User enters answers.
9. `isCorrect` compares raw and accent-stripped strings.
10. Once all answers are correct ignoring accents, `sessionStore.incrementCounter()` updates cookies.

## Local Development

Frontend:

```sh
cd app
npm install
npm run dev
```

Frontend build:

```sh
cd app
npm run build
```

API:

```sh
cd api
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app:asgi_app --reload --host 0.0.0.0 --port 8115
```

Important local proxy note:

- `app/vite.config.js` currently proxies `/conjugate` to `https://api.verbolo.co/conjugate/`, not a local API.
- For local full-stack work, change the target to the local Uvicorn server or make this configurable via environment variables.

## Verification Status From This Review

- `python3 -m py_compile api/app.py` passed.
- `npm run build` could not run because frontend dependencies are not installed in this workspace (`vite: command not found`).
- No automated tests were found.

## Main Technical Risks

- No API input validation or error handling. Invalid language, missing body, unknown tenses, or `mlconjug3` failures can return 500s.
- Frontend assumes every requested tense exists in the API response.
- The API creates a new conjugator on every request, which is likely wasteful.
- Persistent user state is stored in cookies with raw JSON, no schema validation, and no recovery from malformed cookie values.
- `venv/` is committed, and root `.gitignore` only ignores `.DS_Store`.
- `api/requirements.txt` is unpinned and includes unused/mismatched dependencies (`fastapi`, `verbecc`) while the app uses Flask and `mlconjug3`.
- There are no unit, integration, component, or end-to-end tests.
- CI deploys directly but does not test the API and uses `npm install` instead of `npm ci`.
- The API deploy workflow has a misleading Node matrix and old `actions/setup-python@v2`.
- The frontend dev proxy hardcodes the production API.
- `app/vite.config.js.timestamp-...mjs` looks like generated Vite cache/config output and should not be committed.
- `TenseDisplay.vue` uses `v-html` for stem highlighting. Current content comes from conjugation data, but this should still be replaced with a safer render strategy or sanitized.
- Several forms have weak accessibility semantics, e.g. headings with `for` attributes and icon-only buttons without accessible labels.

## High-Value Improvement Backlog

### 1. Harden API Request Handling

Add JSON validation for `POST /conjugate/<lang>/<verb>`. Accept only supported languages, require a JSON object body, require `tenses` to be an object, validate each tense item has `mood` and `name`, and return structured 4xx errors instead of uncaught exceptions.

### 2. Make Frontend Resilient to Missing or Failed Conjugations

Wrap the Axios call in loading/error states. Guard all `fullVerb.conjugation[tense]` access, show a useful UI state when a verb/tense is unsupported, and avoid leaving the app stuck in loading mode.

### 3. Remove Tracked Generated Files

Delete `venv/` and `app/vite.config.js.timestamp-*.mjs` from git. Expand root `.gitignore` to include virtual environments, Python caches, Node modules, Vite build output, local env files, and OS/editor files.

### 4. Clean Dependency Management

Pin Python dependencies, remove unused packages, and document the actual stack. Prefer a simple requirements lock strategy or a modern Python package manager. Update frontend CI to use `npm ci`.

### 5. Add Automated Test Coverage

Start with API tests for valid conjugation, invalid language, missing body, missing tense, and unsupported tense. Add frontend unit tests for answer normalization, daily counter behavior, and store cookie fallback. Add at least one E2E smoke test for a full exercise.

### 6. Refactor `App.vue`

Move exercise generation, answer normalization, and correctness checking into composables or utility modules. Keep `App.vue` focused on rendering and orchestration. This will make the main training logic testable without mounting the full UI.

### 7. Make API Target Configurable

Replace the hardcoded production proxy target in `app/vite.config.js` with an environment-based value. Document `.env.local` examples for local and production-like development.

### 8. Improve State Persistence Robustness

Centralize cookie/local storage parsing and validation. Recover safely from malformed JSON, removed verbs/tenses, invalid daily goals, and stale language settings. Consider using localStorage instead of cookies because this is client-only preference state.

### 9. Cache Conjugators or Results

Avoid constructing `Conjugator` on every API request. Cache per language and consider memoizing `(language, verb, requestedTenses)` responses if latency is noticeable.

### 10. Improve Accessibility and Form Semantics

Add accessible labels to icon-only buttons, use real labels for inputs, make modal focus behavior keyboard-friendly, and ensure settings tables/toggles are navigable with assistive tech.

### 11. Review Answer Normalization Rules

Decide whether answers should ignore accents, case, punctuation, whitespace, apostrophe variants, and pronoun spacing. Put the rule in a shared tested function and reflect the distinction between exact and accepted answers in the UI.

### 12. Remove Production Debug Endpoint

Delete or protect `GET /test`, remove debug prints, and add a small `/health` endpoint if deploy monitoring needs one.

### 13. Modernize CI/CD

Separate CI from deployment. Add frontend build/lint/test gates, API test gates, modern action versions, and concurrency controls. Keep deploy only after checks pass.

### 14. Reconcile Branding and Documentation

The repo name, app name, docs, and domain references use both ConjuBaguette and VerboLoco. Pick the intended public name and update README, metadata, package name, and documentation consistently.

