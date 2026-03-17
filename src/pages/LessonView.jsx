import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Target, Award, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const { lang, dataRegistry } = useContext(AppContext);
  
  const course = dataRegistry.courses.find(c => c.id === courseId);
  const lesson = dataRegistry.lessons[courseId]?.[lessonId];

  if (!lesson) return <div className="p-12 text-center text-[#5f6368]">Lesson not found</div>;

  const StyledText = ({ item }) => {
    const style = lesson.styles[item.highlight] || {};
    return <span style={style}>{item.text}</span>;
  };

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'core-concept':
        return (
          <div key={index} className="mb-10 animate-in fade-in duration-500">
            <h2 className="text-2xl font-normal text-[#202124] mb-5 flex items-center gap-3">
              <div className="text-[#1a73e8]"><Target size={24} /></div>
              {section.title[lang]}
            </h2>
            <div className="bg-white border border-[#dadce0] rounded-2xl p-7 shadow-sm">
              {section.content.map((block, bIdx) => {
                if (block.items) {
                  return (
                    <p key={bIdx} className="text-[17px] mb-6 leading-relaxed text-[#3c4043]">
                      {block.text[lang]}
                      <span className="inline-flex gap-2 ml-1">
                        {block.items.map((item, iIdx) => <StyledText key={iIdx} item={item} />)}
                      </span>
                    </p>
                  );
                }
                if (block.type === 'definition') {
                  const getTerm = (term, lang) => {
                    if (typeof term === 'object') return term[lang] || term.fr;
                    return term;
                  };
                  return (
                    <div key={bIdx} className="mb-4 p-5 bg-[#f8f9fa] rounded-xl border border-[#dadce0] group transition-all">
                      <span className="font-medium text-[13px] tracking-wide mb-1 block" style={{ color: lesson.styles[block.highlight]?.color || '#3c4043' }}>
                        {getTerm(block.term, lang)}
                      </span>
                      <p className="text-[#202124] text-base">
                        {block.definitions[lang]}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );

      case 'rules':
        return (
          <div key={index} className="mb-10 animate-in fade-in duration-700">
            <h2 className="text-2xl font-normal text-[#202124] mb-5 flex items-center gap-3">
              <div className="text-[#f29900]"><Award size={24} /></div>
              {section.title[lang]}
            </h2>
            <div className="bg-[#fff8e1] border border-[#fde293] rounded-2xl p-7">
              <div className="text-[17px] leading-relaxed text-[#3c4043] mb-5">
                {section.content.map((item, iIdx) => <StyledText key={iIdx} item={item} />)}
              </div>
              {section.notes && (
                <div className="flex items-start gap-4 text-sm text-[#8d6e00] bg-[#fffcf0] p-4 rounded-xl border border-[#fde293]">
                  <AlertCircle size={20} className="text-[#f29900] shrink-0" />
                  <p className="leading-relaxed">
                    <span className="font-medium tracking-wide text-[12px] block mb-0.5">Note</span>
                    {section.notes[lang]}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-8">
      <Breadcrumb 
        items={[
          { label: course?.title[lang] || courseId, path: `/course/${courseId}` },
          { label: lesson.title[lang] }
        ]} 
      />

      <header className="mb-14">
        <div className="flex items-center gap-2 text-[#1a73e8] font-medium text-sm tracking-wide mb-3 uppercase">
           <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]"></div>
           Niveau {lesson.level}
        </div>
        <h1 className="text-4xl font-normal text-[#202124] mb-6 leading-tight">
          {lesson.title[lang]}
        </h1>
        <p className="text-xl text-[#5f6368] leading-relaxed font-normal">
          {lesson.introduction[lang]}
        </p>
      </header>

      {/* Rendu des sections */}
      {lesson.sections.map((section, index) => renderSection(section, index))}

      {/* Action finale */}
      <div className="mt-16 flex flex-col items-center">
        <button className="group flex items-center gap-2 bg-[#1a73e8] text-white px-8 py-3 rounded-full font-medium text-base hover:bg-[#1b66c9] hover:shadow-md transition-all">
          {lang === 'mg' ? 'Hanao fanazaran-tena' : lang === 'en' ? 'Start Practice' : 'Commencer l\'exercice'}
          <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
        <p className="mt-4 text-[#5f6368] text-sm flex items-center gap-1.5">
          <CheckCircle2 size={16} className="text-[#1e8e3e]" />
          {lang === 'mg' ? 'Vita ny fianarana' : lang === 'en' ? 'Lesson completed' : 'Leçon terminée'}
        </p>
      </div>
    </div>
  );
};
export default LessonView;
