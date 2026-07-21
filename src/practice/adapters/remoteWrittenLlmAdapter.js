import { aiClient } from '../gateway/aiClient';
import { normalizeWrittenTurn } from '../contracts';

export const remoteWrittenLlmAdapter = {
  async generateWrittenTurn(input) {
    const data = await aiClient.generateWrittenTurn(input);
    return normalizeWrittenTurn(data);
  }
};
