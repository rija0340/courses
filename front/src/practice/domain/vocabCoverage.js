/**
 * Ensure every vocabulary EN term appears at least once in the script (session-side).
 * No DB — pure in-memory post-process.
 */

function normalizeToken(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractEnList(vocabulary = []) {
  return vocabulary
    .map((w) => (typeof w === 'string' ? w : w?.en || w?.word || ''))
    .map((s) => String(s).trim())
    .filter(Boolean);
}

/** Words from vocab that do not appear as whole-ish phrases in the dialogue text. */
export function findMissingVocabulary(turns = [], vocabulary = []) {
  const fullText = normalizeToken(turns.map((t) => t.text).join(' '));
  const missing = [];
  for (const en of extractEnList(vocabulary)) {
    const needle = normalizeToken(en);
    if (!needle) continue;
    const ok = needle.includes(' ')
      ? fullText.includes(needle)
      : new RegExp(`(?:^|\\s)${escapeReg(needle)}(?:\\s|$)`).test(fullText);
    if (!ok) missing.push(en);
  }
  return missing;
}

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Append short doctor/patient turns that mention each missing word.
 * Keeps conversation longer and guarantees coverage in-session.
 */
export function padScriptWithMissingVocabulary(script, vocabulary = []) {
  if (!script?.turns?.length) return { script, missing: extractEnList(vocabulary), covered: [] };

  const missing = findMissingVocabulary(script.turns, vocabulary);
  if (!missing.length) {
    return {
      script: {
        ...script,
        meta: {
          ...script.meta,
          vocabularyCoverage: {
            required: extractEnList(vocabulary).length,
            missing: [],
            padded: 0
          }
        }
      },
      missing: [],
      covered: extractEnList(vocabulary)
    };
  }

  const extra = [];
  let i = 0;
  for (const word of missing) {
    i += 1;
    extra.push({
      id: `pad-doc-${i}`,
      role: 'doctor',
      text: `Can you tell me about your ${word}?`,
      listenHint: `vocab: ${word}`
    });
    extra.push({
      id: `pad-pat-${i}`,
      role: 'patient',
      text: `Yes, my ${word} has been a concern.`,
      listenHint: `vocab: ${word}`
    });
  }

  const turns = [...script.turns, ...extra];
  const stillMissing = findMissingVocabulary(turns, vocabulary);

  return {
    script: {
      ...script,
      turns,
      meta: {
        ...script.meta,
        vocabularyCoverage: {
          required: extractEnList(vocabulary).length,
          missing: stillMissing,
          padded: extra.length
        }
      }
    },
    missing: stillMissing,
    covered: extractEnList(vocabulary).filter((w) => !stillMissing.includes(w))
  };
}

export function suggestTurnCount(vocabCount, length = 'long') {
  const n = Number(vocabCount) || 0;
  if (length === 'short') return Math.max(6, Math.min(10, 4 + Math.ceil(n / 4)));
  if (length === 'medium') return Math.max(10, Math.min(16, 6 + Math.ceil(n / 3)));
  // long — enough room to place every word
  return Math.max(12, Math.min(24, 8 + Math.ceil(n / 2)));
}
