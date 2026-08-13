import {
  coerceDisplayText,
  coercePhoneticString,
} from '../../data/vocabs/vocabItemStructure';

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
  const fr = coerceDisplayText(item?.fr);
  if (fr) return fr;
  const mg = coerceDisplayText(item?.mg);
  if (mg) return mg;
  const en = coerceDisplayText(item?.en);
  return en ? `English word related to ${en}` : '';
}

function wordEn(item) {
  return coerceDisplayText(item?.en) || coerceDisplayText(item?.word) || '';
}

export function buildQuizDeck({ words = [], types = ['definition_to_word'], limit = 8, scenarioKind = 'general' } = {}) {
  const list = shuffle(words).slice(0, Math.max(1, limit));
  const typeCycle = types.length ? types : ['definition_to_word'];
  const medical = scenarioKind === 'medical';
  return list.map((item, index) => {
    const exerciseType = typeCycle[index % typeCycle.length];
    const en = wordEn(item);
    if (exerciseType === 'definition_to_word') {
      return {
        id: `q-${item.id || index}`,
        exerciseType,
        prompt: `Quel est le mot anglais pour : « ${wordDef(item)} » ?`,
        expected: en,
        hint: coercePhoneticString(item.phonetic) || null,
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
        prompt: medical
          ? `Complétez : "The patient described discomfort in the _____." (thème : ${en})`
          : `Complétez : "I want to use the word _____ in a clear sentence." (thème : ${en})`,
        expected: en,
        hint: wordDef(item),
        item
      };
    }
    return {
      id: `q-${item.id || index}`,
      exerciseType,
      prompt: medical
        ? `Reformulez de façon naturelle (EN) : "I have problem with my ${en}."`
        : `Reformulez de façon naturelle (EN) : "I want talk about ${en}."`,
      expected: medical
        ? `I have a problem with my ${en}. / I've been having trouble with my ${en}.`
        : `I want to talk about ${en}. / I'd like to talk about ${en}.`,
      hint: en,
      item
    };
  });
}

export function buildFreeThemeDeck(theme, types = ['reformulate'], count = 5, scenarioKind = 'general') {
  const typeCycle = types.length ? types : ['reformulate'];
  const medical = scenarioKind === 'medical';
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
        prompt: medical
          ? `Complétez une phrase clinique sur « ${theme} » : "The _____ is important to examine today."`
          : `Complétez une phrase sur « ${theme} » : "Today I practiced the word _____."`,
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
