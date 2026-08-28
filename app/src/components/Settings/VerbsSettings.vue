<template>
  <div class="flex flex-col py-2">
    <div>
      <div class="flex gap-3 mb-6 justify-center">
        <button @click="uncheckAll" class="cartoon-button text-base bg-white w-1/2">
          Uncheck All
        </button>
        <button @click="checkAll" class="cartoon-button text-base bg-green-dark w-1/2">
          Check All
        </button>
      </div>

      <div class="flex flex-col gap-6">
        <div
          v-for="level in ['easy', 'medium', 'hard']"
          :key="level"
          class="border-2 border-black rounded-xl p-4 bg-gray-50/50 shadow-[4px_4px_0_rgba(0,0,0,1)]"
        >
          <div class="flex items-center justify-between mb-4 pb-2 border-b-2 border-black/10">
            <div class="flex items-center gap-2">
              <span
                class="w-3.5 h-3.5 rounded-full border border-black"
                :class="{
                  'bg-green-dark': level === 'easy',
                  'bg-orange': level === 'medium',
                  'bg-pink': level === 'hard'
                }"
              ></span>
              <h3 class="font-black text-lg uppercase text-black">
                {{ getLevelLabel(level) }}
              </h3>
            </div>
            <div class="flex gap-2">
              <button
                @click="uncheckLevel(level)"
                class="px-3 py-1 text-xs font-bold bg-white border-2 border-black rounded shadow-[2px_2px_0_rgba(0,0,0,1)] hover:bg-black/5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_rgba(0,0,0,1)] transition-all"
              >
                Uncheck
              </button>
              <button
                @click="checkLevel(level)"
                class="px-3 py-1 text-xs font-bold text-white border-2 border-black rounded shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_rgba(0,0,0,1)] transition-all"
                :class="{
                  'bg-green-dark': level === 'easy',
                  'bg-orange': level === 'medium',
                  'bg-pink': level === 'hard'
                }"
              >
                Check
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            <label
              v-for="(verb, index) in getVerbsByLevel(level)"
              :key="index"
              class="flex items-center justify-between cartoon-button bg-white text-black !p-3 cursor-pointer hover:bg-black/5"
              :class="
                verbsStore.checkedVerbs.some((v) => JSON.stringify(v) === JSON.stringify(verb))
                  ? 'border-green-dark bg-green-dark/10'
                  : ''
              "
            >
              <div class="flex flex-col flex-1 text-left">
                <span class="font-bold border-b-2 border-black/10 pb-1 mb-1">{{
                  verb.fr_label ? verb.fr_label : verb.fr
                }}</span>
                <span class="font-bold text-black/60">{{
                  verb.es_label ? verb.es_label : verb.es
                }}</span>
              </div>
              <div class="ml-4 flex items-center">
                <input
                  type="checkbox"
                  class="w-6 h-6 accent-green-dark rounded cursor-pointer"
                  :value="JSON.stringify(verb)"
                  :checked="
                    verbsStore.checkedVerbs.some((v) => JSON.stringify(v) === JSON.stringify(verb))
                  "
                  @change="toggleVerb($event)"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import availableVerbs from '@/assets/data/verbs.json'
import { getVerbDifficulty } from '@/lib/verbDifficulty'

import { useVerbsStore } from '/store/verbs'

let verbsStore = ref(useVerbsStore())

function checkAll() {
  verbsStore.value.checkAllVerbs()
}

function uncheckAll() {
  verbsStore.value.uncheckAllVerbs()
}

function toggleVerb(e) {
  if (verbsStore.value) {
    verbsStore.value.toggleVerb(e.target.value)
  }
}

function getLevelLabel(level) {
  if (level === 'easy') return 'Facile (Easy)'
  if (level === 'medium') return 'Moyen (Medium)'
  if (level === 'hard') return 'Difficile (Hard)'
  return level
}

function getVerbsByLevel(level) {
  return availableVerbs.filter((verb) => getVerbDifficulty(verb) === level)
}

function checkLevel(level) {
  const verbs = getVerbsByLevel(level)
  verbsStore.value.checkVerbs(verbs)
}

function uncheckLevel(level) {
  const verbs = getVerbsByLevel(level)
  verbsStore.value.uncheckVerbs(verbs)
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

/* Custom scrollbar styles for cartoon theme */
div::-webkit-scrollbar {
  width: 6px;
}
div::-webkit-scrollbar-track {
  background: transparent;
}
div::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
div::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}
</style>
