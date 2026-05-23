export const PERSON_MODE_OPTIONS = [
  { label: 'Any person', value: 'any' },
  { label: 'First person', value: 'first' },
  { label: 'Second person', value: 'second' },
  { label: 'Third person', value: 'third' }
]

const PERSON_INDICES = {
  any: [0, 1, 2, 3, 4, 5],
  first: [0, 3],
  second: [1, 4],
  third: [2, 5]
}

export const getAllowedPersonIndices = (mode) => PERSON_INDICES[mode] ?? PERSON_INDICES.any
