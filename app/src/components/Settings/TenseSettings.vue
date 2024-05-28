<template>
  <div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 flex-wrap py-8">
      <h3 class="font-bold text-lg">Tenses</h3>
      <div
        class="grow rounded-lg bg-white text-gray-800"
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

import availableMoods from '@/assets/data/moods.json'
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
