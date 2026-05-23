import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import tenses from '../src/assets/data/tenses.json'
import { getCookieJson } from './storage'

export const useTensesStore = defineStore('checkedTenses', {
  state: () => {
    let checkedTenses = getCookieJson('checkedTensesNew', [])
    checkedTenses = Array.isArray(checkedTenses) ? checkedTenses : []
    checkedTenses = checkedTenses.filter((tense) => tenses[tense])

    if (checkedTenses.length === 0) {
      checkedTenses = ['present-tense']
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
