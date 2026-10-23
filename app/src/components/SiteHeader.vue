<template>
  <header class="site-header">
    <div class="header-inner">
      <button
        class="header-button"
        :aria-label="t('openSettings')"
        @click="$emit('toggle-modal', 'GeneralSettings')"
      >
        <CustomIcon name="settings" class="w-5 h-5" /><span>{{ t('settings') }}</span>
      </button>
      <h1 class="logo">VerboLoco<span>!</span></h1>
      <button
        class="header-button"
        :aria-label="t('openVerbs')"
        @click="$emit('toggle-modal', 'VerbsSettings')"
      >
        <CustomIcon name="verbs" class="w-5 h-5" /><span>{{ t('myVerbs') }}</span>
      </button>
    </div>
  </header>
</template>
<script setup>
import { useUiLanguage } from '@/composables/useUiLanguage'
const { t } = useUiLanguage()
import CustomIcon from './CustomIcon.vue'
defineEmits(['toggle-modal'])
</script>
<style scoped>
.site-header {
  background: #ffdf57;
  border-bottom: 1.5px solid #281b38;
}
.header-inner {
  max-width: 1100px;
  margin: auto;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.logo {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.6rem, 4vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.06em;
}
.logo span {
  color: #a22f60;
}
.header-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
}
.header-button:hover {
  background: #fff6;
}
@media (max-width: 500px) {
  .header-button span {
    display: none;
  }
  .header-inner {
    padding: 0.6rem 1rem;
  }
}
</style>
