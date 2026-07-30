import englishPack from './english/pack.json';
import b1Level from './english/b1-level.json';
import { normalizePack } from './coursePackSchema';

function buildEnglishSeed() {
  const pack = structuredClone(englishPack);
  const hasB1 = (pack.levels || []).some((l) => l.id === 'b1');
  if (!hasB1) {
    pack.levels = [...(pack.levels || []), structuredClone(b1Level)];
  }
  return normalizePack(pack);
}

const COURSE_SEEDS = {
  english: buildEnglishSeed(),
};

export function getCoursePackSeed(courseId) {
  return COURSE_SEEDS[courseId] ? structuredClone(COURSE_SEEDS[courseId]) : null;
}

export function listSeededCourseIds() {
  return Object.keys(COURSE_SEEDS);
}

export default COURSE_SEEDS;
