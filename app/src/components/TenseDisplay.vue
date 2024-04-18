<template>
  <div>
    <button class="mb-5" @click="showFullVerb = !showFullVerb">
      <span class="underline">Solution</span> {{ !showFullVerb ? '↓' : '↑' }}
    </button>

    <div
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-wrap"
      v-if="showFullVerb"
    >
      <div
        class="grow rounded-lg p-5 bg-white text-gray-800"
        v-for="tense in tenseStore.checkedTenses"
        :key="tense"
      >
        <h3 class="font-bold mb-1 p-1">
          {{ tense.split('/', 2)[0] }}:
          {{ tense.split('/', 2)[1] }}
        </h3>

        <ul class="flex flex-col items-start">
          <template
            v-for="(person, key) in fullVerb?.moods[tense.split('/', 2)[0]]?.[
              tense.split('/', 2)[1]
            ]"
            :key="key"
          >
            <li
              v-if="fullVerb?.moods[tense.split('/', 2)[0]]?.[tense.split('/', 2)[1]]"
              class="inline p-1"
              :class="selectedTense === tense && selectedPerson === key && 'bg-green-200'"
              v-html="highlightStem(person)"
            ></li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTensesStore } from '/store/tenses'
import { ref } from 'vue'

const tenseStore = useTensesStore()

const showFullVerb = ref(false)

const props = defineProps({
  fullVerb: Object,
  selectedTense: String,
  selectedPerson: Number
})

const highlightStem = (person) => {
  if (props.fullVerb && props.fullVerb.verb) {
    const stem = props.fullVerb.verb.stem
    const pronouns = ['je', "j'", 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles']
    const words = person.split(' ')
    const highlightedWords = words.map((word) => {
      if (!pronouns.includes(word) && word.toLowerCase().startsWith(stem)) {
        return word.replace(
          new RegExp(`^${stem}`, 'i'),
          `<span class="text-red-500 font-bold">${stem}</span>`
        )
      } else {
        return word
      }
    })
    return highlightedWords.join(' ')
  }
}
</script>
