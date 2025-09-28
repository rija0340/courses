import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const courses = [
    {
      id: 'Programmation',
      name: 'Programmation',
      description: 'Apprenez des themes sur la programmation',
      icon: '⚡',
      color: 'bg-yellow-500',
      lessons: 1,
      path: '/programmation/'
    },
    {
      id: 'english',
      name: 'Anglais',
      description: 'Améliorez vos compétences en langue anglaise',
      icon: '📚',
      color: 'bg-green-500',
      lessons: 0,
      path: '/anglais'
    },
    // {
    //   id: 'guitar',
    //   name: 'Guitare',
    //   description: 'Maîtrisez les techniques de jeu de guitare',
    //   icon: '🎸',
    //   color: 'bg-purple-500',
    //   lessons: 0,
    //   path: '/guitare'
    // }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            Bienvenue sur votre Plateforme d'Apprentissage
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez un cours et commencez votre parcours d'apprentissage dès aujourd'hui
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map(course => (
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
                  Commencer l'Apprentissage
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
