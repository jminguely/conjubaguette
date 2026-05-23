<template>
  <div class="flex flex-col">
    <button class="mx-auto" @click="showFullVerb = !showFullVerb">
      <span class="underline">Solution</span> {{ !showFullVerb ? '↓' : '↑' }}
    </button>

    <div
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-wrap pt-3"
      v-if="showFullVerb"
    >
      <template v-for="keyTense in availableTenses" :key="keyTense">
        <div class="grow rounded-lg p-5 bg-white text-gray-800 noise">
          <h3 class="font-bold mb-1 p-1">
            {{ tenses[keyTense][sessionStore.languageSetting].label }}
          </h3>

          <ul class="flex flex-col items-start">
            <template v-for="keyPerson in subjects[sessionStore.languageSetting]" :key="keyPerson">
              <li
                v-if="fullVerb?.conjugation[keyTense]"
                class="p-1 flex gap-1"
                :class="[
                  selectedPerson === keyPerson && 'bg-green/30',
                  !isAvailable(keyTense, keyPerson) && 'opacity-40 grayscale'
                ]"
              >
                <span :class="!isAvailable(keyTense, keyPerson) ? 'line-through' : ''">{{ getDisplaySubject(keyTense, keyPerson) }} </span>
                <span>
                  <template
                    v-for="(part, index) in getHighlightedParts(
                      getDisplayedConjugation(keyTense, keyPerson)
                    )"
                    :key="`${keyTense}-${keyPerson}-${index}`"
                  >
                    <span v-if="part.highlight" class="text-red-500 font-bold">{{
                      part.text
                    }}</span>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </span>
              </li>
            </template>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import tenses from '@/assets/data/tenses.json'
import subjects from '@/assets/data/subjects.json'
import { getConjugationAnswer, getSubjectApiKey } from '@/lib/exercise'

import { useSessionStore } from '/store/session'
const sessionStore = useSessionStore()

import { ref } from 'vue'

const showFullVerb = ref(false)

const props = defineProps({
  fullVerb: Object,
  availableTenses: Array,
  selectedPerson: String
})

const getDisplayedConjugation = (tense, subject) =>
  getConjugationAnswer(props.fullVerb, tense, sessionStore.languageSetting, subject)

const isAvailable = (tense, subject) => {
  const available = props.fullVerb?.availability?.[tense] || []
  return (
    available.includes(subject) ||
    available.includes(getSubjectApiKey(sessionStore.languageSetting, subject))
  )
}

const isImperativeFrenchTense = (tenseKey) => {
  const tense = tenses?.[tenseKey]?.[sessionStore.languageSetting]
  if (!tense) return false
  return sessionStore.languageSetting === 'fr' && tense.mood === 'Imperatif'
}

const getDisplaySubject = (tenseKey, subject) =>
  isImperativeFrenchTense(tenseKey) ? `(${subject})` : subject

const getHighlightedParts = (person) => {
  if (props.fullVerb && props.fullVerb.verb) {
    const root = props.fullVerb.verb.root
    if (person?.toLowerCase().startsWith(root.toLowerCase())) {
      return [
        { text: person.slice(0, root.length), highlight: true },
        { text: person.slice(root.length), highlight: false }
      ]
    }
  }
  return [{ text: person || '', highlight: false }]
}
</script>
