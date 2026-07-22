/** Stable DTOs consumed by UI — never vendor-specific payloads. */

export function createTranscript({ text, confidence = null, words = [] }) {
  return {
    version: 1,
    text: String(text || '').trim(),
    confidence,
    words: Array.isArray(words) ? words : []
  };
}

export function createPronunciationResult({
  targetText,
  heardText,
  score,
  wordFeedback = [],
  tips = []
}) {
  const n = Number(score);
  const clamped = Number.isNaN(n) ? 0 : Math.max(0, Math.min(100, Math.round(n)));
  return {
    version: 1,
    targetText: String(targetText || ''),
    heardText: String(heardText || ''),
    score: clamped,
    wordFeedback,
    tips
  };
}

export function createSimulationScript({ theme, locale = 'en', turns = [], meta = {} }) {
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

export function normalizeSimulationScript(raw) {
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

export function createWrittenTurnResult({
  partnerTurn,
  feedback,
  done = false,
  meta = {}
}) {
  const issues = Array.isArray(feedback?.issues)
    ? feedback.issues.map(normalizeIssue)
    : [];
  return {
    version: 1,
    partnerTurn: {
      role: partnerTurn?.role === 'doctor' || partnerTurn?.role === 'patient'
        ? partnerTurn.role
        : 'doctor',
      text: String(partnerTurn?.text || '').trim()
    },
    feedback: {
      overallScore: Math.max(0, Math.min(100, Math.round(Number(feedback?.overallScore) || 0))),
      strengths: Array.isArray(feedback?.strengths) ? feedback.strengths : [],
      issues,
      reformulation: String(feedback?.reformulation || '').trim(),
      vocabUsed: {
        theme: feedback?.vocabUsed?.theme || [],
        missed: feedback?.vocabUsed?.missed || []
      },
      tips: Array.isArray(feedback?.tips) ? feedback.tips : []
    },
    done: !!done,
    meta
  };
}

export function normalizeWrittenTurn(raw) {
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

  return createWrittenTurnResult({
    partnerTurn: partner,
    feedback: {
      ...fb,
      issues,
      overallScore: fb.overallScore
    },
    done: raw.done,
    meta: raw.meta || {}
  });
}
