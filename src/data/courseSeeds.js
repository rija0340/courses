import englishPack from './english/pack.json';

const COURSE_SEEDS = {
  english: englishPack,
};

export function getCoursePackSeed(courseId) {
  return COURSE_SEEDS[courseId] ? structuredClone(COURSE_SEEDS[courseId]) : null;
}

export function listSeededCourseIds() {
  return Object.keys(COURSE_SEEDS);
}

export default COURSE_SEEDS;
