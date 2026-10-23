import { describe, expect, it } from 'vitest'
import { sortVerbs } from './verbSorting'
import verbs from '@/assets/data/verbs.json'
import { getVerbDifficulty } from './verbDifficulty'
describe('verb sorting', () => {
  it('puts everyday essentials first without mutating the catalogue', () => {
    const original = [...verbs]
    expect(
      sortVerbs(verbs)
        .slice(0, 3)
        .map((v) => v.es)
    ).toEqual(['ser', 'estar', 'haber'])
    expect(verbs).toEqual(original)
    expect(sortVerbs(verbs)).toHaveLength(verbs.length)
  })
  it('orders difficulty first and retains all verbs', () => {
    const levels = { easy: 0, medium: 1, hard: 2 }
    const sorted = sortVerbs(verbs, 'difficulty').map((v) => levels[getVerbDifficulty(v)])
    expect(sorted).toEqual([...sorted].sort((a, b) => a - b))
  })
  it('uses the selected learning language for usefulness', () => {
    const pair = [
      { fr: 'parler', es: 'hablar' },
      { fr: 'mettre', es: 'poner' }
    ]
    expect(sortVerbs(pair, 'usefulness', 'fr')[0].fr).toBe('mettre')
  })
  it('includes new, unranked verbs and sorts alphabetically with accents', () => {
    const extra = [
      { fr: 'zapper', es: 'zapear' },
      { fr: 'aérer', es: 'airear' },
      { fr: 'être', es: 'ser' }
    ]
    expect(sortVerbs(extra).map((v) => v.es)).toEqual(['ser', 'airear', 'zapear'])
    expect(sortVerbs(extra, 'fr').map((v) => v.fr)).toEqual(['aérer', 'être', 'zapper'])
  })
  it('catalogue pairs are nonempty and unique', () => {
    expect(
      verbs.every(
        (v) => typeof v.fr === 'string' && v.fr.trim() && typeof v.es === 'string' && v.es.trim()
      )
    ).toBe(true)
    expect(new Set(verbs.map((v) => v.fr + ':' + v.es)).size).toBe(verbs.length)
  })
})
