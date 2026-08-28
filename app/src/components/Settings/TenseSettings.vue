<template>
  <div class="flex flex-col py-2">
    <div>
      <div v-for="(tenses, mood) in groupedTenses" :key="mood" class="mb-8">
        <h4 class="font-bold text-2xl mb-4 text-orange">{{ mood }}</h4>
        <div class="flex flex-col gap-3">
          <label
            v-for="(tense, tenseKey) in tenses"
            :key="tenseKey"
            class="flex items-center justify-between cartoon-button bg-white text-black !p-3"
            :class="tenseStore.checkedTenses.includes(tenseKey) ? 'border-orange bg-orange/10' : ''"
          >
            <div class="flex flex-col flex-1">
              <span class="font-bold border-b-2 border-black/10 pb-1 mb-1">{{
                tense['fr'].label
              }}</span>
              <span class="font-bold text-black/60">{{ tense['es'].label }}</span>
            </div>
            <div class="ml-4">
              <input
                type="checkbox"
                class="w-6 h-6 accent-orange rounded cursor-pointer"
                :id="tenseKey"
                :value="tenseKey"
                :checked="tenseStore.checkedTenses.includes(tenseKey)"
                @change="checkTense($event)"
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import tenses from '@/assets/data/tenses.json'
import { useTensesStore } from '/store/tenses'

let tenseStore = ref(useTensesStore())

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
