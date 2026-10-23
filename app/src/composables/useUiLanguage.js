import { computed } from 'vue'
import { useSessionStore } from '/store/session'
import { translate } from '@/lib/translations'
export function useUiLanguage() {
  const session = useSessionStore()
  const language = computed(() => session.languageSetting)
  const secondaryLanguage = computed(() => (language.value === 'es' ? 'fr' : 'es'))
  const t = (key, values) => translate(language.value, key, values)
  return { language, secondaryLanguage, t }
}
