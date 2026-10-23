import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import availableVerbs from '../src/assets/data/verbs.json'
import { getCookieJson } from './storage'
const key = 'verboloco.verbs.v1'
export const verbId = (verb) => `${verb.fr}:${verb.es}`
const save = (verbs) => {
  try {
    localStorage.setItem(key, JSON.stringify(verbs.map(verbId)))
  } catch {
    /* Preferences remain usable when browser storage is unavailable. */
  }
}
const restore = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    if (Array.isArray(saved)) return availableVerbs.filter((verb) => saved.includes(verbId(verb)))
  } catch {
    /* Recover malformed or inaccessible storage using legacy preferences. */
  }
  const legacy = getCookieJson('checkedVerbsNew', null)
  const selected = Array.isArray(legacy)
    ? availableVerbs.filter((verb) => legacy.some((v) => v && verbId(v) === verbId(verb)))
    : [...availableVerbs]
  save(selected)
  Cookies.remove('checkedVerbsNew')
  return selected
}
export const useVerbsStore = defineStore('checkedVerbs', {
  state: () => ({ checkedVerbs: restore() }),
  actions: {
    persist() {
      save(this.checkedVerbs)
    },
    checkAllVerbs() {
      this.checkedVerbs = [...availableVerbs]
      this.persist()
    },
    uncheckAllVerbs() {
      this.checkedVerbs = []
      this.persist()
    },
    checkVerbs(verbs) {
      const selected = new Set([...this.checkedVerbs, ...verbs].map(verbId))
      this.checkedVerbs = availableVerbs.filter((verb) => selected.has(verbId(verb)))
      this.persist()
    },
    uncheckVerbs(verbs) {
      const removed = new Set(verbs.map(verbId))
      this.checkedVerbs = this.checkedVerbs.filter((verb) => !removed.has(verbId(verb)))
      this.persist()
    },
    toggleVerb(verb) {
      if (this.checkedVerbs.some((v) => verbId(v) === verbId(verb))) this.uncheckVerbs([verb])
      else this.checkVerbs([verb])
    }
  }
})
