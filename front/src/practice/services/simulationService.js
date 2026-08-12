import { usesRemoteLlm } from '../config';
import { mockLlmAdapter } from '../adapters/mockLlmAdapter';
import { remoteLlmAdapter } from '../adapters/remoteLlmAdapter';
import { getScenarioProfile, listPresets, getPresetById } from '../data/scenarioProfiles';
import { suggestTurnCount } from '../domain/vocabCoverage';

function llmAdapter() {
  return usesRemoteLlm() ? remoteLlmAdapter : mockLlmAdapter;
}

export const simulationService = {
  listPresets(domainId) {
    return listPresets(domainId);
  },

  getPreset(domainId, id) {
    return getPresetById(domainId, id);
  },

  getProfile(domainId, promptId = null) {
    return getScenarioProfile(domainId, promptId);
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
    length = 'long',
    domainId = null,
    scenarioKind = null,
  }) {
    const profile = getScenarioProfile(domainId, promptId);
    const kind = scenarioKind || profile.kind;
    const preset = promptId ? getPresetById(domainId, promptId) : null;
    const turnCount =
      turns || suggestTurnCount(vocabulary?.length || 0, length) || preset?.turns || 12;

    return llmAdapter().generateSimulation({
      theme: theme || topicLabel || preset?.theme || 'Conversation practice',
      locale,
      promptId: promptId || null,
      customPrompt: customPrompt || null,
      turns: turnCount,
      level: level || preset?.level || 'beginner',
      vocabulary,
      topicLabel,
      length,
      domainId,
      scenarioKind: kind,
      roles: {
        partner: profile.padPartnerRole,
        learner: profile.padLearnerRole,
      },
    });
  },
};
