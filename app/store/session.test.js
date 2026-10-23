import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
const cookies = vi.hoisted(() => new Map())
vi.mock('js-cookie', () => ({
  default: {
    get: (key) => cookies.get(key),
    set: (key, value) => cookies.set(key, value),
    remove: (key) => cookies.delete(key)
  }
}))
import { useSessionStore } from './session'
import { useVerbsStore } from './verbs'
import { useTensesStore } from './tenses'
beforeEach(() => {
  cookies.clear()
  const storage = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value)
  })
  setActivePinia(createPinia())
})
describe('persistent preferences', () => {
  it('resets yesterday’s progress when practice starts', () => {
    cookies.set('counterNew', '12')
    cookies.set('lastUpdatedNew', '2000-01-01')
    const session = useSessionStore()
    session.resetDailyCounter()
    expect(session.counter).toBe(0)
    session.incrementCounter()
    expect(session.counter).toBe(1)
  })
  it('bounds daily goals to whole, finite values', () => {
    const session = useSessionStore()
    for (const [value, expected] of [
      ['0', 20],
      ['-1', 1],
      ['2.8', 2],
      ['Infinity', 500],
      ['9999', 500]
    ]) {
      session.setDailyGoal({ target: { value } })
      expect(session.dailyGoal).toBe(expected)
    }
  })
  it('preserves an intentionally empty verb selection across reloads', () => {
    useVerbsStore().uncheckAllVerbs()
    setActivePinia(createPinia())
    expect(useVerbsStore().checkedVerbs).toEqual([])
  })
  it('recovers corrupt storage and prevents removing the final tense', () => {
    localStorage.setItem('verboloco.verbs.v1', '{invalid')
    cookies.set('checkedTensesNew', '["not-a-tense"]')
    expect(useVerbsStore().checkedVerbs.length).toBeGreaterThan(0)
    const store = useTensesStore()
    store.checkTense('present-tense')
    store.checkTense('unknown')
    expect(store.checkedTenses).toEqual(['present-tense'])
  })
})
