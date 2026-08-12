import { createWrittenTurnResult } from '../contracts';

export const mockWrittenLlmAdapter = {
  async generateWrittenTurn({
    theme,
    learnerRole = 'a',
    partnerRole = null,
    learnerText = '',
    history = [],
    vocabulary = [],
    topicLabel = null,
    turnIndex = 0,
    scenarioKind = 'general',
  }) {
    await delay(500);
    const medical = scenarioKind === 'medical';
    const resolvedPartner =
      partnerRole ||
      (medical
        ? learnerRole === 'doctor'
          ? 'patient'
          : 'doctor'
        : learnerRole === 'b' || learnerRole === 'partner'
          ? 'a'
          : 'b');
    const vocabWords = (vocabulary || [])
      .map((w) => (typeof w === 'string' ? w : w.en))
      .filter(Boolean);

    let partnerText;
    if (!learnerText && turnIndex === 0) {
      partnerText = medical
        ? resolvedPartner === 'doctor'
          ? `Hello, I'm Dr. Smith. What brings you in today regarding ${topicLabel || theme}?`
          : `Hello doctor. I've been having some concerns about ${topicLabel || theme}.`
        : `Hi! Ready to practice English about ${topicLabel || theme}?`;
    } else if (medical && resolvedPartner === 'doctor') {
      partnerText = `Thank you for explaining that. Can you tell me more about when it started?`;
    } else if (medical) {
      partnerText = `I've noticed it for a few days now, and it's getting worse.`;
    } else {
      partnerText = learnerText
        ? `Nice. Can you also try a sentence with another word from the topic?`
        : `What would you like to say first?`;
    }

    const usedTheme = vocabWords.filter((w) =>
      learnerText.toLowerCase().includes(w.toLowerCase())
    );
    const missedTheme = vocabWords.filter((w) => !usedTheme.includes(w)).slice(0, 4);

    const issues = [];
    if (learnerText && !learnerText.trim().endsWith('?') && /\b(how|what|when|where|why|do|does|did|can|could)\b/i.test(learnerText)) {
      issues.push({
        category: 'question_forms',
        severity: 'high',
        original: learnerText.trim().replace(/\?$/, ''),
        suggestion: `${learnerText.trim().replace(/[.?!]$/, '')}?`,
        explanation:
          'En anglais, une question directe se termine par un point d’interrogation et, souvent, place l’auxiliaire avant le sujet (inversion).',
        partOfSpeech: 'auxiliaire + sujet (interrogative)',
        errorType: 'forme interrogative incomplète',
        rule: 'Structure WH- / Yes-No : (WH-word) + auxiliaire + sujet + verbe… ?',
        formation: 'Ajoutez le ? et vérifiez l’ordre auxiliaire–sujet.',
        steps: [
          'Identifiez si c’est une question (mot interrogatif ou demande d’info).',
          'Placez l’auxiliaire (do/does/did/can…) avant le sujet si besoin.',
          'Terminez par ?'
        ],
        exampleWrong: 'How long it hurts.',
        exampleCorrect: 'How long has it hurt?'
      });
    }
    if (learnerText && learnerText.split(/\s+/).length < 4) {
      issues.push({
        category: 'sentence_structure',
        severity: 'medium',
        original: learnerText,
        suggestion: `I would like to explain that ${learnerText.replace(/^[.]+|[.]+$/g, '')}.`,
        explanation:
          'Une réponse trop courte manque souvent de sujet + verbe + complément. Développez avec une proposition complète.',
        partOfSpeech: 'phrase (SVO)',
        errorType: 'phrase trop elliptique',
        rule: 'Phrase affirmative de base : Subject + Verb + Object/Complement.',
        formation: 'Ajoutez un sujet clair, un verbe conjugué, puis le détail.',
        steps: [
          'Choisissez le sujet (I / This word…).',
          'Ajoutez un verbe conjugué (have, feel, noticed…).',
          'Complétez avec le détail (where, when, how).'
        ],
        exampleWrong: 'Pain eye.',
        exampleCorrect: medical ? 'I have pain in my right eye.' : 'I want to practice this word today.'
      });
    }
    if (missedTheme.length && learnerText) {
      const word = missedTheme[0];
      issues.push({
        category: 'vocabulary_theme',
        severity: 'medium',
        original: '',
        suggestion: `… ${word} …`,
        explanation: `Le thème invite à utiliser « ${word} ». Intégrez ce terme dans une phrase naturelle.`,
        partOfSpeech: 'nom (vocabulaire thématique)',
        errorType: 'vocabulaire du thème non utilisé',
        rule: 'Réutilisez les termes du thème dans des collocations naturelles.',
        formation: `Insérez « ${word} » dans une phrase SVO complète.`,
        steps: [
          `Choisissez le slot pour « ${word} ».`,
          'Placez-le dans une phrase SVO complète.',
          'Vérifiez l’article (a/the/my) selon le contexte.'
        ],
        exampleWrong: 'Something is wrong there.',
        exampleCorrect: medical
          ? `I have discomfort in my ${word}.`
          : `I can use the word ${word} in this sentence.`
      });
    }

    return createWrittenTurnResult({
      partnerTurn: { role: resolvedPartner, text: partnerText },
      feedback: {
        overallScore: issues.length ? 68 : 90,
        strengths: learnerText
          ? [
              'Vous répondez dans le rôle et avancez le dialogue.',
              'Le message reste compréhensible.'
            ]
          : ['Prêt à commencer : écoutez l’ouverture puis écrivez ou dictez.'],
        issues,
        reformulation: learnerText
          ? learnerText.charAt(0).toUpperCase() + learnerText.slice(1).replace(/\.$/, '') + (learnerText.includes('?') ? '' : '.')
          : '',
        vocabUsed: { theme: usedTheme, missed: missedTheme },
        tips: learnerText
          ? [
              'Après chaque correction, reformulez à voix haute la version corrigée.',
              'Pour les questions : auxiliaire + sujet + verbe, puis ?'
            ]
          : ['Préparez une phrase complète : sujet + verbe + détail.']
      },
      done: turnIndex >= 5,
      meta: {
        model: 'mock',
        historyLength: history.length,
        scenarioKind,
        generatedAt: new Date().toISOString()
      }
    });
  }
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
