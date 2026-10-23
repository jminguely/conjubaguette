import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { createRenderer, nextTick } from 'vue'
import { createPinia } from 'pinia'
const requests = vi.hoisted(() => [])
vi.mock('axios', () => ({
  default: {
    create: () => ({
      post: (url, body, options) =>
        new Promise((resolve, reject) => requests.push({ url, body, options, resolve, reject }))
    }),
    isCancel: () => false
  }
}))
vi.mock('js-cookie', () => ({ default: { get: () => undefined, set: () => {}, remove: () => {} } }))
import { useExercise } from './useExercise'
const renderer = createRenderer({
  createElement: () => ({}),
  createComment: () => ({}),
  createText: () => ({}),
  insert: () => {},
  remove: () => {},
  setElementText: () => {},
  setText: () => {},
  parentNode: () => null,
  nextSibling: () => null,
  patchProp: () => {}
})
let app, exercise
const flush = async () => {
  await Promise.resolve()
  await nextTick()
  await nextTick()
}
const result = (word) => ({
  data: {
    verb: { root: word },
    conjugation: {
      'present-tense': Object.fromEntries(
        ['1s', '2s', '3s', '1p', '2p', '3p'].map((key) => [key, word])
      )
    }
  }
})
beforeEach(() => {
  requests.length = 0
  vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} })
  app = renderer.createApp({
    setup() {
      exercise = useExercise()
      return () => null
    }
  })
  app.use(createPinia())
  app.mount({})
})
afterEach(() => {
  app.unmount()
  vi.unstubAllGlobals()
})
it('ignores stale responses when a new exercise is requested', async () => {
  exercise.shuffle()
  expect(requests[0].options.signal.aborted).toBe(true)
  requests[1].resolve(result('new'))
  await flush()
  requests[0].resolve(result('old'))
  await flush()
  expect(exercise.fullVerb.value.verb.root).toBe('new')
  expect(exercise.isVerbLoading.value).toBe(false)
})
it('credits a completed exercise only once', async () => {
  requests[0].resolve(result('hablo'))
  await flush()
  exercise.userResponses.value[0] = 'hablo'
  await flush()
  expect(exercise.sessionStore.counter).toBe(1)
  exercise.userResponses.value[0] = ''
  await flush()
  exercise.userResponses.value[0] = 'hablo'
  await flush()
  expect(exercise.sessionStore.counter).toBe(1)
})
it('does not credit missing forms and recovers from errors', async () => {
  requests[0].resolve({ data: { conjugation: {} } })
  await flush()
  expect(exercise.sessionStore.counter).toBe(0)
  expect(exercise.errorMessage.value).toContain('No hay formas')
  exercise.shuffle()
  requests[1].resolve(result('works'))
  await flush()
  expect(exercise.errorMessage.value).toBe('')
  expect(exercise.exerciseTenses.value).toEqual(['present-tense'])
})
it('refreshes with the selected language when settings close', async () => {
  exercise.handleToggleModal('GeneralSettings')
  await flush()
  exercise.sessionStore.languageSetting = 'fr'
  exercise.showModal.value = undefined
  await flush()
  expect(requests.at(-1).url).toContain('/conjugate/fr/')
})
