import React from 'react';
import { Link } from 'react-router-dom';

const ProgrammationPage = () => {
  const programmingCourses = [
    {
      id: 'javascript',
      name: 'JavaScript',
      description: 'Apprenez les fondamentaux et concepts avancés de JavaScript',
      icon: '⚡',
      color: 'bg-yellow-500',
      lessons: 5,
      path: '/programmation/javascript'
    }
    // Future programming courses can be added here
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            Cours de Programmation
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos cours de programmation et développez vos compétences techniques
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {programmingCourses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className={`${course.color} text-white p-4 sm:p-6`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl">{course.icon}</span>
                  <span className="text-xs sm:text-sm bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full">
                    {course.lessons} leçons
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                  {course.name}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  {course.description}
                </p>
                
                <Link
                  to={course.path}
                  className={`block w-full text-center ${course.color} text-white py-3 sm:py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base`}
                >
                  Commencer le Cours
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgrammationPage;
