/**
 * Role → TTS voice (Deepgram Aura + browser pitch fallback).
 * Doctor / clinical staff = deeper male; patient / learner = brighter female.
 */
export const ROLE_VOICES = {
  doctor: {
    deepgram: 'aura-orion-en',
    browser: { pitch: 0.85, rate: 0.95, prefer: /male|daniel|google us english male|microsoft david/i }
  },
  nurse: {
    deepgram: 'aura-luna-en',
    browser: { pitch: 1.05, rate: 1, prefer: /female|samantha|google us english female|microsoft zira/i }
  },
  receptionist: {
    deepgram: 'aura-asteria-en',
    browser: { pitch: 1.1, rate: 1, prefer: /female|samantha|zira/i }
  },
  patient: {
    deepgram: 'aura-asteria-en',
    browser: { pitch: 1.15, rate: 1, prefer: /female|samantha|zira/i }
  },
  learner: {
    deepgram: 'aura-asteria-en',
    browser: { pitch: 1.15, rate: 1, prefer: /female|samantha|zira/i }
  },
  partner: {
    deepgram: 'aura-arcas-en',
    browser: { pitch: 0.9, rate: 1, prefer: /male|daniel|david/i }
  },
  speaker: {
    deepgram: 'aura-asteria-en',
    browser: { pitch: 1, rate: 1, prefer: null }
  }
};

/** Map free-form role labels to a voice bucket. */
export function resolveRoleVoice(role) {
  const r = String(role || 'speaker').toLowerCase().trim();
  if (ROLE_VOICES[r]) return ROLE_VOICES[r];
  if (/doctor|physician|clinician/.test(r)) return ROLE_VOICES.doctor;
  if (/nurse|paramedic/.test(r)) return ROLE_VOICES.nurse;
  if (/reception|admin/.test(r)) return ROLE_VOICES.receptionist;
  if (/patient|learner|student/.test(r)) return ROLE_VOICES.patient;
  if (/partner|friend/.test(r)) return ROLE_VOICES.partner;
  return ROLE_VOICES.speaker;
}

export function voiceModelForRole(role) {
  return resolveRoleVoice(role).deepgram;
}

export function browserVoiceOptsForRole(role) {
  return resolveRoleVoice(role).browser;
}
