import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Languages, Code, HeartPulse, Cpu, BookOpen, Scale, Briefcase,
  GraduationCap, Globe, FlaskConical
} from 'lucide-react';
import { AppContext } from '../App';
import useVocabDomainsList from '../hooks/useVocabDomainsList';
import { pickLangText } from '../data/vocabs/vocabItemStructure';

const ICONS = {
  Languages, Code, HeartPulse, Cpu, BookOpen, Scale, Briefcase,
  GraduationCap, Globe, FlaskConical
};

const Home = () => {
  const { lang, dataRegistry } = useContext(AppContext);
  const { courses } = dataRegistry;
  const { domains: vocabDomains, loading: vocabsLoading } = useVocabDomainsList(lang);

  const lessonCourses = courses.filter(c => c.type !== 'vocabs');

  const getTitle = (course) => pickLangText(course.title, lang) || course.id;
  const getDesc = (course) => pickLangText(course.description, lang);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-20">
      <h1 className="text-3xl font-normal text-lh-text mb-8">
        {lang === 'fr' ? 'Parcourir les cours' : lang === 'mg' ? 'Hijery ny taranja' : 'Browse courses'}
      </h1>

      {lessonCourses.length > 0 && (
        <>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-lh-faint mb-4">
            {lang === 'fr' ? 'Cours' : lang === 'mg' ? 'Taranja' : 'Courses'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {lessonCourses.map(course => {
              const IconComponent = ICONS[course.icon] || Languages;
              return (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="group bg-lh-card border border-lh-border rounded-2xl p-6 hover:shadow-lh transition-all block"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: course.color }}
                    >
                      <IconComponent size={24} />
                    </div>
                    <h2 className="text-xl font-medium text-lh-text group-hover:text-lh-accent transition-colors">
                      {getTitle(course)}
                    </h2>
                  </div>
                  <p className="text-lh-secondary leading-relaxed">{getDesc(course)}</p>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <h2 className="text-[13px] font-bold uppercase tracking-wider text-lh-faint mb-4">
        {lang === 'fr' ? 'Vocabulaires' : lang === 'mg' ? 'Voaboly' : 'Vocabulary domains'}
      </h2>

      {vocabsLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vocabDomains.map(course => {
            const IconComponent = ICONS[course.icon] || BookOpen;
            return (
              <Link
                key={course.id}
                to={`/vocabs/${course.id}`}
                className="group bg-lh-card border border-lh-border rounded-2xl p-6 hover:shadow-lh transition-all block"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: course.color || '#1a73e8' }}
                  >
                    <IconComponent size={24} />
                  </div>
                  <h2 className="text-xl font-medium text-lh-text group-hover:text-lh-accent transition-colors">
                    {getTitle(course)}
                  </h2>
                </div>
                <p className="text-lh-secondary leading-relaxed">{getDesc(course)}</p>
                {course.itemCount > 0 && (
                  <p className="text-[12px] text-lh-faint mt-2">{course.itemCount} mot{course.itemCount !== 1 ? 's' : ''}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
