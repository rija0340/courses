import { createSimulationScript } from '../contracts';
import { getScenarioProfile, listPresets } from '../data/scenarioProfiles';

export const mockLlmAdapter = {
  async generateSimulation({
    theme,
    locale = 'en',
    promptId = null,
    customPrompt = null,
    vocabulary = [],
    topicLabel = null,
    length = 'long',
    turns = 12,
    domainId = null,
    scenarioKind = null,
    roles = null,
  }) {
    await delay(400);
    const profile = getScenarioProfile(domainId);
    const kind = scenarioKind || profile.kind;
    const partner = roles?.partner || profile.padPartnerRole;
    const learner = roles?.learner || profile.padLearnerRole;
    const presets = listPresets(domainId);
    const preset = presets.find((p) => p.id === promptId) || presets[0];
    const vocabWords = (vocabulary || [])
      .map((w) => (typeof w === 'string' ? w : w.en))
      .filter(Boolean);

    let dialogue;
    if (vocabWords.length) {
      dialogue = buildTopicTurns(
        theme || topicLabel || 'this topic',
        vocabWords,
        turns,
        partner,
        learner,
        kind
      );
    } else {
      dialogue = (preset?.sampleTurns || defaultTurns(theme, partner, learner, kind)).map((t, i) => ({
        ...t,
        id: t.id || `turn-${i + 1}`,
      }));
      if (length === 'long') {
        dialogue = [
          ...dialogue,
          ...extraTurns(partner, learner, kind),
        ];
      }
    }

    return createSimulationScript({
      theme: theme || topicLabel || preset?.theme || 'Conversation practice',
      locale,
      turns: dialogue,
      meta: {
        promptId: promptId || preset?.id || 'mock',
        model: 'mock',
        topicLabel,
        vocabularyCount: vocabWords.length,
        length,
        scenarioKind: kind,
        generatedAt: new Date().toISOString(),
        note: customPrompt ? 'custom prompt noted (mock)' : null,
      },
    });
  },
};

function buildTopicTurns(topic, words, targetTurns, partner, learner, kind) {
  const medical = kind === 'medical';
  const out = [
    {
      id: 'turn-1',
      role: partner,
      text: medical
        ? `Good morning. What brings you in about ${topic} today?`
        : `Hi! Shall we talk about ${topic}?`,
    },
    {
      id: 'turn-2',
      role: learner,
      text: words[0]
        ? medical
          ? `I've been worried — especially about ${words[0]}.`
          : `Yes. I'd like to practice words like ${words[0]}.`
        : medical
          ? `I've been worried about ${topic}.`
          : `Yes, I'd like to practice ${topic}.`,
    },
  ];

  let i = 1;
  while (i < words.length) {
    const batch = words.slice(i, i + 2);
    const joined = batch.join(' and ');
    out.push({
      id: `turn-p-${i}`,
      role: partner,
      text: medical
        ? `I see. Have you noticed anything with ${joined}?`
        : `Interesting. How would you use ${joined} in a sentence?`,
    });
    out.push({
      id: `turn-l-${i}`,
      role: learner,
      text: medical
        ? `Yes, ${batch[0]} has been bothering me${batch[1] ? `, and also ${batch[1]}` : ''}.`
        : `For example, I can talk about ${batch[0]}${batch[1] ? ` and ${batch[1]}` : ''}.`,
    });
    i += 2;
  }

  out.push({
    id: 'turn-end-p',
    role: partner,
    text: medical
      ? 'Thank you. I will examine you and explain the next steps clearly.'
      : 'Nice work. Shall we wrap up for now?',
  });
  out.push({
    id: 'turn-end-l',
    role: learner,
    text: medical
      ? 'That helps. I feel more confident now.'
      : 'Yes, that was helpful. Thank you.',
  });

  const minLen = Math.max(targetTurns || 12, Math.min(out.length, words.length + 4));
  if (out.length > minLen + 4) return out.slice(0, minLen + 4);
  return out;
}

function defaultTurns(theme, partner, learner, kind) {
  if (kind === 'medical') {
    return [
      { role: partner, text: `Hello, welcome. How can I help with ${theme || 'your visit'}?` },
      { role: learner, text: 'I have an appointment today.' },
      { role: partner, text: 'Of course. What brings you in?' },
      { role: learner, text: 'I have some symptoms I want to discuss.' },
      { role: partner, text: 'Please tell me more.' },
      { role: learner, text: 'Thank you for listening.' },
    ];
  }
  return [
    { role: partner, text: `Hi! Ready to practice ${theme || 'English'}?` },
    { role: learner, text: 'Yes, I am ready.' },
    { role: partner, text: 'Great. What would you like to talk about first?' },
    { role: learner, text: 'I would like to use some new words.' },
    { role: partner, text: 'Perfect. Go ahead.' },
    { role: learner, text: 'Thank you for practicing with me.' },
  ];
}

function extraTurns(partner, learner, kind) {
  if (kind === 'medical') {
    return [
      { id: 'extra-1', role: partner, text: 'Is there anything else that worries you today?' },
      { id: 'extra-2', role: learner, text: 'I just want to make sure everything is fine.' },
      { id: 'extra-3', role: partner, text: 'We will take this step by step together.' },
      { id: 'extra-4', role: learner, text: 'Thank you, that makes me feel better.' },
    ];
  }
  return [
    { id: 'extra-1', role: partner, text: 'Is there another word you want to try?' },
    { id: 'extra-2', role: learner, text: 'Yes, I want to make a longer sentence.' },
    { id: 'extra-3', role: partner, text: 'Go ahead — I am listening.' },
    { id: 'extra-4', role: learner, text: 'Thanks, that helps me feel more confident.' },
  ];
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
