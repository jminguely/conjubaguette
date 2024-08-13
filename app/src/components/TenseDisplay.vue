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
                :class="selectedPerson === keyPerson && 'bg-green/30'"
              >
                <span>{{ keyPerson }} </span>
                <span v-html="highlightStem(fullVerb?.conjugation[keyTense][keyPerson])"></span>
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

import { useSessionStore } from '/store/session'
const sessionStore = useSessionStore()

import { ref } from 'vue'

const showFullVerb = ref(false)

const props = defineProps({
  fullVerb: Object,
  availableTenses: Array,
  selectedPerson: String
})

const highlightStem = (person) => {
  if (props.fullVerb && props.fullVerb.verb) {
    const root = props.fullVerb.verb.root
    return person.replace(
      new RegExp(`^${root}`, 'i'),
      `<span class="text-red-500 font-bold">${root}</span>`
    )
  }
}
</script>
