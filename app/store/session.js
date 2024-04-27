import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useSessionStore = defineStore('session', {
  state: () => ({
    counter: Number(Cookies.get('counter')) || 0,
    dailyGoal: Number(Cookies.get('dailyGoal')) || 20,
    lastUpdated: new Date(Cookies.get('lastUpdated')) || new Date(),
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

      Cookies.set('counter', String(this.counter));
      Cookies.set('lastUpdated', String(this.lastUpdated));
    },
    setDailyGoal(event) {
      this.dailyGoal = event.target.value;
      Cookies.set('dailyGoal', String(this.dailyGoal));
    },
  },
})
