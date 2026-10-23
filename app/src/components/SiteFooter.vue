<template>
  <footer class="text-center px-6 pt-6 pb-8">
    <button
      class="cartoon-button bg-yellow text-black w-full max-w-sm"
      :disabled="loading"
      @click="$emit('next')"
    >
      {{ loading ? t('loading') : t('next') }}
    </button>
    <p class="text-xs text-black/60 mt-4">{{ t('motto') }}</p>
  </footer>
</template>
<script setup>
import { useUiLanguage } from '@/composables/useUiLanguage'
const { t } = useUiLanguage()
defineProps({ loading: Boolean })
defineEmits(['next'])
</script>
