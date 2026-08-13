import {
  collectCardLexicon,
  combineCardUtteranceScore,
  isCopiedExample,
  scoreCardUtterance,
  textContainsTerm,
} from './cardUtterance';

const item = {
  en: 'headache',
  fr: 'mal de tête',
  synonyms: [{ en: 'migraine', fr: 'migraine' }],
  antonyms: [{ en: 'comfort', fr: 'confort' }],
  example: {
    patient: { en: 'I have a headache this morning.' },
    doctor: { en: 'How long have you had this headache?' },
  },
};

describe('collectCardLexicon', () => {
  it('collects headword, synonyms and antonyms', () => {
    const lex = collectCardLexicon(item);
    expect(lex.headword).toBe('headache');
    expect(lex.related.map((r) => r.word)).toEqual(expect.arrayContaining(['migraine', 'comfort']));
    expect(lex.exampleEn[0]).toMatch(/headache/i);
  });
});

describe('textContainsTerm', () => {
  it('matches inflected forms', () => {
    expect(textContainsTerm('She had headaches yesterday', 'headache')).toBe(true);
    expect(textContainsTerm('I feel fine today', 'headache')).toBe(false);
  });
});

describe('scoreCardUtterance', () => {
  it('scores an original sentence with the headword highly on context', () => {
    const result = scoreCardUtterance(
      'I woke up with a terrible headache after the night shift.',
      item
    );
    expect(result.dimensions.contextUse).toBeGreaterThanOrEqual(85);
    expect(result.overallScore).toBeGreaterThanOrEqual(70);
    expect(result.used.some((u) => u.role === 'headword')).toBe(true);
  });

  it('accepts a related synonym instead of the headword', () => {
    const result = scoreCardUtterance(
      'The migraine started behind my left eye last night.',
      item
    );
    expect(result.used.some((u) => u.word.toLowerCase() === 'migraine')).toBe(true);
    expect(result.dimensions.contextUse).toBeGreaterThanOrEqual(80);
  });

  it('gives weak context when the learner only repeats the isolated word', () => {
    const result = scoreCardUtterance('headache', item);
    expect(result.dimensions.contextUse).toBeLessThan(45);
    expect(result.overallScore).toBeLessThan(55);
  });

  it('penalizes a fluent sentence that never uses card vocabulary', () => {
    const result = scoreCardUtterance(
      'I went to the supermarket and bought some apples for lunch.',
      item
    );
    expect(result.dimensions.contextUse).toBeLessThan(20);
    expect(result.used.length).toBe(0);
    expect(result.overallScore).toBeLessThan(
      combineCardUtteranceScore({ grammar: 90, naturalness: 90, sentenceLevel: 80, contextUse: 20 })
    );
  });

  it('treats the example sentence as valid, not required', () => {
    const copied = scoreCardUtterance('I have a headache this morning.', item);
    expect(isCopiedExample('I have a headache this morning.', copied.lexicon.exampleEn)).toBe(true);
    expect(copied.dimensions.contextUse).toBeGreaterThanOrEqual(80);
  });
});
