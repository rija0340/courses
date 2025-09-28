import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LessonLayout = ({ children, courseTitle, courseDescription, lessons }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
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
        <div className="p-4 sm:p-6 bg-yellow-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{courseTitle}</h2>
              <p className="text-yellow-100 mt-1 sm:mt-2 text-sm sm:text-base">{courseDescription}</p>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-md text-yellow-100 hover:text-white hover:bg-yellow-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 overflow-y-auto h-full">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Leçons</h3>
          <ul className="space-y-1 sm:space-y-2">
            {lessons.map(lesson => (
              <li key={lesson.id}>
                <Link
                  to={lesson.path}
                  onClick={closeSidebar}
                  className={`block p-2 sm:p-3 rounded-lg transition-colors ${
                    location.pathname === lesson.path
                      ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm font-medium mr-2 sm:mr-3">
                      {lesson.id.toString().padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-sm sm:text-base">{lesson.title}</span>
                    {lesson.completed && (
                      <span className="text-green-500 text-sm">✓</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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
            <h1 className="text-lg font-semibold text-gray-900">{courseTitle}</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LessonLayout;
