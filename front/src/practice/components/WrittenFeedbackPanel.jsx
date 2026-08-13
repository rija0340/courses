const CATEGORY_LABELS = {
  grammar: 'Grammaire',
  vocabulary_general: 'Vocabulaire général',
  vocabulary_theme: 'Vocabulaire du thème',
  sentence_structure: 'Structure de phrase',
  question_forms: 'Formes interrogatives',
  naturalness: 'Formulation naturelle',
  agreement: 'Accord',
  tense_aspect: 'Temps / aspect',
  preposition: 'Préposition',
  article: 'Article',
  collocation: 'Expression / collocation',
  word_order: 'Ordre des mots',
  context_use: 'Mot en contexte',
  sentence_level: 'Niveau de phrase'
};

export default function WrittenFeedbackPanel({ feedback, onSpeakReformulation }) {
  if (!feedback) return null;

  const score = feedback.overallScore ?? 0;
  const scoreColor =
    score >= 80 ? 'text-[#137333] bg-[#E6F4EA]' :
    score >= 60 ? 'text-[#E37400] bg-[#FEF7E0]' :
    'text-[#C5221F] bg-[#FCE8E6]';

  return (
    <div className="rounded-2xl border border-[#dadce0] bg-[#f8f9fa] p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-[#202124]">Retour pédagogique</h3>
        <span className={`text-[13px] font-bold px-2.5 py-1 rounded-full tabular-nums ${scoreColor}`}>
          {score}/100
        </span>
      </div>

      {feedback.strengths?.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#34A853] mb-1.5">Points forts</p>
          <ul className="space-y-1">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-[13px] text-[#3c4043]">• {s}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.reformulation && (
        <div className="rounded-xl bg-white border border-[#dadce0] p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] mb-1">
                Reformulation naturelle
              </p>
              <p className="text-[14px] text-[#202124] italic">{feedback.reformulation}</p>
            </div>
            {onSpeakReformulation && (
              <button
                type="button"
                onClick={onSpeakReformulation}
                className="text-[11px] font-semibold text-[#1a73e8] hover:underline shrink-0"
              >
                Écouter
              </button>
            )}
          </div>
        </div>
      )}

      {feedback.issues?.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-2">
            Corrections détaillées ({feedback.issues.length})
          </p>
          <div className="space-y-3">
            {feedback.issues.map((issue, i) => (
              <div key={i} className="rounded-xl bg-white border border-[#dadce0] p-3.5 text-[13px] space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#f1f3f4] text-[#5f6368]">
                    {CATEGORY_LABELS[issue.category] || issue.category}
                  </span>
                  {issue.errorType && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#E8F0FE] text-[#1967D2]">
                      {issue.errorType}
                    </span>
                  )}
                  {issue.partOfSpeech && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#f8f9fa] text-[#5f6368] border border-[#dadce0]">
                      {issue.partOfSpeech}
                    </span>
                  )}
                  {issue.severity === 'high' && (
                    <span className="text-[10px] font-semibold text-[#C5221F]">important</span>
                  )}
                </div>

                {(issue.original || issue.suggestion) && (
                  <div className="rounded-lg bg-[#f8f9fa] px-2.5 py-2 space-y-0.5">
                    {issue.original && (
                      <p className="text-[#9aa0a6]">
                        <span className="text-[10px] font-semibold uppercase tracking-wide mr-1">Erreur</span>
                        <span className="line-through">{issue.original}</span>
                      </p>
                    )}
                    {issue.suggestion && (
                      <p className="text-[#137333]">
                        <span className="text-[10px] font-semibold uppercase tracking-wide mr-1">Correction</span>
                        <span className="font-medium">{issue.suggestion}</span>
                      </p>
                    )}
                  </div>
                )}

                {issue.rule && (
                  <p className="text-[#3c4043]">
                    <span className="font-semibold text-[#202124]">Règle : </span>
                    {issue.rule}
                  </p>
                )}

                {issue.explanation && (
                  <p className="text-[#5f6368] leading-relaxed">{issue.explanation}</p>
                )}

                {(issue.steps?.length > 0 || issue.formation) && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1">
                      Formation de la correction
                    </p>
                    {issue.steps?.length > 0 ? (
                      <ol className="list-decimal pl-4 space-y-0.5 text-[#3c4043]">
                        {issue.steps.map((step, si) => (
                          <li key={si}>{step}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-[#3c4043]">{issue.formation}</p>
                    )}
                  </div>
                )}

                {(issue.exampleCorrect || issue.exampleWrong) && (
                  <div className="grid sm:grid-cols-2 gap-2 text-[12px]">
                    {issue.exampleWrong && (
                      <div className="rounded-lg border border-red-100 bg-red-50/60 px-2.5 py-1.5">
                        <p className="text-[10px] font-semibold uppercase text-[#C5221F] mb-0.5">À éviter</p>
                        <p className="text-[#5f6368]">{issue.exampleWrong}</p>
                      </div>
                    )}
                    {issue.exampleCorrect && (
                      <div className="rounded-lg border border-green-100 bg-[#E6F4EA]/60 px-2.5 py-1.5">
                        <p className="text-[10px] font-semibold uppercase text-[#137333] mb-0.5">Exemple</p>
                        <p className="text-[#3c4043]">{issue.exampleCorrect}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(feedback.vocabUsed?.theme?.length > 0 || feedback.vocabUsed?.missed?.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {feedback.vocabUsed.theme?.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#34A853] mb-1.5">Thème utilisé</p>
              <div className="flex flex-wrap gap-1">
                {feedback.vocabUsed.theme.map((w) => (
                  <span key={w} className="text-[11px] px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333]">{w}</span>
                ))}
              </div>
            </div>
          )}
          {feedback.vocabUsed.missed?.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#E37400] mb-1.5">À essayer ensuite</p>
              <div className="flex flex-wrap gap-1">
                {feedback.vocabUsed.missed.map((w) => (
                  <span key={w} className="text-[11px] px-2 py-0.5 rounded-full bg-[#FEF7E0] text-[#E37400]">{w}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {feedback.tips?.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">Conseils</p>
          <ul className="space-y-1">
            {feedback.tips.map((tip, i) => (
              <li key={i} className="text-[13px] text-[#3c4043]">• {tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { CATEGORY_LABELS };
