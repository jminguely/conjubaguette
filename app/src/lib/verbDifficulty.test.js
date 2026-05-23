import { describe, expect, it } from 'vitest'

import { filterVerbsByDifficulty, getVerbDifficulty } from './verbDifficulty'

describe('getVerbDifficulty', () => {
  it('classifies hard verbs before medium verbs', () => {
    expect(getVerbDifficulty({ es: 'ser', fr: 'être' })).toBe('hard')
    expect(getVerbDifficulty({ es: 'pagar', fr: 'payer' })).toBe('medium')
    expect(getVerbDifficulty({ es: 'habitar', fr: 'habiter' })).toBe('easy')
  })
})

describe('filterVerbsByDifficulty', () => {
  it('filters by the requested difficulty level', () => {
    const verbs = [
      { es: 'ser', fr: 'être' },
      { es: 'pagar', fr: 'payer' },
      { es: 'habitar', fr: 'habiter' }
    ]

    expect(filterVerbsByDifficulty(verbs, 'hard')).toEqual([{ es: 'ser', fr: 'être' }])
    expect(filterVerbsByDifficulty(verbs, 'medium')).toEqual([{ es: 'pagar', fr: 'payer' }])
    expect(filterVerbsByDifficulty(verbs, 'all')).toHaveLength(3)
  })
})
