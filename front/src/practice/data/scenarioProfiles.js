import { pickLangText } from '../../data/vocabs/vocabItemStructure';

/**
 * Domain-aware scenario profiles for practice simulation.
 * Medical = medi-vocabs; everything else = general two-role dialogue.
 */

export const MEDICAL_PRESETS = [
  {
    id: 'clinic-checkin',
    theme: 'Clinic check-in',
    title: { fr: 'Arrivée à la clinique', en: 'Clinic check-in', mg: 'Fidirana clinique' },
    description: {
      fr: 'Dialogue réceptionniste / patient à l’accueil.',
      en: 'Receptionist and patient at the front desk.',
      mg: 'Reseptionista sy marary ao amin’ny fidirana.',
    },
    level: 'beginner',
    turns: 6,
    sampleTurns: [
      { role: 'receptionist', text: 'Good morning. How can I help you?' },
      { role: 'learner', text: 'I have an appointment with Doctor Smith.' },
      { role: 'receptionist', text: 'What time is your appointment?' },
      { role: 'learner', text: 'It is at ten o’clock.' },
      { role: 'receptionist', text: 'Please fill out this form and take a seat.' },
      { role: 'learner', text: 'Thank you.' },
    ],
  },
  {
    id: 'pain-symptoms',
    theme: 'Describing pain',
    title: { fr: 'Décrire la douleur', en: 'Describing pain', mg: 'Mamaritra ny fanaintainana' },
    description: {
      fr: 'Patient explique où et comment ça fait mal.',
      en: 'Patient explains where and how it hurts.',
      mg: 'Ny marary manazava ny fanaintainana.',
    },
    level: 'beginner',
    turns: 6,
    sampleTurns: [
      { role: 'nurse', text: 'Where does it hurt?' },
      { role: 'learner', text: 'I have a headache.' },
      { role: 'nurse', text: 'When did it start?' },
      { role: 'learner', text: 'It started this morning.' },
      { role: 'nurse', text: 'Is the pain sharp or dull?' },
      { role: 'learner', text: 'It is a dull pain.' },
    ],
  },
  {
    id: 'pharmacy',
    theme: 'At the pharmacy',
    title: { fr: 'À la pharmacie', en: 'At the pharmacy', mg: 'Ao amin’ny pharmacy' },
    description: {
      fr: 'Demander un médicament et des instructions.',
      en: 'Ask for medication and instructions.',
      mg: 'Hangataka fanafody sy torolalana.',
    },
    level: 'intermediate',
    turns: 6,
    sampleTurns: [
      { role: 'pharmacist', text: 'Hello. Do you have a prescription?' },
      { role: 'learner', text: 'Yes, here it is.' },
      { role: 'pharmacist', text: 'Take one tablet twice a day after meals.' },
      { role: 'learner', text: 'Should I avoid alcohol?' },
      { role: 'pharmacist', text: 'Yes, please avoid alcohol with this medicine.' },
      { role: 'learner', text: 'Thank you for your help.' },
    ],
  },
];

export const GENERAL_PRESETS = [
  {
    id: 'small-talk',
    theme: 'Everyday small talk',
    title: { fr: 'Small talk du quotidien', en: 'Everyday small talk', mg: 'Resaka andavanandro' },
    description: {
      fr: 'Conversation simple entre deux personnes.',
      en: 'Simple conversation between two people.',
      mg: 'Resaka tsotra eo amin’ny olona roa.',
    },
    level: 'beginner',
    turns: 6,
    sampleTurns: [
      { role: 'b', text: 'Hi! How are you today?' },
      { role: 'a', text: 'I am good, thanks. And you?' },
      { role: 'b', text: 'Pretty well. What have you been up to?' },
      { role: 'a', text: 'I have been studying English.' },
      { role: 'b', text: 'That sounds great. What are you learning?' },
      { role: 'a', text: 'New words and short conversations.' },
    ],
  },
  {
    id: 'explain-topic',
    theme: 'Explain a topic',
    title: { fr: 'Expliquer un sujet', en: 'Explain a topic', mg: 'Manazava lohahevitra' },
    description: {
      fr: 'Un partenaire pose des questions ; vous expliquez avec le vocabulaire.',
      en: 'A partner asks questions; you explain using the vocabulary.',
      mg: 'Namana manontany; hazavao amin’ny voambolana.',
    },
    level: 'beginner',
    turns: 6,
    sampleTurns: [
      { role: 'b', text: 'Can you tell me about this topic?' },
      { role: 'a', text: 'Sure. I will explain the main idea.' },
      { role: 'b', text: 'What is the most important word here?' },
      { role: 'a', text: 'I think this key word matters most.' },
      { role: 'b', text: 'Can you give a short example?' },
      { role: 'a', text: 'Yes. Here is a simple example.' },
    ],
  },
  {
    id: 'friendly-debate',
    theme: 'Friendly discussion',
    title: { fr: 'Discussion amicale', en: 'Friendly discussion', mg: 'Dinika am-pirahalahiana' },
    description: {
      fr: 'Échanger des opinions poliment en anglais.',
      en: 'Share opinions politely in English.',
      mg: 'Mizara hevitra am-pitandremana amin’ny teny anglisy.',
    },
    level: 'intermediate',
    turns: 6,
    sampleTurns: [
      { role: 'b', text: 'What do you think about this idea?' },
      { role: 'a', text: 'I think it is useful, but I am not sure.' },
      { role: 'b', text: 'Interesting. Why do you feel that way?' },
      { role: 'a', text: 'Because it helps me practice new words.' },
      { role: 'b', text: 'That makes sense. Would you recommend it?' },
      { role: 'a', text: 'Yes, I would recommend it to beginners.' },
    ],
  },
];

/** @typedef {{ id: string, label: { fr: string, en: string, mg: string } }} ScenarioRole */

/**
 * @typedef {Object} ScenarioProfile
 * @property {'medical'|'general'} kind
 * @property {ScenarioRole[]} roles
 * @property {string} defaultLearnerRole
 * @property {object[]} presets
 * @property {string} padPartnerRole
 * @property {string} padLearnerRole
 */

export const MEDICAL_PROFILE = {
  kind: 'medical',
  roles: [
    { id: 'patient', label: { fr: 'Patient', en: 'Patient', mg: 'Marary' } },
    { id: 'doctor', label: { fr: 'Médecin', en: 'Doctor', mg: 'Dokotera' } },
  ],
  defaultLearnerRole: 'patient',
  presets: MEDICAL_PRESETS,
  padPartnerRole: 'doctor',
  padLearnerRole: 'patient',
};

export const GENERAL_PROFILE = {
  kind: 'general',
  roles: [
    { id: 'a', label: { fr: 'Interlocuteur A', en: 'Speaker A', mg: 'Mpiteny A' } },
    { id: 'b', label: { fr: 'Interlocuteur B', en: 'Speaker B', mg: 'Mpiteny B' } },
  ],
  defaultLearnerRole: 'a',
  presets: GENERAL_PRESETS,
  padPartnerRole: 'b',
  padLearnerRole: 'a',
};

const MEDICAL_DOMAIN_IDS = new Set(['medi-vocabs']);
const MEDICAL_PRESET_IDS = new Set(MEDICAL_PRESETS.map((p) => p.id));

export function isMedicalDomain(domainId) {
  return MEDICAL_DOMAIN_IDS.has(String(domainId || ''));
}

export function isMedicalPresetId(id) {
  return MEDICAL_PRESET_IDS.has(String(id || ''));
}

/**
 * Default = generic A/B vocabulary dialogue.
 * Medical doctor/patient only when a clinical preset is selected on medi-vocabs.
 */
export function getScenarioProfile(domainId, promptId = null) {
  if (isMedicalDomain(domainId) && isMedicalPresetId(promptId)) {
    return MEDICAL_PROFILE;
  }
  return GENERAL_PROFILE;
}

export function roleLabel(profile, roleId, lang = 'fr') {
  const role = (profile?.roles || []).find((r) => r.id === roleId);
  if (!role) return roleId || '';
  return pickLangText(role.label, lang) || role.id;
}

export function partnerRoleFor(profile, learnerRole) {
  const roles = profile?.roles || [];
  const other = roles.find((r) => r.id !== learnerRole);
  return other?.id || profile?.padPartnerRole || 'b';
}

export function listPresets(domainId) {
  if (isMedicalDomain(domainId)) {
    return [...GENERAL_PRESETS, ...MEDICAL_PRESETS];
  }
  return GENERAL_PRESETS;
}

export function getPresetById(domainId, id) {
  return listPresets(domainId).find((p) => p.id === id) || null;
}
