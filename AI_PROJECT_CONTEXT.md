# VerboLoco project context

Updated 2026-10-23. See README.md and app/README.md for setup and verification.

- Vue 3/Vite/Pinia frontend in `app/`; Flask/ASGI/mlconjug3 API in `api/`.
- Exercise orchestration lives in `app/src/composables/useExercise.js`. Requests have a timeout, cancellation, and stale-response protection. Closing settings starts an exercise using current preferences.
- Answer matching accepts normalized accents and reports exact answers separately. The daily counter increments once per completed exercise.
- Verb selections are compact localStorage IDs; legacy cookie selections migrate. Empty selections persist and show an actionable empty state. Tenses retain at least one valid option.
- Design uses Nunito Sans for readable interface text and Fredoka for display words/branding. Warm surfaces, yellow actions, pink answer fields, green success states.
- Settings use a native dialog; verb search is accent-insensitive. Lists share one dialog scroll area.
- API validates bounded JSON, language and verb inputs, caches conjugators, returns structured errors, and keeps exception details in server logs.
- Tests: Vitest utility/store coverage; Pytest validation and real-conjugator coverage; Playwright desktop/mobile flows. Pull requests run checks; deployment workflows run their own gates.

Production deployment must configure the API origin, matching ALLOWED_ORIGINS, TLS, and reverse-proxy request rate limits. No application-level rate limiter or authentication is included; this is a public practice application. Conjugation accuracy follows mlconjug3 and the existing imperative/reflexive fallback rules; linguistic validation of the entire dataset is separate from software tests.
