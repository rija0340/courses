import { usesRemoteLlm } from '../config';
import { mockQuizLlmAdapter } from '../adapters/mockQuizLlmAdapter';
import { remoteQuizLlmAdapter } from '../adapters/remoteQuizLlmAdapter';

function adapter() {
  return usesRemoteLlm() ? remoteQuizLlmAdapter : mockQuizLlmAdapter;
}

export const quizService = {
  async evaluate(input) {
    return adapter().generateQuizFeedback(input);
  }
};
