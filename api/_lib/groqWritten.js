const { normalizeWrittenTurn } = require('./contracts');
const { mapUpstreamError } = require('./errors');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey() {
  return process.env.GROQ_API_KEY || '';
}

const WRITTEN_SYSTEM_PROMPT = `You are a pedagogical English coach for medical doctor–patient role-play in WRITTEN mode.
The learner types one turn at a time; you reply as their conversation partner AND give detailed feedback on their last message.

Return ONLY valid JSON:
{
  "partnerTurn": { "role": "doctor|patient", "text": "natural reply in English" },
  "feedback": {
    "overallScore": 0-100,
    "strengths": ["string"],
    "issues": [
      {
        "category": "grammar|vocabulary_general|vocabulary_theme|sentence_structure|question_forms|naturalness",
        "severity": "low|medium|high",
        "original": "problematic phrase or empty if general",
        "suggestion": "corrected phrase",
        "explanation": "short pedagogical note in French"
      }
    ],
    "reformulation": "more natural version of the learner's message",
    "vocabUsed": { "theme": ["words used"], "missed": ["theme words they could use next"] },
    "tips": ["actionable tip in French"]
  },
  "done": false
}

Rules:
- partnerTurn must be the OTHER role than the learner
- Feedback must be complete and pedagogical: grammar, general vocabulary, theme vocabulary, sentence structure, question forms, natural reformulation
- Explanations in French; example sentences in English
- Keep partner replies under 40 words, natural clinical English
- Set done=true only when the conversation reached a natural closing (after at least 4 learner turns)
- No markdown, JSON only`;

async function generateWrittenTurn({
  theme,
  locale = 'en',
  level = 'beginner',
  learnerRole = 'patient',
  learnerText = '',
  history = [],
  vocabulary = [],
  topicLabel = null,
  customPrompt = null,
  turnIndex = 0
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

  const partnerRole = learnerRole === 'doctor' ? 'patient' : 'doctor';
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
    `Learner role: ${learnerRole}`,
    `Your partner role: ${partnerRole}`,
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
        { role: 'system', content: WRITTEN_SYSTEM_PROMPT },
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
        partnerRole,
        theme,
        topicLabel,
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
