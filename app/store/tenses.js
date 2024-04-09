import { defineStore } from 'pinia'

export const useStore = defineStore('checkedTenses', {
  state: () => ({
    checkedTenses: [],
  }),
  getters: {
    checkedTensesWithDefault() {
      return this.checkedTenses.length > 0 ? this.checkedTenses : ['indicatif/présent'];
    }
  },
  actions: {
    checkTense(tense) {
      if (!this.checkedTenses.includes(tense)) {
        this.checkedTenses.push(tense)
      } else {
        this.checkedTenses.splice(this.checkedTenses.indexOf(tense), 1)
      }
      this.updateCookie();
    },
    setCheckedTenses(tenses) {
      this.checkedTenses = tenses
      this.updateCookie();
    },
    updateCookie() {
      document.cookie = `checkedTenses=${JSON.stringify(this.checkedTenses)}; path=/`;
    },
    loadFromCookie() {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('checkedTenses='))
        ?.split('=')[1];
      if (cookieValue) {
        this.checkedTenses = JSON.parse(cookieValue);
      }
      if (this.checkedTenses.length === 0) {
        this.checkedTenses = ['indicatif/présent'];
      }
    },
  },
})
