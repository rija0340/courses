import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import useCoursePack from '../hooks/useCoursePack';
import LessonSections from '../components/lesson/LessonSections';
import { localize } from '../data/coursePackSchema';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const { lang, dataRegistry } = useContext(AppContext);
  const { pack, loading, findLesson } = useCoursePack(courseId);

  const course = dataRegistry.courses.find((c) => c.id === courseId);
  const found = findLesson(lessonId);
  const packLesson = found?.lesson;
  const legacyLesson = dataRegistry.lessons[courseId]?.[lessonId];
  const lesson = packLesson || legacyLesson;

  if (loading && !legacyLesson) {
    return <div className="p-12 text-center text-[#5f6368]">Loading…</div>;
  }

  if (!lesson) {
    return <div className="p-12 text-center text-[#5f6368]">Lesson not found</div>;
  }

  const cefr = found?.cefr || lesson.level || '';
  const chapterTitle = found?.chapter ? localize(found.chapter.title, lang) : null;
  const levelTitle = found?.level
    ? found.level.cefr || localize(found.level.title, lang)
    : cefr;
  const hasExercises = Array.isArray(lesson.exercises) && lesson.exercises.length > 0;
  const practicePath = `/course/${courseId}/lesson/${lessonId}/practice`;

  const breadcrumbItems = [
    { label: localize(course?.title, lang, courseId), path: `/course/${courseId}` },
  ];
  if (levelTitle && pack) {
    breadcrumbItems.push({
      label: levelTitle,
      path: `/course/${courseId}?level=${found?.level?.id || ''}`,
    });
  }
  if (chapterTitle) {
    breadcrumbItems.push({ label: chapterTitle });
  }
  breadcrumbItems.push({ label: localize(lesson.title, lang) });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      <Breadcrumb items={breadcrumbItems} />

      <header className="mb-10 sm:mb-14">
        {lesson.coverImage && (
          <div className="mb-6 -mx-4 sm:mx-0 overflow-hidden sm:rounded-2xl">
            <img
              src={lesson.coverImage}
              alt=""
              className="w-full h-44 sm:h-56 object-cover"
            />
          </div>
        )}
        {cefr && (
          <div className="flex items-center gap-2 text-[#1a73e8] font-medium text-sm tracking-wide mb-3 uppercase mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
            Niveau {cefr}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-normal text-[#202124] dark:text-[#e8eaed] mb-4 sm:mb-6 leading-tight">
          {localize(lesson.title, lang)}
        </h1>
        {lesson.introduction && (
          <p className="text-lg sm:text-xl text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed font-normal">
            {localize(lesson.introduction, lang)}
          </p>
        )}
      </header>

      <LessonSections
        sections={lesson.sections || []}
        styles={lesson.styles || {}}
        lang={lang}
      />

      <div className="mt-14 sm:mt-16 flex flex-col items-center">
        {hasExercises ? (
          <Link
            to={practicePath}
            className="group flex items-center gap-2 bg-[#1a73e8] text-white px-8 py-3.5 rounded-full font-medium text-base hover:bg-[#1b66c9] hover:shadow-md transition-all"
          >
            {lang === 'mg'
              ? 'Hanao fanazaran-tena'
              : lang === 'en'
                ? 'Start Practice'
                : "Commencer l'exercice"}
            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="flex items-center gap-2 bg-[#dadce0] text-[#5f6368] px-8 py-3.5 rounded-full font-medium text-base cursor-not-allowed"
          >
            {lang === 'en' ? 'No exercises yet' : lang === 'mg' ? 'Tsy mbola misy' : 'Pas encore d’exercices'}
          </button>
        )}
        <p className="mt-4 text-[#5f6368] dark:text-[#9aa0a6] text-sm flex items-center gap-1.5">
          <CheckCircle2 size={16} className="text-[#1e8e3e]" />
          {lang === 'mg'
            ? 'Vita ny fianarana'
            : lang === 'en'
              ? 'Lesson completed'
              : 'Leçon terminée'}
        </p>
      </div>
    </div>
  );
};

export default LessonView;
