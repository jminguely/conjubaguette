import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useTensesStore = defineStore('checkedTenses', {
  state: () => {
    let checkedTenses = Cookies.get('checkedTenses') ? JSON.parse(Cookies.get('checkedTenses')) : [];
    if (checkedTenses.length === 0) {
      checkedTenses = ['indicatif/présent'];
      Cookies.set('checkedTenses', JSON.stringify(checkedTenses));
    }
    return {
      checkedTenses
    };
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
