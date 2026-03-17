import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Languages, Code } from 'lucide-react';
import { AppContext } from '../App';

const ICONS = { Languages, Code };

const Home = () => {
  const { lang, dataRegistry } = useContext(AppContext);
  const { courses } = dataRegistry;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12">
      <h1 className="text-3xl font-normal text-[#202124] mb-8">
        {lang === 'fr' ? 'Parcourir les cours' : lang === 'mg' ? 'Hijery ny taranja' : 'Browse courses'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => {
          const IconComponent = ICONS[course.icon] || Languages;
          return (
            <Link 
              key={course.id} 
              to={`/course/${course.id}`}
              className="group bg-white border border-[#dadce0] rounded-2xl p-6 hover:shadow-md transition-all block"
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: course.color }}
                >
                  <IconComponent size={24} />
                </div>
                <h2 className="text-xl font-medium text-[#202124] group-hover:text-[#1a73e8] transition-colors">{course.title[lang]}</h2>
              </div>
              <p className="text-[#5f6368] leading-relaxed">
                {course.description[lang]}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  );
};
export default Home;
