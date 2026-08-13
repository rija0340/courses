import { createCardUtteranceResult } from '../contracts';
import { scoreCardUtterance } from '../domain/cardUtterance';

export const mockCardUtteranceAdapter = {
  async assess({ learnerText, item, itemStructure }) {
    await delay(280);
    const local = scoreCardUtterance(learnerText, item, itemStructure);
    return createCardUtteranceResult({
      learnerText,
      overallScore: local.overallScore,
      dimensions: local.dimensions,
      usedTargets: local.used,
      missedTargets: local.missed,
      copiedExample: local.copied,
      feedback: {
        overallScore: local.overallScore,
        strengths: local.strengths,
        issues: local.issues,
        reformulation: local.reformulation,
        tips: local.tips
      },
      meta: { model: 'mock', generatedAt: new Date().toISOString() }
    });
  }
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
