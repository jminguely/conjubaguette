import { describe, expect, it } from 'vitest'

import { compareAnswer, getConjugationAnswer, getSubjectApiKey, normalizeAnswer } from './exercise'

describe('normalizeAnswer', () => {
  it('normalizes accents, case, apostrophes, and whitespace', () => {
    expect(normalizeAnswer("  J’ÉTAIS   ")).toBe("j'etais")
  })
})

describe('compareAnswer', () => {
  it('accepts accent-insensitive answers while preserving exactness', () => {
    expect(compareAnswer('etais', 'étais')).toEqual({
      isCorrect: true,
      isTotallyCorrect: false
    })
  })

  it('marks exact answers as totally correct', () => {
    expect(compareAnswer('étais', 'étais')).toEqual({
      isCorrect: true,
      isTotallyCorrect: true
    })
  })
})

describe('getConjugationAnswer', () => {
  it('returns an empty string when a tense or subject is missing', () => {
    expect(getConjugationAnswer({}, 'present-tense', 'fr', 'je')).toBe('')
  })

  it('maps displayed labels to API person keys', () => {
    expect(getSubjectApiKey('es', 'nosotros')).toBe('1p')
    expect(
      getConjugationAnswer(
        { conjugation: { 'present-tense': { '1p': 'dibujamos' } } },
        'present-tense',
        'es',
        'nosotros'
      )
    ).toBe('dibujamos')
  })
})
