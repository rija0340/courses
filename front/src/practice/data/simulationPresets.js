/**
 * Legacy medical presets. Prefer scenarioProfiles for domain-aware packs.
 */
export { MEDICAL_PRESETS as SIMULATION_PRESETS } from './scenarioProfiles';
export { MEDICAL_PRESETS } from './scenarioProfiles';

import { MEDICAL_PRESETS } from './scenarioProfiles';

export function getPresetById(id) {
  return MEDICAL_PRESETS.find((p) => p.id === id) || null;
}
