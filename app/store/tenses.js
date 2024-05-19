import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useTensesStore = defineStore('checkedTenses', {
  state: () => {
    let checkedTenses = Cookies.get('checkedTensesNew')
      ? JSON.parse(Cookies.get('checkedTensesNew'))
      : []
    if (checkedTenses.length === 0) {
      checkedTenses = ['fr/indicatif/présent', 'es/indicativo/presente']
      Cookies.set('checkedTensesNew', JSON.stringify(checkedTenses))
    }
    return {
      checkedTenses
    }
  },
  actions: {
    checkTense(tense) {
      if (!this.checkedTenses.includes(tense)) {
        this.checkedTenses.push(tense)
      } else {
        this.checkedTenses.splice(this.checkedTenses.indexOf(tense), 1)
      }
      Cookies.set('checkedTensesNew', JSON.stringify(this.checkedTenses))
    }
  }
})
