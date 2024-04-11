<template>
  <header class="flex justify-between items-center p-5 bg-red-700 border-b-2 sticky top-0 z-10">
    <button class="text-xl md:text-3xl" @click="$emit('toggle-modal', 'tenses')">⚙️</button>
    <h1 class="text-lg md:text-3xl font-bold uppercase">Conju-baguette</h1>
    <button class="text-xl md:text-3xl" @click="$emit('toggle-modal', 'verbs')">📋</button>
  </header>
</template>

<script setup>
import { defineEmits } from 'vue'

defineEmits(['toggle-modal'])
</script>
