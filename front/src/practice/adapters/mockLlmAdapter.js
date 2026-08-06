import { createSimulationScript } from '../contracts';
import { SIMULATION_PRESETS } from '../data/simulationPresets';

export const mockLlmAdapter = {
  async generateSimulation({
    theme,
    locale = 'en',
    promptId = null,
    customPrompt = null,
    vocabulary = [],
    topicLabel = null,
    length = 'long',
    turns = 12
  }) {
    await delay(400);
    const preset = SIMULATION_PRESETS.find((p) => p.id === promptId) || SIMULATION_PRESETS[0];
    const vocabWords = (vocabulary || [])
      .map((w) => (typeof w === 'string' ? w : w.en))
      .filter(Boolean);

    let dialogue;
    if (vocabWords.length) {
      dialogue = buildLongTopicTurns(theme || topicLabel || 'this topic', vocabWords, turns);
    } else {
      dialogue = (preset?.sampleTurns || defaultTurns(theme)).map((t, i) => ({
        ...t,
        id: t.id || `turn-${i + 1}`
      }));
      if (length === 'long') {
        dialogue = [
          ...dialogue,
          { id: 'extra-1', role: 'doctor', text: 'Is there anything else that worries you today?' },
          { id: 'extra-2', role: 'patient', text: 'I just want to make sure everything is fine.' },
          { id: 'extra-3', role: 'doctor', text: 'We will take this step by step together.' },
          { id: 'extra-4', role: 'patient', text: 'Thank you, that makes me feel better.' }
        ];
      }
    }

    return createSimulationScript({
      theme: theme || topicLabel || preset?.theme || 'General practice',
      locale,
      turns: dialogue,
      meta: {
        promptId: promptId || preset?.id || 'mock',
        model: 'mock',
        topicLabel,
        vocabularyCount: vocabWords.length,
        length,
        generatedAt: new Date().toISOString(),
        note: customPrompt ? 'custom prompt noted (mock)' : null
      }
    });
  }
};

function buildLongTopicTurns(topic, words, targetTurns) {
  // More natural mock: open + weave a few words per exchange, not one Q/A per word
  const out = [
    { id: 'turn-1', role: 'doctor', text: `Good morning. What brings you in about ${topic} today?` },
    {
      id: 'turn-2',
      role: 'patient',
      text: words[0]
        ? `I've been worried — especially about ${words[0]}.`
        : `I've been worried about ${topic}.`,
    },
  ];

  let i = 1;
  while (i < words.length) {
    const batch = words.slice(i, i + 2);
    const joined = batch.join(' and ');
    out.push({
      id: `turn-d-${i}`,
      role: 'doctor',
      text: `I see. Have you noticed anything with ${joined}?`,
    });
    out.push({
      id: `turn-p-${i}`,
      role: 'patient',
      text: `Yes, ${batch[0]} has been bothering me${batch[1] ? `, and also ${batch[1]}` : ''}.`,
    });
    i += 2;
  }

  out.push({
    id: 'turn-end-d',
    role: 'doctor',
    text: 'Thank you. I will examine you and explain the next steps clearly.',
  });
  out.push({
    id: 'turn-end-p',
    role: 'patient',
    text: 'That helps. I feel more confident now.',
  });

  const minLen = Math.max(targetTurns || 12, Math.min(out.length, words.length + 4));
  if (out.length > minLen + 4) return out.slice(0, minLen + 4);
  return out;
}

function defaultTurns(theme) {
  return [
    { role: 'doctor', text: `Hello, welcome. How can I help with ${theme || 'your visit'}?` },
    { role: 'patient', text: 'I have an appointment today.' },
    { role: 'doctor', text: 'Of course. What brings you in?' },
    { role: 'patient', text: 'I have some symptoms I want to discuss.' },
    { role: 'doctor', text: 'Please tell me more.' },
    { role: 'patient', text: 'Thank you for listening.' }
  ];
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
