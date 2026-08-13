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
  'word_order',
  'context_use',
  'sentence_level'
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
  const role = String(partnerTurn?.role || 'partner').trim() || 'partner';
  return {
    version: 1,
    partnerTurn: {
      role,
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

const CARD_WEIGHTS = { contextUse: 0.45, grammar: 0.25, naturalness: 0.2, sentenceLevel: 0.1 };

function clampDim(n, fallback = 0) {
  const x = Number(n);
  if (Number.isNaN(x)) return fallback;
  return Math.max(0, Math.min(100, Math.round(x)));
}

function combineCardDims(d) {
  return clampDim(
    CARD_WEIGHTS.contextUse * (d.contextUse || 0) +
      CARD_WEIGHTS.grammar * (d.grammar || 0) +
      CARD_WEIGHTS.naturalness * (d.naturalness || 0) +
      CARD_WEIGHTS.sentenceLevel * (d.sentenceLevel || 0)
  );
}

function mapTarget(entry) {
  if (!entry) return null;
  if (typeof entry === 'string') {
    const word = entry.trim();
    return word ? { word, role: 'related' } : null;
  }
  const word = String(entry.word || entry.en || '').trim();
  if (!word) return null;
  return { word, role: String(entry.role || 'related') };
}

export function createCardUtteranceResult({
  learnerText = '',
  overallScore,
  dimensions = {},
  usedTargets = [],
  missedTargets = [],
  copiedExample = false,
  feedback = {},
  meta = {}
}) {
  const dims = {
    grammar: clampDim(dimensions.grammar),
    naturalness: clampDim(dimensions.naturalness),
    sentenceLevel: clampDim(dimensions.sentenceLevel),
    contextUse: clampDim(dimensions.contextUse)
  };
  const combined = combineCardDims(dims);
  const score = clampDim(overallScore, combined);
  const used = (usedTargets || []).map(mapTarget).filter(Boolean);
  const missed = (missedTargets || []).map(mapTarget).filter(Boolean);
  const issues = Array.isArray(feedback.issues) ? feedback.issues.map(normalizeIssue) : [];
  return {
    version: 1,
    learnerText: String(learnerText || '').trim(),
    heardText: String(learnerText || '').trim(),
    targetText: used[0]?.word || '',
    score,
    overallScore: score,
    dimensions: dims,
    usedTargets: used,
    missedTargets: missed,
    copiedExample: !!copiedExample,
    wordFeedback: used.map((u) => ({ word: u.word, ok: true, hint: u.role })),
    tips: Array.isArray(feedback.tips) ? feedback.tips : [],
    feedback: {
      overallScore: score,
      strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
      issues,
      reformulation: String(feedback.reformulation || '').trim(),
      vocabUsed: {
        theme: used.map((u) => u.word),
        missed: missed.map((m) => m.word)
      },
      tips: Array.isArray(feedback.tips) ? feedback.tips : []
    },
    meta
  };
}

export function normalizeCardUtterance(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('INVALID_CARD_UTTERANCE: empty payload');
  }
  const dimsIn = raw.dimensions || {};
  return createCardUtteranceResult({
    learnerText: raw.learnerText,
    overallScore: raw.overallScore ?? raw.feedback?.overallScore,
    dimensions: {
      grammar: dimsIn.grammar,
      naturalness: dimsIn.naturalness,
      sentenceLevel: dimsIn.sentenceLevel ?? dimsIn.advancement,
      contextUse: dimsIn.contextUse
    },
    usedTargets: raw.usedTargets || raw.feedback?.vocabUsed?.theme,
    missedTargets: raw.missedTargets || raw.feedback?.vocabUsed?.missed,
    copiedExample: raw.copiedExample,
    feedback: raw.feedback || {},
    meta: raw.meta || {}
  });
}
