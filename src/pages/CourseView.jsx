import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';

const CourseView = () => {
  const { courseId } = useParams();
  const { lang, dataRegistry } = useContext(AppContext);
  
  const course = dataRegistry.courses.find(c => c.id === courseId);
  const lessons = dataRegistry.courseLessons[courseId] || [];

  if (!course) return <div className="p-12 text-center text-[#5f6368]">Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8">
      <Breadcrumb items={[{ label: course.title[lang] }]} />
      
      <div className="mb-12">
        <h1 className="text-4xl font-normal text-[#202124] mb-4">{course.title[lang]}</h1>
        <p className="text-xl text-[#5f6368]">{course.description[lang]}</p>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <Link 
            key={lesson.id}
            to={`/course/${courseId}/lesson/${lesson.id}`}
            className="flex items-center justify-between bg-white border border-[#dadce0] rounded-2xl p-5 hover:shadow-md transition-all group"
          >
            <div className="flex gap-5 items-center">
              <div className="w-10 h-10 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[#5f6368] font-medium">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#202124] mb-1 group-hover:text-[#1a73e8] transition-colors">
                  {lesson.title[lang]}
                </h3>
                <p className="text-sm text-[#5f6368]">{lesson.description[lang]}</p>
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
