<template>
  <div class="flex flex-col h-full">
    <header class="text-center p-5 bg-red-700 border-b-2">
      <h1 class="text-3xl font-bold uppercase">Conju-baguette</h1>
    </header>
    <main class="text-center p-5 container max-w-7xl mx-auto">
      <div class="flex gap-5 mb-5">
        <div class="text-left w-1/2">
          <h2>Español</h2>
          <p class="text-xl font-bold">{{ verb.sp }}</p>
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
            <option v-for="tense in tenses" :key="tense" :value="tense">
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
        :class="conjugatedVerb === userInput.toLowerCase() && 'bravo'"
      >
        <input
          class="text-xl rounded-lg block w-full p-2.5 border-4 font-bold bg-transparent placeholder:text-gray-500 outline-none"
          :class="
            conjugatedVerb === userInput.toLowerCase()
              ? 'border-green-400 text-green-400 bg-green-700'
              : 'border-red-300 text-red-300 bg-white'
          "
          v-model="userInput"
          type="text"
          placeholder="Conjuguez le verbe ici"
        />
      </div>

      <div class="py-5">
        <button class="mb-5" @click="showFullVerb = !showFullVerb">
          <span class="underline">Solution</span> {{ showFullVerb ? '⬆' : '⬇' }}
        </button>
        <div v-if="showFullVerb" class="flex flex-wrap gap-5">
          <template v-for="(tense, tenseLabel) in fullVerb['indicatif']" :key="tenseLabel">
            <div
              class="grow border-2 border-white rounded-lg p-8"
              v-if="tenses.includes(tenseLabel)"
            >
              <h3 class="font-bold mb-5">
                {{ tenseLabel }}
              </h3>

              <div v-for="(person, key) in tense" :key="key">
                <p
                  :class="
                    selectedTense === tenseLabel &&
                    selectedPerson === key &&
                    'text-green-400 font-bold'
                  "
                >
                  {{ person }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
    <footer class="border-t-2 text-center mt-auto">
      <button class="text-2xl font-bold bg-red-700 p-5 w-full" @click="selectRandomVerb">
        Shuffle 🃏
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import verbs from './assets/data/verbs.json'

const selectedTense = ref('présent')
const selectedPerson = ref(0)
const userInput = ref('')
const showVerb = ref(false)
const showFullVerb = ref(false)

const tenses = ref(['présent', 'imparfait', 'passé-composé'])
const persons = ref(['je', 'tu', 'il', 'nous', 'vous', 'ils'])

let verb = ref(verbs[Math.floor(Math.random() * verbs.length)])
const conjugatedVerb = ref('')
const fullVerb = ref('')

const fetchVerb = async () => {
  try {
    const response = await axios.get(`/api/verbecc/conjugate/fr/${verb.value.fr}`)
    console.log(response)
    conjugatedVerb.value =
      response.data.value.moods['indicatif'][selectedTense.value][selectedPerson.value]
    fullVerb.value = response.data.value.moods
  } catch (error) {
    console.error(error)
  }
}

const selectRandomVerb = () => {
  selectedTense.value = tenses.value[Math.floor(Math.random() * tenses.value.length)]
  selectedPerson.value = Math.floor(Math.random() * persons.value.length)
  verb.value = verbs[Math.floor(Math.random() * verbs.length)]
  showVerb.value = false
  showFullVerb.value = false
  userInput.value = ''
  fetchVerb()
}

onMounted(fetchVerb)
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
