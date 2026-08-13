const { normalizeCardUtterance } = require('./contracts');
const { mapUpstreamError } = require('./errors');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey() {
  return process.env.GROQ_API_KEY || '';
}

const SYSTEM_PROMPT = `You are a meticulous pedagogical English coach for vocabulary-card practice.
The learner produces ONE English sentence (typed or dictated). They may invent their own sentence OR reuse the card example. Do NOT require repeating the example. Do NOT score by word-overlap with the example.

They should use the HEADWORD or a RELATED card word (synonym, antonym, or other column) in the RIGHT meaning / collocation.

Return ONLY valid JSON:
{
  "overallScore": 0-100,
  "dimensions": {
    "grammar": 0-100,
    "naturalness": 0-100,
    "sentenceLevel": 0-100,
    "contextUse": 0-100
  },
  "usedTargets": [{ "word": "…", "role": "headword|synonyms|antonyms|related" }],
  "missedTargets": [{ "word": "…", "role": "…" }],
  "copiedExample": true|false,
  "feedback": {
    "overallScore": 0-100,
    "strengths": ["concrete strength in French"],
    "issues": [
      {
        "category": "grammar|vocabulary_general|vocabulary_theme|sentence_structure|question_forms|naturalness|agreement|tense_aspect|preposition|article|collocation|word_order|context_use|sentence_level",
        "severity": "low|medium|high",
        "original": "exact wrong span",
        "suggestion": "corrected span",
        "explanation": "detailed French explanation",
        "partOfSpeech": "…",
        "errorType": "…",
        "rule": "…",
        "formation": "…",
        "steps": ["…"],
        "exampleCorrect": "short correct English example",
        "exampleWrong": "short incorrect English example"
      }
    ],
    "reformulation": "more natural full English sentence using the target lexicon",
    "vocabUsed": { "theme": ["words used"], "missed": ["related words to try next"] },
    "tips": ["specific actionable tip in French"]
  }
}

Scoring (MUST follow):
- overallScore = round(0.45*contextUse + 0.25*grammar + 0.20*naturalness + 0.10*sentenceLevel)
- contextUse is THE main criterion:
  - 0–20: fluent English but none of the card words, OR the word is used with the WRONG meaning
  - ≤40: they only uttered the isolated word, no sentence
  - ≥80: headword OR related word in a real sentence with the CORRECT sense (original sentence is encouraged)
  - ≥85: original sentence, correct collocation/context
  - copying the example is valid (~80–88) but not required
- grammar: morphology, agreement, tense, articles, word order
- naturalness: would a native say this, or does it sound translated / telegram-style?
- sentenceLevel: sophistication (subordination, connectors, precision) — not length for its own sake
- A synonym/antonym used correctly counts as strong contextUse even if the headword is absent
- Isolated word with no grammar around it: low sentenceLevel and low contextUse
- Explanations, rules, formation, steps, strengths, tips: French. Examples and learner text: English.
- One issue object per distinct mistake. No vague praise.
- No markdown, JSON only.`;

async function assessCardUtterance({
  learnerText = '',
  headword = '',
  related = [],
  meaningFr = '',
  meaningMg = '',
  context = '',
  exampleEn = [],
  detectedUsed = [],
  detectedMissed = []
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
  const relatedLines = (related || [])
    .map((r) => (typeof r === 'string' ? `- ${r}` : `- ${r.word} (${r.role || 'related'})`))
    .filter(Boolean);

  const userParts = [
    `Headword: ${headword || '(none)'}`,
    meaningFr ? `French gloss: ${meaningFr}` : null,
    meaningMg ? `Malagasy gloss: ${meaningMg}` : null,
    context ? `Card context/notes: ${context}` : null,
    relatedLines.length ? `Related card words (valid substitutes):\n${relatedLines.join('\n')}` : 'Related card words: none',
    exampleEn?.length
      ? `Card example(s) — valid if reused, NOT required:\n${exampleEn.map((e) => `- ${e}`).join('\n')}`
      : 'No example on the card.',
    `Learner's sentence:\n${learnerText || '(empty)'}`,
    detectedUsed?.length
      ? `Local token detector found these card words: ${detectedUsed.map((u) => u.word || u).join(', ')}`
      : 'Local token detector found NO card words. If you also find none, contextUse must be very low unless a close inflection was missed.',
    detectedMissed?.length
      ? `Unused related words: ${detectedMissed.map((m) => m.word || m).join(', ')}`
      : null
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
        { role: 'system', content: SYSTEM_PROMPT },
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
        message: 'Groq returned invalid JSON for card utterance',
        status: 502
      }
    };
  }

  try {
    const normalized = normalizeCardUtterance({
      ...parsed,
      learnerText,
      meta: {
        model,
        headword,
        generatedAt: new Date().toISOString()
      }
    });
    return { data: normalized };
  } catch (err) {
    return {
      error: {
        code: 'INVALID_CARD_UTTERANCE',
        message: err.message || 'Invalid card utterance payload',
        status: 502
      }
    };
  }
}

module.exports = { assessCardUtterance };
