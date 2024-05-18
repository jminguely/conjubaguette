import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import availableVerbs from '../src/assets/data/verbs.json'

export const useVerbsStore = defineStore('checkedVerbs', {
  state: () => {
    let checkedVerbs = Cookies.get('checkedVerbsNew') ? JSON.parse(Cookies.get('checkedVerbsNew')) : [];

    if (checkedVerbs.length === 0) {
      checkedVerbs = availableVerbs.map(verb => verb);
      Cookies.set('checkedVerbsNew', JSON.stringify(checkedVerbs));
    }
    return {
      checkedVerbs
    };
  },
  actions: {
    checkAllVerbs() {
      this.checkedVerbs = availableVerbs.map(verb => verb);
      Cookies.set('checkedVerbsNew', JSON.stringify(this.checkedVerbs));
    },
    uncheckAllVerbs() {
      this.checkedVerbs = [];
      Cookies.set('checkedVerbsNew', JSON.stringify(this.checkedVerbs));
    },
    toggleVerb(verb) {
      const verbObject = JSON.parse(verb);
      const index = this.checkedVerbs.findIndex(v => JSON.stringify(v) === JSON.stringify(verbObject));

      if (index >= 0) {
        this.checkedVerbs.splice(index, 1);
      } else {
        this.checkedVerbs.push(verbObject);
      }

      Cookies.set('checkedVerbsNew', JSON.stringify(this.checkedVerbs));
    },
  },
})
