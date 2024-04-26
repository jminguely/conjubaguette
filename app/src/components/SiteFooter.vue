<template>
  <footer class="border-t-2 text-center mt-auto">
    <button
      class="text-2xl font-bold bg-red-700 p-5 w-full transition-all duration-300"
      :class="conjubravo && 'bg-yellow-500 text-gray-800'"
      @click="shuffle"
    >
      Shuffle 🃏
    </button>
  </footer>
</template>

<script setup>
defineProps({
  shuffle: Function,
  conjubravo: Boolean
})
</script>
