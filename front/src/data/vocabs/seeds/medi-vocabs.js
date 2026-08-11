/**
 * MediVocabs seed — tabs: vocab | symptoms | conditions | scenarios
 * - symptoms / conditions: optional mini example { patient, doctor }
 * - scenarios: long dialogue[] filtered by categoryId (e.g. yeux)
 */
const mediVocabsSeed = {
  version: 3,
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
      { id: 'symptoms', label: { fr: 'Symptômes', en: 'Symptoms', mg: "Soritr'aretina" } },
      { id: 'conditions', label: { fr: 'Maladies', en: 'Conditions', mg: 'Arety' } },
      { id: 'scenarios', label: { fr: 'Scénarios', en: 'Scenarios', mg: 'Sehatra' } },
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
      },
      {
        id: 'specialty',
        label: { fr: 'Spécialité', en: 'Specialty', mg: 'Specialty' },
        image: null,
        visuals: [],
        children: [
          {
            id: 'ophthalmology',
            label: { fr: 'Ophtalmologie', en: 'Ophthalmology', mg: 'Ophtalmolojia' },
            image: null,
            visuals: [],
            children: []
          },
          {
            id: 'dentistry',
            label: { fr: 'Dentisterie', en: 'Dentistry', mg: 'Dentistry' },
            image: null,
            visuals: [],
            children: []
          }
        ]
      }
    ]
  },
  items: [
    // --- Vocab ---
    { id: 'eye', en: 'Eye', fr: 'Œil', mg: 'Maso', category: 'Organe', tab: 'vocab', categoryId: 'yeux', phonetic: '/aɪ/' },
    { id: 'ear', en: 'Ear', fr: 'Oreille', mg: 'Sofina', category: 'Organe', tab: 'vocab', categoryId: 'oreilles', phonetic: '/ɪər/' },
    { id: 'nose', en: 'Nose', fr: 'Nez', mg: 'Orona', category: 'Organe', tab: 'vocab', categoryId: 'nez', phonetic: '/noʊz/' },
    { id: 'mouth', en: 'Mouth', fr: 'Bouche', mg: 'Vava', category: 'Organe', tab: 'vocab', categoryId: 'bouche', phonetic: '/maʊθ/' },
    { id: 'brain', en: 'Brain', fr: 'Cerveau', mg: 'Atidoha', category: 'Organe', tab: 'vocab', categoryId: 'cerveau', phonetic: '/breɪn/' },
    { id: 'heart', en: 'Heart', fr: 'Cœur', mg: 'Fo', category: 'Organe', tab: 'vocab', categoryId: 'coeur', phonetic: '/hɑːrt/' },
    { id: 'lung', en: 'Lung', fr: 'Poumon', mg: 'Havokavoka', category: 'Organe', tab: 'vocab', categoryId: 'poumons', phonetic: '/lʌŋ/' },
    { id: 'stomach', en: 'Stomach', fr: 'Estomac', mg: 'Vavony', category: 'Organe', tab: 'vocab', categoryId: 'estomac', phonetic: '/ˈstʌmək/' },
    { id: 'arm', en: 'Arm', fr: 'Bras', mg: 'Sandry', category: 'Organe', tab: 'vocab', categoryId: 'bras', phonetic: '/ɑːrm/' },
    { id: 'leg', en: 'Leg', fr: 'Jambe', mg: 'Tongotra', category: 'Organe', tab: 'vocab', categoryId: 'jambes', phonetic: '/lɛɡ/' },

    // --- Symptoms (with short patient/doctor examples) ---
    {
      id: 'blurry',
      en: 'Blurry vision',
      fr: 'Vision floue',
      mg: 'Manjavo ny maso',
      category: 'Symptôme',
      tab: 'symptoms',
      categoryId: 'yeux',
      example: {
        patient: { en: 'I have blurry vision in my left eye.', fr: "J'ai une vision floue à l'œil gauche.", mg: '' },
        doctor: { en: 'How long have you noticed the blurry vision?', fr: 'Depuis combien de temps avez-vous cette vision floue ?', mg: '' },
      },
    },
    {
      id: 'earache',
      en: 'Earache',
      fr: "Mal d'oreille",
      mg: 'Marary sofina',
      category: 'Symptôme',
      tab: 'symptoms',
      categoryId: 'oreilles',
      example: {
        patient: { en: 'I have a bad earache since yesterday.', fr: "J'ai un fort mal d'oreille depuis hier.", mg: '' },
        doctor: { en: 'Is the earache sharp or more like pressure?', fr: 'Le mal est-il aigu ou plutôt une pression ?', mg: '' },
      },
    },
    {
      id: 'runny',
      en: 'Runny nose',
      fr: 'Nez qui coule',
      mg: 'Mandeha ny orona',
      category: 'Symptôme',
      tab: 'symptoms',
      categoryId: 'nez',
    },
    {
      id: 'toothache',
      en: 'Toothache',
      fr: 'Mal de dents',
      mg: 'Marary nify',
      category: 'Symptôme',
      tab: 'symptoms',
      categoryId: 'bouche',
    },
    {
      id: 'palpitation',
      en: 'Palpitation',
      fr: 'Palpitation',
      mg: 'Mitempo mafy ny fo',
      category: 'Symptôme',
      tab: 'symptoms',
      categoryId: 'coeur',
    },
    {
      id: 'cough',
      en: 'Cough',
      fr: 'Toux',
      mg: 'Kohaka',
      category: 'Symptôme',
      tab: 'symptoms',
      categoryId: 'poumons',
      example: {
        patient: { en: 'This cough keeps me awake at night.', fr: 'Cette toux m\'empêche de dormir la nuit.', mg: '' },
        doctor: { en: 'Is it a dry cough or with phlegm?', fr: 'Est-ce une toux sèche ou grasse ?', mg: '' },
      },
    },
    {
      id: 'stomachache',
      en: 'Stomachache',
      fr: 'Mal de ventre',
      mg: 'Marary kibo',
      category: 'Symptôme',
      tab: 'symptoms',
      categoryId: 'estomac',
    },

    // --- Conditions ---
    {
      id: 'conjunctivitis',
      en: 'Conjunctivitis',
      fr: 'Conjonctivite',
      mg: 'Mamaivay ny maso',
      category: 'Maladie',
      tab: 'conditions',
      categoryId: 'yeux',
      example: {
        patient: { en: 'My eye is red — is it conjunctivitis?', fr: "Mon œil est rouge — est-ce une conjonctivite ?", mg: '' },
        doctor: { en: 'It looks like conjunctivitis. Avoid rubbing your eyes.', fr: 'Cela ressemble à une conjonctivite. Évitez de frotter vos yeux.', mg: '' },
      },
    },
    {
      id: 'cataract',
      en: 'Cataract',
      fr: 'Cataracte',
      mg: 'Katarakta',
      category: 'Maladie',
      tab: 'conditions',
      categoryId: 'yeux',
      example: {
        patient: { en: 'Could this be a cataract?', fr: 'Est-ce que ce pourrait être une cataracte ?', mg: '' },
        doctor: { en: 'A cataract is possible. We will examine the lens.', fr: 'Une cataracte est possible. Nous allons examiner le cristallin.', mg: '' },
      },
    },
    {
      id: 'otitis',
      en: 'Otitis',
      fr: 'Otite',
      mg: 'Mamaivay ny sofina',
      category: 'Maladie',
      tab: 'conditions',
      categoryId: 'oreilles',
    },

    // --- Scenarios (replace former expressions) — linked to category ---
    {
      id: 'scenario-yeux-vision',
      en: 'Blurry vision checkup',
      fr: 'Consultation vision floue',
      mg: 'Fitsaboana fahitana manjavozavo',
      category: 'Scénario',
      tab: 'scenarios',
      categoryId: 'yeux',
      dialogue: [
        {
          role: 'patient',
          en: 'Good morning. My vision has been blurry for about two weeks.',
          fr: 'Bonjour. Ma vision est floue depuis environ deux semaines.',
          mg: '',
        },
        {
          role: 'doctor',
          en: 'Good morning. Does the blurry vision affect one eye or both?',
          fr: 'Bonjour. La vision floue touche un œil ou les deux ?',
          mg: '',
        },
        {
          role: 'patient',
          en: 'Mostly the left eye, especially in bright light.',
          fr: "Surtout l'œil gauche, surtout en pleine lumière.",
          mg: '',
        },
        {
          role: 'doctor',
          en: 'That can happen with a cataract. We need to examine the lens.',
          fr: 'Cela peut arriver avec une cataracte. Nous devons examiner le cristallin.',
          mg: '',
        },
        {
          role: 'patient',
          en: 'Will I need surgery?',
          fr: "Est-ce que j'aurai besoin d'une opération ?",
          mg: '',
        },
        {
          role: 'doctor',
          en: 'Not always. First we will check your eyes and follow up in a week.',
          fr: "Pas toujours. D'abord nous examinerons vos yeux et ferons un suivi dans une semaine.",
          mg: '',
        },
      ],
    },
    {
      id: 'scenario-poumons-cough',
      en: 'Persistent cough visit',
      fr: 'Consultation toux persistante',
      mg: '',
      category: 'Scénario',
      tab: 'scenarios',
      categoryId: 'poumons',
      dialogue: [
        {
          role: 'patient',
          en: 'I have had a cough for more than ten days.',
          fr: "J'ai une toux depuis plus de dix jours.",
          mg: '',
        },
        {
          role: 'doctor',
          en: 'Is it a dry cough or do you bring up phlegm?',
          fr: 'Est-ce une toux sèche ou ramenez-vous des mucosités ?',
          mg: '',
        },
        {
          role: 'patient',
          en: 'It is mostly dry, and worse at night.',
          fr: 'Surtout sèche, et pire la nuit.',
          mg: '',
        },
        {
          role: 'doctor',
          en: 'I will listen to your lungs. Tell me if you have difficulty breathing.',
          fr: 'Je vais ausculter vos poumons. Dites-moi si vous avez du mal à respirer.',
          mg: '',
        },
        {
          role: 'patient',
          en: 'Sometimes when I climb stairs.',
          fr: 'Parfois quand je monte les escaliers.',
          mg: '',
        },
        {
          role: 'doctor',
          en: 'We may need a chest exam. Take this medication and follow up if it worsens.',
          fr: "Nous pourrions avoir besoin d'un examen. Prenez ce traitement et revenez si ça empire.",
          mg: '',
        },
      ],
    },
  ]
};

export default mediVocabsSeed;
