import { aiClient } from '../gateway/aiClient';
import { normalizeWrittenTurn } from '../contracts';

export const remoteQuizLlmAdapter = {
  async generateQuizFeedback(input) {
    const data = await aiClient.generateQuizFeedback(input);
    const written = normalizeWrittenTurn(data);
    return {
      ...written,
      correct: !!data.correct,
      score: Number(data.score ?? written.feedback.overallScore) || 0,
      expectedAnswer: String(data.expectedAnswer || input.expected || '').trim()
    };
  }
};
