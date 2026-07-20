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
  const out = [
    { id: 'turn-1', role: 'doctor', text: `Hello. Today we will talk about ${topic}.` },
    { id: 'turn-2', role: 'patient', text: `Thank you. I have questions about ${topic}.` }
  ];
  words.forEach((word, i) => {
    out.push({
      id: `turn-d-${i + 1}`,
      role: 'doctor',
      text: `Please describe any problem with your ${word}.`
    });
    out.push({
      id: `turn-p-${i + 1}`,
      role: 'patient',
      text: `My ${word} feels unusual sometimes.`
    });
  });
  out.push({
    id: 'turn-end-d',
    role: 'doctor',
    text: 'I will examine you carefully and explain the next steps.'
  });
  out.push({
    id: 'turn-end-p',
    role: 'patient',
    text: 'Thank you, doctor. I feel more confident now.'
  });
  // trim or keep — prefer covering all words over exact turn count
  if (out.length > Math.max(targetTurns, words.length * 2 + 4)) {
    return out.slice(0, Math.max(targetTurns, words.length * 2 + 4));
  }
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
