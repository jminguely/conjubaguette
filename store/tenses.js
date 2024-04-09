import { defineStore } from 'pinia'

export const useStore = defineStore('checkedTenses', {
  state: () => ({
    checkedTenses: [],
  }),
  actions: {
    checkTense(tense) {
      if (!this.checkedTenses.includes(tense)) {
        this.checkedTenses.push(tense)
      } else {
        this.checkedTenses.splice(this.checkedTenses.indexOf(tense), 1)
      }
    },
    setCheckedTenses(tenses) {
      this.checkedTenses = tenses
    },
  },
})
