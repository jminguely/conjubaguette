<template>
  <div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 flex-wrap">
      <div
        class="grow rounded-lg py-5 bg-white text-gray-800"
        v-for="(moods, moodKey) in availableMoods"
        :key="moodKey"
      >
        <h3 class="font-bold">{{ moodKey }}</h3>
        <div v-for="tense in moods" :key="moodKey + '/' + tense">
          <input
            class="mr-2"
            type="checkbox"
            :id="moodKey + '/' + tense"
            :value="moodKey + '/' + tense"
            :checked="store.checkedTenses.includes(moodKey + '/' + tense)"
            @change="checkTense($event)"
          />
          <label :for="moodKey + '/' + tense">{{ tense }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

import availableMoods from '../assets/data/moods.json'
import { useStore } from '/store/tenses'

const store = useStore()

watch(
  () => store.checkedTenses,
  () => {
    store.updateCookie()
  },
  { deep: true }
)

function checkTense(e) {
  store.checkTense(e.target.value)
}
</script>
