<template>
  <footer class="text-center mt-auto p-6">
    <a
      class="cartoon-input cartoon-button bg-pink text-white hover:bg-pink-dark cursor-pointer"
      :class="conjubravo && 'bg-pink-dark'"
      @click="shuffle"
    >
      Shuffle
    </a>
  </footer>
</template>

<script setup>
defineProps({
  shuffle: Function,
  conjubravo: Boolean
})
</script>
