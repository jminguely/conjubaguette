<template>
  <div class="py-2">
    <div class="flex flex-col gap-6">
      <div class="w-full">
        <label class="block font-medium text-sm mb-2" for="languageSetting">{{
          t('direction')
        }}</label>
        <select
          class="cartoon-select w-full text-black bg-white"
          v-model="sessionStore.languageSetting"
          @change="sessionStore.setLanguageSetting"
          id="languageSetting"
        >
          <option value="es">{{ t('toEs') }}</option>
          <option value="fr">{{ t('toFr') }}</option>
        </select>
      </div>
      <div class="w-full">
        <label class="block font-medium text-sm mb-2" for="dailyGoal">{{ t('goal') }}</label>
        <input
          class="cartoon-input w-full text-black bg-white"
          :value="sessionStore.dailyGoal"
          @change="sessionStore.setDailyGoal"
          type="number"
          min="1"
          max="500"
          step="1"
          id="dailyGoal"
        />
      </div>
      <div class="w-full">
        <label class="block font-medium text-sm mb-2" for="difficultySetting">{{
          t('difficulty')
        }}</label>
        <select
          class="cartoon-select w-full text-black bg-white"
          v-model="sessionStore.difficultySetting"
          @change="sessionStore.setDifficultySetting"
          id="difficultySetting"
        >
          <option value="all">{{ t('all') }}</option>
          <option value="easy">{{ t('easy') }}</option>
          <option value="medium">{{ t('medium') }}</option>
          <option value="hard">{{ t('hard') }}</option>
        </select>
      </div>
      <div class="w-full">
        <label class="block font-medium text-sm mb-2" for="personSetting">{{ t('person') }}</label>
        <select
          class="cartoon-select w-full text-black bg-white"
          v-model="sessionStore.personSetting"
          @change="sessionStore.setPersonSetting"
          id="personSetting"
        >
          <option value="any">{{ t('anyPerson') }}</option>
          <option value="first">{{ t('firstPerson') }}</option>
          <option value="second">{{ t('secondPerson') }}</option>
          <option value="third">{{ t('thirdPerson') }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiLanguage } from '@/composables/useUiLanguage'
const { t } = useUiLanguage()
import { useSessionStore } from '/store/session'

const sessionStore = useSessionStore()
</script>
