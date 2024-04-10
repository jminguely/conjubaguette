<template>
  <div class="flex flex-col h-full">
    <SiteHeader @toggle-modal="handleToggleModal" />

    <main class="grow p-5 container max-w-7xl mx-auto relative">
      <div
        class="modal absolute min-h-full w-full z-10 inset-0 overflow-y-auto flex bg-red-300 transition-opacity duration-300 p-5"
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
          <h2>Español</h2>
          <p class="text-xl font-bold">{{ verb.es }}</p>
        </div>
        <div class="text-left w-1/2">
          <h2>Français:</h2>
          <button class="text-xl font-bold underline" @click="showVerb = !showVerb">
            {{ showVerb ? verb.fr : '???' }}
          </button>
        </div>
      </div>

      <div class="flex gap-5 mb-5">
        <div class="text-left w-1/2">
          <label for="tense">Temps</label>
          <select
            class="text-xl rounded-lg block w-full p-2.5 border-4 bg-transparent text-white"
            v-model="selectedTense"
            id="tense"
          >
            <option v-for="tense in store.checkedTenses" :key="tense" :value="tense">
              {{ tense }}
            </option>
          </select>
        </div>
        <div class="text-left w-1/2">
          <label for="person">Personne</label>
          <select
            class="text-xl rounded-lg block w-full p-2.5 border-4 bg-transparent text-white"
            v-model="selectedPerson"
            id="person"
          >
            <option v-for="(person, index) in persons" :key="index" :value="index">
              {{ person }}
            </option>
          </select>
        </div>
      </div>

      <div
        class="inputVerbContainer"
        :class="conjugatedVerb === userInput.toLowerCase().trim() && 'bravo'"
      >
        <input
          class="text-xl rounded-lg block w-full p-2.5 border-4 font-bold placeholder:text-gray-500 outline-none"
          :class="
            conjugatedVerb === userInput.toLowerCase().trim()
              ? 'border-green-400 text-green-400 bg-green-700'
              : 'border-red-300 text-red-300 bg-white'
          "
          v-model="userInput"
          type="text"
          placeholder="Conjuguez le verbe ici"
        />
      </div>

      <div class="py-5">
        <TenseDisplay
          :checkedTenses="checkedTenses"
          :availableMoods="availableMoods"
          :fullVerb="fullVerb"
          :selectedTense="selectedTense"
          :selectedPerson="selectedPerson"
          :showFullVerb="showFullVerb"
          @toggle-show-full-verb="handleToggleShowFullVerb"
        />
      </div>
    </main>
    <SiteFooter :shuffle="shuffle" />
  </div>
</template>

<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import TenseDisplay from './components/TenseDisplay.vue'
import TenseSettings from './components/TenseSettings.vue'
import VerbsSettings from './components/VerbsSettings.vue'

import { ref, onMounted } from 'vue'
import axios from 'axios'
import availableVerbs from './assets/data/verbs.json'
import availableMoods from './assets/data/moods.json'
import { useStore } from '/store/tenses'

const store = useStore()

const selectedTense = ref('présent')
const selectedPerson = ref(0)
const userInput = ref('')
const showVerb = ref(false)
const showFullVerb = ref(false)
const showModal = ref(false)
const checkedTenses = ref([])

const handleToggleModal = (page) => {
  if (page === showModal.value) {
    showModal.value = false
    shuffle()
  } else {
    showModal.value = page
  }
}

const handleToggleShowFullVerb = () => {
  showFullVerb.value = !showFullVerb.value
}

const persons = ref(['je', 'tu', 'il', 'nous', 'vous', 'ils'])

let verb = ref('')
const conjugatedVerb = ref('')
const fullVerb = ref({})

const fetchVerb = async () => {
  if (!verb.value) {
    return
  }
  try {
    const response = await axios.get(`/conjugate/fr/${verb.value.fr}`)
    // console.log(response.data.moods)
    if (selectedTense.value && selectedTense.value.includes('/')) {
      const [mood, tense] = selectedTense.value.split('/', 2)

      if (response.data.moods[mood] && response.data.moods[mood][tense]) {
        conjugatedVerb.value = response.data.moods[mood][tense][selectedPerson.value]
      } else {
        console.error(`Mood ${mood} or tense ${tense} not found in response data`)
      }
    } else {
      console.error('selectedTense.value is not properly initialized or does not contain a /')
    }

    fullVerb.value = response.data.moods
  } catch (error) {
    console.error(error)
  }
}

const shuffle = () => {
  selectedTense.value = store.checkedTenses[Math.floor(Math.random() * store.checkedTenses.length)]
  selectedPerson.value = Math.floor(Math.random() * persons.value.length)
  verb.value = availableVerbs[Math.floor(Math.random() * availableVerbs.length)]
  showVerb.value = false
  showFullVerb.value = false
  userInput.value = ''
  if (showModal.value) showModal.value = false

  fetchVerb()
}

onMounted(() => {
  fetchVerb()
  store.loadFromCookie()
  shuffle()
})
</script>

<style lang="postcss" scoped>
.inputVerbContainer {
  position: relative;

  &.bravo::after {
    position: absolute;
    right: 12px;
    top: 6px;
    content: '🥖';
    margin-left: 10px;
    font-size: 30px;
  }
}
</style>
