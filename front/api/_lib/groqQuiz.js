const { normalizeWrittenTurn } = require('./contracts');
const { mapUpstreamError } = require('./errors');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey() {
  return process.env.GROQ_API_KEY || '';
}

const QUIZ_SYSTEM_PROMPT = `You are a meticulous English vocabulary coach for medical / domain learning.
Evaluate the learner's answer to a quiz item and return rich pedagogical feedback.

Return ONLY valid JSON:
{
  "correct": true|false,
  "score": 0-100,
  "expectedAnswer": "canonical expected answer in English",
  "partnerTurn": { "role": "coach", "text": "short encouraging coach reply in English" },
  "feedback": {
    "overallScore": 0-100,
    "strengths": ["concrete French strengths"],
    "issues": [
      {
        "category": "grammar|vocabulary_general|vocabulary_theme|sentence_structure|question_forms|naturalness|agreement|tense_aspect|preposition|article|collocation|word_order",
        "severity": "low|medium|high",
        "original": "wrong span",
        "suggestion": "correction",
        "explanation": "detailed French explanation",
        "partOfSpeech": "…",
        "errorType": "…",
        "rule": "…",
        "formation": "…",
        "steps": ["…"],
        "exampleCorrect": "…",
        "exampleWrong": "…"
      }
    ],
    "reformulation": "ideal full answer in English",
    "vocabUsed": { "theme": [], "missed": [] },
    "tips": ["specific French tip"]
  },
  "done": false
}

Rules:
- Be microscopic: one issue per mistake; POS, rule, formation steps, examples.
- Explanations/rules/tips in French; examples and expectedAnswer in English.
- Accept close synonyms when exerciseType is definition_to_word or word_to_definition if meaning is correct; explain nuances.
- For cloze and reformulate, judge precision and naturalness strictly.
- No markdown, JSON only.`;

async function generateQuizFeedback({
  exerciseType = 'definition_to_word',
  prompt = '',
  expected = '',
  learnerAnswer = '',
  theme = '',
  vocabulary = [],
  level = 'beginner'
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

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const vocabLines = (vocabulary || [])
    .map((w) => (typeof w === 'string' ? w : w?.en || ''))
    .filter(Boolean)
    .slice(0, 40);

  const userParts = [
    `Exercise type: ${exerciseType}`,
    theme ? `Theme: ${theme}` : null,
    `Level: ${level}`,
    `Prompt shown to learner:\n${prompt}`,
    expected ? `Expected / target answer:\n${expected}` : null,
    `Learner answer:\n${learnerAnswer || '(empty)'}`,
    vocabLines.length ? `Theme vocabulary:\n${vocabLines.map((w) => `- ${w}`).join('\n')}` : null
  ].filter(Boolean);

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: QUIZ_SYSTEM_PROMPT },
        { role: 'user', content: userParts.join('\n\n') }
      ]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: mapUpstreamError('groq', res.status, text) };
  }

  const data = await res.json();
  const usage = data?.usage || null;
  let parsed;
  try {
    parsed = JSON.parse(data?.choices?.[0]?.message?.content);
  } catch {
    return {
      error: {
        code: 'INVALID_JSON',
        message: 'Groq returned invalid JSON for quiz feedback',
        status: 502
      }
    };
  }

  try {
    const written = normalizeWrittenTurn({
      partnerTurn: parsed.partnerTurn || { role: 'doctor', text: parsed.expectedAnswer || '' },
      feedback: parsed.feedback || {},
      done: false,
      meta: {
        model,
        exerciseType,
        correct: !!parsed.correct,
        score: parsed.score ?? parsed.feedback?.overallScore,
        expectedAnswer: parsed.expectedAnswer || expected,
        usage,
        generatedAt: new Date().toISOString()
      }
    });
    return {
      data: {
        ...written,
        correct: !!parsed.correct,
        score: Number(parsed.score ?? written.feedback.overallScore) || 0,
        expectedAnswer: String(parsed.expectedAnswer || expected || '').trim()
      },
      usage
    };
  } catch (err) {
    return {
      error: {
        code: 'INVALID_QUIZ_FEEDBACK',
        message: err.message || 'Invalid quiz feedback',
        status: 502
      }
    };
  }
}

module.exports = { generateQuizFeedback };
