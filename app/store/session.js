import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useSessionStore = defineStore('session', {
  state: () => ({
    counter: Number(Cookies.get('counterNew')) || 0,
    dailyGoal: Number(Cookies.get('dailyGoalNew')) || 20,
    lastUpdated: new Date(Cookies.get('lastUpdatedNew')) || new Date(),
    languageSetting: Cookies.get('languageSettingNew') || 'es',
  }),
  actions: {
    incrementCounter() {
      const today = new Date();
      const lastUpdatedDay = new Date(this.lastUpdated);

      if (today.getDate() !== lastUpdatedDay.getDate() ||
        today.getMonth() !== lastUpdatedDay.getMonth() ||
        today.getFullYear() !== lastUpdatedDay.getFullYear()) {
        this.counter = 0;
      }

      this.counter++;
      this.lastUpdated = today;

      Cookies.set('counterNew', String(this.counter));
      Cookies.set('lastUpdatedNew', String(this.lastUpdated));
    },
    setDailyGoal(event) {
      this.dailyGoal = event.target.value;
      Cookies.set('dailyGoalNew', String(this.dailyGoal));
    },
    setLanguageSetting(event) {
      this.languageSetting = event.target.value;
      Cookies.set('languageSettingNew', this.languageSetting);
    },
  },
})
