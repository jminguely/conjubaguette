import { beforeEach, expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createPinia, setActivePinia } from 'pinia'
import { useSessionStore } from '/store/session'
import VerbsSettings from './VerbsSettings.vue'
import TenseSettings from './TenseSettings.vue'
vi.mock('js-cookie', () => ({ default: { get: () => undefined, set: () => {}, remove: () => {} } }))
beforeEach(() => vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} }))
const render = async (component, language) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  useSessionStore().languageSetting = language
  return renderToString(createSSRApp(component).use(pinia))
}
it('renders Spanish verb and tense labels before French translations', async () => {
  const verbs = await render(VerbsSettings, 'es')
  expect(verbs).toContain('199 de 199 seleccionados')
  expect(verbs.indexOf('>ser</span>')).toBeLessThan(verbs.indexOf('>être</span>'))
  const tenses = await render(TenseSettings, 'es')
  expect(tenses.indexOf('>Pretérito imperfecto</span>')).toBeLessThan(
    tenses.indexOf('>Imparfait</span>')
  )
  expect(tenses).toContain('Indicativo')
})
it('renders French verb and tense labels before Spanish translations', async () => {
  const verbs = await render(VerbsSettings, 'fr')
  expect(verbs).toContain('199 sur 199 sélectionnés')
  expect(verbs.indexOf('>être</span>')).toBeLessThan(verbs.indexOf('>ser</span>'))
  const tenses = await render(TenseSettings, 'fr')
  expect(tenses.indexOf('>Imparfait</span>')).toBeLessThan(
    tenses.indexOf('>Pretérito imperfecto</span>')
  )
  expect(tenses).toContain('Indicatif')
})
