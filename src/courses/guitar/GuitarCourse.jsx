import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

const GuitarCourse = () => {
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
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6 bg-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Cours de Guitare</h2>
              <p className="text-purple-100 mt-1 sm:mt-2 text-sm sm:text-base">Maîtrisez le jeu de guitare</p>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-md text-purple-100 hover:text-white hover:bg-purple-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 overflow-y-auto h-full">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Bientôt Disponible</h3>
          <p className="text-sm sm:text-base text-gray-600">Les leçons de guitare sont en cours de préparation pour vous !</p>
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
            <h1 className="text-lg font-semibold text-gray-900">Cours de Guitare</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<CourseOverview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const CourseOverview = () => (
  <div className="max-w-4xl">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">Aperçu du Cours de Guitare</h1>
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 text-center">
      <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 lg:mb-6">🎸</div>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Bientôt Disponible !</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
        Nous travaillons à créer des leçons de guitare complètes pour vous.
      </p>
      <p className="text-sm sm:text-base text-gray-500">
        Ce cours couvrira les accords, les gammes, les techniques et des chansons populaires.
      </p>
    </div>
  </div>
);

export default GuitarCourse;
