<template>
  <div>
    <div class="flex gap-5 flex-wrap">
      <div
        class="grow rounded-lg p-8 bg-white text-gray-800"
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
            :checked="store.checkedTenses.includes(moodKey + '/' + tense)"
            @change="checkTense($event)"
          />
          <label :for="moodKey + '/' + tense">{{ tense }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import availableMoods from '../assets/data/moods.json'
import { onMounted, watch } from 'vue'
import { useStore } from '/store/tenses'

const store = useStore()
const emit = defineEmits(['update-checked-tenses'])

onMounted(() => {
  let cookies = document.cookie.split('; ')
  let checkedTensesCookie = cookies.find((row) => row.startsWith('checkedTenses='))

  if (checkedTensesCookie) {
    let checkedTensesSerialized = checkedTensesCookie.slice(14)
    store.setCheckedTenses(JSON.parse(checkedTensesSerialized)) // deserialize the array
  } else {
    console.log('checkedTenses cookie not found')
  }
})

watch(
  () => store.checkedTenses,
  (newVal) => {
    if (typeof document !== 'undefined') {
      let serializedCheckFilm = JSON.stringify(newVal) // serialize the new array

      let d = new Date()
      d.setTime(d.getTime() + 1 * 365 * 24 * 60 * 60 * 1000)
      let expires = 'expires=' + d.toUTCString()

      document.cookie = 'checkedTenses=' + serializedCheckFilm + ';' + expires

      emit('update-checked-tenses', newVal)
    } else {
      console.error('document object is not available')
    }
  },
  { deep: true }
)

function checkTense(e) {
  store.checkTense(e.target.value)
}
</script>
