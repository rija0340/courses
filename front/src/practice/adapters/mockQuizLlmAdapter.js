import { createWrittenTurnResult } from '../contracts';

function normalize(answer) {
  return String(answer || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const mockQuizLlmAdapter = {
  async generateQuizFeedback({
    exerciseType = 'definition_to_word',
    prompt = '',
    expected = '',
    learnerAnswer = '',
    vocabulary = []
  }) {
    await delay(400);
    const expectedN = normalize(expected);
    const answerN = normalize(learnerAnswer);
    const correct =
      !!answerN &&
      (answerN === expectedN ||
        expectedN.includes(answerN) ||
        answerN.includes(expectedN));

    const issues = [];
    if (!correct && learnerAnswer) {
      issues.push({
        category: exerciseType === 'cloze' ? 'vocabulary_theme' : 'vocabulary_general',
        severity: 'medium',
        original: learnerAnswer,
        suggestion: expected || '…',
        explanation:
          'La réponse attendue est différente. Comparez le sens et l’orthographe avec la cible.',
        partOfSpeech: 'nom / expression',
        errorType: 'réponse hors cible',
        rule: 'Pour ce type d’exercice, privilégiez le terme exact du thème ou un synonyme médical précis.',
        formation: 'Repartir du prompt, identifier le concept, produire le mot EN exact.',
        steps: [
          'Relisez le prompt / la définition.',
          'Cherchez le mot anglais du thème correspondant.',
          'Vérifiez orthographe et article éventuel.'
        ],
        exampleCorrect: expected || 'eyelid',
        exampleWrong: learnerAnswer
      });
    }
    if (learnerAnswer && learnerAnswer.split(/\s+/).length === 1 && exerciseType === 'word_to_definition') {
      issues.push({
        category: 'sentence_structure',
        severity: 'low',
        original: learnerAnswer,
        suggestion: `A short definition: "${expected || learnerAnswer}" means…`,
        explanation: 'Une définition gagne à être une phrase complète (sujet + verbe).',
        partOfSpeech: 'phrase',
        errorType: 'définition trop courte',
        rule: 'Definition = complete sentence describing meaning/function.',
        formation: 'Start with "It is…" / "This is the…" + function.',
        steps: ['Nommez la catégorie (organe, symptôme…).', 'Ajoutez la fonction ou le contexte.'],
        exampleCorrect: 'It is the movable fold of skin that covers the eye.',
        exampleWrong: learnerAnswer
      });
    }

    const themeWords = (vocabulary || [])
      .map((w) => (typeof w === 'string' ? w : w.en))
      .filter(Boolean);

    const written = createWrittenTurnResult({
      partnerTurn: {
        role: 'doctor',
        text: correct
          ? 'Well done — that matches the target.'
          : `Not quite. The expected answer is "${expected || '…'}".`
      },
      feedback: {
        overallScore: correct ? 92 : issues.length ? 55 : 40,
        strengths: correct
          ? ['Réponse alignée avec la cible.', 'Bonne mobilisation du thème.']
          : ['Vous avez tenté une réponse — continuez.'],
        issues,
        reformulation: expected || '',
        vocabUsed: {
          theme: themeWords.filter((w) => answerN.includes(normalize(w))).slice(0, 5),
          missed: correct ? [] : themeWords.slice(0, 3)
        },
        tips: [
          'Répétez à voix haute la reformulation proposée.',
          'Reliez le mot à une image mentale ou un symptôme clinique.'
        ]
      },
      done: false,
      meta: { model: 'mock', exerciseType, prompt }
    });

    return {
      ...written,
      correct,
      score: written.feedback.overallScore,
      expectedAnswer: expected
    };
  }
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
