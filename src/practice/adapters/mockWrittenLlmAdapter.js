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
    if (learnerText && /\bi have pain since\b/i.test(learnerText)) {
      issues.push({
        category: 'tense_aspect',
        severity: 'high',
        original: 'I have pain since',
        suggestion: 'I have had pain since / I have been having pain since',
        explanation:
          'Avec « since » (point de départ dans le passé), l’anglais utilise souvent le present perfect, pas le present simple.',
        partOfSpeech: 'verbe (present perfect)',
        errorType: 'temps / aspect incorrect avec since',
        rule: 'since + moment passé → present perfect (have/has + V3) ou present perfect continuous.',
        formation: 'have/has + participe passé du verbe principal.',
        steps: [
          'Repérez « since » + un moment passé.',
          'Conjuguez have/has selon le sujet.',
          'Ajoutez le participe passé (had, felt, noticed…).'
        ],
        exampleWrong: 'I have pain since Monday.',
        exampleCorrect: 'I have had pain since Monday.'
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
        formation: 'Ajoutez un sujet clair, un verbe conjugué, puis le détail clinique.',
        steps: [
          'Choisissez le sujet (I / My eye / The pain…).',
          'Ajoutez un verbe conjugué (have, feel, noticed…).',
          'Complétez avec le détail (where, when, how).'
        ],
        exampleWrong: 'Pain eye.',
        exampleCorrect: 'I have pain in my right eye.'
      });
    }
    if (missedTheme.length && learnerText) {
      const word = missedTheme[0];
      issues.push({
        category: 'vocabulary_theme',
        severity: 'medium',
        original: '',
        suggestion: `… my ${word} …`,
        explanation: `Le thème invite à utiliser « ${word} ». Intégrez ce terme dans une collocation naturelle (my ${word}, pain in the ${word}, etc.).`,
        partOfSpeech: 'nom (vocabulaire thématique)',
        errorType: 'vocabulaire du thème non utilisé',
        rule: 'Réutilisez les termes du thème dans des collocations médicales naturelles.',
        formation: `Insérez « ${word} » après un déterminant (my/the) ou dans une expression fixe.`,
        steps: [
          `Choisissez le slot : my ${word} / the ${word} / pain in the ${word}.`,
          'Placez-le dans une phrase SVO complète.',
          'Vérifiez l’article (a/the/my) selon le contexte.'
        ],
        exampleWrong: 'Something is wrong there.',
        exampleCorrect: `I have discomfort in my ${word}.`
      });
    }
    if (learnerText && /\bgo to hospital\b/i.test(learnerText) && !/\bthe hospital\b/i.test(learnerText)) {
      issues.push({
        category: 'article',
        severity: 'low',
        original: 'go to hospital',
        suggestion: 'go to the hospital (US) / go to hospital (UK — possible)',
        explanation:
          'En anglais américain, on dit souvent « the hospital ». En britannique, « hospital » sans article est courant pour l’institution.',
        partOfSpeech: 'article défini',
        errorType: 'article / usage institutionnel',
        rule: 'Article selon variété et sens (lieu vs institution).',
        formation: 'Ajoutez « the » si vous visez l’usage américain.',
        steps: [
          'Décidez US vs UK.',
          'US : the hospital ; UK institution : hospital.'
        ],
        exampleWrong: 'I go to hospital yesterday. (tense + article)',
        exampleCorrect: 'I went to the hospital yesterday.'
      });
    }

    return createWrittenTurnResult({
      partnerTurn: { role: partnerRole, text: partnerText },
      feedback: {
        overallScore: issues.length ? 68 : 90,
        strengths: learnerText
          ? [
              'Vous répondez dans le rôle et avancez le dialogue.',
              'Le message reste compréhensible dans un contexte médical.'
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
          : ['Préparez une phrase complète : sujet + verbe + détail clinique.']
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
