<template>
  <div class="flex flex-col py-8">
    <div class="overflow-x-auto">
      <div class="align-middle inline-block min-w-full sm:px-2 lg:px-4">
        <h3 class="font-bold text-lg">Tenses</h3>
        <div class="overflow-hidden mb-5">
          <div v-for="(tenses, mood) in groupedTenses" :key="mood">
            <h4 class="font-bold text-md">{{ mood }}</h4>
            <table class="min-w-full divide-y divide-black border-2 mb-4">
              <thead class="bg-black text-white">
                <tr>
                  <th class="text-left px-2 py-2 equal-width" scope="col">FR</th>
                  <th class="text-left px-2 py-2 equal-width" scope="col">ES</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tense, tenseKey) in tenses" :key="tenseKey">
                  <td class="px-2 py-1">{{ tense['fr'].label }}</td>
                  <td class="px-2 py-1">{{ tense['es'].label }}</td>
                  <td class="px-2 py-1 flex">
                    <label class="switch ml-auto">
                      <input
                        type="checkbox"
                        :id="tenseKey"
                        :value="tenseKey"
                        :checked="tenseStore.checkedTenses.includes(tenseKey)"
                        @change="checkTense($event)"
                      />
                      <span class="slider round"></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import tenses from '@/assets/data/tenses.json'
import { useTensesStore } from '/store/tenses'
import { useSessionStore } from '/store/session'

let tenseStore = ref(useTensesStore())
let sessionStore = ref(useSessionStore())

const groupedTenses = computed(() => {
  const groups = {}
  for (const [key, tense] of Object.entries(tenses)) {
    const mood = tense.fr.mood
    if (!groups[mood]) {
      groups[mood] = {}
    }
    groups[mood][key] = tense
  }
  return groups
})

const checkedTensesCount = computed(() => tenseStore.value.checkedTenses.length)

function checkTense(e) {
  const tenseKey = e.target.value
  if (tenseStore.value.checkedTenses.includes(tenseKey)) {
    if (checkedTensesCount.value > 1) {
      tenseStore.value.checkTense(tenseKey)
    } else {
      e.target.checked = true
    }
  } else {
    tenseStore.value.checkTense(tenseKey)
  }
}
</script>

<style lang="postcss" scoped>
.btn {
  @apply text-xs font-bold py-2 px-4 rounded bg-pink text-white;
}

.switch {
  @apply relative inline-block w-9 h-5;
}

.switch input {
  @apply opacity-0 w-0 h-0;
}

.slider {
  @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-black/50;
  transition: all 0.4s;
}

.slider:before {
  content: '';
  @apply absolute h-3 w-3 left-1 bottom-1 bg-white;
  transition: all 0.4s;
}

input:checked + .slider {
  @apply bg-pink;
}

input:focus + .slider {
  @apply shadow-orange outline-orange;
}

input:checked + .slider:before {
  transform: translateX(1rem);
}

.slider.round {
  @apply rounded-full;
}

.slider.round:before {
  @apply rounded-full;
}

.equal-width {
  width: 33.33%;
}
</style>
