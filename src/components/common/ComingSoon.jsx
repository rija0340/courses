import React from 'react';

const ComingSoon = ({ lesson }) => (
  <div className="max-w-4xl">
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 text-center">
      <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🚧</div>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{lesson}</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Cette leçon arrive bientôt !</p>
      <p className="text-sm sm:text-base text-gray-500">Nous travaillons dur pour créer un contenu formidable pour vous.</p>
    </div>
  </div>
);

export default ComingSoon;
