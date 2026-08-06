const { normalizeSimulationScript } = require('./contracts');
const { mapUpstreamError } = require('./errors');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey() {
  return process.env.GROQ_API_KEY || '';
}

const SYSTEM_PROMPT = `You generate spoken doctor–patient role-play simulations for English language practice.
Return ONLY valid JSON matching this shape:
{
  "theme": "string",
  "locale": "en",
  "turns": [
    { "id": "turn-1", "role": "doctor|patient|nurse|receptionist|learner|partner", "text": "spoken line", "listenHint": "optional hint" }
  ]
}
Rules:
- Alternate speakers naturally (prefer doctor ↔ patient)
- Write natural, realistic clinic conversation — not a vocabulary quiz
- Keep each turn under 30 words
- When a vocabulary list is provided: weave those English terms into the dialogue naturally (about 1–2 terms per turn when possible). Prefer clinical context over checklist questions. Use the exact English spelling of each term at least once if you can do so without sounding forced.
- Stay focused on the given topic
- No markdown, no code fences, JSON only`;

function padMissingOnServer(script, vocabulary) {
  const list = (vocabulary || [])
    .map((w) => (typeof w === 'string' ? w : w?.en || ''))
    .map((s) => String(s).trim())
    .filter(Boolean);
  if (!list.length) return script;

  const full = script.turns.map((t) => t.text).join(' ').toLowerCase();
  const missing = list.filter((en) => {
    const n = en.toLowerCase();
    return !full.includes(n);
  });
  if (!missing.length) {
    return {
      ...script,
      meta: {
        ...script.meta,
        vocabularyCoverage: { required: list.length, missing: [], padded: 0 }
      }
    };
  }

  // Soft clinical pad — only for terms the LLM missed (keep short)
  const extra = [];
  missing.forEach((word, idx) => {
    extra.push({
      id: `pad-doc-${idx + 1}`,
      role: 'doctor',
      text: `I'd also like to check anything related to ${word}.`,
      listenHint: `vocab: ${word}`
    });
    extra.push({
      id: `pad-pat-${idx + 1}`,
      role: 'patient',
      text: `Yes, ${word} has been on my mind lately.`,
      listenHint: `vocab: ${word}`
    });
  });

  return {
    ...script,
    turns: [...script.turns, ...extra],
    meta: {
      ...script.meta,
      vocabularyCoverage: {
        required: list.length,
        missing: [],
        padded: extra.length
      }
    }
  };
}

async function generateSimulation({
  theme,
  locale = 'en',
  customPrompt = null,
  promptId = null,
  turns = 12,
  level = 'beginner',
  vocabulary = [],
  topicLabel = null,
  length = 'long'
}) {
  const key = getApiKey();
  if (!key) {
    return {
      error: {
        code: 'MISSING_KEY',
        message:
          'GROQ_API_KEY not configured. Add GROQ_API_KEY=... to .env (not REACT_APP_*) and restart the API.',
        status: 503
      }
    };
  }

  const vocab = Array.isArray(vocabulary) ? vocabulary.slice(0, 80) : [];
  const vocabCount = vocab.length;
  const minTurns =
    length === 'short' ? 8 : length === 'medium' ? 12 : Math.max(14, Math.min(24, 8 + Math.ceil(vocabCount / 2)));
  const targetTurns = Math.max(minTurns, Math.min(24, Number(turns) || minTurns));

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const userParts = [
    `Theme: ${theme}`,
    topicLabel ? `Topic focus: ${topicLabel}` : null,
    `Locale: ${locale}`,
    `Level: ${level}`,
    `Length: ${length}`,
    `Target turns: ${targetTurns} (use at least ${Math.max(10, targetTurns - 2)} turns)`,
    'Roles: use mostly "doctor" and "patient" so two distinct voices can be applied.'
  ].filter(Boolean);

  if (vocabCount) {
    const lines = vocab.map((w) => {
      if (typeof w === 'string') return `- ${w}`;
      const en = w.en || w.word || '';
      const fr = w.fr ? ` (fr: ${w.fr})` : '';
      return `- ${en}${fr}`;
    });
    userParts.push(
      `Vocabulary to weave in naturally (aim to use each English term once in context):\n${lines.join('\n')}`
    );
    userParts.push(
      `Write a believable clinic visit. Do not ask "tell me about X" for every term. Spread terms across the dialogue.`
    );
  }

  if (customPrompt) {
    userParts.push(`Extra instructions: ${String(customPrompt).slice(0, 1200)}`);
  }

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.75,
      max_tokens: 2800,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userParts.join('\n') }
      ]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: mapUpstreamError('groq', res.status, text) };
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '';
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return {
      error: {
        code: 'INVALID_SIMULATION',
        message: 'LLM returned non-JSON content',
        status: 502
      }
    };
  }

  try {
    let script = normalizeSimulationScript({
      ...parsed,
      theme: parsed.theme || theme,
      locale: parsed.locale || locale,
      meta: {
        promptId,
        model,
        topicLabel: topicLabel || null,
        vocabularyCount: vocabCount,
        length,
        generatedAt: new Date().toISOString()
      }
    });
    script = padMissingOnServer(script, vocab);
    return { data: script };
  } catch (err) {
    return {
      error: {
        code: 'INVALID_SIMULATION',
        message: err.message || 'Invalid simulation script',
        status: 502
      }
    };
  }
}

module.exports = { generateSimulation };
