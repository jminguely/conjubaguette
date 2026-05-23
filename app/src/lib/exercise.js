export const removeAccents = (value) =>
  value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : ''

export const normalizeAnswer = (value) =>
  removeAccents(String(value ?? ''))
    .trim()
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, ' ')

export const compareAnswer = (response, expected) => {
  if (!expected) {
    return { isCorrect: false, isTotallyCorrect: false }
  }

  const trimmedResponse = String(response ?? '').trim()
  const trimmedExpected = String(expected).trim()

  return {
    isCorrect: normalizeAnswer(trimmedResponse) === normalizeAnswer(trimmedExpected),
    isTotallyCorrect: trimmedResponse === trimmedExpected
  }
}

const SUBJECT_KEY_BY_LANGUAGE = {
  fr: {
    je: '1s',
    tu: '2s',
    'il (elle, on)': '3s',
    nous: '1p',
    vous: '2p',
    'ils (elles)': '3p'
  },
  es: {
    yo: '1s',
    'tú': '2s',
    él: '3s',
    nosotros: '1p',
    vosotros: '2p',
    ellos: '3p'
  }
}

export const getSubjectApiKey = (language, subject) =>
  SUBJECT_KEY_BY_LANGUAGE[language]?.[subject] ?? subject

export const getConjugationAnswer = (fullVerb, tense, language, subject) => {
  const conjugation = fullVerb?.conjugation?.[tense]
  if (!conjugation) return ''

  return conjugation[subject] ?? conjugation[getSubjectApiKey(language, subject)] ?? ''
}
