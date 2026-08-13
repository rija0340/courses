/**
 * Card utterance assessment: the learner produces a sentence using the
 * headword or a related card word (synonym, antonym, …).
 * Exact overlap with the example is NOT required.
 *
 * Weights (context is the main criterion):
 *   contextUse 45% | grammar 25% | naturalness 20% | sentenceLevel 10%
 */
import {
  coerceDisplayText,
  hasText,
  listEntryPrimary,
  normalizeListField,
  pickI18nText,
} from '../../data/vocabs/vocabItemStructure';

export const CARD_UTTERANCE_WEIGHTS = {
  contextUse: 0.45,
  grammar: 0.25,
  naturalness: 0.2,
  sentenceLevel: 0.1,
};

function clampScore(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function normalize(text) {
  return tokenize(text).join(' ');
}

function escapeReg(s) {
  return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Whole-word / short-phrase match; allows simple English inflections. */
export function textContainsTerm(text, term) {
  const hay = ` ${normalize(text)} `;
  const needle = normalize(term);
  if (!needle) return false;
  if (needle.includes(' ')) return hay.includes(` ${needle} `) || hay.includes(needle);
  const re = new RegExp(`(?:^|\\s)${escapeReg(needle)}(?:s|es|ed|ing|er|est)?(?:\\s|$)`);
  return re.test(hay);
}

function addRelated(related, seen, word, role) {
  const w = coerceDisplayText(word);
  if (!hasText(w)) return;
  const key = w.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  related.push({ word: w, role: role || 'related' });
}

function pushListField(related, seen, item, fieldId, translate, role) {
  const entries = normalizeListField(item?.[fieldId], translate);
  entries.forEach((entry) => addRelated(related, seen, listEntryPrimary(entry), role || fieldId));
}

/**
 * Lexicon the learner may use: headword + structure lists (syn/ant/…) + example lines.
 */
export function collectCardLexicon(item = {}, itemStructure = null) {
  const headword = coerceDisplayText(item.en);
  const related = [];
  const seen = new Set();
  if (headword) seen.add(headword.toLowerCase());

  const fields = Array.isArray(itemStructure?.fields) ? itemStructure.fields : [];
  const seenFieldIds = new Set();
  fields.forEach((f) => {
    if (!f?.id || f.id === 'phonetic') return;
    seenFieldIds.add(f.id);
    if (f.type === 'list') {
      pushListField(related, seen, item, f.id, f.translate, f.id);
    }
  });
  if (!seenFieldIds.has('synonyms')) pushListField(related, seen, item, 'synonyms', true, 'synonyms');
  if (!seenFieldIds.has('antonyms')) pushListField(related, seen, item, 'antonyms', true, 'antonyms');

  const exampleEn = [item.example?.patient?.en, item.example?.doctor?.en]
    .map((s) => coerceDisplayText(s))
    .filter(hasText);

  return {
    headword,
    related,
    exampleEn,
    meaningFr: coerceDisplayText(item.fr),
    meaningMg: coerceDisplayText(item.mg),
    context: pickI18nText(item.context, 'en') || coerceDisplayText(item.context),
  };
}

export function findUsedTargets(text, lexicon) {
  const used = [];
  const missed = [];
  if (lexicon.headword) {
    const hit = { word: lexicon.headword, role: 'headword' };
    (textContainsTerm(text, lexicon.headword) ? used : missed).push(hit);
  }
  (lexicon.related || []).forEach((r) => {
    (textContainsTerm(text, r.word) ? used : missed).push(r);
  });
  return { used, missed };
}

export function isCopiedExample(text, examples = []) {
  const n = normalize(text);
  if (!n || n.length < 8) return false;
  return examples.some((ex) => {
    const e = normalize(ex);
    if (!e) return false;
    return e === n || (n.length >= 12 && e.includes(n)) || (e.length >= 12 && n.includes(e));
  });
}

function dimensionGrammar(text, tokens) {
  if (!tokens.length) return 0;
  let score = 52;
  if (/^[A-ZÀ-Ÿ]/.test(text.trim())) score += 10;
  if (/[.?!]["']?$/.test(text.trim())) score += 8;
  if (tokens.length >= 5) score += 12;
  else if (tokens.length >= 3) score += 6;
  if (
    /\b(am|is|are|was|were|be|been|have|has|had|do|does|did|can|could|will|would|feel|felt|make|made|get|got|need|want|use|used|take|took|give|gave)\b/i.test(
      text
    )
  ) {
    score += 12;
  }
  if (tokens.length < 3) score -= 22;
  return clampScore(score);
}

function dimensionNaturalness(tokens, copied) {
  let score = 58;
  if (copied) score += 12;
  if (tokens.length >= 6) score += 12;
  if (tokens.length >= 10) score += 6;
  if (tokens.length <= 2) score -= 28;
  return clampScore(score);
}

function dimensionSentenceLevel(text, tokens) {
  let score = 38;
  if (tokens.length >= 5) score += 16;
  if (tokens.length >= 8) score += 12;
  if (tokens.length >= 12) score += 8;
  if (/\b(because|although|which|that|when|if|while|since|however|after|before|so that)\b/i.test(text)) {
    score += 16;
  }
  if (tokens.length <= 2) score = 14;
  return clampScore(score);
}

function dimensionContextUse({ used, tokens, copied }) {
  const usedHead = used.some((u) => u.role === 'headword');
  const usedRelated = used.some((u) => u.role !== 'headword');
  if (!usedHead && !usedRelated) return 12;
  if (tokens.length <= 2) return usedHead ? 38 : 32;
  if (copied) return 82;
  if (usedHead && usedRelated && tokens.length >= 6) return 96;
  if (usedHead && tokens.length >= 5) return 88;
  if (usedRelated && tokens.length >= 5) return 84;
  return 70;
}

export function combineCardUtteranceScore(dimensions) {
  const d = dimensions || {};
  return clampScore(
    CARD_UTTERANCE_WEIGHTS.contextUse * (d.contextUse || 0) +
      CARD_UTTERANCE_WEIGHTS.grammar * (d.grammar || 0) +
      CARD_UTTERANCE_WEIGHTS.naturalness * (d.naturalness || 0) +
      CARD_UTTERANCE_WEIGHTS.sentenceLevel * (d.sentenceLevel || 0)
  );
}

function buildLocalIssues({ text, tokens, used, missed, lexicon }) {
  const issues = [];
  if (!used.length && lexicon.headword) {
    issues.push({
      category: 'context_use',
      severity: 'high',
      original: text,
      suggestion: `I used ${lexicon.headword} in a full sentence.`,
      explanation:
        'La phrase ne contient ni le mot de la carte ni un synonyme / antonyme associé. Le critère principal est d’employer ce lexique dans un vrai contexte.',
      partOfSpeech: 'vocable cible',
      errorType: 'mot de la carte absent',
      rule: 'Employez le mot (ou un mot lié de la carte) avec son sens correct, dans une phrase complète.',
      formation: `Insérez « ${lexicon.headword} » dans une structure Sujet + Verbe + Complément.`,
      steps: [
        `Gardez le sens de « ${lexicon.headword} »${lexicon.meaningFr ? ` (${lexicon.meaningFr})` : ''}.`,
        'Écrivez une phrase complète, pas le mot seul.',
        'Un synonyme ou antonyme de la carte est aussi accepté.',
      ],
      exampleCorrect: lexicon.exampleEn[0] || `Yesterday I noticed a ${lexicon.headword}.`,
      exampleWrong: 'Something happened.',
    });
  } else if (tokens.length <= 2 && lexicon.headword) {
    issues.push({
      category: 'sentence_structure',
      severity: 'high',
      original: text,
      suggestion: `I had a ${lexicon.headword} this morning.`,
      explanation:
        'Répéter le mot seul ne montre pas que vous savez l’utiliser. Il faut une phrase (sujet, verbe, contexte).',
      partOfSpeech: 'phrase (SVO)',
      errorType: 'mot isolé au lieu d’une phrase',
      rule: 'Phrase affirmative de base : Subject + Verb + Object/Complement.',
      formation: 'Ajoutez un sujet, un verbe conjugué, puis un détail (quand, où, comment).',
      steps: [
        'Choisissez un sujet (I / The patient / This word…).',
        'Ajoutez un verbe conjugué.',
        `Placez « ${lexicon.headword} » dans un complément naturel.`,
      ],
      exampleCorrect: lexicon.exampleEn[0] || `I woke up with a ${lexicon.headword}.`,
      exampleWrong: lexicon.headword,
    });
  }
  if (missed.some((m) => m.role === 'synonyms' || m.role === 'antonyms') && used.length && tokens.length >= 4) {
    const next = missed.find((m) => m.role === 'synonyms' || m.role === 'antonyms');
    if (next) {
      issues.push({
        category: 'vocabulary_theme',
        severity: 'low',
        original: '',
        suggestion: `… ${next.word} …`,
        explanation: `Vous pouvez aussi faire une deuxième phrase avec « ${next.word} » (${next.role}).`,
        partOfSpeech: 'lexique lié',
        errorType: 'mot lié non encore utilisé',
        rule: 'Le lexique de la carte (synonymes, antonymes) est un matériel valide, pas seulement le titre.',
        formation: `Inventez une phrase où « ${next.word} » a le bon sens.`,
        steps: [`Choisissez le rôle de « ${next.word} ».`, 'Placez-le dans une phrase SVO.'],
        exampleCorrect: `This is the opposite of ${next.word}.`,
        exampleWrong: '',
      });
    }
  }
  return issues;
}

/**
 * Deterministic local judge — used by mock adapter and as remote fallback.
 * Cannot detect wrong *sense* of a homograph; Groq handles that.
 */
export function scoreCardUtterance(learnerText, item = {}, itemStructure = null) {
  const lexicon = collectCardLexicon(item, itemStructure);
  const text = String(learnerText || '').trim();
  const tokens = tokenize(text);
  const { used, missed } = findUsedTargets(text, lexicon);
  const copied = isCopiedExample(text, lexicon.exampleEn);

  if (!tokens.length) {
    const dimensions = { grammar: 0, naturalness: 0, sentenceLevel: 0, contextUse: 0 };
    return {
      lexicon,
      used,
      missed,
      copied,
      dimensions,
      overallScore: 0,
      issues: [
        {
          category: 'sentence_structure',
          severity: 'high',
          original: '',
          suggestion: lexicon.headword ? `I can use ${lexicon.headword} in a sentence.` : '',
          explanation: 'Aucune phrase n’a été entendue ou saisie.',
          partOfSpeech: 'phrase',
          errorType: 'réponse vide',
          rule: 'Produisez une phrase anglaise complète.',
          formation: 'Parlez ou tapez une phrase avec le mot de la carte.',
          steps: ['Ouvrez la pratique.', 'Inventez une phrase, ou dictez-la.'],
          exampleCorrect: lexicon.exampleEn[0] || '',
          exampleWrong: '',
        },
      ],
      strengths: [],
      reformulation: lexicon.exampleEn[0] || '',
      tips: ['Inventez une phrase : le mot (ou un synonyme / antonyme) doit apparaître dans un vrai contexte.'],
    };
  }

  const dimensions = {
    grammar: dimensionGrammar(text, tokens),
    naturalness: dimensionNaturalness(tokens, copied),
    sentenceLevel: dimensionSentenceLevel(text, tokens),
    contextUse: dimensionContextUse({ used, tokens, copied }),
  };
  const overallScore = combineCardUtteranceScore(dimensions);
  const issues = buildLocalIssues({ text, tokens, used, missed, lexicon });

  const strengths = [];
  if (used.length && tokens.length >= 4) {
    strengths.push(
      copied
        ? 'Vous réutilisez l’exemple : c’est valide. Vous pouvez aussi inventer une autre phrase.'
        : 'Vous avez produit une phrase avec le lexique de la carte — ce n’est pas une répétition forcée.'
    );
  }
  if (used.some((u) => u.role !== 'headword')) {
    strengths.push('Un mot lié (synonyme / antonyme / colonne) est bien intégré.');
  }
  if (dimensions.grammar >= 75 && tokens.length >= 5) {
    strengths.push('La phrase a une structure lisible (sujet / verbe / complément).');
  }

  const reformulation =
    tokens.length <= 2 && lexicon.headword
      ? `I used the word ${lexicon.headword} in this sentence.`
      : text.charAt(0).toUpperCase() + text.slice(1).replace(/[.?!]*$/, '.');

  const tips = [];
  if (!used.length) {
    tips.push(`Placez « ${lexicon.headword || 'le mot'} » (ou un synonyme / antonyme) dans la phrase.`);
  } else if (tokens.length <= 2) {
    tips.push('Allongez : qui fait quoi, où, quand — pour montrer le contexte.');
  } else {
    tips.push('Le juge ne demande pas de copier l’exemple : une phrase originale correcte score aussi bien, voire mieux.');
  }

  return {
    lexicon,
    used,
    missed,
    copied,
    dimensions,
    overallScore,
    issues,
    strengths,
    reformulation,
    tips,
  };
}
