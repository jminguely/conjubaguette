<template>
  <div>
    <button class="mb-5" @click="$emit('toggle-show-full-verb')">
      <span class="underline">Solution</span> {{ showFullVerb ? '⬆' : '⬇' }}
    </button>
    <div
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-wrap"
      v-if="showFullVerb"
    >
      <div
        class="grow rounded-lg p-5 bg-white text-gray-800"
        v-for="tense in store.checkedTenses"
        :key="tense"
      >
        <h3 class="font-bold mb-5">
          {{ tense.split('/', 2)[0] }}:
          {{ tense.split('/', 2)[1] }}
        </h3>

        <template
          v-for="(person, key) in fullVerb?.[tense.split('/', 2)[0]]?.[tense.split('/', 2)[1]]"
          :key="key"
        >
          <ul
            class="list-disc pl-4"
            v-if="fullVerb?.[tense.split('/', 2)[0]]?.[tense.split('/', 2)[1]]"
          >
            <li
              :class="
                selectedTense === tense && selectedPerson === key && 'text-green-400 font-bold'
              "
            >
              {{ person }}
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '/store/tenses'

const store = useStore()

defineProps({
  fullVerb: Object,
  showFullVerb: Boolean,
  selectedTense: String,
  selectedPerson: Number,
  availableMoods: Object
})
</script>
