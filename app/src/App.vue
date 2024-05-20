<template>
  <div class="flex flex-col h-svh">
    <SiteHeader @toggle-modal="handleToggleModal" />

    <main class="grow px-5 container max-w-7xl mx-auto relative">
      <h2 class="pt-3">
        Objectif journalier: {{ sessionStore.counter }}/{{ sessionStore.dailyGoal }}
      </h2>
      <div class="w-full bg-white rounded-full h-2.5 mb-5">
        <div
          class="bg-pink h-2.5 rounded-full transition-all duration-1000 ease-in-out"
          :style="{
            width: `${(100 / sessionStore.dailyGoal) * Math.min(sessionStore.dailyGoal, sessionStore.counter)}%`
          }"
        ></div>
      </div>
      <div
        class="modal absolute min-h-full w-full z-50 inset-0 overflow-y-auto flex bg-yellow/50 backdrop-blur-md transition-opacity duration-300 p-5"
        :class="
          showModal != false ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        "
      >
        <div class="modal-content m-auto bg-white text-black p-6 rounded shadow-lg">
          <TenseSettings v-if="showModal === 'tenses'" />
          <VerbsSettings v-if="showModal === 'verbs'" />
        </div>
      </div>
      <div class="flex gap-5 mb-5">
        <div class="text-left w-1/2">
          <h2>
            {{ sessionStore.languageSetting === 'fr' ? 'Español' : 'Français' }}
          </h2>
          <p class="text-xl font-bold">
            {{
              sessionStore.languageSetting === 'fr'
                ? verb['es_label']
                  ? verb['es_label']
                  : verb['es']
                : verb['fr_label']
                  ? verb['fr_label']
                  : verb['fr']
            }}
          </p>
        </div>
        <div class="text-left w-1/2">
          <h2>{{ sessionStore.languageSetting === 'fr' ? 'Français' : 'Español' }}</h2>
          <button class="text-xl font-bold underline" @click="showVerb = !showVerb">
            {{ showVerb ? verb[sessionStore.languageSetting] : '???' }}
          </button>
        </div>
      </div>
      <div class="inputsContainer">
        <div
          v-for="(tense, index) in availableTenses"
          :key="index"
          class="mb-5 inputVerbContainer"
          :class="
            (isCorrect?.[index]?.isCorrect || isCorrect?.[index]?.isTotallyCorrect) && 'bravo'
          "
        >
          <label class="label" :for="'answer' + index">{{
            moods[tense.split('/')[0]][tense.split('/')[1]].find(
              (item) => item.key === tense.split('/')[2]
            ).name
          }}</label>
          <input
            class="cartoon-input block w-full placeholder:text-white outline-none transition-all duration-300 disabled:opacity-100"
            :class="{
              'text-transparent': isVerbLoading,
              'bg-green-dark': isCorrect?.[index]?.isTotallyCorrect,
              'bg-orange': isCorrect?.[index]?.isCorrect,
              'bg-pink': !isCorrect?.[index]?.isCorrect && !isCorrect?.[index]?.isTotallyCorrect
            }"
            :disabled="isCorrect?.[index]?.isTotallyCorrect"
            v-model="userResponses[index]"
            ref="userInputField"
            type="text"
            :id="'answer' + index"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </div>
      </div>

      <div class="py-2">
        <TenseDisplay
          :fullVerb="fullVerb"
          :selectedPerson="selectedPerson"
          :availableTenses="availableTenses"
        />
      </div>
    </main>
    <SiteFooter :shuffle="shuffle" />
  </div>
</template>

<script setup>
import moods from './assets/data/moods.json'

import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import TenseDisplay from './components/TenseDisplay.vue'
import TenseSettings from './components/TenseSettings.vue'
import VerbsSettings from './components/VerbsSettings.vue'

import { ref, onMounted, watch, watchEffect, computed } from 'vue'
import axios from 'axios'

import { useTensesStore } from '/store/tenses'
import { useVerbsStore } from '/store/verbs'
import { useSessionStore } from '/store/session'

const tenseStore = useTensesStore()
const verbsStore = useVerbsStore()
const sessionStore = useSessionStore()

const selectedPerson = ref(0)

const userInputField = ref(null)
const showVerb = ref(false)
const showFullVerb = ref(false)
const showModal = ref(false)
const availableTenses = ref([])
const userResponses = ref([])
const correctAnswers = ref([])
const isVerbLoading = ref(true)
let verb = ref('')
const fullVerb = ref({})

const removeAccents = (str) => {
  return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : ''
}

const isCorrect = computed(() => {
  if (isVerbLoading.value || !userResponses.value || !correctAnswers.value) {
    return []
  }

  const results = userResponses.value.map((response, index) => {
    const isTotallyCorrect = response === correctAnswers.value[index]
    const isCorrect = removeAccents(response) === removeAccents(correctAnswers.value[index])
    return { isCorrect, isTotallyCorrect }
  })

  return results
})

let isExerciseFinished = false

watch(
  isCorrect,
  () => {
    if (isExerciseFinished || isCorrect.value.length === 0) return
    // Return true if all answers are correct
    const areAllAnswersCorrect = isCorrect.value.reduce(
      (acc, result) => {
        acc.value = acc.value && result.isCorrect
        return acc
      },
      { value: true }
    )
    if (areAllAnswersCorrect.value) {
      sessionStore.incrementCounter()
      isExerciseFinished = true
    }
  },
  { immediate: true }
)

const loadAvailableTenses = () => {
  availableTenses.value = tenseStore.checkedTenses.filter((tense) =>
    tense.startsWith(sessionStore.languageSetting)
  )
}

watchEffect(() => {
  loadAvailableTenses(sessionStore.languageSetting, tenseStore.checkedTenses)
})

const getCorrectConjugation = (verb, tense, person) => {
  return verb.value?.moods?.[tense.split('/')[1]]?.[tense.split('/')[2]]?.[person]
}

const prepareVerb = async () => {
  isExerciseFinished = false
  showVerb.value = false
  showFullVerb.value = false

  if (!verb.value) return

  const response = await axios.get(
    `/conjugate/${sessionStore.languageSetting}/${verb.value[sessionStore.languageSetting]}`
  )
  fullVerb.value = response.data

  selectedPerson.value = Math.floor(Math.random() * 6)

  correctAnswers.value = availableTenses.value.map((tense) =>
    getCorrectConjugation(fullVerb, tense, selectedPerson.value)
  )

  userResponses.value = availableTenses.value.map((tense, index) => {
    const answer = correctAnswers.value[index]
    if (answer) {
      if (sessionStore.languageSetting == 'fr' && answer.startsWith("j'")) {
        return "j'"
      } else {
        return answer.split(' ')[0] + ' '
      }
    }
    return ''
  })

  isVerbLoading.value = false
}

watch(
  verb,
  () => {
    prepareVerb()
  },
  { immediate: true }
)

const handleToggleModal = (page) => {
  if (page === showModal.value) {
    showModal.value = false
    shuffle()
  } else {
    showModal.value = page
  }
}

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)]

function getRandomItemNotLast(verbs, lastVerb) {
  if (verbs.length === 0) {
    return null
  } else if (verbs.length === 1) {
    return verbs[0]
  } else {
    let newVerb
    do {
      newVerb = getRandomItem(verbs)
    } while (newVerb === lastVerb)
    return newVerb
  }
}

const shuffle = () => {
  isVerbLoading.value = true
  let oldVerb = verb.value
  verb.value = getRandomItemNotLast(verbsStore.checkedVerbs, verb.value)
  if (verb.value === oldVerb) {
    prepareVerb()
  }
  if (showModal.value) showModal.value = false
}

onMounted(() => {
  shuffle()
})
</script>

<style lang="postcss" scoped>
.inputVerbContainer {
  position: relative;
  margin-top: 2.5rem;
  margin-bottom: 4rem;

  &:last-of-type {
    margin-bottom: 2rem;
  }

  input {
    position: relative;
    z-index: 2;
  }

  .label {
    @apply absolute text-white bg-black text-xs px-2 py-1.5 rounded-t-xl -top-6 left-2/4 -translate-x-2/4;
    z-index: 1;
  }

  &::after {
    @apply absolute text-white bg-black px-2 pt-1 pb-0.5 rounded-b-xl -bottom-0 left-2/4 -translate-x-2/4 opacity-0 transition-all duration-200 ease-in-out;
    content: '✔';
    z-index: 1;
  }

  &.bravo::after {
    @apply opacity-100 -bottom-6;
  }
}
</style>
