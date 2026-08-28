<template>
  <div class="py-2">
    <div class="flex flex-col gap-6">
      <div class="w-full">
        <label class="block font-bold text-xl mb-2 text-pink" for="languageSetting"
          >Language setting</label
        >
        <select
          class="cartoon-select w-full text-black bg-white"
          v-model="sessionStore.languageSetting"
          @change="sessionStore.setLanguageSetting"
          id="languageSetting"
        >
          <option value="es">FR → ES</option>
          <option value="fr">ES → FR</option>
        </select>
      </div>
      <div class="w-full">
        <label class="block font-bold text-xl mb-2 text-orange" for="dailyGoal">Daily goal</label>
        <input
          class="cartoon-input w-full text-black bg-white"
          v-model="sessionStore.dailyGoal"
          @input="sessionStore.setDailyGoal"
          type="number"
          min="1"
          id="dailyGoal"
        />
      </div>
      <div class="w-full">
        <label class="block font-bold text-xl mb-2 text-green-dark" for="difficultySetting"
          >Verb difficulty</label
        >
        <select
          class="cartoon-select w-full text-black bg-white"
          v-model="sessionStore.difficultySetting"
          @change="sessionStore.setDifficultySetting"
          id="difficultySetting"
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div class="w-full">
        <label class="block font-bold text-xl mb-2 text-yellow-dark" for="personSetting"
          >Person mode</label
        >
        <select
          class="cartoon-select w-full text-black bg-white"
          v-model="sessionStore.personSetting"
          @change="sessionStore.setPersonSetting"
          id="personSetting"
        >
          <option value="any">Any person</option>
          <option value="first">First person</option>
          <option value="second">Second person</option>
          <option value="third">Third person</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useSessionStore } from '/store/session'

let sessionStore = ref(useSessionStore())
</script>
