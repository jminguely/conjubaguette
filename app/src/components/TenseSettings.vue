<template>
  <div>
    <div class="flex gap-5">
      <div class="w-1/2">
        <h3 for="languageSetting">Paramètres de langue</h3>
        <select
          class="text-xl rounded-lg block w-full p-2.5 border-4 placeholder:white outline-none border-red-300 text-red-300 bg-white"
          v-model="sessionStore.languageSetting"
          @change="sessionStore.setLanguageSetting"
          id="languageSetting"
        >
          <option value="es">FR → ES</option>
          <option value="fr">ES → FR</option>
        </select>
      </div>
      <div class="w-1/2">
        <h3 for="dailyGoal">Objectifs journaliers</h3>
        <input
          class="text-xl rounded-lg block w-full p-2.5 border-4 placeholder:white outline-none border-red-300 text-red-300 bg-white"
          v-model="sessionStore.dailyGoal"
          @input="sessionStore.setDailyGoal"
          type="text"
          id="dailyGoal"
        />
      </div>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 flex-wrap">
      <div
        class="grow rounded-lg py-5 bg-white text-gray-800"
        v-for="(mood, moodKey) in moods"
        :key="moodKey"
      >
        <h3 class="font-bold capitalize">{{ moodKey }}</h3>
        <div
          v-for="tense in mood"
          :key="sessionStore.languageSetting + '/' + moodKey + '/' + tense.key"
        >
          <input
            class="mr-2"
            type="checkbox"
            :id="sessionStore.languageSetting + '/' + moodKey + '/' + tense.key"
            :value="sessionStore.languageSetting + '/' + moodKey + '/' + tense.key"
            :checked="
              tenseStore.checkedTenses.includes(
                sessionStore.languageSetting + '/' + moodKey + '/' + tense.key
              )
            "
            @change="checkTense($event)"
          />
          <label :for="sessionStore.languageSetting + '/' + moodKey + '/' + tense.key">{{
            tense.name
          }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import availableMoods from '../assets/data/moods.json'
import { useTensesStore } from '/store/tenses'
import { useSessionStore } from '/store/session'

let tenseStore = ref(useTensesStore())
let sessionStore = ref(useSessionStore())

const moods = computed(() => {
  return availableMoods[sessionStore.value.languageSetting]
})

function checkTense(e) {
  if (tenseStore.value) {
    tenseStore.value.checkTense(e.target.value)
  }
}
</script>
