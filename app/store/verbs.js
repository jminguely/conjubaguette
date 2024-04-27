import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import availableVerbs from '../src/assets/data/verbs.json'

export const useVerbsStore = defineStore('checkedVerbs', {
  state: () => {
    let checkedVerbs = Cookies.get('checkedVerbs') ? JSON.parse(Cookies.get('checkedVerbs')) : [];
    if (checkedVerbs.length === 0) {
      checkedVerbs = availableVerbs.map(verb => verb.fr);
      Cookies.set('checkedVerbs', JSON.stringify(checkedVerbs));
    }
    return {
      checkedVerbs
    };
  },
  actions: {
    checkAllVerbs() {
      this.checkedVerbs = availableVerbs.map(verb => verb.fr);
      Cookies.set('checkedVerbs', JSON.stringify(this.checkedVerbs));
    },
    uncheckAllVerbs() {
      this.checkedVerbs = [];
      Cookies.set('checkedVerbs', JSON.stringify(this.checkedVerbs));
    },
    toggleVerb(verb) {
      const index = this.checkedVerbs.indexOf(verb);
      if (index >= 0) {
        this.checkedVerbs.splice(index, 1);
      } else {
        this.checkedVerbs.push(verb);
      }
      Cookies.set('checkedVerbs', JSON.stringify(this.checkedVerbs));
    },
  },
})
