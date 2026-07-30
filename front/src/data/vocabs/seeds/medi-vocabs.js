const mediVocabsSeed = {
  version: 2,
  meta: {
    title: { fr: 'MediVocabs', en: 'MediVocabs', mg: 'MediVocabs' },
    description: {
      fr: 'Lexique médical trilingue français-anglais-malgache',
      en: 'Trilingual medical lexicon French-English-Malagasy',
      mg: 'Rakibolana ara-pitsaboana telo fiteny frantsay-anglisy-malgasy'
    }
  },
  organization: {
    tabs: [
      { id: 'vocab', label: { fr: 'Vocabulaire', en: 'Vocabulary', mg: 'Voaboly' } },
      { id: 'maladies', label: { fr: 'Maladies', en: 'Illnesses', mg: 'Arety' } },
      { id: 'expressions', label: { fr: 'Expressions', en: 'Expressions', mg: 'Fitenenana' } }
    ],
    categories: [
      {
        id: 'tete',
        label: { fr: 'Tête', en: 'Head', mg: 'Loha' },
        image: null,
        visuals: [],
        children: [
          { id: 'yeux', label: { fr: 'Yeux', en: 'Eyes', mg: 'Maso' }, image: null, visuals: [], children: [] },
          { id: 'oreilles', label: { fr: 'Oreilles', en: 'Ears', mg: 'Sofina' }, image: null, visuals: [], children: [] },
          { id: 'nez', label: { fr: 'Nez', en: 'Nose', mg: 'Orona' }, image: null, visuals: [], children: [] },
          { id: 'bouche', label: { fr: 'Bouche', en: 'Mouth', mg: 'Vava' }, image: null, visuals: [], children: [] },
          { id: 'cerveau', label: { fr: 'Cerveau', en: 'Brain', mg: 'Atidoha' }, image: null, visuals: [], children: [] }
        ]
      },
      {
        id: 'torse',
        label: { fr: 'Torse', en: 'Torso', mg: 'Vata' },
        image: null,
        visuals: [],
        children: [
          { id: 'coeur', label: { fr: 'Cœur', en: 'Heart', mg: 'Fo' }, image: null, visuals: [], children: [] },
          { id: 'poumons', label: { fr: 'Poumons', en: 'Lungs', mg: 'Havokavoka' }, image: null, visuals: [], children: [] },
          { id: 'estomac', label: { fr: 'Estomac', en: 'Stomach', mg: 'Vavony' }, image: null, visuals: [], children: [] }
        ]
      },
      {
        id: 'membres',
        label: { fr: 'Membres', en: 'Limbs', mg: 'Rantsam-batana' },
        image: null,
        visuals: [],
        children: [
          { id: 'bras', label: { fr: 'Bras', en: 'Arms', mg: 'Sandry' }, image: null, visuals: [], children: [] },
          { id: 'jambes', label: { fr: 'Jambes', en: 'Legs', mg: 'Tongotra' }, image: null, visuals: [], children: [] }
        ]
      }
    ]
  },
  items: [
    { id: 'eye', en: 'Eye', fr: 'Œil', mg: 'Maso', category: 'Organe', tab: 'vocab', categoryId: 'yeux', phonetic: '/aɪ/' },
    { id: 'conjunctivitis', en: 'Conjunctivitis', fr: 'Conjonctivite', mg: 'Mamaivay ny maso', category: 'Maladie', tab: 'maladies', categoryId: 'yeux' },
    { id: 'cataract', en: 'Cataract', fr: 'Cataracte', mg: 'Katarakta', category: 'Maladie', tab: 'maladies', categoryId: 'yeux' },
    { id: 'blurry', en: 'Blurry vision', fr: 'Vision floue', mg: 'Manjavo ny maso', category: 'Symptôme', tab: 'maladies', categoryId: 'yeux' },
    { id: 'ear', en: 'Ear', fr: 'Oreille', mg: 'Sofina', category: 'Organe', tab: 'vocab', categoryId: 'oreilles', phonetic: '/ɪər/' },
    { id: 'earache', en: 'Earache', fr: "Mal d'oreille", mg: 'Marary sofina', category: 'Symptôme', tab: 'maladies', categoryId: 'oreilles' },
    { id: 'otitis', en: 'Otitis', fr: 'Otite', mg: 'Mamaivay ny sofina', category: 'Maladie', tab: 'maladies', categoryId: 'oreilles' },
    { id: 'nose', en: 'Nose', fr: 'Nez', mg: 'Orona', category: 'Organe', tab: 'vocab', categoryId: 'nez', phonetic: '/noʊz/' },
    { id: 'runny', en: 'Runny nose', fr: 'Nez qui coule', mg: 'Mandeha ny orona', category: 'Symptôme', tab: 'maladies', categoryId: 'nez' },
    { id: 'mouth', en: 'Mouth', fr: 'Bouche', mg: 'Vava', category: 'Organe', tab: 'vocab', categoryId: 'bouche', phonetic: '/maʊθ/' },
    { id: 'toothache', en: 'Toothache', fr: 'Mal de dents', mg: 'Marary nify', category: 'Symptôme', tab: 'maladies', categoryId: 'bouche' },
    { id: 'brain', en: 'Brain', fr: 'Cerveau', mg: 'Atidoha', category: 'Organe', tab: 'vocab', categoryId: 'cerveau', phonetic: '/breɪn/' },
    { id: 'heart', en: 'Heart', fr: 'Cœur', mg: 'Fo', category: 'Organe', tab: 'vocab', categoryId: 'coeur', phonetic: '/hɑːrt/' },
    { id: 'palpitation', en: 'Palpitation', fr: 'Palpitation', mg: 'Mitempo mafy ny fo', category: 'Symptôme', tab: 'maladies', categoryId: 'coeur' },
    { id: 'lung', en: 'Lung', fr: 'Poumon', mg: 'Havokavoka', category: 'Organe', tab: 'vocab', categoryId: 'poumons', phonetic: '/lʌŋ/' },
    { id: 'cough', en: 'Cough', fr: 'Toux', mg: 'Kohaka', category: 'Symptôme', tab: 'maladies', categoryId: 'poumons' },
    { id: 'stomach', en: 'Stomach', fr: 'Estomac', mg: 'Vavony', category: 'Organe', tab: 'vocab', categoryId: 'estomac', phonetic: '/ˈstʌmək/' },
    { id: 'stomachache', en: 'Stomachache', fr: 'Mal de ventre', mg: 'Marary kibo', category: 'Symptôme', tab: 'maladies', categoryId: 'estomac' },
    { id: 'arm', en: 'Arm', fr: 'Bras', mg: 'Sandry', category: 'Organe', tab: 'vocab', categoryId: 'bras', phonetic: '/ɑːrm/' },
    { id: 'leg', en: 'Leg', fr: 'Jambe', mg: 'Tongotra', category: 'Organe', tab: 'vocab', categoryId: 'jambes', phonetic: '/lɛɡ/' },
    { id: 'headache', en: 'I have a headache', fr: "J'ai mal à la tête", mg: 'Marary loha aho', category: 'Expression', tab: 'expressions', categoryId: 'tete' },
    { id: 'cough_expr', en: 'I have a cough', fr: 'Je tousse', mg: 'Mikohaka aho', category: 'Expression', tab: 'expressions', categoryId: 'poumons' },
    { id: 'fever', en: 'I have a fever', fr: "J'ai de la fièvre", mg: 'Mafana aho', category: 'Expression', tab: 'expressions' },
    { id: 'breathing', en: 'I have difficulty breathing', fr: "J'ai du mal à respirer", mg: 'Sarotra miaina aho', category: 'Expression', tab: 'expressions', categoryId: 'poumons' },
    { id: 'broken', en: 'I broke my arm', fr: 'Je me suis cassé le bras', mg: 'Vaky ny sandriko', category: 'Expression', tab: 'expressions', categoryId: 'bras' }
  ]
};

export default mediVocabsSeed;