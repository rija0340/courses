import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from './storageConfig';
import localCourseProvider from './providers/localCourseProvider';
import supabaseCourseProvider from './providers/supabaseCourseProvider';
import { getCoursePackSeed } from '../data/courseSeeds';
import { normalizePack, mergeCoursePacks, validateCoursePack } from '../data/coursePackSchema';

const provider =
  ACTIVE_PROVIDER === STORAGE_PROVIDERS.SUPABASE
    ? supabaseCourseProvider
    : localCourseProvider;

const courseStorage = {
  async getPack(courseId) {
    const fromProvider = await provider.getPack(courseId);
    if (fromProvider) return fromProvider;

    const ensured = await provider.ensureSeeded?.(courseId);
    if (ensured) return ensured;

    const seed = getCoursePackSeed(courseId);
    return seed ? normalizePack(seed) : null;
  },

  async savePack(courseId, pack) {
    const result = validateCoursePack(pack, { expectedCourseId: courseId });
    if (!result.ok) {
      const err = new Error(result.errors[0] || 'Pack JSON invalide');
      err.validation = result;
      throw err;
    }
    return provider.savePack(courseId, result.pack);
  },

  async importPack(courseId, raw, { mode = 'replace' } = {}) {
    const result = validateCoursePack(raw, { expectedCourseId: courseId });
    if (!result.ok) {
      return { ok: false, ...result };
    }

    let toSave = result.pack;
    if (mode === 'merge') {
      const current = (await provider.getPack(courseId)) || getCoursePackSeed(courseId);
      toSave = mergeCoursePacks(current, result.pack);
    }

    const saved = await provider.savePack(courseId, toSave);
    return { ok: true, pack: saved, warnings: result.warnings, errors: [] };
  },

  async listPacks() {
    return provider.listPacks();
  },

  async deletePack(courseId) {
    return provider.deletePack(courseId);
  },

  async resetToSeed(courseId) {
    const seed = getCoursePackSeed(courseId);
    if (!seed) throw new Error(`Pas de seed pour ${courseId}`);
    return provider.savePack(courseId, seed);
  },
};

export default courseStorage;
export { provider as activeCourseProvider };
