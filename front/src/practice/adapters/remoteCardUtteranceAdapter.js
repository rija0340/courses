import { aiClient } from '../gateway/aiClient';
import { createCardUtteranceResult, normalizeCardUtterance } from '../contracts';
import { collectCardLexicon, findUsedTargets, isCopiedExample } from '../domain/cardUtterance';

export const remoteCardUtteranceAdapter = {
  async assess({ learnerText, item, itemStructure }) {
    const lexicon = collectCardLexicon(item, itemStructure);
    const { used, missed } = findUsedTargets(learnerText, lexicon);
    const data = await aiClient.assessCardUtterance({
      learnerText,
      headword: lexicon.headword,
      related: lexicon.related,
      meaningFr: lexicon.meaningFr,
      meaningMg: lexicon.meaningMg,
      context: lexicon.context,
      exampleEn: lexicon.exampleEn,
      detectedUsed: used,
      detectedMissed: missed.slice(0, 12)
    });
    const normalized = normalizeCardUtterance({
      ...data,
      learnerText,
      copiedExample: data.copiedExample ?? isCopiedExample(learnerText, lexicon.exampleEn)
    });
    if (!normalized.usedTargets.length && used.length) {
      return createCardUtteranceResult({
        ...normalized,
        usedTargets: used,
        missedTargets: missed,
        learnerText
      });
    }
    return normalized;
  }
};
