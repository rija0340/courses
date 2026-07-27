export const I18N_LANGS = ['fr', 'en', 'mg'];

export const SECTION_TYPES = [
  'core-concept',
  'rules',
  'image',
  'gallery',
  'dialogue',
  'tip',
  'example',
];

export const EXERCISE_TYPES = [
  'multiple-choice',
  'true-false',
  'fill-blank',
  'match',
  'reorder',
];

export function isI18nObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export function localize(value, lang, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (isI18nObject(value)) {
    return value[lang] || value.fr || value.en || value.mg || fallback;
  }
  return fallback;
}

function pushError(errors, path, message) {
  errors.push(`${path}: ${message}`);
}

function validateI18n(errors, path, value, { required = true } = {}) {
  if (value == null || value === '') {
    if (required) pushError(errors, path, 'texte i18n requis');
    return;
  }
  if (typeof value === 'string') return;
  if (!isI18nObject(value)) {
    pushError(errors, path, 'doit être une string ou {fr,en,mg}');
    return;
  }
  if (required && !I18N_LANGS.some((l) => typeof value[l] === 'string' && value[l].trim())) {
    pushError(errors, path, 'au moins une langue (fr/en/mg) requise');
  }
}

function validateExercise(errors, path, exercise) {
  if (!exercise || typeof exercise !== 'object') {
    pushError(errors, path, 'objet exercice invalide');
    return;
  }
  if (!exercise.id || typeof exercise.id !== 'string') {
    pushError(errors, `${path}.id`, 'id requis');
  }
  if (!EXERCISE_TYPES.includes(exercise.type)) {
    pushError(errors, `${path}.type`, `type inconnu (${exercise.type})`);
  }
  if (exercise.points != null && (typeof exercise.points !== 'number' || exercise.points < 0)) {
    pushError(errors, `${path}.points`, 'points doit être un nombre >= 0');
  }
  validateI18n(errors, `${path}.prompt`, exercise.prompt);

  switch (exercise.type) {
    case 'multiple-choice': {
      if (!Array.isArray(exercise.choices) || exercise.choices.length < 2) {
        pushError(errors, `${path}.choices`, 'au moins 2 choix requis');
      } else {
        exercise.choices.forEach((c, i) => {
          if (!c?.id) pushError(errors, `${path}.choices[${i}].id`, 'id requis');
          validateI18n(errors, `${path}.choices[${i}].text`, c?.text);
        });
      }
      if (!exercise.correctChoiceId) {
        pushError(errors, `${path}.correctChoiceId`, 'requis');
      }
      break;
    }
    case 'true-false': {
      if (typeof exercise.correct !== 'boolean') {
        pushError(errors, `${path}.correct`, 'boolean requis');
      }
      break;
    }
    case 'fill-blank': {
      validateI18n(errors, `${path}.sentence`, exercise.sentence);
      if (!Array.isArray(exercise.acceptedAnswers) || !exercise.acceptedAnswers.length) {
        pushError(errors, `${path}.acceptedAnswers`, 'au moins une réponse acceptée');
      }
      break;
    }
    case 'match': {
      if (!Array.isArray(exercise.pairs) || exercise.pairs.length < 2) {
        pushError(errors, `${path}.pairs`, 'au moins 2 paires requises');
      } else {
        exercise.pairs.forEach((p, i) => {
          if (!p?.id) pushError(errors, `${path}.pairs[${i}].id`, 'id requis');
          validateI18n(errors, `${path}.pairs[${i}].left`, p?.left);
          validateI18n(errors, `${path}.pairs[${i}].right`, p?.right);
        });
      }
      break;
    }
    case 'reorder': {
      if (!Array.isArray(exercise.items) || exercise.items.length < 2) {
        pushError(errors, `${path}.items`, 'au moins 2 items requis');
      } else {
        exercise.items.forEach((it, i) => {
          if (!it?.id) pushError(errors, `${path}.items[${i}].id`, 'id requis');
          validateI18n(errors, `${path}.items[${i}].text`, it?.text);
        });
      }
      if (!Array.isArray(exercise.correctOrder) || !exercise.correctOrder.length) {
        pushError(errors, `${path}.correctOrder`, 'ordre correct requis');
      }
      break;
    }
    default:
      break;
  }
}

function validateSection(errors, path, section) {
  if (!section || typeof section !== 'object') {
    pushError(errors, path, 'section invalide');
    return;
  }
  if (!SECTION_TYPES.includes(section.type)) {
    pushError(errors, `${path}.type`, `type inconnu (${section.type})`);
  }
  if (section.title != null) validateI18n(errors, `${path}.title`, section.title, { required: false });

  if (section.type === 'image') {
    if (!section.src || typeof section.src !== 'string') {
      pushError(errors, `${path}.src`, 'url image requise');
    }
  }
  if (section.type === 'gallery') {
    if (!Array.isArray(section.images) || !section.images.length) {
      pushError(errors, `${path}.images`, 'au moins une image');
    }
  }
  if (section.type === 'dialogue') {
    if (!Array.isArray(section.lines) || !section.lines.length) {
      pushError(errors, `${path}.lines`, 'au moins une réplique');
    }
  }
}

/**
 * Validate a full course pack payload.
 * @returns {{ ok: boolean, errors: string[], warnings: string[], pack?: object }}
 */
export function validateCoursePack(raw, { expectedCourseId = null } = {}) {
  const errors = [];
  const warnings = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['Le JSON doit être un objet course pack'], warnings };
  }

  if (!raw.courseId || typeof raw.courseId !== 'string') {
    pushError(errors, 'courseId', 'requis (string)');
  } else if (expectedCourseId && raw.courseId !== expectedCourseId) {
    pushError(errors, 'courseId', `attendu "${expectedCourseId}", reçu "${raw.courseId}"`);
  }

  if (raw.version != null && typeof raw.version !== 'number') {
    pushError(errors, 'version', 'doit être un nombre');
  }

  if (!Array.isArray(raw.levels) || !raw.levels.length) {
    pushError(errors, 'levels', 'au moins un niveau requis');
  } else {
    const levelIds = new Set();
    const lessonIds = new Set();

    raw.levels.forEach((level, li) => {
      const lp = `levels[${li}]`;
      if (!level?.id) pushError(errors, `${lp}.id`, 'requis');
      else if (levelIds.has(level.id)) pushError(errors, `${lp}.id`, `doublon "${level.id}"`);
      else levelIds.add(level.id);

      if (!level.cefr && !level.title) {
        pushError(errors, `${lp}`, 'cefr ou title requis');
      }
      if (level.title) validateI18n(errors, `${lp}.title`, level.title, { required: false });

      if (!Array.isArray(level.chapters)) {
        pushError(errors, `${lp}.chapters`, 'tableau requis');
        return;
      }

      const chapterIds = new Set();
      level.chapters.forEach((chapter, ci) => {
        const cp = `${lp}.chapters[${ci}]`;
        if (!chapter?.id) pushError(errors, `${cp}.id`, 'requis');
        else if (chapterIds.has(chapter.id)) pushError(errors, `${cp}.id`, `doublon "${chapter.id}"`);
        else chapterIds.add(chapter.id);

        validateI18n(errors, `${cp}.title`, chapter?.title);

        if (!Array.isArray(chapter.lessons)) {
          pushError(errors, `${cp}.lessons`, 'tableau requis');
          return;
        }

        chapter.lessons.forEach((lesson, lei) => {
          const lep = `${cp}.lessons[${lei}]`;
          if (!lesson?.id) pushError(errors, `${lep}.id`, 'requis');
          else if (lessonIds.has(lesson.id)) pushError(errors, `${lep}.id`, `doublon leçon "${lesson.id}"`);
          else lessonIds.add(lesson.id);

          validateI18n(errors, `${lep}.title`, lesson?.title);
          if (lesson.introduction) validateI18n(errors, `${lep}.introduction`, lesson.introduction, { required: false });
          if (lesson.description) validateI18n(errors, `${lep}.description`, lesson.description, { required: false });

          if (Array.isArray(lesson.sections)) {
            lesson.sections.forEach((s, si) => validateSection(errors, `${lep}.sections[${si}]`, s));
          } else if (lesson.sections != null) {
            pushError(errors, `${lep}.sections`, 'doit être un tableau');
          }

          if (Array.isArray(lesson.exercises)) {
            lesson.exercises.forEach((ex, ei) => validateExercise(errors, `${lep}.exercises[${ei}]`, ex));
          } else if (lesson.exercises != null) {
            pushError(errors, `${lep}.exercises`, 'doit être un tableau');
          } else {
            warnings.push(`${lep}: aucun exercice`);
          }
        });
      });
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    pack: errors.length === 0 ? normalizePack(raw) : undefined,
  };
}

export function normalizePack(raw) {
  return {
    courseId: raw.courseId,
    version: raw.version ?? 1,
    levels: (raw.levels || []).map((level) => ({
      ...level,
      chapters: (level.chapters || []).map((chapter) => ({
        ...chapter,
        lessons: (chapter.lessons || []).map((lesson) => ({
          ...lesson,
          sections: lesson.sections || [],
          exercises: lesson.exercises || [],
          styles: lesson.styles || {},
        })),
      })),
    })),
  };
}

/** Deep-merge imported pack into current: upsert levels/chapters/lessons by id. */
export function mergeCoursePacks(current, incoming) {
  const base = normalizePack(current || { courseId: incoming.courseId, version: 1, levels: [] });
  const next = normalizePack(incoming);

  const levelsById = new Map(base.levels.map((l) => [l.id, structuredClone(l)]));

  next.levels.forEach((inLevel) => {
    const existing = levelsById.get(inLevel.id);
    if (!existing) {
      levelsById.set(inLevel.id, structuredClone(inLevel));
      return;
    }
    const mergedLevel = {
      ...existing,
      ...inLevel,
      chapters: [...(existing.chapters || [])],
    };
    const chaptersById = new Map(mergedLevel.chapters.map((c) => [c.id, c]));

    (inLevel.chapters || []).forEach((inChapter) => {
      const exChapter = chaptersById.get(inChapter.id);
      if (!exChapter) {
        chaptersById.set(inChapter.id, structuredClone(inChapter));
        return;
      }
      const mergedChapter = {
        ...exChapter,
        ...inChapter,
        lessons: [...(exChapter.lessons || [])],
      };
      const lessonsById = new Map(mergedChapter.lessons.map((l) => [l.id, l]));
      (inChapter.lessons || []).forEach((inLesson) => {
        const exLesson = lessonsById.get(inLesson.id);
        lessonsById.set(
          inLesson.id,
          exLesson ? { ...exLesson, ...inLesson } : structuredClone(inLesson)
        );
      });
      mergedChapter.lessons = Array.from(lessonsById.values());
      chaptersById.set(inChapter.id, mergedChapter);
    });

    mergedLevel.chapters = Array.from(chaptersById.values());
    levelsById.set(inLevel.id, mergedLevel);
  });

  return {
    courseId: next.courseId || base.courseId,
    version: next.version ?? base.version,
    levels: Array.from(levelsById.values()),
  };
}

export function findLessonInPack(pack, lessonId) {
  if (!pack?.levels) return null;
  for (const level of pack.levels) {
    for (const chapter of level.chapters || []) {
      const lesson = (chapter.lessons || []).find((l) => l.id === lessonId);
      if (lesson) {
        return {
          lesson,
          chapter,
          level,
          cefr: level.cefr || lesson.level || '',
        };
      }
    }
  }
  return null;
}

export function flattenLessons(pack) {
  const rows = [];
  if (!pack?.levels) return rows;
  pack.levels.forEach((level) => {
    (level.chapters || []).forEach((chapter) => {
      (chapter.lessons || []).forEach((lesson) => {
        rows.push({
          ...lesson,
          levelId: level.id,
          cefr: level.cefr || lesson.level || '',
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          levelTitle: level.title,
        });
      });
    });
  });
  return rows;
}

export function buildCoursePackTemplate(courseId = 'english') {
  return {
    courseId,
    version: 1,
    levels: [
      {
        id: 'a1',
        cefr: 'A1',
        title: { fr: 'Débutant', en: 'Beginner', mg: 'Vao manomboka' },
        coverImage: 'https://images.unsplash.com/photo-1456513080880-7d93d20f0d60?w=1200&q=80',
        chapters: [
          {
            id: 'basics',
            title: { fr: 'Les bases', en: 'Basics', mg: 'Ny fototra' },
            description: {
              fr: 'Premiers pas en anglais.',
              en: 'First steps in English.',
              mg: 'Dingana voalohany amin\'ny teny anglisy.',
            },
            lessons: [
              {
                id: 'sample-lesson',
                title: { fr: 'Leçon exemple', en: 'Sample lesson', mg: 'Lespansiona ohatra' },
                description: {
                  fr: 'Exemple de structure.',
                  en: 'Structure example.',
                  mg: 'Ohatra firafitra.',
                },
                coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
                estimatedMinutes: 8,
                introduction: {
                  fr: 'Introduction de la leçon.',
                  en: 'Lesson introduction.',
                  mg: 'Fampidirana ny lesona.',
                },
                sections: [
                  {
                    type: 'image',
                    src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
                    caption: { fr: 'Apprendre en contexte', en: 'Learn in context', mg: 'Mianara amin\'ny toe-javatra' },
                  },
                  {
                    type: 'tip',
                    title: { fr: 'Astuce', en: 'Tip', mg: 'Torohevitra' },
                    text: {
                      fr: 'Répétez à voix haute.',
                      en: 'Repeat out loud.',
                      mg: 'Avereno amin\'ny feo mafy.',
                    },
                  },
                ],
                exercises: [
                  {
                    id: 'ex-1',
                    type: 'multiple-choice',
                    points: 1,
                    prompt: { fr: 'Que signifie "Hello" ?', en: 'What does "Hello" mean?', mg: 'Inona no dikan\'ny "Hello"?' },
                    choices: [
                      { id: 'a', text: { fr: 'Bonjour', en: 'Hello', mg: 'Salama' } },
                      { id: 'b', text: { fr: 'Au revoir', en: 'Goodbye', mg: 'Veloma' } },
                    ],
                    correctChoiceId: 'a',
                    explanation: {
                      fr: '"Hello" veut dire bonjour.',
                      en: '"Hello" means a greeting.',
                      mg: '"Hello" dia midika hoe salama.',
                    },
                  },
                ],
                styles: {},
              },
            ],
          },
        ],
      },
    ],
  };
}

export function summarizePack(pack) {
  const levels = pack?.levels?.length || 0;
  let chapters = 0;
  let lessons = 0;
  let exercises = 0;
  (pack?.levels || []).forEach((l) => {
    chapters += l.chapters?.length || 0;
    (l.chapters || []).forEach((c) => {
      lessons += c.lessons?.length || 0;
      (c.lessons || []).forEach((lesson) => {
        exercises += lesson.exercises?.length || 0;
      });
    });
  });
  return { levels, chapters, lessons, exercises };
}
