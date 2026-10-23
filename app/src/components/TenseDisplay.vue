<template>
  <div class="flex flex-col mt-8">
    <button
      class="mx-auto flex items-center gap-2 cartoon-button bg-white text-black text-lg py-2 px-6"
      :aria-expanded="showFullVerb"
      @click="showFullVerb = !showFullVerb"
    >
      <span>{{ t(showFullVerb ? 'hideConjugations' : 'showConjugations') }}</span>
      <span class="font-medium">{{ !showFullVerb ? '↓' : '↑' }}</span>
    </button>

    <div class="grid sm:grid-cols-2 gap-5 flex-wrap pt-6" v-if="showFullVerb">
      <template v-for="keyTense in availableTenses" :key="keyTense">
        <div class="grow cartoon-box bg-white text-black noise">
          <h3 class="font-semibold text-base mb-3 border-b-2 border-black/10 pb-2">
            {{ tenses[keyTense][language].label }}
            <span class="block text-sm font-normal text-black/60 mt-1" :lang="secondaryLanguage">{{
              tenses[keyTense][secondaryLanguage].label
            }}</span>
          </h3>

          <ul class="flex flex-col items-start gap-1">
            <template v-for="keyPerson in subjects[sessionStore.languageSetting]" :key="keyPerson">
              <li
                v-if="fullVerb?.conjugation?.[keyTense]"
                class="p-1 px-2 flex gap-2 rounded-md w-full"
                :class="[
                  selectedPerson === keyPerson && 'bg-orange/20 font-medium',
                  !isAvailable(keyTense, keyPerson) && 'opacity-40 grayscale'
                ]"
              >
                <span
                  class="w-1/3 text-right text-black/60"
                  :class="!isAvailable(keyTense, keyPerson) ? 'line-through' : ''"
                  >{{ getDisplaySubject(keyTense, keyPerson) }}</span
                >
                <span class="w-2/3">
                  <template
                    v-for="(part, index) in getHighlightedParts(
                      getDisplayedConjugation(keyTense, keyPerson)
                    )"
                    :key="`${keyTense}-${keyPerson}-${index}`"
                  >
                    <span v-if="part.highlight" class="text-pink-dark font-medium">{{
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
import { useUiLanguage } from '@/composables/useUiLanguage'
const { t, language, secondaryLanguage } = useUiLanguage()
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
    const root = props.fullVerb.verb.root || ''
    if (root && person?.toLowerCase().startsWith(root.toLowerCase())) {
      return [
        { text: person.slice(0, root.length), highlight: true },
        { text: person.slice(root.length), highlight: false }
      ]
    }
  }
  return [{ text: person || '', highlight: false }]
}
</script>
