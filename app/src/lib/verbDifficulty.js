import verbDifficulty from '@/assets/data/verbDifficulty.json'

const difficultySets = {
  medium: new Set(verbDifficulty.medium.map((entry) => `${entry.es}|${entry.fr}`)),
  hard: new Set(verbDifficulty.hard.map((entry) => `${entry.es}|${entry.fr}`))
}

const getVerbKey = (verb) => {
  if (!verb) return ''
  if (typeof verb === 'string') return verb
  return `${verb.es ?? ''}|${verb.fr ?? ''}`
}

export const getVerbDifficulty = (verb) => {
  const key = getVerbKey(verb)
  if (!key) return 'easy'
  if (difficultySets.hard.has(key)) return 'hard'
  if (difficultySets.medium.has(key)) return 'medium'
  return 'easy'
}

export const filterVerbsByDifficulty = (verbs, difficulty) => {
  if (!difficulty || difficulty === 'all') return verbs

  return verbs.filter((verb) => getVerbDifficulty(verb) === difficulty)
}
