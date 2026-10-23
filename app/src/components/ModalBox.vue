<template>
  <dialog
    ref="dialog"
    class="settings-dialog"
    aria-labelledby="settings-title"
    @cancel.prevent="close"
    @click="onBackdrop"
  >
    <div class="settings-shell">
      <div class="settings-heading">
        <div>
          <p class="eyebrow">{{ t('personalize') }}</p>
          <h2 id="settings-title">{{ t('yourPractice') }}</h2>
        </div>
        <button class="close-button" :aria-label="t('closeSettings')" @click="close">✕</button>
      </div>
      <nav class="settings-tabs" :aria-label="t('settingsSections')">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :aria-current="showModal === tab.id ? 'page' : undefined"
          :class="{ active: showModal === tab.id }"
          @click="$emit('update:showModal', tab.id)"
        >
          {{ t(tab.label) }}
        </button>
      </nav>
      <div class="settings-body"><component :is="components[showModal]" /></div>
      <div class="settings-bottom">
        <span>{{ t('saved') }}</span
        ><button class="cartoon-button bg-yellow" @click="close">{{ t('practice') }}</button>
      </div>
    </div>
  </dialog>
</template>
<script setup>
import { useUiLanguage } from '@/composables/useUiLanguage'
const { t } = useUiLanguage()
import { ref, watch, onBeforeUnmount } from 'vue'
import GeneralSettings from './Settings/GeneralSettings.vue'
import TenseSettings from './Settings/TenseSettings.vue'
import VerbsSettings from './Settings/VerbsSettings.vue'
const props = defineProps({ showModal: String })
const emit = defineEmits(['update:showModal'])
const dialog = ref(null)
const components = { GeneralSettings, TenseSettings, VerbsSettings }
const tabs = [
  { id: 'GeneralSettings', label: 'general' },
  { id: 'TenseSettings', label: 'tenses' },
  { id: 'VerbsSettings', label: 'verbs' }
]
const close = () => emit('update:showModal', undefined)
let previousOverflow = ''
watch(
  () => props.showModal,
  (value) => {
    if (value && !dialog.value.open) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      dialog.value.showModal()
    } else if (!value && dialog.value.open) {
      dialog.value.close()
      document.body.style.overflow = previousOverflow
    }
  },
  { flush: 'post' }
)
const onBackdrop = (event) => {
  if (event.target === dialog.value) close()
}
onBeforeUnmount(() => {
  if (dialog.value?.open) document.body.style.overflow = previousOverflow
})
</script>
<style scoped>
.settings-dialog {
  margin: auto;
  width: min(700px, calc(100% - 2rem));
  max-height: min(850px, calc(100dvh - 2rem));
  padding: 0;
  border: 1.5px solid #281b38;
  border-radius: 24px;
  background: #fffdf5;
  color: #281b38;
  box-shadow: 0 24px 90px #281b3830;
  overflow: hidden;
}
.settings-dialog::backdrop {
  background: #281b3870;
  backdrop-filter: blur(5px);
}
.settings-shell {
  display: flex;
  flex-direction: column;
  max-height: inherit;
}
.settings-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
}
h2 {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.75rem;
  font-weight: 500;
  margin-top: 0.2rem;
}
.close-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffe0e9;
}
.settings-tabs {
  display: flex;
  margin: 0 1.5rem 1rem;
  gap: 0.3rem;
  background: #eee8ee;
  padding: 0.3rem;
  border-radius: 12px;
}
.settings-tabs button {
  flex: 1;
  padding: 0.65rem;
  border-radius: 9px;
  font-size: 0.9rem;
  font-weight: 600;
}
.settings-tabs .active {
  background: #ffdf57;
  box-shadow: 0 1px 3px #281b3820;
}
.settings-body {
  min-height: 0;
  overflow-y: auto;
  padding: 0 1.5rem 1.5rem;
  overscroll-behavior: contain;
}
.settings-bottom {
  border-top: 1px solid #ded6df;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.settings-bottom span {
  font-size: 0.75rem;
  color: #776b7d;
}
@media (max-width: 500px) {
  .settings-heading {
    padding: 1.25rem 1rem 1rem;
  }
  .settings-tabs {
    margin-inline: 1rem;
  }
  .settings-body {
    padding-inline: 1rem;
  }
  .settings-bottom {
    padding: 0.85rem 1rem;
  }
  .settings-bottom span {
    max-width: 110px;
  }
  .settings-bottom button {
    font-size: 0.85rem;
    padding: 0.65rem 0.8rem;
  }
}
</style>
