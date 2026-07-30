import { createPronunciationResult } from '../contracts';

/** Normalize for word overlap scoring (vendor-agnostic). */
function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Simple intelligibility score from target vs transcript.
 * Swap algorithm later without changing UI or adapters.
 */
export function scorePronunciation(targetText, heardText) {
  const target = tokenize(targetText);
  const heard = tokenize(heardText);

  if (!target.length) {
    return createPronunciationResult({
      targetText,
      heardText,
      score: 0,
      tips: ['No target phrase provided.']
    });
  }

  if (!heard.length) {
    return createPronunciationResult({
      targetText,
      heardText,
      score: 0,
      tips: ['Nothing was heard. Try speaking closer to the mic.']
    });
  }

  const heardSet = new Set(heard);
  const wordFeedback = target.map((word) => ({
    word,
    ok: heardSet.has(word),
    hint: heardSet.has(word) ? null : 'Try this word again'
  }));

  const matched = wordFeedback.filter((w) => w.ok).length;
  const coverage = matched / target.length;

  // Soft penalty if many extra words
  const extra = Math.max(0, heard.length - target.length);
  const extraPenalty = Math.min(0.25, extra * 0.05);
  const score = Math.round(Math.max(0, (coverage - extraPenalty) * 100));

  const tips = [];
  if (score >= 85) tips.push('Clear and easy to understand. Nice work.');
  else if (score >= 60) tips.push('Mostly understandable. Focus on the highlighted words.');
  else tips.push('Slow down and pronounce each word clearly.');

  const missing = wordFeedback.filter((w) => !w.ok).slice(0, 4).map((w) => w.word);
  if (missing.length) {
    tips.push(`Practice: ${missing.join(', ')}`);
  }

  return createPronunciationResult({
    targetText,
    heardText,
    score,
    wordFeedback,
    tips
  });
}
