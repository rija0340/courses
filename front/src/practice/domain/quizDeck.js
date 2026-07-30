/**
 * Build quiz items from vocab list / free theme.
 */

const EXERCISE_TYPES = [
  { id: 'definition_to_word', label: 'Définition → mot' },
  { id: 'word_to_definition', label: 'Mot → définition' },
  { id: 'cloze', label: 'Texte à trous' },
  { id: 'reformulate', label: 'Reformuler' }
];

export { EXERCISE_TYPES };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function wordDef(item) {
  if (item.fr) return item.fr;
  if (item.mg) return item.mg;
  return `English medical term related to ${item.en}`;
}

export function buildQuizDeck({ words = [], types = ['definition_to_word'], limit = 8 } = {}) {
  const list = shuffle(words).slice(0, Math.max(1, limit));
  const typeCycle = types.length ? types : ['definition_to_word'];
  return list.map((item, index) => {
    const exerciseType = typeCycle[index % typeCycle.length];
    const en = item.en || item.word || '';
    if (exerciseType === 'definition_to_word') {
      return {
        id: `q-${item.id || index}`,
        exerciseType,
        prompt: `Quel est le mot anglais pour : « ${wordDef(item)} » ?`,
        expected: en,
        hint: item.phonetic || null,
        item
      };
    }
    if (exerciseType === 'word_to_definition') {
      return {
        id: `q-${item.id || index}`,
        exerciseType,
        prompt: `Donnez une définition courte (EN ou FR) pour : « ${en} »`,
        expected: wordDef(item),
        hint: null,
        item
      };
    }
    if (exerciseType === 'cloze') {
      return {
        id: `q-${item.id || index}`,
        exerciseType,
        prompt: `Complétez : "The patient described discomfort in the _____." (thème : ${en})`,
        expected: en,
        hint: wordDef(item),
        item
      };
    }
    // reformulate
    return {
      id: `q-${item.id || index}`,
      exerciseType,
      prompt: `Reformulez de façon naturelle (EN) : "I have problem with my ${en}."`,
      expected: `I have a problem with my ${en}. / I've been having trouble with my ${en}.`,
      hint: en,
      item
    };
  });
}

export function buildFreeThemeDeck(theme, types = ['reformulate'], count = 5) {
  const typeCycle = types.length ? types : ['reformulate'];
  return Array.from({ length: count }, (_, index) => {
    const exerciseType = typeCycle[index % typeCycle.length];
    if (exerciseType === 'definition_to_word') {
      return {
        id: `free-${index}`,
        exerciseType,
        prompt: `Proposez un mot anglais utile pour le thème « ${theme} » (item ${index + 1}).`,
        expected: '',
        hint: theme,
        item: null
      };
    }
    if (exerciseType === 'word_to_definition') {
      return {
        id: `free-${index}`,
        exerciseType,
        prompt: `Inventez une définition claire liée à « ${theme} » (item ${index + 1}).`,
        expected: '',
        hint: theme,
        item: null
      };
    }
    if (exerciseType === 'cloze') {
      return {
        id: `free-${index}`,
        exerciseType,
        prompt: `Complétez une phrase clinique sur « ${theme} » : "The _____ is important to examine today."`,
        expected: '',
        hint: theme,
        item: null
      };
    }
    return {
      id: `free-${index}`,
      exerciseType,
      prompt: `Reformulez naturellement : "I want talk about ${theme}."`,
      expected: `I would like to talk about ${theme}.`,
      hint: theme,
      item: null
    };
  });
}
