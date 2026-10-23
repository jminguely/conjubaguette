import { describe, it, expect } from 'vitest'
import { messages, translate } from './translations'
import verbs from '@/assets/data/verbs.json'
describe('bilingual interface and catalogue', () => {
  it('has a complete message set in both languages', () => {
    expect(Object.keys(messages.fr).sort()).toEqual(Object.keys(messages.es).sort())
    for (const key of Object.keys(messages.fr)) {
      expect(messages.fr[key].trim()).not.toBe('')
      expect(messages.es[key].trim()).not.toBe('')
      expect(messages.fr[key].match(/\{\w+\}/g) || []).toEqual(
        messages.es[key].match(/\{\w+\}/g) || []
      )
    }
  })
  it('formats localized counters and error messages', () => {
    expect(translate('fr', 'selected', { count: 3, total: 199 })).toBe('3 sur 199 sélectionnés')
    expect(translate('es', 'selected', { count: 3, total: 199 })).toBe('3 de 199 seleccionados')
    expect(translate('es', 'found', { count: 1 })).toBe('1 resultado')
    expect(translate('fr', 'found', { count: 1 })).toBe('1 résultat')
    expect(translate('es', 'loadError')).not.toContain('Unable')
  })
  it('contains the original 99 plus 100 distinct new Spanish verbs', () => {
    expect(verbs).toHaveLength(199)
    expect(new Set(verbs.map((v) => v.es)).size).toBe(199)
  })
})
