<template>
  <div class="py-5">
    <h3 class="font-bold text-lg">General</h3>
    <div class="flex flex-wrap gap-5">
      <div class="w-full md:w-[calc(50%-0.625rem)]">
        <label class="block font-semibold" for="languageSetting">Language setting</label>
        <select
          class="text-xl rounded-lg block w-full p-2.5 border-4 placeholder:white outline-none border-red-300 text-red-300 bg-white"
          v-model="sessionStore.languageSetting"
          @change="sessionStore.setLanguageSetting"
          id="languageSetting"
        >
          <option value="es">FR → ES</option>
          <option value="fr">ES → FR</option>
        </select>
      </div>
      <div class="w-full md:w-[calc(50%-0.625rem)]">
        <label class="block font-semibold" for="dailyGoal">Daily goal</label>
        <input
          class="text-xl rounded-lg block w-full p-2.5 border-4 placeholder:white outline-none border-red-300 text-red-300 bg-white"
          v-model="sessionStore.dailyGoal"
          @input="sessionStore.setDailyGoal"
          type="number"
          min="1"
          id="dailyGoal"
        />
      </div>
      <div class="w-full md:w-[calc(50%-0.625rem)]">
        <label class="block font-semibold" for="difficultySetting">Verb difficulty</label>
        <select
          class="text-xl rounded-lg block w-full p-2.5 border-4 placeholder:white outline-none border-red-300 text-red-300 bg-white"
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
      <div class="w-full md:w-[calc(50%-0.625rem)]">
        <label class="block font-semibold" for="personSetting">Person mode</label>
        <select
          class="text-xl rounded-lg block w-full p-2.5 border-4 placeholder:white outline-none border-red-300 text-red-300 bg-white"
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
