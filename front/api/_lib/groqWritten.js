const { normalizeWrittenTurn } = require('./contracts');
const { mapUpstreamError } = require('./errors');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey() {
  return process.env.GROQ_API_KEY || '';
}

const WRITTEN_SYSTEM_PROMPT_MEDICAL = `You are a meticulous pedagogical English coach for medical doctor–patient role-play (written or dictated replies).
The learner sends one turn at a time; you reply as their conversation partner AND give MICROSCOPIC, detailed feedback on their last message.

Return ONLY valid JSON:
{
  "partnerTurn": { "role": "doctor|patient", "text": "natural reply in English" },
  "feedback": {
    "overallScore": 0-100,
    "strengths": ["concrete strength in French, not vague praise"],
    "issues": [
      {
        "category": "grammar|vocabulary_general|vocabulary_theme|sentence_structure|question_forms|naturalness|agreement|tense_aspect|preposition|article|collocation|word_order",
        "severity": "low|medium|high",
        "original": "exact wrong span from the learner text (not the whole sentence unless needed)",
        "suggestion": "corrected span or phrase",
        "explanation": "detailed French explanation: what is wrong, why, and the correct pattern",
        "partOfSpeech": "e.g. verb (present perfect) / noun / preposition / auxiliary / article…",
        "errorType": "short label e.g. subject-verb agreement / missing article / wrong word order",
        "rule": "the grammar/usage rule in French",
        "formation": "how to form the correction step by step in French",
        "steps": ["step 1 in French", "step 2 in French"],
        "exampleCorrect": "short correct English example",
        "exampleWrong": "short incorrect English example if useful"
      }
    ],
    "reformulation": "more natural full version of the learner's message",
    "vocabUsed": { "theme": ["words used"], "missed": ["theme words they could use next"] },
    "tips": ["specific actionable tip in French tied to this turn"]
  },
  "done": false
}

STRICT feedback rules:
- ONE issue object per distinct mistake (span-level). Do not merge several errors into one vague note.
- Never write vague tips like "améliorez votre anglais" — be concrete.
- For each issue: name the part of speech, state the rule, explain formation of the correction (steps), give a mini correct example.
- Cover grammar faults, sentence construction, question forms, articles, prepositions, tense/aspect, word order, collocations/expressions, theme vocabulary when relevant.
- Explanations, rules, formation, steps, strengths, tips: French. Examples and learner/partner text: English.
- partnerTurn must be the OTHER role than the learner; under 40 words; natural clinical English.
- If learnerText is empty (opening): partner opens the dialogue; issues may be empty.
- Set done=true only after a natural closing and at least 4 learner turns.
- No markdown, JSON only`;

const WRITTEN_SYSTEM_PROMPT_GENERAL = `You are a meticulous pedagogical English coach for two-person vocabulary role-play (written or dictated replies). NOT medical unless the theme is medical.
The learner sends one turn at a time; you reply as their conversation partner AND give MICROSCOPIC, detailed feedback on their last message.

Return ONLY valid JSON:
{
  "partnerTurn": { "role": "partner|learner|string", "text": "natural reply in English" },
  "feedback": {
    "overallScore": 0-100,
    "strengths": ["concrete strength in French, not vague praise"],
    "issues": [
      {
        "category": "grammar|vocabulary_general|vocabulary_theme|sentence_structure|question_forms|naturalness|agreement|tense_aspect|preposition|article|collocation|word_order",
        "severity": "low|medium|high",
        "original": "exact wrong span from the learner text (not the whole sentence unless needed)",
        "suggestion": "corrected span or phrase",
        "explanation": "detailed French explanation: what is wrong, why, and the correct pattern",
        "partOfSpeech": "e.g. verb (present perfect) / noun / preposition / auxiliary / article…",
        "errorType": "short label e.g. subject-verb agreement / missing article / wrong word order",
        "rule": "the grammar/usage rule in French",
        "formation": "how to form the correction step by step in French",
        "steps": ["step 1 in French", "step 2 in French"],
        "exampleCorrect": "short correct English example",
        "exampleWrong": "short incorrect English example if useful"
      }
    ],
    "reformulation": "more natural full version of the learner's message",
    "vocabUsed": { "theme": ["words used"], "missed": ["theme words they could use next"] },
    "tips": ["specific actionable tip in French tied to this turn"]
  },
  "done": false
}

STRICT feedback rules:
- ONE issue object per distinct mistake (span-level). Do not merge several errors into one vague note.
- Never write vague tips like "améliorez votre anglais" — be concrete.
- For each issue: name the part of speech, state the rule, explain formation of the correction (steps), give a mini correct example.
- Cover grammar faults, sentence construction, question forms, articles, prepositions, tense/aspect, word order, collocations/expressions, theme vocabulary when relevant.
- Explanations, rules, formation, steps, strengths, tips: French. Examples and learner/partner text: English.
- partnerTurn must be the OTHER role than the learner; under 40 words; natural everyday English for the topic.
- If learnerText is empty (opening): partner opens the dialogue; issues may be empty.
- Set done=true only after a natural closing and at least 4 learner turns.
- No markdown, JSON only`;

async function generateWrittenTurn({
  theme,
  locale = 'en',
  level = 'beginner',
  learnerRole = 'learner',
  partnerRole = null,
  learnerText = '',
  history = [],
  vocabulary = [],
  topicLabel = null,
  customPrompt = null,
  turnIndex = 0,
  scenarioKind = 'general'
}) {
  const key = getApiKey();
  if (!key) {
    return {
      error: {
        code: 'MISSING_KEY',
        message: 'GROQ_API_KEY not configured',
        status: 503
      }
    };
  }

  const kind = scenarioKind === 'medical' ? 'medical' : 'general';
  const resolvedPartner =
    partnerRole ||
    (kind === 'medical'
      ? learnerRole === 'doctor'
        ? 'patient'
        : 'doctor'
      : learnerRole === 'partner'
        ? 'learner'
        : 'partner');
  const vocab = Array.isArray(vocabulary) ? vocabulary.slice(0, 80) : [];
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const historyLines = (history || [])
    .map((t) => `${t.role}: ${t.text}`)
    .join('\n');

  const vocabLines = vocab
    .map((w) => (typeof w === 'string' ? w : w?.en || ''))
    .filter(Boolean);

  const userParts = [
    `Theme: ${theme}`,
    topicLabel ? `Topic: ${topicLabel}` : null,
    `Level: ${level}`,
    `Locale: ${locale}`,
    `Scenario kind: ${kind}`,
    `Learner role: ${learnerRole}`,
    `Your partner role: ${resolvedPartner}`,
    `Turn number (learner): ${turnIndex + 1}`,
    historyLines ? `Conversation so far:\n${historyLines}` : 'Conversation: starting',
    learnerText
      ? `Learner's new message:\n${learnerText}`
      : 'Learner has not written yet — provide an opening partner line to start the dialogue and minimal feedback with empty issues.',
    vocabLines.length
      ? `Theme vocabulary to encourage:\n${vocabLines.map((w) => `- ${w}`).join('\n')}`
      : null,
    customPrompt ? `Extra instructions: ${String(customPrompt).slice(0, 800)}` : null
  ].filter(Boolean);

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: kind === 'medical' ? WRITTEN_SYSTEM_PROMPT_MEDICAL : WRITTEN_SYSTEM_PROMPT_GENERAL
        },
        { role: 'user', content: userParts.join('\n\n') }
      ]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: mapUpstreamError('groq', res.status, text) };
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return {
      error: {
        code: 'INVALID_JSON',
        message: 'Groq returned invalid JSON for written turn',
        status: 502
      }
    };
  }

  try {
    const normalized = normalizeWrittenTurn({
      ...parsed,
      meta: {
        model,
        learnerRole,
        partnerRole: resolvedPartner,
        theme,
        topicLabel,
        scenarioKind: kind,
        generatedAt: new Date().toISOString()
      }
    });
    return { data: normalized };
  } catch (err) {
    return {
      error: {
        code: 'INVALID_WRITTEN_TURN',
        message: err.message || 'Invalid written turn payload',
        status: 502
      }
    };
  }
}

module.exports = { generateWrittenTurn };
