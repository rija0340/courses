export const SIMULATION_PRESETS = [
  {
    id: 'clinic-checkin',
    theme: 'Clinic check-in',
    title: { fr: 'Arrivée à la clinique', en: 'Clinic check-in', mg: 'Fidirana clinique' },
    description: {
      fr: 'Dialogue réceptionniste / patient à l’accueil.',
      en: 'Receptionist and patient at the front desk.',
      mg: 'Reseptionista sy marary ao amin’ny fidirana.'
    },
    level: 'beginner',
    turns: 6,
    sampleTurns: [
      { role: 'receptionist', text: 'Good morning. How can I help you?' },
      { role: 'learner', text: 'I have an appointment with Doctor Smith.' },
      { role: 'receptionist', text: 'What time is your appointment?' },
      { role: 'learner', text: 'It is at ten o’clock.' },
      { role: 'receptionist', text: 'Please fill out this form and take a seat.' },
      { role: 'learner', text: 'Thank you.' }
    ]
  },
  {
    id: 'pain-symptoms',
    theme: 'Describing pain',
    title: { fr: 'Décrire la douleur', en: 'Describing pain', mg: 'Mamaritra ny fanaintainana' },
    description: {
      fr: 'Patient explique où et comment ça fait mal.',
      en: 'Patient explains where and how it hurts.',
      mg: 'Ny marary manazava ny fanaintainana.'
    },
    level: 'beginner',
    turns: 6,
    sampleTurns: [
      { role: 'nurse', text: 'Where does it hurt?' },
      { role: 'learner', text: 'I have a headache.' },
      { role: 'nurse', text: 'When did it start?' },
      { role: 'learner', text: 'It started this morning.' },
      { role: 'nurse', text: 'Is the pain sharp or dull?' },
      { role: 'learner', text: 'It is a dull pain.' }
    ]
  },
  {
    id: 'pharmacy',
    theme: 'At the pharmacy',
    title: { fr: 'À la pharmacie', en: 'At the pharmacy', mg: 'Ao amin’ny pharmacy' },
    description: {
      fr: 'Demander un médicament et des instructions.',
      en: 'Ask for medication and instructions.',
      mg: 'Hangataka fanafody sy torolalana.'
    },
    level: 'intermediate',
    turns: 6,
    sampleTurns: [
      { role: 'pharmacist', text: 'Hello. Do you have a prescription?' },
      { role: 'learner', text: 'Yes, here it is.' },
      { role: 'pharmacist', text: 'Take one tablet twice a day after meals.' },
      { role: 'learner', text: 'Should I avoid alcohol?' },
      { role: 'pharmacist', text: 'Yes, please avoid alcohol with this medicine.' },
      { role: 'learner', text: 'Thank you for your help.' }
    ]
  }
];

export function getPresetById(id) {
  return SIMULATION_PRESETS.find((p) => p.id === id) || null;
}
