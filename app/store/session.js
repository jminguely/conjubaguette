import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { getCookieDate, getCookieNumber, getCookieString } from './storage'

export const useSessionStore = defineStore('session', {
  state: () => ({
    counter: getCookieNumber('counterNew', 0),
    dailyGoal: getCookieNumber('dailyGoalNew', 20),
    lastUpdated: getCookieDate('lastUpdatedNew'),
    languageSetting: getCookieString('languageSettingNew', 'es', ['es', 'fr']),
    difficultySetting: getCookieString('difficultySettingNew', 'all', ['all', 'easy', 'medium', 'hard']),
    personSetting: getCookieString('personSettingNew', 'any', ['any', 'first', 'second', 'third'])
  }),
  actions: {
    incrementCounter() {
      const today = new Date()
      const lastUpdatedDay = new Date(this.lastUpdated)

      if (
        today.getDate() !== lastUpdatedDay.getDate() ||
        today.getMonth() !== lastUpdatedDay.getMonth() ||
        today.getFullYear() !== lastUpdatedDay.getFullYear()
      ) {
        this.counter = 0
      }

      this.counter++
      this.lastUpdated = today

      Cookies.set('counterNew', String(this.counter))
      Cookies.set('lastUpdatedNew', String(this.lastUpdated))
    },
    setDailyGoal(event) {
      this.dailyGoal = Math.max(1, Number(event.target.value) || 20)
      Cookies.set('dailyGoalNew', String(this.dailyGoal))
    },
    setLanguageSetting(event) {
      this.languageSetting = event.target.value
      Cookies.set('languageSettingNew', this.languageSetting)
    },
    setDifficultySetting(event) {
      this.difficultySetting = event.target.value
      Cookies.set('difficultySettingNew', this.difficultySetting)
    },
    setPersonSetting(event) {
      this.personSetting = event.target.value
      Cookies.set('personSettingNew', this.personSetting)
    }
  }
})
