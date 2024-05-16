<template>
  <header class="sticky top-0 z-10 py-2 bg-yellow shadow-lg">
    <div class="container max-w-7xl mx-auto flex justify-between items-center p-5">
      <button class="text-xl md:text-3xl" @click="$emit('toggle-modal', 'tenses')">
        <CustomIcon name="settings" class="w-8 h-8 m-auto" />
      </button>
      <h1 class="text-lg md:text-3xl font-bold uppercase">Verbos!</h1>
      <button class="text-xl md:text-3xl" @click="$emit('toggle-modal', 'verbs')">
        <CustomIcon name="verbs" class="w-10 h-10 m-auto" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { defineEmits } from 'vue'
import CustomIcon from './CustomIcon.vue'

defineEmits(['toggle-modal'])
</script>
