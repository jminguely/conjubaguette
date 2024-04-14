import { defineStore } from 'pinia'
import availableVerbs from '../src/assets/data/verbs.json'

export const useVerbsStore = defineStore('checkedVerbs', {
  state: () => ({
    checkedVerbs: [],
  }),
  getters: {
    checkedVerbsWithDefault() {
      return this.checkedVerbs.length > 0 ? this.checkedVerbs : [];
    }
  },
  actions: {
    checkVerb(verb) {
      if (!this.checkedVerbs.includes(verb)) {
        this.checkedVerbs.push(verb)
      } else {
        this.checkedVerbs.splice(this.checkedVerbs.indexOf(verb), 1)
      }
      this.updateCookie();
    },
    setCheckedVerbs(verbs) {
      this.checkedVerbs = verbs
      this.updateCookie();
    },
    updateCookie() {
      document.cookie = `checkedVerbs=${JSON.stringify(this.checkedVerbs)}; path=/`;
    },
    loadFromCookie() {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('checkedVerbs='))
        ?.split('=')[1];
      if (cookieValue) {
        this.checkedVerbs = JSON.parse(cookieValue);
      }
      if (this.checkedVerbs.length === 0) {
        this.checkedVerbs = [];
      }
    },
    loadAllVerbs() {
      this.checkedVerbs = availableVerbs.map(verb => verb.fr);
      this.updateCookie();
    },
    uncheckAllVerbs() {
      this.checkedVerbs = [];
      this.updateCookie();
    },
  },
})
