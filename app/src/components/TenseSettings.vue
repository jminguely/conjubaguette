<template>
  <div>
    <div>
      <h3 class="font-bold" for="dailyGoal">Objectifs journaliers</h3>
      <input
        class="text-xl rounded-lg block w-full p-2.5 border-4 font-bold placeholder:text-gray-500 outline-none border-red-300 text-red-300 bg-white"
        v-model="sessionStore.dailyGoal"
        @input="sessionStore.setDailyGoal"
        type="text"
        id="dailyGoal"
      />
    </div>
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
            :checked="tenseStore.checkedTenses.includes(moodKey + '/' + tense)"
            @change="checkTense($event)"
          />
          <label :for="moodKey + '/' + tense">{{ tense }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'

import availableMoods from '../assets/data/moods.json'
import { useTensesStore } from '/store/tenses'
import { useSessionStore } from '/store/session'

let tenseStore = ref(useTensesStore())
let sessionStore = ref(useSessionStore())

watch(
  () => tenseStore.value?.checkedTenses,
  () => {
    if (tenseStore.value) {
      tenseStore.value.updateCookie()
    }
  },
  { deep: true }
)

function checkTense(e) {
  if (tenseStore.value) {
    tenseStore.value.checkTense(e.target.value)
  }
}
</script>
