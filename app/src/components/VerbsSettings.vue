<template>
  <div class="flex flex-col -m-5">
    <div class="overflow-x-auto">
      <div class="align-middle inline-block min-w-full sm:px-2 lg:px-8">
        <h3 class="font-bold text-lg pt-5">Verbs</h3>
        <div class="flex gap-5 mt-2 mb-4">
          <button @click="uncheckAll" class="btn">Uncheck All</button>
          <button @click="checkAll" class="btn">Check All</button>
        </div>
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  French
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Spanish
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(verb, index) in availableVerbs" :key="index">
                <td class="px-2 py-1 whitespace-nowrap">
                  <input
                    class="mr-2"
                    type="checkbox"
                    :id="verb.fr"
                    :value="verb.fr"
                    :checked="store.checkedVerbs.includes(verb.fr)"
                    @change="checkVerb($event)"
                  />
                  <label :for="verb.fr">{{ verb.fr }}</label>
                </td>
                <td class="px-2 py-1 whitespace-nowrap">
                  {{ verb.es }}
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
import { watch, ref } from 'vue'
import availableVerbs from '../assets/data/verbs.json'

import { useVerbsStore } from '/store/verbs'

let store = ref(useVerbsStore())

watch(
  () => store.value?.checkedVerbs,
  () => {
    if (store.value) {
      store.value.updateCookie()
    }
  },
  { deep: true }
)

function checkAll() {
  store.value.checkAllVerbs()
}

function uncheckAll() {
  store.value.uncheckAllVerbs()
}

function checkVerb(e) {
  if (store.value) {
    store.value.checkVerb(e.target.value)
  }
}
</script>

<style>
.btn {
  @apply text-xs font-bold py-2 px-4 rounded bg-red-500 text-white;
}
</style>
