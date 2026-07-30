import { aiClient } from '../gateway/aiClient';
import { normalizeSimulationScript } from '../contracts';

export const remoteLlmAdapter = {
  async generateSimulation(input) {
    const data = await aiClient.generateSimulation(input);
    return normalizeSimulationScript(data);
  }
};
