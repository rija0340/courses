const techVocabsSeed = {
  version: 2,
  meta: {
    title: { fr: 'TechVocabs', en: 'TechVocabs', mg: 'TechVocabs' },
    description: {
      fr: 'Lexique tech trilingue français-anglais-malgache',
      en: 'Trilingual tech lexicon French-English-Malagasy',
      mg: 'Rakibolana teknolojia telo fiteny frantsay-anglisy-malgasy'
    }
  },
  organization: {
    tabs: [
      { id: 'vocab', label: { fr: 'Vocabulaire', en: 'Vocabulary', mg: 'Voaboly' } },
      { id: 'concepts', label: { fr: 'Concepts', en: 'Concepts', mg: 'Foto-kevitra' } }
    ],
    categories: [
      {
        id: 'web',
        label: { fr: 'Web', en: 'Web', mg: 'Web' },
        image: null,
        visuals: [],
        children: [
          { id: 'frontend', label: { fr: 'Frontend', en: 'Frontend', mg: 'Frontend' }, image: null, visuals: [], children: [] },
          { id: 'backend', label: { fr: 'Backend', en: 'Backend', mg: 'Backend' }, image: null, visuals: [], children: [] }
        ]
      },
      {
        id: 'data',
        label: { fr: 'Données', en: 'Data', mg: 'Angona' },
        image: null,
        visuals: [],
        children: [
          { id: 'database', label: { fr: 'Base de données', en: 'Database', mg: 'Banky angona' }, image: null, visuals: [], children: [] },
          { id: 'analytics', label: { fr: 'Analytique', en: 'Analytics', mg: 'Fanadihadiana' }, image: null, visuals: [], children: [] }
        ]
      }
    ]
  },
  items: [
    { id: 'browser', en: 'Browser', fr: 'Navigateur', mg: 'Mpikaroka', category: 'Organe', tab: 'vocab', categoryId: 'frontend' },
    { id: 'server', en: 'Server', fr: 'Serveur', mg: 'Mpizara', category: 'Organe', tab: 'vocab', categoryId: 'backend' },
    { id: 'api', en: 'API', fr: 'API', mg: 'API', category: 'Concept', tab: 'concepts', categoryId: 'backend' },
    { id: 'sql', en: 'SQL', fr: 'SQL', mg: 'SQL', category: 'Organe', tab: 'vocab', categoryId: 'database' }
  ]
};

export default techVocabsSeed;