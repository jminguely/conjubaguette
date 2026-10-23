import tenses from '../assets/data/tenses.json'
import subjects from '../assets/data/subjects.json'

import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import axios from 'axios'

import { useTensesStore } from '/store/tenses'
import { useVerbsStore } from '/store/verbs'
import { useSessionStore } from '/store/session'

import { compareAnswer, getConjugationAnswer } from '../lib/exercise'
import { getAllowedPersonIndices } from '../lib/exerciseModes'
import { useUiLanguage } from './useUiLanguage'
import { filterVerbsByDifficulty } from '../lib/verbDifficulty'

const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '', timeout: 20000 })

export function useExercise() {
  const { t } = useUiLanguage()
  const tenseStore = useTensesStore()
  const verbsStore = useVerbsStore()
  const sessionStore = useSessionStore()

  const selectedPerson = ref(0)

  const showVerb = ref(false)

  const showModal = ref(undefined)

  const userResponses = ref([])
  const correctAnswers = ref([])
  const exerciseAvailability = ref([])
  const isVerbLoading = ref(true)
  const verb = ref(null)
  const fullVerb = ref({})
  const exerciseTenses = ref([])
  const errorKey = ref('')
  const errorMessage = computed(() => (errorKey.value ? t(errorKey.value) : ''))

  const eligibleVerbs = computed(() =>
    filterVerbsByDifficulty(verbsStore.checkedVerbs, sessionStore.difficultySetting)
  )

  const allowedPersonIndices = computed(() => getAllowedPersonIndices(sessionStore.personSetting))

  const isImperativeFrenchTense = (tenseKey) => {
    const tense = tenses?.[tenseKey]?.[sessionStore.languageSetting]
    if (!tense) return false
    return sessionStore.languageSetting === 'fr' && tense.mood === 'Imperatif'
  }

  const getDisplaySubject = (tenseKey, subject) =>
    isImperativeFrenchTense(tenseKey) ? `(${subject})` : subject

  const isCorrect = computed(() => {
    if (isVerbLoading.value || !userResponses.value || !correctAnswers.value) {
      return []
    }

    const results = userResponses.value.map((response, index) =>
      exerciseAvailability.value[index]
        ? compareAnswer(response, correctAnswers.value[index])
        : { isCorrect: true, isTotallyCorrect: true, isUnavailable: true }
    )

    return results
  })

  let isExerciseFinished = false

  watch(
    isCorrect,
    () => {
      if (isExerciseFinished || isCorrect.value.length === 0) return
      // Return true if all answers are correct
      const areAllAnswersCorrect = isCorrect.value.every((result) => result.isCorrect)
      if (areAllAnswersCorrect) {
        sessionStore.incrementCounter()
        isExerciseFinished = true
      }
    },
    { immediate: true }
  )

  let requestId = 0
  let controller
  const cancelRequest = () => {
    requestId++
    controller?.abort()
  }
  onBeforeUnmount(cancelRequest)

  const prepareVerb = async () => {
    cancelRequest()
    const currentRequest = requestId
    controller = new AbortController()
    isVerbLoading.value = true
    isExerciseFinished = false
    showVerb.value = false
    errorKey.value = ''
    exerciseAvailability.value = []

    if (!verb.value) {
      isVerbLoading.value = false
      return
    }

    const language = sessionStore.languageSetting
    const selectedTenses = [...tenseStore.checkedTenses]
    const conjugateTenses = {}
    selectedTenses.forEach((tenseKey) => {
      conjugateTenses[tenseKey] = tenses[tenseKey][sessionStore.languageSetting]
    })

    try {
      const response = await apiClient.post(
        `/conjugate/${language}/${encodeURIComponent(verb.value[language])}`,
        {
          tenses: conjugateTenses
        },
        { signal: controller.signal }
      )
      if (currentRequest !== requestId) return
      fullVerb.value = response.data
      exerciseTenses.value = selectedTenses

      const playablePersonIndices = allowedPersonIndices.value.filter((personIndex) =>
        exerciseTenses.value.some((tense) =>
          getConjugationAnswer(
            fullVerb.value,
            tense,
            sessionStore.languageSetting,
            subjects[sessionStore.languageSetting][personIndex]
          )
        )
      )

      const personPool =
        playablePersonIndices.length > 0 ? playablePersonIndices : allowedPersonIndices.value
      selectedPerson.value = personPool[Math.floor(Math.random() * personPool.length)]

      const selectedSubject = subjects[sessionStore.languageSetting][selectedPerson.value]
      exerciseAvailability.value = exerciseTenses.value.map((tense) =>
        Boolean(
          getConjugationAnswer(fullVerb.value, tense, sessionStore.languageSetting, selectedSubject)
        )
      )

      if (exerciseAvailability.value.every((isAvailable) => !isAvailable)) {
        throw new Error('noForms')
      }

      correctAnswers.value = exerciseTenses.value.map((tense) =>
        getConjugationAnswer(fullVerb.value, tense, sessionStore.languageSetting, selectedSubject)
      )

      userResponses.value = exerciseTenses.value.map(() => '')
    } catch (error) {
      if (currentRequest !== requestId || axios.isCancel(error)) return
      fullVerb.value = {}
      exerciseTenses.value = []
      userResponses.value = []
      correctAnswers.value = []
      exerciseAvailability.value = []
      errorKey.value = error.message === 'noForms' ? 'noForms' : 'loadError'
    } finally {
      if (currentRequest === requestId) isVerbLoading.value = false
    }
  }

  const handleToggleModal = (page) => {
    cancelRequest()
    isVerbLoading.value = true
    showModal.value = page
  }
  watch(showModal, (value, previous) => {
    if (!value && previous) shuffle()
  })

  const getRandomItemNotLast = (verbs, lastVerb) => {
    const pool = verbs.length > 1 ? verbs.filter((verb) => verb !== lastVerb) : verbs
    return pool[Math.floor(Math.random() * pool.length)] || null
  }

  const shuffle = () => {
    cancelRequest()
    errorKey.value = ''
    exerciseAvailability.value = []
    exerciseTenses.value = []
    fullVerb.value = {}
    userResponses.value = []
    correctAnswers.value = []
    const verbPool = eligibleVerbs.value
    if (!verbPool.length) {
      verb.value = null
      errorKey.value = verbsStore.checkedVerbs.length ? 'noDifficultyMatch' : 'emptySelection'
      isVerbLoading.value = false
      return
    }
    verb.value = getRandomItemNotLast(verbPool, verb.value)
    prepareVerb()
  }
  onMounted(() => {
    sessionStore.resetDailyCounter()
    shuffle()
  })
  return {
    sessionStore,
    verb,
    showVerb,
    showModal,
    userResponses,
    exerciseAvailability,
    isVerbLoading,
    fullVerb,
    exerciseTenses,
    errorMessage,
    selectedPerson,
    isCorrect,
    getDisplaySubject,
    handleToggleModal,
    shuffle
  }
}
