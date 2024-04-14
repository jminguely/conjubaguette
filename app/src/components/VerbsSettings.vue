<template>
  <div class="flex flex-col">
    <!-- ... -->
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(verb, index) in availableVerbs" :key="index">
        <td class="px-2 py-4 whitespace-nowrap">
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
        <td class="px-2 py-4 whitespace-nowrap">
          {{ verb.es }}
        </td>
      </tr>
    </tbody>
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

function checkVerb(e) {
  if (store.value) {
    store.value.checkVerb(e.target.value)
  }
}
</script>
