import React, { useContext, useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import useCoursePack from '../hooks/useCoursePack';
import { localize } from '../data/coursePackSchema';

const CourseView = () => {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, dataRegistry } = useContext(AppContext);
  const { pack, loading, error } = useCoursePack(courseId);

  const course = dataRegistry.courses.find((c) => c.id === courseId);
  const legacyLessons = dataRegistry.courseLessons[courseId] || [];

  const levels = useMemo(() => pack?.levels || [], [pack]);
  const levelFromQuery = searchParams.get('level');
  const [selectedLevelId, setSelectedLevelId] = useState(null);

  const activeLevelId = useMemo(() => {
    if (selectedLevelId && levels.some((l) => l.id === selectedLevelId)) return selectedLevelId;
    if (levelFromQuery && levels.some((l) => l.id === levelFromQuery)) return levelFromQuery;
    return levels[0]?.id || null;
  }, [selectedLevelId, levelFromQuery, levels]);

  const activeLevel = levels.find((l) => l.id === activeLevelId) || null;

  const selectLevel = (id) => {
    setSelectedLevelId(id);
    setSearchParams(id ? { level: id } : {});
  };

  if (!course) {
    return <div className="p-12 text-center text-[#5f6368]">Course not found</div>;
  }

  if (loading) {
    return <div className="p-12 text-center text-[#5f6368]">Loading…</div>;
  }

  // Pack-based course (english, etc.)
  if (pack && levels.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <Breadcrumb items={[{ label: localize(course.title, lang) }]} />

        <div className="mb-8 sm:mb-10">
          {activeLevel?.coverImage && (
            <div className="mb-6 -mx-4 sm:mx-0 overflow-hidden sm:rounded-2xl">
              <img
                src={activeLevel.coverImage}
                alt=""
                className="w-full h-40 sm:h-52 object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-normal text-[#202124] dark:text-[#e8eaed] mb-3">
            {localize(course.title, lang)}
          </h1>
          <p className="text-lg sm:text-xl text-[#5f6368] dark:text-[#9aa0a6]">
            {localize(course.description, lang)}
          </p>
          {error && (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 -mx-1 px-1">
          {levels.map((level) => {
            const active = level.id === activeLevelId;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => selectLevel(level.id)}
                className={`shrink-0 h-10 px-4 rounded-full text-sm font-medium transition-all border ${
                  active
                    ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                    : 'bg-white dark:bg-[#303134] text-[#5f6368] dark:text-[#e8eaed] border-[#dadce0] dark:border-[#5f6368] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043]'
                }`}
              >
                {level.cefr || localize(level.title, lang, level.id)}
              </button>
            );
          })}
        </div>

        <div className="space-y-10">
          {(activeLevel?.chapters || []).map((chapter) => (
            <section key={chapter.id}>
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-normal text-[#202124] dark:text-[#e8eaed] flex items-center gap-2">
                  <BookOpen size={20} className="text-[#1a73e8]" />
                  {localize(chapter.title, lang)}
                </h2>
                {chapter.description && (
                  <p className="text-sm sm:text-base text-[#5f6368] dark:text-[#9aa0a6] mt-1 ml-7">
                    {localize(chapter.description, lang)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {(chapter.lessons || []).map((lesson, index) => (
                  <Link
                    key={lesson.id}
                    to={`/course/${courseId}/lesson/${lesson.id}`}
                    className="flex gap-4 items-center bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-3 sm:p-4 hover:shadow-md transition-all group"
                  >
                    {lesson.coverImage ? (
                      <img
                        src={lesson.coverImage}
                        alt=""
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#f1f3f4] dark:bg-[#303134] flex items-center justify-center text-[#5f6368] font-medium shrink-0">
                        {index + 1}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8]">
                          {activeLevel.cefr || lesson.level}
                        </span>
                        {lesson.estimatedMinutes && (
                          <span className="inline-flex items-center gap-1 text-[12px] text-[#5f6368] dark:text-[#9aa0a6]">
                            <Clock size={12} />
                            {lesson.estimatedMinutes} min
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-[#202124] dark:text-[#e8eaed] group-hover:text-[#1a73e8] transition-colors truncate">
                        {localize(lesson.title, lang)}
                      </h3>
                      {lesson.description && (
                        <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] line-clamp-2 mt-0.5">
                          {localize(lesson.description, lang)}
                        </p>
                      )}
                    </div>
                    <div className="text-[#1a73e8] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block shrink-0">
                      <PlayCircle size={28} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  // Legacy flat lessons (e.g. javascript)
  return (
    <div className="max-w-4xl mx-auto px-6 pt-8">
      <Breadcrumb items={[{ label: localize(course.title, lang) }]} />

      <div className="mb-12">
        <h1 className="text-4xl font-normal text-[#202124] dark:text-[#e8eaed] mb-4">
          {localize(course.title, lang)}
        </h1>
        <p className="text-xl text-[#5f6368] dark:text-[#9aa0a6]">
          {localize(course.description, lang)}
        </p>
      </div>

      <div className="space-y-4">
        {legacyLessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            to={`/course/${courseId}/lesson/${lesson.id}`}
            className="flex items-center justify-between bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 hover:shadow-md transition-all group"
          >
            <div className="flex gap-5 items-center">
              <div className="w-10 h-10 rounded-full bg-[#f1f3f4] dark:bg-[#303134] flex items-center justify-center text-[#5f6368] font-medium">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#202124] dark:text-[#e8eaed] mb-1 group-hover:text-[#1a73e8] transition-colors">
                  {localize(lesson.title, lang)}
                </h3>
                <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6]">
                  {localize(lesson.description, lang)}
                </p>
              </div>
            </div>
            <div className="text-[#1a73e8] opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle size={28} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseView;
