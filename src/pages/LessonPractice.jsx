import React, { useContext, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, CheckCircle2, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import useCoursePack from '../hooks/useCoursePack';
import { localize } from '../data/coursePackSchema';
import ExerciseQuestion, {
  gradeExercise,
  getExerciseMaxPoints,
} from '../components/lesson/ExerciseQuestion';

export default function LessonPractice() {
  const { courseId, lessonId } = useParams();
  const { lang, dataRegistry } = useContext(AppContext);
  const { loading, findLesson } = useCoursePack(courseId);

  const course = dataRegistry.courses.find((c) => c.id === courseId);
  const found = findLesson(lessonId);
  const lesson = found?.lesson;
  const exercises = useMemo(() => lesson?.exercises || [], [lesson]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = exercises[index];
  const totalMax = useMemo(
    () => exercises.reduce((sum, ex) => sum + getExerciseMaxPoints(ex), 0),
    [exercises]
  );

  const results = useMemo(() => {
    if (!finished) return null;
    let score = 0;
    const detail = exercises.map((ex) => {
      const g = gradeExercise(ex, answers[ex.id]);
      score += g.score;
      return { exercise: ex, ...g };
    });
    return { score, detail };
  }, [finished, exercises, answers]);

  if (loading) {
    return <div className="p-12 text-center text-[#5f6368]">Loading…</div>;
  }

  if (!lesson) {
    return <div className="p-12 text-center text-[#5f6368]">Lesson not found</div>;
  }

  if (!exercises.length) {
    return (
      <div className="max-w-xl mx-auto px-6 pt-10 text-center">
        <p className="text-[#5f6368] mb-4">
          {lang === 'en' ? 'No exercises for this lesson yet.' : lang === 'mg' ? 'Tsy mbola misy fanazaran-tena.' : 'Pas encore d’exercices pour cette leçon.'}
        </p>
        <Link to={`/course/${courseId}/lesson/${lessonId}`} className="text-[#1a73e8] font-medium">
          ← {localize(lesson.title, lang)}
        </Link>
      </div>
    );
  }

  const answer = answers[current?.id];
  const canCheck =
    answer !== undefined &&
    answer !== null &&
    answer !== '' &&
    !(typeof answer === 'object' && !Array.isArray(answer) && Object.keys(answer).length === 0);

  const handleCheck = () => {
    setRevealed(true);
  };

  const handleNext = () => {
    if (index >= exercises.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  };

  const handleRetry = () => {
    setIndex(0);
    setAnswers({});
    setRevealed(false);
    setFinished(false);
  };

  if (finished && results) {
    const pct = totalMax ? Math.round((results.score / totalMax) * 100) : 0;
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <Breadcrumb
          items={[
            { label: localize(course?.title, lang, courseId), path: `/course/${courseId}` },
            { label: localize(lesson.title, lang), path: `/course/${courseId}/lesson/${lessonId}` },
            { label: lang === 'en' ? 'Practice' : lang === 'mg' ? 'Fanazaran-tena' : 'Exercices' },
          ]}
        />
        <div className="mt-8 text-center bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-normal text-[#202124] dark:text-[#e8eaed] mb-2">
            {lang === 'en' ? 'Session score' : lang === 'mg' ? 'Isa' : 'Score de session'}
          </h1>
          <p className="text-5xl font-medium text-[#1a73e8] my-6">
            {results.score}/{totalMax}
          </p>
          <p className="text-[#5f6368] dark:text-[#9aa0a6] mb-8">{pct}%</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[#1a73e8] text-white font-medium"
            >
              <RotateCcw size={18} />
              {lang === 'en' ? 'Retry' : lang === 'mg' ? 'Avereno' : 'Recommencer'}
            </button>
            <Link
              to={`/course/${courseId}/lesson/${lessonId}`}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-[#dadce0] dark:border-[#5f6368] font-medium text-[#202124] dark:text-[#e8eaed]"
            >
              <ArrowLeft size={18} />
              {lang === 'en' ? 'Back to lesson' : lang === 'mg' ? 'Hiverina' : 'Retour à la leçon'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const grade = revealed ? gradeExercise(current, answer) : null;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      <Breadcrumb
        items={[
          { label: localize(course?.title, lang, courseId), path: `/course/${courseId}` },
          { label: localize(lesson.title, lang), path: `/course/${courseId}/lesson/${lessonId}` },
          { label: lang === 'en' ? 'Practice' : lang === 'mg' ? 'Fanazaran-tena' : 'Exercices' },
        ]}
      />

      <div className="mt-6 mb-4">
        <div className="flex justify-between text-sm text-[#5f6368] dark:text-[#9aa0a6] mb-2">
          <span>
            {index + 1} / {exercises.length}
          </span>
          <span className="uppercase tracking-wide text-[11px] font-semibold">{current.type}</span>
        </div>
        <div className="h-2 rounded-full bg-[#e8eaed] dark:bg-[#3c4043] overflow-hidden">
          <div
            className="h-full bg-[#1a73e8] transition-all"
            style={{ width: `${((index + (revealed ? 1 : 0)) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 sm:p-7 shadow-sm">
        <h1 className="text-xl sm:text-2xl text-[#202124] dark:text-[#e8eaed] font-normal mb-6 leading-snug">
          {localize(current.prompt, lang)}
        </h1>

        <ExerciseQuestion
          key={current.id}
          exercise={current}
          lang={lang}
          value={answer}
          disabled={revealed}
          onChange={(v) => setAnswers((prev) => ({ ...prev, [current.id]: v }))}
        />

        {revealed && grade && (
          <div
            className={`mt-5 flex items-start gap-2 p-4 rounded-xl text-sm ${
              grade.correct
                ? 'bg-[#e6f4ea] text-[#137333] dark:bg-[#0d2818] dark:text-[#81c995]'
                : 'bg-[#fce8e6] text-[#c5221f] dark:bg-[#3c1512] dark:text-[#f6aea9]'
            }`}
          >
            {grade.correct ? <CheckCircle2 size={18} className="shrink-0" /> : <XCircle size={18} className="shrink-0" />}
            <div>
              <p className="font-medium mb-1">
                {grade.correct
                  ? lang === 'en'
                    ? 'Correct'
                    : lang === 'mg'
                      ? 'Marina'
                      : 'Correct'
                  : lang === 'en'
                    ? 'Not quite'
                    : lang === 'mg'
                      ? 'Diso'
                      : 'Incorrect'}{' '}
                (+{grade.score}/{grade.max})
              </p>
              {current.explanation && <p>{localize(current.explanation, lang)}</p>}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!revealed ? (
            <button
              type="button"
              disabled={!canCheck}
              onClick={handleCheck}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#1a73e8] text-white font-medium disabled:opacity-40"
            >
              {lang === 'en' ? 'Check' : lang === 'mg' ? 'Jereo' : 'Vérifier'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#1a73e8] text-white font-medium"
            >
              {index >= exercises.length - 1
                ? lang === 'en'
                  ? 'See score'
                  : lang === 'mg'
                    ? 'Jereo ny isa'
                    : 'Voir le score'
                : lang === 'en'
                  ? 'Next'
                  : lang === 'mg'
                    ? 'Manaraka'
                    : 'Suivant'}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
