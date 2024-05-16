<template>
  <div class="flex flex-col h-svh">
    <SiteHeader @toggle-modal="handleToggleModal" />

    <main class="grow p-5 container max-w-7xl mx-auto relative">
      <h2>Objectif journalier: {{ sessionStore.counter }}/{{ sessionStore.dailyGoal }}</h2>
      <div class="w-full bg-white rounded-full h-2.5 mb-5">
        <div
          class="bg-pink h-2.5 rounded-full transition-all duration-1000 ease-in-out"
          :style="{
            width: `${(100 / sessionStore.dailyGoal) * Math.min(sessionStore.dailyGoal, sessionStore.counter)}%`
          }"
        ></div>
      </div>
      <div
        class="modal absolute min-h-full w-full z-10 inset-0 overflow-y-auto flex bg-pink/50 backdrop-blur-lg transition-opacity duration-300 p-5"
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

      <div class="flex flex-col md:flex-row gap-5 mb-5">
        <div class="text-left w-full md:w-1/2">
          <CustomSelect
            label="Temps"
            v-model:selectedOption="selectedTense"
            :disabled="conjubravo"
            :options="availableTenses"
          />
        </div>
        <div class="text-left w-full md:w-1/2">
          <CustomSelect
            label="Personne"
            v-if="personsList"
            v-model:selectedOption="selectedPerson"
            :disabled="conjubravo"
            :options="personsList"
          />
        </div>
      </div>
      <div class="inputVerbContainer" :class="conjubravo && 'bravo'">
        <label for="answer">{{ availableTenses[selectedTense] }}</label>
        <input
          class="cartoon-input block w-full placeholder:text-white outline-none transition-all duration-300"
          :class="conjubravo ? 'bg-green text-black' : 'bg-pink text-white'"
          v-model="userInput"
          ref="userInputField"
          :disabled="conjubravo"
          type="text"
          placeholder="Conjuguez le verbe ici"
          id="answer"
        />
      </div>

      <div class="py-5">
        <TenseDisplay
          :fullVerb="fullVerb"
          :selectedTense="selectedTense"
          :selectedPerson="selectedPerson"
          :availableTenses="availableTenses"
        />
      </div>
    </main>
    <SiteFooter :shuffle="shuffle" :conjubravo="conjubravo" />
  </div>
</template>

<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import TenseDisplay from './components/TenseDisplay.vue'
import TenseSettings from './components/TenseSettings.vue'
import VerbsSettings from './components/VerbsSettings.vue'

import availableVerbs from './assets/data/verbs.json'

import { ref, onMounted, watch, watchEffect } from 'vue'
import axios from 'axios'

import { useTensesStore } from '/store/tenses'
import { useVerbsStore } from '/store/verbs'
import { useSessionStore } from '/store/session'
import CustomSelect from './components/CustomSelect.vue'

const tenseStore = useTensesStore()
const verbsStore = useVerbsStore()
const sessionStore = useSessionStore()

const selectedTense = ref(0)
const selectedPerson = ref(0)
const userInput = ref('')
const userInputField = ref(null)
const showVerb = ref(false)
const showFullVerb = ref(false)
const showModal = ref(false)
const conjubravo = ref(false)
const availableTenses = ref([])

let verb = ref('')
const conjugatedVerb = ref('')
const fullVerb = ref({})
let personsList = ref([])

const loadAvailableTenses = () => {
  availableTenses.value = tenseStore.checkedTenses.filter((tense) =>
    tense.startsWith(sessionStore.languageSetting)
  )
}

watchEffect(() => {
  loadAvailableTenses(sessionStore.languageSetting, tenseStore.checkedTenses)
})

watch(verb, async () => {
  showVerb.value = false
  showFullVerb.value = false
  selectedTense.value = Math.floor(Math.random() * availableTenses?.value?.length)
  if (!verb.value) return

  const response = await axios.get(
    `/conjugate/${sessionStore.languageSetting}/${verb.value[sessionStore.languageSetting]}`
  )
  fullVerb.value = response.data
})

watch([fullVerb, selectedTense], () => {
  const [lang, mood, tense] = availableTenses.value[selectedTense.value].split('/', 3)

  if (lang == 'fr') {
    personsList.value = fullVerb.value?.moods?.[mood]?.[tense].map((person) => {
      if (person.startsWith("j'")) return "j'"
      else if (person.startsWith('ils')) return 'ils/elles'
      else if (person.startsWith('il')) return 'il/elle/on'
      else return person.split(' ')[0] + ' '
    })
  }

  if (lang == 'es') {
    personsList.value = fullVerb.value?.moods?.[mood]?.[tense].map((person) => {
      if (person.startsWith('yo')) return 'yo'
      else if (person.startsWith('nosotros')) return 'nosotros/nosotras'
      else if (person.startsWith('vosotros')) return 'vosotros/vosotras'
      else if (person.startsWith('ellos')) return 'ellos/ellas'
      else if (person.startsWith('él')) return 'él/ella/usted'
      else if (person.startsWith('tú')) return 'tú'
      else return person.split(' ')[0] + ' '
    })
  }

  selectedPerson.value = Math.floor(Math.random() * personsList?.value?.length)

  conjugatedVerb.value = fullVerb.value?.moods?.[mood]?.[tense]?.[selectedPerson.value]

  if (!conjugatedVerb.value) {
    return
  }
  if (conjugatedVerb.value.startsWith("j'")) {
    userInput.value = "j'"
  } else {
    userInput.value = conjugatedVerb.value.split(' ')[0] + ' '
  }
})

watch([userInput], () => {
  if (conjugatedVerb.value === userInput.value.toLowerCase().trim()) {
    conjubravo.value = true
    sessionStore.incrementCounter()
  }
})

const handleToggleModal = (page) => {
  if (page === showModal.value) {
    showModal.value = false
    shuffle()
  } else {
    showModal.value = page
  }
}

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)]

const shuffle = () => {
  verb.value = getRandomItem(verbsStore.checkedVerbs)
  conjubravo.value = false
  if (showModal.value) showModal.value = false
  userInputField.value.focus()
}

onMounted(() => {
  shuffle()
})
</script>

<style lang="postcss" scoped>
.inputVerbContainer {
  position: relative;

  &.bravo::after {
    position: absolute;
    right: 30px;
    top: 32px;
    content: '✔';
    margin-left: 10px;
    font-size: 30px;
  }
}
</style>
