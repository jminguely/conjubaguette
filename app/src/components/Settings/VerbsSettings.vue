<template>
  <div class="flex flex-col py-8">
    <div class="overflow-x-auto">
      <div class="align-middle inline-block min-w-full sm:px-2 lg:px-4">
        <h3 class="font-bold text-lg">Verbs</h3>
        <div class="flex gap-5 mt-2 mb-4">
          <button @click="uncheckAll" class="btn">Uncheck All</button>
          <button @click="checkAll" class="btn">Check All</button>
        </div>
        <div class="overflow-hidden mb-5">
          <table class="min-w-full divide-y divide-black border-2">
            <thead class="bg-black text-white">
              <tr>
                <th class="text-left px-2 py-2 equal-width" scope="col">French</th>
                <th class="text-left px-2 py-2 equal-width" scope="col">Spanish</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody class="">
              <tr v-for="(verb, index) in availableVerbs" :key="index">
                <td class="px-2 py-1">
                  {{ verb.fr_label ? verb.fr_label : verb.fr }}
                </td>
                <td class="px-2 py-1">
                  {{ verb.es_label ? verb.es_label : verb.es }}
                </td>

                <td class="px-2 py-1 flex">
                  <label class="switch ml-auto">
                    <input
                      type="checkbox"
                      :value="JSON.stringify(verb)"
                      :checked="
                        verbsStore.checkedVerbs.some(
                          (v) => JSON.stringify(v) === JSON.stringify(verb)
                        )
                      "
                      @change="toggleVerb($event)"
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
</template>

<script setup>
import { ref } from 'vue'
import availableVerbs from '@/assets/data/verbs.json'

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
