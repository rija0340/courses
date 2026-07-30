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
  'multi-select',
  'true-false',
  'fill-blank',
  'short-answer',
  'match',
  'reorder',
  'categorize',
  'error-correction',
  'cloze',
  'transform',
];

export const EXERCISE_TYPE_LABELS = {
  'multiple-choice': 'QCM (1 réponse)',
  'multi-select': 'QCM multi',
  'true-false': 'Vrai / Faux',
  'fill-blank': 'Texte à trous',
  'short-answer': 'Réponse courte',
  match: 'Association',
  reorder: 'Remise en ordre',
  categorize: 'Catégoriser',
  'error-correction': 'Correction d’erreur',
  cloze: 'Cloze multi-trous',
  transform: 'Transformation',
};

export const SECTION_TYPE_LABELS = {
  'core-concept': 'Concept clé',
  rules: 'Règles',
  image: 'Image',
  gallery: 'Galerie',
  dialogue: 'Dialogue',
  tip: 'Astuce',
  example: 'Exemple',
};

/** Highlight map sample used by StyledText in sections. */
export const SAMPLE_LESSON_STYLES = {
  'key-term': { color: '#1a73e8', fontWeight: 600 },
  emphasis: { color: '#c5221f', fontStyle: 'italic' },
};

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
    case 'multi-select': {
      if (!Array.isArray(exercise.choices) || exercise.choices.length < 2) {
        pushError(errors, `${path}.choices`, 'au moins 2 choix requis');
      } else {
        exercise.choices.forEach((c, i) => {
          if (!c?.id) pushError(errors, `${path}.choices[${i}].id`, 'id requis');
          validateI18n(errors, `${path}.choices[${i}].text`, c?.text);
        });
      }
      if (!Array.isArray(exercise.correctChoiceIds) || !exercise.correctChoiceIds.length) {
        pushError(errors, `${path}.correctChoiceIds`, 'au moins une bonne réponse');
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
    case 'short-answer':
    case 'error-correction':
    case 'transform': {
      if (exercise.type === 'error-correction' || exercise.type === 'transform') {
        validateI18n(errors, `${path}.source`, exercise.source);
      }
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
    case 'categorize': {
      if (!Array.isArray(exercise.categories) || exercise.categories.length < 2) {
        pushError(errors, `${path}.categories`, 'au moins 2 catégories');
      }
      if (!Array.isArray(exercise.items) || exercise.items.length < 2) {
        pushError(errors, `${path}.items`, 'au moins 2 items');
      } else {
        exercise.items.forEach((it, i) => {
          if (!it?.id) pushError(errors, `${path}.items[${i}].id`, 'id requis');
          if (!it?.categoryId) pushError(errors, `${path}.items[${i}].categoryId`, 'requis');
          validateI18n(errors, `${path}.items[${i}].text`, it?.text);
        });
      }
      break;
    }
    case 'cloze': {
      validateI18n(errors, `${path}.text`, exercise.text);
      if (!Array.isArray(exercise.blanks) || !exercise.blanks.length) {
        pushError(errors, `${path}.blanks`, 'au moins un trou');
      } else {
        exercise.blanks.forEach((b, i) => {
          if (!Array.isArray(b?.acceptedAnswers) || !b.acceptedAnswers.length) {
            pushError(errors, `${path}.blanks[${i}].acceptedAnswers`, 'requis');
          }
        });
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

export function validateLessonContentPayload(raw, { expectedLessonId = null } = {}) {
  const errors = [];
  const warnings = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['JSON leçon invalide (objet requis)'], warnings };
  }
  if (expectedLessonId && raw.id && raw.id !== expectedLessonId) {
    warnings.push(`id JSON (${raw.id}) ≠ leçon sélectionnée (${expectedLessonId}) — id ignoré`);
  }
  if (raw.introduction) validateI18n(errors, 'introduction', raw.introduction, { required: false });
  if (raw.title) validateI18n(errors, 'title', raw.title, { required: false });
  if (raw.description) validateI18n(errors, 'description', raw.description, { required: false });
  if (raw.sections != null) {
    if (!Array.isArray(raw.sections)) pushError(errors, 'sections', 'tableau requis');
    else raw.sections.forEach((s, i) => validateSection(errors, `sections[${i}]`, s));
  } else {
    warnings.push('aucune section');
  }
  if (raw.exercises != null) {
    warnings.push('exercises ignorés ici — utiliser l’import Exercices');
  }
  return {
    ok: errors.length === 0,
    errors,
    warnings,
    content: errors.length === 0
      ? {
          introduction: raw.introduction,
          sections: raw.sections || [],
          styles: raw.styles || {},
          coverImage: raw.coverImage,
          estimatedMinutes: raw.estimatedMinutes,
          description: raw.description,
          title: raw.title,
        }
      : undefined,
  };
}

export function validateExercisesPayload(raw, { expectedLessonId = null } = {}) {
  const errors = [];
  const warnings = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['JSON exercices invalide (objet requis)'], warnings };
  }
  if (expectedLessonId && raw.lessonId && raw.lessonId !== expectedLessonId) {
    pushError(errors, 'lessonId', `attendu "${expectedLessonId}", reçu "${raw.lessonId}"`);
  }
  const list = Array.isArray(raw.exercises) ? raw.exercises : Array.isArray(raw) ? raw : null;
  if (!list) {
    pushError(errors, 'exercises', 'tableau exercises requis');
    return { ok: false, errors, warnings };
  }
  if (!list.length) warnings.push('liste d’exercices vide');
  const ids = new Set();
  list.forEach((ex, i) => {
    validateExercise(errors, `exercises[${i}]`, ex);
    if (ex?.id) {
      if (ids.has(ex.id)) pushError(errors, `exercises[${i}].id`, `doublon ${ex.id}`);
      ids.add(ex.id);
    }
  });
  return {
    ok: errors.length === 0,
    errors,
    warnings,
    exercises: errors.length === 0 ? list : undefined,
  };
}

export function buildSectionExample(type) {
  switch (type) {
    case 'core-concept':
      return {
        type: 'core-concept',
        title: { fr: 'Concept clé', en: 'Core concept', mg: 'Foto-kevitra' },
        content: [
          {
            text: {
              fr: 'Le verbe to be a 3 formes au présent :',
              en: 'The verb to be has 3 present forms:',
              mg: 'Ny matoanteny to be dia misy endrika 3 :',
            },
            items: [
              { text: ' am ', highlight: 'key-term' },
              { text: ', ', highlight: 'none' },
              { text: ' is ', highlight: 'key-term' },
              { text: ', ', highlight: 'none' },
              { text: ' are ', highlight: 'key-term' },
            ],
          },
          {
            type: 'definition',
            term: 'I am',
            highlight: 'emphasis',
            definitions: {
              fr: 'Je suis (I am a student).',
              en: 'I am (I am a student).',
              mg: 'Izaho dia (I am a student).',
            },
          },
        ],
      };
    case 'rules':
      return {
        type: 'rules',
        title: { fr: 'Règles', en: 'Rules', mg: 'Fitsipika' },
        content: [
          { text: 'I / you / we / they → am / are. ', highlight: 'key-term' },
          { text: 'he / she / it → is.', highlight: 'emphasis' },
        ],
        notes: {
          fr: 'Contractions : I’m, you’re, he’s…',
          en: 'Contractions: I’m, you’re, he’s…',
          mg: 'Contractions: I’m, you’re, he’s…',
        },
      };
    case 'image':
      return {
        type: 'image',
        title: { fr: 'Illustration', en: 'Illustration', mg: 'Sary' },
        src: 'https://placehold.co/640x360/png?text=Lesson+image',
        caption: {
          fr: 'Légende de l’image',
          en: 'Image caption',
          mg: 'Sora-tsoratra',
        },
      };
    case 'gallery':
      return {
        type: 'gallery',
        title: { fr: 'Galerie', en: 'Gallery', mg: 'Gallery' },
        images: [
          {
            src: 'https://placehold.co/320x200/png?text=1',
            caption: { fr: 'Image 1', en: 'Image 1', mg: 'Sary 1' },
          },
          {
            src: 'https://placehold.co/320x200/png?text=2',
            caption: { fr: 'Image 2', en: 'Image 2', mg: 'Sary 2' },
          },
        ],
      };
    case 'dialogue':
      return {
        type: 'dialogue',
        title: { fr: 'Dialogue', en: 'Dialogue', mg: 'Resaka' },
        lines: [
          {
            speaker: 'A',
            text: { fr: 'Hi! How are you?', en: 'Hi! How are you?', mg: 'Hi! How are you?' },
          },
          {
            speaker: 'B',
            text: { fr: 'I am fine, thanks.', en: 'I am fine, thanks.', mg: 'I am fine, thanks.' },
          },
        ],
      };
    case 'tip':
      return {
        type: 'tip',
        title: { fr: 'Astuce', en: 'Tip', mg: 'Torohevitra' },
        text: {
          fr: 'Écoutez la forme contractée “I’m” dans les dialogues.',
          en: 'Listen for the contracted form “I’m” in dialogues.',
          mg: 'Henoy ny endrika “I’m” ao amin’ny resaka.',
        },
      };
    case 'example':
      return {
        type: 'example',
        title: { fr: 'Exemple', en: 'Example', mg: 'Ohatra' },
        text: { fr: 'I am a student.', en: 'I am a student.', mg: 'I am a student.' },
        translation: {
          fr: 'Je suis étudiant.',
          en: 'I am a student.',
          mg: 'Mpianatra aho.',
        },
      };
    default:
      throw new Error(`Type de section inconnu: ${type}`);
  }
}

export function buildExerciseExample(type, idSuffix = '1') {
  const id = `ex-${type}-${idSuffix}`.replace(/[^a-z0-9-]/g, '-');
  switch (type) {
    case 'multiple-choice':
      return {
        id,
        type: 'multiple-choice',
        points: 1,
        prompt: { fr: 'QCM : choisissez.', en: 'MCQ: choose.', mg: 'QCM: fidio.' },
        choices: [
          { id: 'a', text: { fr: 'Bonne', en: 'Correct', mg: 'Marina' } },
          { id: 'b', text: { fr: 'Mauvaise', en: 'Wrong', mg: 'Diso' } },
        ],
        correctChoiceId: 'a',
      };
    case 'multi-select':
      return {
        id,
        type: 'multi-select',
        points: 2,
        prompt: {
          fr: 'Cochez toutes les bonnes réponses.',
          en: 'Select all that apply.',
          mg: 'Mariho ny marina rehetra.',
        },
        choices: [
          { id: 'a', text: { fr: 'Oui', en: 'Yes', mg: 'Eny' } },
          { id: 'b', text: { fr: 'Non', en: 'No', mg: 'Tsia' } },
          { id: 'c', text: { fr: 'Aussi', en: 'Also', mg: 'Koas' } },
        ],
        correctChoiceIds: ['a', 'c'],
      };
    case 'true-false':
      return {
        id,
        type: 'true-false',
        points: 1,
        prompt: { fr: 'Ceci est vrai.', en: 'This is true.', mg: 'Marina ity.' },
        correct: true,
      };
    case 'fill-blank':
      return {
        id,
        type: 'fill-blank',
        points: 1,
        prompt: { fr: 'Complétez.', en: 'Fill in.', mg: 'Fenoy.' },
        sentence: {
          fr: 'I ___ a teacher.',
          en: 'I ___ a teacher.',
          mg: 'I ___ a teacher.',
        },
        acceptedAnswers: ['am', 'Am'],
      };
    case 'short-answer':
      return {
        id,
        type: 'short-answer',
        points: 1,
        prompt: {
          fr: 'Écrivez le pluriel de "cat".',
          en: 'Write the plural of "cat".',
          mg: 'Soraty ny pluriel an\'ny "cat".',
        },
        acceptedAnswers: ['cats', 'Cats'],
      };
    case 'match':
      return {
        id,
        type: 'match',
        points: 2,
        prompt: { fr: 'Associez.', en: 'Match.', mg: 'Ampifanaraho.' },
        pairs: [
          { id: 'p1', left: { fr: 'I', en: 'I', mg: 'I' }, right: { fr: 'am', en: 'am', mg: 'am' } },
          { id: 'p2', left: { fr: 'He', en: 'He', mg: 'He' }, right: { fr: 'is', en: 'is', mg: 'is' } },
        ],
      };
    case 'reorder':
      return {
        id,
        type: 'reorder',
        points: 2,
        prompt: { fr: 'Remettez en ordre.', en: 'Reorder.', mg: 'Avereno filaharana.' },
        items: [
          { id: 'w1', text: { fr: 'I', en: 'I', mg: 'I' } },
          { id: 'w2', text: { fr: 'am', en: 'am', mg: 'am' } },
          { id: 'w3', text: { fr: 'happy', en: 'happy', mg: 'happy' } },
        ],
        correctOrder: ['w1', 'w2', 'w3'],
      };
    case 'categorize':
      return {
        id,
        type: 'categorize',
        points: 2,
        prompt: { fr: 'Classez.', en: 'Categorize.', mg: 'Sokajio.' },
        categories: [
          { id: 'verb', label: { fr: 'Verbe', en: 'Verb', mg: 'Matoanteny' } },
          { id: 'noun', label: { fr: 'Nom', en: 'Noun', mg: 'Anarana' } },
        ],
        items: [
          { id: 'i1', text: { fr: 'run', en: 'run', mg: 'run' }, categoryId: 'verb' },
          { id: 'i2', text: { fr: 'dog', en: 'dog', mg: 'dog' }, categoryId: 'noun' },
        ],
      };
    case 'error-correction':
      return {
        id,
        type: 'error-correction',
        points: 1,
        prompt: {
          fr: 'Corrigez la phrase.',
          en: 'Correct the sentence.',
          mg: 'Ahitsio ny fehezanteny.',
        },
        source: {
          fr: 'She are happy.',
          en: 'She are happy.',
          mg: 'She are happy.',
        },
        acceptedAnswers: ['She is happy.', 'She is happy'],
      };
    case 'cloze':
      return {
        id,
        type: 'cloze',
        points: 2,
        prompt: {
          fr: 'Remplissez les trous.',
          en: 'Fill the blanks.',
          mg: 'Fenoy ny lavaka.',
        },
        text: {
          fr: 'I {{0}} a student and he {{1}} a teacher.',
          en: 'I {{0}} a student and he {{1}} a teacher.',
          mg: 'I {{0}} a student and he {{1}} a teacher.',
        },
        blanks: [{ acceptedAnswers: ['am'] }, { acceptedAnswers: ['is'] }],
      };
    case 'transform':
      return {
        id,
        type: 'transform',
        points: 1,
        prompt: {
          fr: 'Mettez au négatif.',
          en: 'Make it negative.',
          mg: 'Ataovy négatif.',
        },
        source: { fr: 'I am ready.', en: 'I am ready.', mg: 'I am ready.' },
        acceptedAnswers: ["I am not ready.", "I'm not ready."],
      };
    default:
      throw new Error(`Type d’exercice inconnu: ${type}`);
  }
}

export function buildLessonContentTemplate(lessonId = 'sample-lesson') {
  return {
    id: lessonId,
    introduction: {
      fr: 'Introduction de la leçon.',
      en: 'Lesson introduction.',
      mg: 'Fampidirana ny lesona.',
    },
    sections: SECTION_TYPES.map((type) => buildSectionExample(type)),
    styles: { ...SAMPLE_LESSON_STYLES },
  };
}

export function buildExercisesTemplate(lessonId = 'sample-lesson') {
  return {
    lessonId,
    exercises: EXERCISE_TYPES.map((type, i) => buildExerciseExample(type, String(i + 1))),
  };
}
