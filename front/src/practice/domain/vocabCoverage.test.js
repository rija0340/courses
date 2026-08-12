import { scorePronunciation } from './pronunciation';
import { findMissingVocabulary, padScriptWithMissingVocabulary } from './vocabCoverage';

describe('vocabCoverage', () => {
  const vocab = [{ en: 'retina' }, { en: 'cornea' }, { en: 'pupil' }];

  it('detects missing words', () => {
    const missing = findMissingVocabulary(
      [{ text: 'My retina hurts' }],
      vocab
    );
    expect(missing).toEqual(expect.arrayContaining(['cornea', 'pupil']));
    expect(missing).not.toContain('retina');
  });

  it('pads script so all words appear', () => {
    const script = {
      theme: 'eyes',
      turns: [{ id: '1', role: 'b', text: 'Hello' }],
      meta: {}
    };
    const { script: padded, missing } = padScriptWithMissingVocabulary(script, vocab);
    expect(missing).toEqual([]);
    const text = padded.turns.map((t) => t.text).join(' ');
    expect(text).toMatch(/retina/i);
    expect(text).toMatch(/cornea/i);
    expect(text).toMatch(/pupil/i);
  });
});

describe('scorePronunciation smoke', () => {
  it('works', () => {
    expect(scorePronunciation('hello', 'hello').score).toBeGreaterThan(80);
  });
});
