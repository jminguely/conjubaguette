<template>
  <div class="flex flex-col py-8">
    <div class="overflow-x-auto">
      <div class="align-middle inline-block min-w-full sm:px-2 lg:px-4">
        <h3 class="font-bold text-lg">Tenses</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 flex-wrap py-2">
          <div v-for="(tense, tenseKey) in tenses" :key="tenseKey">
            <input
              class="mr-2"
              type="checkbox"
              :id="tenseKey"
              :value="tenseKey"
              :checked="tenseStore.checkedTenses.includes(tenseKey)"
              @change="checkTense($event)"
            />
            <label :for="tenseKey">{{ tense[sessionStore.languageSetting].name }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import tenses from '@/assets/data/tenses.json'
import { useTensesStore } from '/store/tenses'
import { useSessionStore } from '/store/session'

let tenseStore = ref(useTensesStore())
let sessionStore = ref(useSessionStore())

function checkTense(e) {
  if (tenseStore.value) {
    tenseStore.value.checkTense(e.target.value)
  }
}
</script>
