import { scorePronunciation } from './pronunciation';

describe('scorePronunciation', () => {
  it('scores exact match highly', () => {
    const result = scorePronunciation('I have a headache', 'I have a headache');
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.wordFeedback.every((w) => w.ok)).toBe(true);
  });

  it('penalizes missing words', () => {
    const result = scorePronunciation('I have a headache', 'I have');
    expect(result.score).toBeLessThan(80);
    expect(result.wordFeedback.some((w) => !w.ok)).toBe(true);
  });

  it('handles empty transcript', () => {
    const result = scorePronunciation('hello', '');
    expect(result.score).toBe(0);
  });
});
