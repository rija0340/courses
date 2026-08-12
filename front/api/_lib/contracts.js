function createTranscript({ text, confidence = null, words = [] }) {
  return {
    version: 1,
    text: String(text || '').trim(),
    confidence,
    words: Array.isArray(words) ? words : []
  };
}

function createSimulationScript({ theme, locale = 'en', turns = [], meta = {} }) {
  return {
    version: 1,
    theme: String(theme || ''),
    locale,
    turns: (turns || []).map((t, i) => ({
      id: t.id || `turn-${i + 1}`,
      role: t.role || 'speaker',
      text: String(t.text || '').trim(),
      listenHint: t.listenHint || null
    })),
    meta: {
      promptId: meta.promptId || null,
      model: meta.model || null,
      generatedAt: meta.generatedAt || new Date().toISOString(),
      ...meta
    }
  };
}

function normalizeSimulationScript(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('INVALID_SIMULATION: empty payload');
  }
  const turns = Array.isArray(raw.turns) ? raw.turns : [];
  if (!turns.length) {
    throw new Error('INVALID_SIMULATION: turns required');
  }
  const cleaned = createSimulationScript({
    theme: raw.theme,
    locale: raw.locale || 'en',
    turns,
    meta: raw.meta || {}
  });
  const validTurns = cleaned.turns.filter((t) => t.text);
  if (!validTurns.length) {
    throw new Error('INVALID_SIMULATION: no usable turns');
  }
  return { ...cleaned, turns: validTurns.slice(0, 28) };
}

const FEEDBACK_CATEGORIES = new Set([
  'grammar',
  'vocabulary_general',
  'vocabulary_theme',
  'sentence_structure',
  'question_forms',
  'naturalness',
  'agreement',
  'tense_aspect',
  'preposition',
  'article',
  'collocation',
  'word_order'
]);

function normalizeIssue(issue) {
  const steps = Array.isArray(issue.steps)
    ? issue.steps.map((s) => String(s).trim()).filter(Boolean)
    : typeof issue.formation === 'string' && issue.formation.trim()
      ? [issue.formation.trim()]
      : [];
  return {
    category: FEEDBACK_CATEGORIES.has(issue.category) ? issue.category : 'grammar',
    severity: ['low', 'medium', 'high'].includes(issue.severity) ? issue.severity : 'medium',
    original: String(issue.original || '').trim(),
    suggestion: String(issue.suggestion || '').trim(),
    explanation: String(issue.explanation || '').trim(),
    partOfSpeech: String(issue.partOfSpeech || '').trim(),
    errorType: String(issue.errorType || '').trim(),
    rule: String(issue.rule || '').trim(),
    formation: String(issue.formation || '').trim(),
    steps,
    exampleCorrect: String(issue.exampleCorrect || '').trim(),
    exampleWrong: String(issue.exampleWrong || '').trim()
  };
}

function normalizeWrittenTurn(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('INVALID_WRITTEN_TURN: empty payload');
  }
  const partner = raw.partnerTurn || {};
  const fb = raw.feedback || {};
  const issues = Array.isArray(fb.issues)
    ? fb.issues
        .map(normalizeIssue)
        .filter((issue) => issue.explanation || issue.suggestion || issue.rule)
    : [];

  const score = Number(fb.overallScore);
  const clamped = Number.isNaN(score) ? 70 : Math.max(0, Math.min(100, Math.round(score)));

  return {
    version: 1,
    partnerTurn: {
      role: String(partner.role || 'partner').trim() || 'partner',
      text: String(partner.text || '').trim()
    },
    feedback: {
      overallScore: clamped,
      strengths: Array.isArray(fb.strengths) ? fb.strengths.map((s) => String(s)) : [],
      issues,
      reformulation: String(fb.reformulation || '').trim(),
      vocabUsed: {
        theme: Array.isArray(fb.vocabUsed?.theme) ? fb.vocabUsed.theme.map(String) : [],
        missed: Array.isArray(fb.vocabUsed?.missed) ? fb.vocabUsed.missed.map(String) : []
      },
      tips: Array.isArray(fb.tips) ? fb.tips.map((t) => String(t)) : []
    },
    done: !!raw.done,
    meta: raw.meta || {}
  };
}

module.exports = {
  createTranscript,
  createSimulationScript,
  normalizeSimulationScript,
  normalizeWrittenTurn
};
