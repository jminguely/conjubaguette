<template>
  <footer class="text-center mt-auto px-6 py-7">
    <button
      class="cartoon-button bg-pink text-white w-full max-w-sm hover:-translate-y-1 transition-transform"
      :class="conjubravo && 'bg-pink-dark'"
      @click="shuffle"
    >
      Shuffle
    </button>
  </footer>
</template>

<script setup>
defineProps({
  shuffle: Function,
  conjubravo: Boolean
})
</script>
