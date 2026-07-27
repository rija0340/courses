import { normalizePack, findLessonInPack } from './coursePackSchema';

export function emptyI18n(fr = '', en = '', mg = '') {
  return { fr, en, mg };
}

export function slugifyId(text) {
  return (
    String(text || 'item')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || `item-${Date.now()}`
  );
}

/** Return slugified base, or base-2, base-3… while `isTaken` is true. */
export function uniqueId(base, isTaken) {
  const root = slugifyId(base);
  if (!isTaken(root)) return root;
  let n = 2;
  while (isTaken(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

function clonePack(pack) {
  return normalizePack(structuredClone(pack));
}

export function addLevel(pack, { id, cefr = 'A1', title } = {}) {
  const next = clonePack(pack);
  const levelId =
    id ||
    uniqueId(cefr || 'level', (candidate) => next.levels.some((l) => l.id === candidate));
  if (id && next.levels.some((l) => l.id === levelId)) {
    throw new Error(`Niveau déjà existant: ${levelId}`);
  }
  next.levels.push({
    id: levelId,
    cefr,
    title: title || emptyI18n(cefr, cefr, cefr),
    chapters: [],
  });
  return next;
}

export function addChapter(pack, levelId, { id, title, description } = {}) {
  const next = clonePack(pack);
  const level = next.levels.find((l) => l.id === levelId);
  if (!level) throw new Error('Niveau introuvable');
  const resolvedTitle = title || emptyI18n('Nouveau chapitre', 'New chapter', 'Toko vaovao');
  const chapterId =
    id ||
    uniqueId(resolvedTitle.fr || resolvedTitle.en || 'chapitre', (candidate) =>
      (level.chapters || []).some((c) => c.id === candidate)
    );
  if (id && (level.chapters || []).some((c) => c.id === chapterId)) {
    throw new Error(`Chapitre déjà existant: ${chapterId}`);
  }
  level.chapters = level.chapters || [];
  level.chapters.push({
    id: chapterId,
    title: resolvedTitle,
    description: description || emptyI18n(),
    lessons: [],
  });
  return next;
}

export function addLessonStub(pack, levelId, chapterId, { id, title, description } = {}) {
  const next = clonePack(pack);
  const level = next.levels.find((l) => l.id === levelId);
  const chapter = level?.chapters?.find((c) => c.id === chapterId);
  if (!chapter) throw new Error('Chapitre introuvable');
  const resolvedTitle = title || emptyI18n('Nouvelle leçon', 'New lesson', 'Lesona vaovao');
  const lessonId =
    id ||
    uniqueId(resolvedTitle.fr || resolvedTitle.en || 'nouvelle-lecon', (candidate) =>
      !!findLessonInPack(next, candidate)
    );
  if (id && findLessonInPack(next, lessonId)) {
    throw new Error(`Leçon déjà existante: ${lessonId}`);
  }
  chapter.lessons = chapter.lessons || [];
  chapter.lessons.push({
    id: lessonId,
    title: resolvedTitle,
    description: description || emptyI18n(),
    estimatedMinutes: 10,
    introduction: emptyI18n(),
    sections: [],
    exercises: [],
    styles: {},
  });
  return next;
}

export function updateLevelMeta(pack, levelId, patch) {
  const next = clonePack(pack);
  const level = next.levels.find((l) => l.id === levelId);
  if (!level) throw new Error('Niveau introuvable');
  Object.assign(level, patch);
  return next;
}

export function updateChapterMeta(pack, levelId, chapterId, patch) {
  const next = clonePack(pack);
  const level = next.levels.find((l) => l.id === levelId);
  const chapter = level?.chapters?.find((c) => c.id === chapterId);
  if (!chapter) throw new Error('Chapitre introuvable');
  Object.assign(chapter, patch);
  return next;
}

export function updateLessonMeta(pack, lessonId, patch) {
  const next = clonePack(pack);
  const found = findLessonInPack(next, lessonId);
  if (!found) throw new Error('Leçon introuvable');
  const { sections, exercises, ...safe } = patch;
  void sections;
  void exercises;
  if (safe.id && safe.id !== lessonId) {
    if (findLessonInPack(next, safe.id)) throw new Error(`Id leçon déjà pris: ${safe.id}`);
  }
  Object.assign(found.lesson, safe);
  return next;
}

export function deleteLevel(pack, levelId) {
  const next = clonePack(pack);
  next.levels = next.levels.filter((l) => l.id !== levelId);
  return next;
}

export function deleteChapter(pack, levelId, chapterId) {
  const next = clonePack(pack);
  const level = next.levels.find((l) => l.id === levelId);
  if (!level) throw new Error('Niveau introuvable');
  level.chapters = (level.chapters || []).filter((c) => c.id !== chapterId);
  return next;
}

export function deleteLesson(pack, lessonId) {
  const next = clonePack(pack);
  for (const level of next.levels) {
    for (const chapter of level.chapters || []) {
      const before = chapter.lessons?.length || 0;
      chapter.lessons = (chapter.lessons || []).filter((l) => l.id !== lessonId);
      if (chapter.lessons.length !== before) return next;
    }
  }
  throw new Error('Leçon introuvable');
}

function moveInArray(arr, index, direction) {
  const to = index + direction;
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [item] = copy.splice(index, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function moveLevel(pack, levelId, direction) {
  const next = clonePack(pack);
  const index = next.levels.findIndex((l) => l.id === levelId);
  if (index < 0) throw new Error('Niveau introuvable');
  next.levels = moveInArray(next.levels, index, direction);
  return next;
}

export function moveChapter(pack, levelId, chapterId, direction) {
  const next = clonePack(pack);
  const level = next.levels.find((l) => l.id === levelId);
  if (!level) throw new Error('Niveau introuvable');
  const index = (level.chapters || []).findIndex((c) => c.id === chapterId);
  if (index < 0) throw new Error('Chapitre introuvable');
  level.chapters = moveInArray(level.chapters, index, direction);
  return next;
}

export function moveLesson(pack, lessonId, direction) {
  const next = clonePack(pack);
  for (const level of next.levels) {
    for (const chapter of level.chapters || []) {
      const index = (chapter.lessons || []).findIndex((l) => l.id === lessonId);
      if (index >= 0) {
        chapter.lessons = moveInArray(chapter.lessons, index, direction);
        return next;
      }
    }
  }
  throw new Error('Leçon introuvable');
}

export function applyLessonContent(pack, lessonId, content) {
  const next = clonePack(pack);
  const found = findLessonInPack(next, lessonId);
  if (!found) throw new Error('Leçon introuvable');
  if (content.introduction != null) found.lesson.introduction = content.introduction;
  if (content.sections != null) found.lesson.sections = content.sections;
  if (content.styles != null) found.lesson.styles = content.styles;
  if (content.coverImage != null) found.lesson.coverImage = content.coverImage;
  if (content.estimatedMinutes != null) found.lesson.estimatedMinutes = content.estimatedMinutes;
  if (content.description != null) found.lesson.description = content.description;
  if (content.title != null) found.lesson.title = content.title;
  return next;
}

export function applyLessonExercises(pack, lessonId, exercises, { mode = 'replace' } = {}) {
  const next = clonePack(pack);
  const found = findLessonInPack(next, lessonId);
  if (!found) throw new Error('Leçon introuvable');
  if (mode === 'merge') {
    const byId = new Map((found.lesson.exercises || []).map((e) => [e.id, e]));
    (exercises || []).forEach((ex) => byId.set(ex.id, ex));
    found.lesson.exercises = Array.from(byId.values());
  } else {
    found.lesson.exercises = exercises || [];
  }
  return next;
}
