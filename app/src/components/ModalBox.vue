<template>
  <div
    class="modal absolute min-h-full w-full z-40 inset-0 flex bg-yellow/50 backdrop-blur-md transition-opacity duration-300 p-5"
    :class="
      showModal != undefined ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    "
  >
    <div
      class="modal-content w-full h-full overflow-y-auto bg-white text-black p-6 rounded shadow-lg"
    >
      <div class="-m-6 flex border-b-2 mb-1">
        <button
          class="grow py-3"
          :class="showModal === 'GeneralSettings' && 'bg-pink font-semibold'"
          @click="$emit('update:showModal', 'GeneralSettings')"
        >
          General
        </button>
        <button
          :class="showModal === 'TenseSettings' && 'bg-pink font-semibold'"
          class="grow py-3 border-l-2"
          @click="$emit('update:showModal', 'TenseSettings')"
        >
          Tenses
        </button>
        <button
          :class="showModal === 'VerbsSettings' && 'bg-pink font-semibold'"
          class="grow py-3 border-l-2"
          @click="$emit('update:showModal', 'VerbsSettings')"
        >
          Verbs
        </button>
      </div>

      <component :is="showModal" />
    </div>
  </div>
</template>

<script>
import GeneralSettings from '../components/Settings/GeneralSettings.vue'
import TenseSettings from '../components/Settings/TenseSettings.vue'
import VerbsSettings from '../components/Settings/VerbsSettings.vue'

export default {
  components: { GeneralSettings, TenseSettings, VerbsSettings },
  props: {
    showModal: String
  }
}
</script>
