import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useTensesStore = defineStore('checkedTenses', {
  state: () => ({
    checkedTenses: JSON.parse(Cookies.get('checkedTenses')) || [],
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
      Cookies.set('checkedTenses', JSON.stringify(this.checkedTenses));
    },
  },
})
