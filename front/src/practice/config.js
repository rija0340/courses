/**
 * Feature flags & provider selection.
 * Secrets never live here — only public REACT_APP_* flags.
 */
const truthy = (v) => v === 'true' || v === '1' || v === true;

export const PRACTICE_ENABLED = truthy(
  process.env.REACT_APP_PRACTICE_ENABLED ?? 'true'
);

/** mock | remote — remote hits Vercel /api gateway */
export const SPEECH_PROVIDER =
  process.env.REACT_APP_SPEECH_PROVIDER || 'mock';

/** mock | remote */
export const LLM_PROVIDER =
  process.env.REACT_APP_LLM_PROVIDER || 'mock';

/**
 * Empty = same-origin /api (production on Vercel).
 * Local CRA: leave mock, or set to http://localhost:3000 while running `vercel dev`.
 */
export const AI_GATEWAY_URL = (process.env.REACT_APP_AI_GATEWAY_URL || '').replace(/\/$/, '');

export function isPracticeEnabled() {
  return PRACTICE_ENABLED;
}

export function usesRemoteSpeech() {
  return PRACTICE_ENABLED && SPEECH_PROVIDER === 'remote';
}

export function usesRemoteLlm() {
  return PRACTICE_ENABLED && LLM_PROVIDER === 'remote';
}
