<template>
  <div class="py-5">
    <h3 class="font-bold text-lg">General</h3>
    <div class="flex gap-5">
      <div class="w-1/2">
        <h3 for="languageSetting">Paramètres de langue</h3>
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
      <div class="w-1/2">
        <h3 for="dailyGoal">Objectifs journaliers</h3>
        <input
          class="text-xl rounded-lg block w-full p-2.5 border-4 placeholder:white outline-none border-red-300 text-red-300 bg-white"
          v-model="sessionStore.dailyGoal"
          @input="sessionStore.setDailyGoal"
          type="text"
          id="dailyGoal"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useSessionStore } from '/store/session'

let sessionStore = ref(useSessionStore())
</script>
