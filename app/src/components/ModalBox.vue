<template>
  <div
    class="modal-container"
    :class="
      showModal != undefined ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    "
  >
    <div
      class="modal-content cartoon-box bg-white flex flex-col items-center max-w-2xl mx-auto my-auto relative max-h-[90vh]"
    >
      <button
        class="absolute -top-4 -right-4 cartoon-button bg-pink text-white w-12 h-12 flex items-center justify-center rounded-full !p-0 z-50 text-2xl font-bold"
        @click="$emit('update:showModal', undefined)"
      >
        ✕
      </button>

      <div class="flex flex-wrap gap-2 w-full mb-6 justify-center">
        <button
          class="cartoon-button text-lg !py-2 !px-4"
          :class="showModal === 'GeneralSettings' ? 'bg-pink text-white' : 'bg-gray-200'"
          @click="$emit('update:showModal', 'GeneralSettings')"
        >
          General
        </button>
        <button
          class="cartoon-button text-lg !py-2 !px-4"
          :class="showModal === 'TenseSettings' ? 'bg-orange text-white' : 'bg-gray-200'"
          @click="$emit('update:showModal', 'TenseSettings')"
        >
          Tenses
        </button>
        <button
          class="cartoon-button text-lg !py-2 !px-4"
          :class="showModal === 'VerbsSettings' ? 'bg-green text-black' : 'bg-gray-200'"
          @click="$emit('update:showModal', 'VerbsSettings')"
        >
          Verbs
        </button>
      </div>

      <div class="w-full overflow-y-auto pr-2">
        <component :is="showModal" />
      </div>
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

<style scoped lang="postcss">
.modal-container {
  @apply fixed min-h-screen w-full z-40 inset-0 flex bg-black/40 backdrop-blur-sm transition-opacity duration-300 p-5;
}

.modal-content {
  @apply w-full;
}
</style>
