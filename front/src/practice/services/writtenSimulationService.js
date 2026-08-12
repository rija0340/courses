import { usesRemoteLlm } from '../config';
import { mockWrittenLlmAdapter } from '../adapters/mockWrittenLlmAdapter';
import { remoteWrittenLlmAdapter } from '../adapters/remoteWrittenLlmAdapter';

function adapter() {
  return usesRemoteLlm() ? remoteWrittenLlmAdapter : mockWrittenLlmAdapter;
}

export const writtenSimulationService = {
  async submitTurn({
    theme,
    locale = 'en',
    level = 'beginner',
    learnerRole = 'a',
    partnerRole = null,
    learnerText = '',
    history = [],
    vocabulary = [],
    topicLabel = null,
    customPrompt = null,
    turnIndex = 0,
    domainId = null,
    scenarioKind = 'general',
  }) {
    return adapter().generateWrittenTurn({
      theme,
      locale,
      level,
      learnerRole,
      partnerRole,
      learnerText,
      history,
      vocabulary,
      topicLabel,
      customPrompt,
      turnIndex,
      domainId,
      scenarioKind,
    });
  }
};
