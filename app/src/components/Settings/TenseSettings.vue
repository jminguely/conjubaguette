<template>
  <div class="flex flex-col py-2">
    <p class="text-sm text-black/60">
      {{ t('chooseTenses') }}
    </p>
    <div>
      <div v-for="(tenses, mood) in groupedTenses" :key="mood" class="mb-8">
        <h4 class="settings-section-title">{{ mood }}</h4>
        <div class="flex flex-col gap-3">
          <label
            v-for="(tense, tenseKey) in tenses"
            :key="tenseKey"
            class="selection-row"
            :class="tenseStore.checkedTenses.includes(tenseKey) ? 'border-orange bg-orange/10' : ''"
          >
            <div class="flex flex-col flex-1">
              <span :lang="language">{{ tense[language].label }}</span>
              <span class="translation" :lang="secondaryLanguage">{{
                tense[secondaryLanguage].label
              }}</span>
            </div>
            <div class="ml-4">
              <input
                type="checkbox"
                class="w-6 h-6 accent-orange rounded cursor-pointer"
                :id="tenseKey"
                :value="tenseKey"
                :checked="tenseStore.checkedTenses.includes(tenseKey)"
                @change="checkTense($event)"
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiLanguage } from '@/composables/useUiLanguage'
const { t, language, secondaryLanguage } = useUiLanguage()
import { computed } from 'vue'

import tenses from '@/assets/data/tenses.json'
import { useTensesStore } from '/store/tenses'

const tenseStore = useTensesStore()

const groupedTenses = computed(() => {
  const groups = {}
  for (const [key, tense] of Object.entries(tenses)) {
    const mood =
      tense[language.value].mood === 'Imperatif' ? 'Impératif' : tense[language.value].mood
    if (!groups[mood]) {
      groups[mood] = {}
    }
    groups[mood][key] = tense
  }
  return groups
})

const checkedTensesCount = computed(() => tenseStore.checkedTenses.length)

function checkTense(e) {
  const tenseKey = e.target.value
  if (tenseStore.checkedTenses.includes(tenseKey)) {
    if (checkedTensesCount.value > 1) {
      tenseStore.checkTense(tenseKey)
    } else {
      e.target.checked = true
    }
  } else {
    tenseStore.checkTense(tenseKey)
  }
}
</script>
