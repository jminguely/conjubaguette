<template>
  <footer class="border-t-2 text-center mt-auto">
    <button class="text-2xl font-bold bg-red-700 p-5 w-full" @click="shuffle">Shuffle 🃏</button>
  </footer>
</template>

<script setup>
defineProps({
  shuffle: Function
})
</script>
