<template>
  <div class="app-shell flex flex-col">
    <SiteHeader @toggle-modal="handleToggleModal" />
    <main class="practice-main">
      <div class="goal-card">
        <span>{{ t('dailyPractice') }}</span>
        <div
          class="goal-track"
          role="progressbar"
          :aria-label="t('goal')"
          :aria-valuenow="Math.min(sessionStore.counter, sessionStore.dailyGoal)"
          :aria-valuemax="sessionStore.dailyGoal"
          aria-valuemin="0"
        >
          <div
            class="goal-fill"
            :style="{
              width: `${Math.min(100, (sessionStore.counter / sessionStore.dailyGoal) * 100)}%`
            }"
          ></div>
        </div>
        <span>{{
          t('dailyProgress', { count: sessionStore.counter, total: sessionStore.dailyGoal })
        }}</span>
      </div>
      <ModalBox v-model:showModal="showModal" />
      <section class="practice-card" :aria-busy="isVerbLoading">
        <p class="eyebrow">{{ t('tagline') }}</p>
        <p v-if="errorMessage" class="state-message mt-5" role="alert">
          {{ errorMessage }}
          <button class="underline ml-2" @click="shuffle">{{ t('retry') }}</button>
        </p>
        <p v-if="isVerbLoading" class="py-8 text-black/60" role="status">
          {{ t('loading') }}
        </p>
        <template v-else-if="verb && !errorMessage">
          <div class="prompt-grid">
            <div :lang="language">
              <h2 class="text-sm text-black/60">{{ t(language) }}</h2>
              <button
                class="prompt-word reveal-button"
                :aria-expanded="showVerb"
                @click="showVerb = !showVerb"
              >
                {{ showVerb ? verb[language + '_label'] || verb[language] : t('reveal') }}
              </button>
            </div>
            <div :lang="secondaryLanguage">
              <h2 class="text-sm text-black/60">{{ t(secondaryLanguage) }}</h2>
              <p class="prompt-word">
                {{ verb[secondaryLanguage + '_label'] || verb[secondaryLanguage] }}
              </p>
            </div>
          </div>
          <div class="exercise-list">
            <div v-for="(tense, index) in exerciseTenses" :key="tense">
              <label class="answer-label" :for="'answer' + index"
                >{{ tenses[tense][sessionStore.languageSetting].label
                }}<span
                  class="block text-xs font-normal text-black/60 mt-1"
                  :lang="secondaryLanguage"
                  >{{ tenses[tense][secondaryLanguage].label }}</span
                ></label
              >
              <div
                class="answer-field"
                :class="{
                  correct: exerciseAvailability[index] && isCorrect[index]?.isTotallyCorrect,
                  almost:
                    exerciseAvailability[index] &&
                    isCorrect[index]?.isCorrect &&
                    !isCorrect[index]?.isTotallyCorrect,
                  unavailable: !exerciseAvailability[index]
                }"
              >
                <span class="answer-subject">{{
                  getDisplaySubject(tense, subjects[sessionStore.languageSetting][selectedPerson])
                }}</span>
                <input
                  :id="'answer' + index"
                  v-model="userResponses[index]"
                  :disabled="!exerciseAvailability[index] || isCorrect[index]?.isTotallyCorrect"
                  :aria-describedby="'feedback' + index"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                  :spellcheck="false"
                  type="text"
                  :lang="sessionStore.languageSetting"
                />
                <span
                  v-if="exerciseAvailability[index] && isCorrect[index]?.isCorrect"
                  aria-hidden="true"
                  >✓</span
                >
              </div>
              <p :id="'feedback' + index" class="answer-feedback" aria-live="polite">
                {{
                  !exerciseAvailability[index]
                    ? t('unavailable')
                    : isCorrect[index]?.isTotallyCorrect
                      ? t('perfect')
                      : isCorrect[index]?.isCorrect
                        ? t('almost')
                        : t('typeAnswer')
                }}
              </p>
            </div>
          </div>
          <TenseDisplay
            :fullVerb="fullVerb"
            :availableTenses="exerciseTenses"
            :selectedPerson="subjects[sessionStore.languageSetting][selectedPerson]"
          />
        </template>
      </section>
    </main>
    <SiteFooter :loading="isVerbLoading" @next="shuffle" />
  </div>
</template>
<script setup>
import { watchEffect } from 'vue'
import { useUiLanguage } from '@/composables/useUiLanguage'
const { t, language, secondaryLanguage } = useUiLanguage()
watchEffect(() => {
  document.documentElement.lang = language.value
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('description'))
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute('content', t('description'))
})
import tenses from './assets/data/tenses.json'
import subjects from './assets/data/subjects.json'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import ModalBox from './components/ModalBox.vue'
import TenseDisplay from './components/TenseDisplay.vue'
import { useExercise } from './composables/useExercise'
const {
  sessionStore,
  verb,
  showVerb,
  showModal,
  userResponses,
  exerciseAvailability,
  isVerbLoading,
  fullVerb,
  exerciseTenses,
  errorMessage,
  selectedPerson,
  isCorrect,
  getDisplaySubject,
  handleToggleModal,
  shuffle
} = useExercise()
</script>
