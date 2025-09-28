import React, { useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import EnglishLesson1 from './lessons/Lesson1';

const EnglishCourse = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Define English lessons for the sidebar
  const englishLessons = [
    {
      path: 'lesson1',
      name: 'The Alphabet & Basic Sounds',
      lessonId: 1
    }
    // Additional lessons will be added here in the future
  ];

  const isActiveLesson = (lessonPath) => {
    return location.pathname === `/anglais/${lessonPath}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6 bg-green-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Cours d'Anglais</h2>
              <p className="text-green-100 mt-1 sm:mt-2 text-sm sm:text-base">Améliorez vos compétences en anglais</p>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-md text-green-100 hover:text-white hover:bg-green-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 overflow-y-auto h-full">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Leçons</h3>
          <nav className="space-y-1">
            <Link
              to="/anglais"
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                location.pathname === '/anglais'
                  ? 'bg-green-100 text-green-800 border-r-2 border-green-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Accueil Anglais
            </Link>
            {englishLessons.map((lesson) => (
              <Link
                key={lesson.lessonId}
                to={`/anglais/${lesson.path}`}
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                  isActiveLesson(lesson.path)
                    ? 'bg-green-100 text-green-800 border-r-2 border-green-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {lesson.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Cours d'Anglais</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<CourseOverview />} />
            <Route path="lesson1" element={<EnglishLesson1 />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const CourseOverview = () => (
  <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">Aperçu du Cours d'Anglais</h1>
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 lg:mb-6">📚</div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Cours d'Anglais</h2>
        <p className="text-base sm:text-lg text-gray-600">
          Apprenez les bases de l'anglais, de l'alphabet aux phrases simples.
        </p>
      </div>
      
      <div className="border-t border-gray-200 pt-6 sm:pt-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Leçons Disponibles</h3>
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800">Lesson 1: The Alphabet & Basic Sounds</h4>
            <p className="text-sm sm:text-base text-blue-700 mt-1">Apprenez les 26 lettres de l'alphabet anglais et leurs sons de base.</p>
            <Link 
              to="/anglais/lesson1" 
              className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              Commencer la leçon
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default EnglishCourse;
