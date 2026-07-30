import { getCoursePackSeed } from '../../data/courseSeeds';
import { normalizePack } from '../../data/coursePackSchema';

const PACK_KEY = (courseId) => `course_pack_${courseId}`;
const SEEDED_KEY = (courseId) => `course_pack_seeded_${courseId}`;

const localCourseProvider = {
  async getPack(courseId) {
    const raw = localStorage.getItem(PACK_KEY(courseId));
    if (!raw) return null;
    try {
      return normalizePack(JSON.parse(raw));
    } catch {
      return null;
    }
  },

  async savePack(courseId, pack) {
    const normalized = normalizePack({ ...pack, courseId });
    localStorage.setItem(PACK_KEY(courseId), JSON.stringify(normalized));
    return normalized;
  },

  async ensureSeeded(courseId) {
    const existing = await this.getPack(courseId);
    if (existing) return existing;

    const seed = getCoursePackSeed(courseId);
    if (!seed) return null;

    if (!localStorage.getItem(SEEDED_KEY(courseId))) {
      await this.savePack(courseId, seed);
      localStorage.setItem(SEEDED_KEY(courseId), 'true');
    }
    return this.getPack(courseId);
  },

  async listPacks() {
    const ids = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith('course_pack_') && !key.includes('seeded')) {
        ids.push(key.replace('course_pack_', ''));
      }
    }
    return ids;
  },

  async deletePack(courseId) {
    localStorage.removeItem(PACK_KEY(courseId));
    localStorage.removeItem(SEEDED_KEY(courseId));
  },
};

export default localCourseProvider;
