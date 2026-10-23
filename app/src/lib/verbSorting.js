import priority from '@/assets/data/verbPriority.json'
import { getVerbDifficulty } from './verbDifficulty'
const levels = { easy: 0, medium: 1, hard: 2 }
export const VERB_SORT_OPTIONS = ['usefulness', 'difficulty', 'fr', 'es']

// This is an editorial learning order, not a statistical frequency ranking.
// Unranked additions remain visible after the essentials, in alphabetical order.
export function sortVerbs(verbs, order = 'usefulness', language = 'es') {
  const target = language === 'fr' ? 'fr' : 'es'
  const ranks = new Map(priority[target].map((verb, index) => [verb, index]))
  const rank = (verb) => ranks.get(verb[target]) ?? Number.MAX_SAFE_INTEGER
  const alphabet = order === 'fr' || order === 'es' ? order : target
  const collator = new Intl.Collator(alphabet, { sensitivity: 'base' })
  const alphabetical = (a, b) =>
    collator.compare(
      a[`${alphabet}_label`] || a[alphabet],
      b[`${alphabet}_label`] || b[alphabet]
    ) || collator.compare(a.fr + a.es, b.fr + b.es)
  return [...verbs].sort((a, b) => {
    if (order === 'difficulty') {
      const difference = levels[getVerbDifficulty(a)] - levels[getVerbDifficulty(b)]
      if (difference) return difference
    }
    if (order === 'usefulness' || order === 'difficulty') {
      const difference = rank(a) - rank(b)
      if (difference) return difference
    }
    return alphabetical(a, b)
  })
}
