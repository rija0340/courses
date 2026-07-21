import { createWrittenTurnResult } from '../contracts';

export const mockWrittenLlmAdapter = {
  async generateWrittenTurn({
    theme,
    learnerRole = 'patient',
    learnerText = '',
    history = [],
    vocabulary = [],
    topicLabel = null,
    turnIndex = 0
  }) {
    await delay(500);
    const partnerRole = learnerRole === 'doctor' ? 'patient' : 'doctor';
    const vocabWords = (vocabulary || [])
      .map((w) => (typeof w === 'string' ? w : w.en))
      .filter(Boolean);

    let partnerText;
    if (!learnerText && turnIndex === 0) {
      partnerText = partnerRole === 'doctor'
        ? `Hello, I'm Dr. Smith. What brings you in today regarding ${topicLabel || theme}?`
        : `Hello doctor. I've been having some concerns about ${topicLabel || theme}.`;
    } else if (partnerRole === 'doctor') {
      partnerText = `Thank you for explaining that. Can you tell me more about when it started?`;
    } else {
      partnerText = `I've noticed it for a few days now, and it's getting worse.`;
    }

    const usedTheme = vocabWords.filter((w) =>
      learnerText.toLowerCase().includes(w.toLowerCase())
    );
    const missedTheme = vocabWords.filter((w) => !usedTheme.includes(w)).slice(0, 4);

    const issues = [];
    if (learnerText && !learnerText.trim().endsWith('?') && learnerText.toLowerCase().includes('how')) {
      issues.push({
        category: 'question_forms',
        severity: 'medium',
        original: learnerText,
        suggestion: learnerText.replace(/\.$/, '?'),
        explanation: 'Les questions en anglais se terminent souvent par un point d\'interrogation.'
      });
    }
    if (learnerText && learnerText.split(' ').length < 4) {
      issues.push({
        category: 'sentence_structure',
        severity: 'low',
        original: learnerText,
        suggestion: `${learnerText} I would like to explain in more detail.`,
        explanation: 'Essayez des phrases plus complètes pour décrire votre situation.'
      });
    }
    if (missedTheme.length && learnerText) {
      issues.push({
        category: 'vocabulary_theme',
        severity: 'medium',
        original: '',
        suggestion: `Try using: ${missedTheme[0]}`,
        explanation: 'Intégrez le vocabulaire du thème pour enrichir votre expression.'
      });
    }

    return createWrittenTurnResult({
      partnerTurn: { role: partnerRole, text: partnerText },
      feedback: {
        overallScore: issues.length ? 72 : 88,
        strengths: learnerText
          ? ['Vous participez activement à la conversation.', 'Ton approprié pour un contexte médical.']
          : ['Prêt à commencer la simulation écrite.'],
        issues,
        reformulation: learnerText
          ? learnerText.charAt(0).toUpperCase() + learnerText.slice(1).replace(/\.$/, '') + '.'
          : '',
        vocabUsed: { theme: usedTheme, missed: missedTheme },
        tips: [
          'Utilisez des connecteurs : "because", "since", "however".',
          'Pour poser des questions : "Could you tell me…?", "How long has…?"'
        ]
      },
      done: turnIndex >= 5,
      meta: {
        model: 'mock',
        historyLength: history.length,
        generatedAt: new Date().toISOString()
      }
    });
  }
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
