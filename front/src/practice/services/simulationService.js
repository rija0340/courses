import { usesRemoteLlm } from '../config';
import { mockLlmAdapter } from '../adapters/mockLlmAdapter';
import { remoteLlmAdapter } from '../adapters/remoteLlmAdapter';
import { SIMULATION_PRESETS, getPresetById } from '../data/simulationPresets';
import { padScriptWithMissingVocabulary, suggestTurnCount } from '../domain/vocabCoverage';

function llmAdapter() {
  return usesRemoteLlm() ? remoteLlmAdapter : mockLlmAdapter;
}

export const simulationService = {
  listPresets() {
    return SIMULATION_PRESETS;
  },

  getPreset(id) {
    return getPresetById(id);
  },

  async generate({
    theme,
    locale = 'en',
    promptId = null,
    customPrompt = null,
    turns,
    level,
    vocabulary = [],
    topicLabel = null,
    length = 'long'
  }) {
    const preset = promptId ? getPresetById(promptId) : null;
    const turnCount =
      turns || suggestTurnCount(vocabulary?.length || 0, length) || preset?.turns || 12;

    let script = await llmAdapter().generateSimulation({
      theme: theme || topicLabel || preset?.theme || 'Conversation practice',
      locale,
      promptId: promptId || null,
      customPrompt: customPrompt || null,
      turns: turnCount,
      level: level || preset?.level || 'beginner',
      vocabulary,
      topicLabel,
      length
    });

    if (vocabulary?.length) {
      const { script: padded } = padScriptWithMissingVocabulary(script, vocabulary);
      script = padded;
    }

    return script;
  }
};
