<template>
  <div>
    <label class="sr-only" for="verb-search">{{ t('searchVerbs') }}</label>
    <input
      id="verb-search"
      v-model="search"
      class="cartoon-input w-full"
      type="search"
      :placeholder="t('searchPlaceholder')"
    />
    <div class="sort-control">
      <label for="verb-sort">{{ t('sort') }}</label>
      <select id="verb-sort" v-model="sortOrder" class="cartoon-select">
        <option value="usefulness">{{ t('usefulness') }}</option>
        <option value="difficulty">{{ t('difficultySort') }}</option>
        <option :value="language">{{ t(language) }} · A–Z</option>
        <option :value="secondaryLanguage">{{ t(secondaryLanguage) }} · A–Z</option>
      </select>
    </div>
    <p class="sort-note">
      {{
        t(
          sortOrder === 'usefulness'
            ? 'usefulnessNote'
            : sortOrder === 'difficulty'
              ? 'difficultyNote'
              : 'alphabetNote'
        )
      }}
    </p>
    <div class="selection-toolbar">
      <p class="text-sm text-black/60" role="status">
        {{ t('selected', { count: verbsStore.checkedVerbs.length, total: availableVerbs.length })
        }}<span v-if="search.trim()"> · {{ t('found', { count: visibleVerbs.length }) }}</span>
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          class="small-button"
          :disabled="!visibleVerbs.length"
          @click="verbsStore.uncheckVerbs(visibleVerbs)"
        >
          {{ t(search.trim() ? 'clearResults' : 'clearAll') }}
        </button>
        <button
          class="small-button"
          :disabled="!visibleVerbs.length"
          @click="verbsStore.checkVerbs(visibleVerbs)"
        >
          {{ t(search.trim() ? 'selectResults' : 'selectAll') }}
        </button>
      </div>
    </div>
    <p v-if="!verbsStore.checkedVerbs.length" class="state-message text-sm">
      {{ t('emptySelection') }}
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <label v-for="verb in visibleVerbs" :key="verb.fr + ':' + verb.es" class="selection-row">
        <div class="min-w-0">
          <span :lang="language">{{ verb[language + '_label'] || verb[language] }}</span
          ><span class="translation" :lang="secondaryLanguage">{{
            verb[secondaryLanguage + '_label'] || verb[secondaryLanguage]
          }}</span
          ><span
            v-if="sortOrder === 'difficulty'"
            class="difficulty-label"
            :class="getVerbDifficulty(verb)"
            >{{ t(getVerbDifficulty(verb)) }}</span
          >
        </div>
        <input
          type="checkbox"
          :checked="selected.has(verb.fr + ':' + verb.es)"
          @change="verbsStore.toggleVerb(verb)"
        />
      </label>
    </div>
    <p v-if="!visibleVerbs.length" class="text-sm text-black/60 py-5">
      {{ t('noMatches', { search }) }}
    </p>
  </div>
</template>
<script setup>
import { useUiLanguage } from '@/composables/useUiLanguage'
const { t, language, secondaryLanguage } = useUiLanguage()
import { ref, computed, watch } from 'vue'
import availableVerbs from '@/assets/data/verbs.json'
import { getVerbDifficulty } from '@/lib/verbDifficulty'
import { sortVerbs, VERB_SORT_OPTIONS } from '@/lib/verbSorting'
import { normalizeAnswer } from '@/lib/exercise'
import { useVerbsStore } from '/store/verbs'
import { useSessionStore } from '/store/session'
const verbsStore = useVerbsStore()
const sessionStore = useSessionStore()
const search = ref('')
const preferenceKey = 'verboloco.verbSort.v1'
const restoreSort = () => {
  try {
    const saved = localStorage.getItem(preferenceKey)
    return VERB_SORT_OPTIONS.includes(saved) ? saved : 'usefulness'
  } catch {
    return 'usefulness'
  }
}
const sortOrder = ref(restoreSort())
watch(sortOrder, (value) => {
  try {
    localStorage.setItem(preferenceKey, value)
  } catch {
    /* Sorting still works without persistent storage. */
  }
})
const selected = computed(() => new Set(verbsStore.checkedVerbs.map((v) => v.fr + ':' + v.es)))
const visibleVerbs = computed(() =>
  sortVerbs(
    availableVerbs.filter((verb) =>
      normalizeAnswer([verb.fr, verb.es, verb.fr_label, verb.es_label].join(' ')).includes(
        normalizeAnswer(search.value)
      )
    ),
    sortOrder.value,
    sessionStore.languageSetting
  )
)
</script>
<style scoped>
.sort-control {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1rem;
}
.sort-control label {
  white-space: nowrap;
  font-size: 0.85rem;
  color: #776b7d;
}
.sort-control select {
  min-width: 0;
  padding: 0.65rem 0.8rem;
  font-size: 0.9rem;
}
.sort-note {
  font-size: 0.78rem;
  color: #776b7d;
  line-height: 1.5;
  margin-top: 0.5rem;
}
.selection-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.25rem 0;
}
.selection-row .difficulty-label {
  display: inline-block;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 5px;
  margin-top: 0.4rem;
}
.easy {
  background: #e1f4e7;
  color: #286144;
}
.medium {
  background: #fff0ce;
  color: #805a13;
}
.hard {
  background: #ffe1eb;
  color: #963755;
}
</style>
