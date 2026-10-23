# VerboLoco frontend

Vue 3 + Pinia. Requires Node 22.12+.

```sh
npm ci
npm run dev
```

The development proxy expects the API at `http://127.0.0.1:8115`.
Copy `.env.example` to `.env.local` to override the target.
For a separate production API origin, set `VITE_API_BASE_URL` at build time.

## Checks

```sh
npm run lint
npm run test:unit -- --run
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests cover desktop and phone layouts using deterministic API fixtures.
API tests separately cover the real conjugation library.
`npm run lint:fix` and `npm run format` are explicit opt-in formatting commands.

## Structure

- `src/App.vue`: practice screen
- `src/composables/useExercise.js`: cancellable exercise loading and scoring
- `src/lib/`: answer normalization, person modes, difficulty helpers
- `store/`: validated preferences and daily progress
- `src/components/Settings/`: general preferences, tenses, searchable verbs
- `src/assets/css/tailwind.css`: design tokens and shared controls

Verb selections use compact IDs in localStorage, migrated from legacy cookies.
Other preferences and daily progress use cookies. Storage failures do not prevent practice.
The settings dialog uses native focus trapping, Escape dismissal, and focus restoration.

## Adding verbs

Add a French/Spanish pair to `src/assets/data/verbs.json`, for example:

```json
{ "es": "necesitar", "fr": "nécessiter", "fr_label": "nécessiter / avoir besoin de" }
```

Use actual infinitives in `fr` and `es`; optional `fr_label` and `es_label` clarify meaning. Check the translation and both languages' conjugations through the API, especially reflexive and irregular verbs. No conjugation tables need to be entered manually.

New entries automatically appear in search and sorting. Existing users' selections are preserved, so they must select the new verbs (or Select all). Add harder pairs to `verbDifficulty.json`; unlisted pairs currently default to easy. To promote an everyday essential, add its infinitive to the ordered language list in `verbPriority.json`. Unranked verbs follow the essentials alphabetically.

“Most useful first” is a curated teaching order, not a measured frequency claim. It prioritizes common foundational verbs, broadly informed by https://conjugoapp.com/learn/most-common-spanish-verbs/; the French ordering is editorial. Importance and difficulty are distinct: common irregular verbs can be useful early. Difficulty sorting retains the existing pair-level classification rather than estimating difficulty for each tense.

## Interface languages

The target study language (`session.languageSetting`) is also the interface language. `useUiLanguage` exposes the primary and secondary language and translates shared messages from `src/lib/translations.js`. All bilingual verb/tense labels put the target language first. API errors map to localized frontend messages, and the page's language and description update immediately.

The catalogue contains 199 unique Spanish infinitives (99 original + 100 added), paired with French infinitives and optional meaning labels. The usefulness order remains editorial, not an exact corpus-frequency ranking.
