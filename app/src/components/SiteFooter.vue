<template>
  <footer class="text-center mt-auto px-6 py-7">
    <button
      class="cartoon-input cartoon-button bg-pink text-white hover:bg-pink-dark cursor-pointer"
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
