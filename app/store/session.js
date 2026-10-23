import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { getCookieDate, getCookieNumber, getCookieString } from './storage'

export const useSessionStore = defineStore('session', {
  state: () => ({
    counter: getCookieNumber('counterNew', 0),
    dailyGoal: Math.min(500, Math.max(1, Math.floor(getCookieNumber('dailyGoalNew', 20)))),
    lastUpdated: getCookieDate('lastUpdatedNew'),
    languageSetting: getCookieString('languageSettingNew', 'es', ['es', 'fr']),
    difficultySetting: getCookieString('difficultySettingNew', 'all', [
      'all',
      'easy',
      'medium',
      'hard'
    ]),
    personSetting: getCookieString('personSettingNew', 'any', ['any', 'first', 'second', 'third'])
  }),
  actions: {
    resetDailyCounter() {
      if (new Date(this.lastUpdated).toDateString() !== new Date().toDateString()) {
        this.counter = 0
        this.lastUpdated = new Date()
        Cookies.set('counterNew', '0')
        Cookies.set('lastUpdatedNew', String(this.lastUpdated))
      }
    },
    incrementCounter() {
      this.resetDailyCounter()
      const today = new Date()
      this.counter++
      this.lastUpdated = today

      Cookies.set('counterNew', String(this.counter))
      Cookies.set('lastUpdatedNew', String(this.lastUpdated))
    },
    setDailyGoal(event) {
      this.dailyGoal = Math.min(500, Math.max(1, Math.floor(Number(event.target.value)) || 20))
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
