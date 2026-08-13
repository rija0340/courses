import { usesRemoteLlm } from '../config';
import { mockCardUtteranceAdapter } from '../adapters/mockCardUtteranceAdapter';
import { remoteCardUtteranceAdapter } from '../adapters/remoteCardUtteranceAdapter';

export const cardUtteranceService = {
  async assess({ learnerText, item, itemStructure }) {
    if (!usesRemoteLlm()) {
      return mockCardUtteranceAdapter.assess({ learnerText, item, itemStructure });
    }
    try {
      return await remoteCardUtteranceAdapter.assess({ learnerText, item, itemStructure });
    } catch {
      return mockCardUtteranceAdapter.assess({ learnerText, item, itemStructure });
    }
  }
};
