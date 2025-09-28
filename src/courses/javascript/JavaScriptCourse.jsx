import React from 'react';
import { Link } from 'react-router-dom';

const JavaScriptCourse = () => {
  return <CourseOverview />;
};

const CourseOverview = () => (
  <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">Aperçu du Cours JavaScript</h1>
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
      <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
        Bienvenue dans notre cours JavaScript complet ! Ce cours vous mènera du niveau débutant au niveau intermédiaire.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Ce que vous apprendrez :</h3>
          <ul className="space-y-2 text-sm sm:text-base text-gray-600">
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Fondamentaux de JavaScript</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Variables et types de données</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Fonctions et portée</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Travail avec les tableaux et objets</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Manipulation du DOM</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Détails du Cours :</h3>
          <ul className="space-y-2 text-sm sm:text-base text-gray-600">
            <li><strong>Durée :</strong> 5 leçons</li>
            <li><strong>Niveau :</strong> Débutant à Intermédiaire</li>
            <li><strong>Prérequis :</strong> Compétences informatiques de base</li>
            <li><strong>Format :</strong> Leçons interactives</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <Link
          to="/programmation/javascript/lesson1"
          className="inline-block bg-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-sm sm:text-base"
        >
          Commencer avec la Leçon 1
        </Link>
      </div>
    </div>
  </div>
);

export default JavaScriptCourse;
