<template>
  <header class="sticky top-0 z-10 py-3 bg-yellow shadow-lg">
    <div class="container max-w-7xl mx-auto flex justify-between items-center px-5">
      <button
        class="text-xl md:text-3xl hover:text-pink-dark"
        @click="$emit('toggle-modal', 'tenses')"
      >
        <CustomIcon name="settings" class="w-7 h-7 md:w-9 md:h-9 m-auto" />
      </button>
      <h1 class="logo">VerboLoco!</h1>
      <button
        class="text-xl md:text-3xl hover:text-pink-dark"
        @click="$emit('toggle-modal', 'verbs')"
      >
        <CustomIcon name="verbs" class="w-8 h-8 md:w-10 md:h-10 m-auto" />
      </button>
    </div>
  </header>
</template>

<style lang="postcss" scoped>
.logo {
  @apply text-2xl md:text-4xl font-bold;
  letter-spacing: -0.05em;
  text-shadow:
    -1px -1px 0 #fff,
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    1px 1px 0 #fff,
    3px 3px #00000033;
}
</style>

<script setup>
import { defineEmits } from 'vue'
import CustomIcon from './CustomIcon.vue'

defineEmits(['toggle-modal'])
</script>
