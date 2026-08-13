import { pickLangText, structureFieldLabel } from './vocabItemStructure';
import { localize } from '../coursePackSchema';
import { buildQuizDeck } from '../../practice/domain/quizDeck';

describe('pickLangText', () => {
  it('picks UI lang from {fr,en,mg}', () => {
    expect(pickLangText({ fr: 'Tête', en: 'Head', mg: 'Loha' }, 'fr')).toBe('Tête');
  });

  it('unwraps nested i18n objects', () => {
    const nested = { fr: { fr: 'Œil', en: 'Eye', mg: 'Maso' }, en: 'Eye', mg: 'Maso' };
    expect(pickLangText(nested, 'fr')).toBe('Œil');
  });
});

describe('structureFieldLabel', () => {
  it('extracts a string from a raw i18n label object', () => {
    expect(structureFieldLabel({ fr: 'Synonymes', en: 'Synonyms', mg: 'Mitovy' }, 'fr'))
      .toBe('Synonymes');
  });
});

describe('localize', () => {
  it('never returns a nested i18n object', () => {
    const value = { fr: { fr: 'Bonjour', en: 'Hello', mg: '' }, en: 'Hello', mg: '' };
    const out = localize(value, 'fr');
    expect(typeof out).toBe('string');
    expect(out).toBe('Bonjour');
  });
});

describe('buildQuizDeck', () => {
  it('keeps hint and definition as strings when fields are i18n objects', () => {
    const [q] = buildQuizDeck({
      words: [{
        id: 'eye',
        en: { fr: 'œil', en: 'Eye', mg: 'maso' },
        fr: { fr: 'Œil', en: 'Eye', mg: 'Maso' },
        phonetic: { fr: '/aɪ/', en: '/aɪ/', mg: '/aɪ/' },
      }],
      types: ['definition_to_word'],
      limit: 1,
    });
    expect(typeof q.prompt).toBe('string');
    expect(q.prompt).not.toMatch(/\[object Object\]/);
    expect(typeof q.expected).toBe('string');
    expect(q.hint == null || typeof q.hint === 'string').toBe(true);
  });
});
