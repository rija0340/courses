/**
 * Legacy medical presets. Prefer scenarioProfiles for domain-aware packs.
 */
import { MEDICAL_PRESETS } from './scenarioProfiles';

export { MEDICAL_PRESETS, MEDICAL_PRESETS as SIMULATION_PRESETS };

export function getPresetById(id) {
  return MEDICAL_PRESETS.find((p) => p.id === id) || null;
}
