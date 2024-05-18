<template>
  <div class="flex flex-col">
    <button class="mx-auto" @click="showFullVerb = !showFullVerb">
      <span class="underline">Solution</span> {{ !showFullVerb ? '↓' : '↑' }}
    </button>

    <div
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-wrap pt-3"
      v-if="showFullVerb"
    >
      <template v-for="(tense, keyTense) in availableTenses" :key="keyTense">
        <div
          v-if="tense.split('/', 3)[0] === sessionStore.languageSetting"
          class="grow rounded-lg p-5 bg-white text-gray-800"
        >
          <h3 class="font-bold mb-1 p-1">
            {{ tense.split('/', 3)[1] }}: {{ tense.split('/', 3)[2] }}
          </h3>

          <ul class="flex flex-col items-start">
            <template
              v-for="(person, keyPerson) in fullVerb?.moods[tense.split('/', 3)[1]]?.[
                tense.split('/', 3)[2]
              ]"
              :key="keyPerson"
            >
              <li
                v-if="fullVerb?.moods[tense.split('/', 3)[1]]?.[tense.split('/', 3)[2]]"
                class="inline p-1"
                :class="selectedPerson === keyPerson && 'bg-green/30'"
                v-html="highlightStem(person)"
              ></li>
            </template>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from '/store/session'
import { ref } from 'vue'

const sessionStore = useSessionStore()

const showFullVerb = ref(false)

const props = defineProps({
  fullVerb: Object,
  availableTenses: Array,
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
