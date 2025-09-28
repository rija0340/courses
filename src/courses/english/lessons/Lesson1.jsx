import React from 'react';

const EnglishLesson1 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            📘 Lesson 1: Ny Abidy & Feo Fototra
          </h1>
          <div className="w-20 h-1 bg-blue-500 rounded-full mt-2"></div>
        </header>

        {/* Introduction */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">❓</span>
            Inona no atao hoe Abidy?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            Ny abidy dia fitambarana litera.
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Ny teny anglisy dia mampiasa litera <strong className="text-blue-600 font-medium">26</strong> hanoratana teny rehetra.
          </p>
          
          {/* Alphabet grid */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
            <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 font-medium flex items-center">
              <span className="mr-2">👉</span>
              Ity ny abidy anglisy:
            </p>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-300 rounded-lg p-2 sm:p-3 text-center font-bold text-lg sm:text-xl text-gray-800 shadow-sm"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <p className="text-base sm:text-lg text-blue-800 mb-3 sm:mb-4">
              Ampiasaintsika ireo litera ireo hanamboarana teny, ohatra:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">cat</span> → C-A-T
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">dog</span> → D-O-G
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">red</span> → R-E-D
              </div>
            </div>
          </div>
        </section>

        {/* Letter Names Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">🔤</span>
            Anaran'ny Litera
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
            Ireto no anaran'ny litera anglisy:
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Litera</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Anarana (fomba fanonona)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { letter: 'A', name: '"ei"' },
                  { letter: 'B', name: '"bi"' },
                  { letter: 'C', name: '"si"' },
                  { letter: 'D', name: '"di"' },
                  { letter: 'E', name: '"i"' },
                  { letter: 'F', name: '"ef"' },
                  { letter: 'G', name: '"dji"' },
                  { letter: 'H', name: '"eitsh"' },
                  { letter: 'I', name: '"ai"' },
                  { letter: 'J', name: '"djei"' },
                  { letter: 'K', name: '"kei"' },
                  { letter: 'L', name: '"el"' },
                  { letter: 'M', name: '"em"' },
                  { letter: 'N', name: '"en"' },
                  { letter: 'O', name: '"ou"' },
                  { letter: 'P', name: '"pi"' },
                  { letter: 'Q', name: '"kiou"' },
                  { letter: 'R', name: '"ar"' },
                  { letter: 'S', name: '"es"' },
                  { letter: 'T', name: '"ti"' },
                  { letter: 'U', name: '"iou"' },
                  { letter: 'V', name: '"vi"' },
                  { letter: 'W', name: '"dabolyou"' },
                  { letter: 'X', name: '"eks"' },
                  { letter: 'Y', name: '"wai"' },
                  { letter: 'Z', name: '"zi" (na "zed" amin\'ny British English)' },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-800 font-bold text-lg">{item.letter}</td>
                    <td className="py-3 px-4 text-gray-700">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Letter Sounds Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">🔊</span>
            Feon'ny Litera
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            Ny litera dia mamoaka feo rehefa mamaky teny.
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
            Misy litera manana feo mihoatra ny iray.
          </p>

          {/* Consonant Sounds */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹</span>
              Feo mahazatra amin'ny Kônsônà (consonne)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Litera</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Feo</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Ohatra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { letter: 'B', sound: '"b"', example: 'boy' },
                    { letter: 'C', sound: '"k"', example: 'cat' },
                    { letter: 'C', sound: '"s"', example: 'city' },
                    { letter: 'D', sound: '"d"', example: 'dog' },
                    { letter: 'F', sound: '"f"', example: 'fish' },
                    { letter: 'G', sound: '"g"', example: 'go' },
                    { letter: 'G', sound: '"dj"', example: 'giraffe' },
                    { letter: 'H', sound: '"h"', example: 'house' },
                    { letter: 'L', sound: '"l"', example: 'love' },
                    { letter: 'M', sound: '"m"', example: 'man' },
                    { letter: 'N', sound: '"n"', example: 'nose' },
                    { letter: 'P', sound: '"p"', example: 'pen' },
                    { letter: 'R', sound: '"r"', example: 'red' },
                    { letter: 'S', sound: '"s"', example: 'sun' },
                    { letter: 'S', sound: '"z"', example: 'season' },
                    { letter: 'T', sound: '"t"', example: 'top' },
                    { letter: 'V', sound: '"v"', example: 'van' },
                    { letter: 'W', sound: '"w"', example: 'we' },
                    { letter: 'Y', sound: '"y"', example: 'yes' },
                    { letter: 'Z', sound: '"z"', example: 'zoo' },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 sm:px-4 text-gray-800 font-bold">{item.letter}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.sound}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vowel Sounds */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹</span>
              Feo mahazatra amin'ny Voyelle
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Litera</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Feo</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Ohatra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { letter: 'A', sound: '"a" (toy ny cat)', example: 'cat' },
                    { letter: 'E', sound: '"e" (toy ny bed)', example: 'bed' },
                    { letter: 'I', sound: '"i" (toy ny sit)', example: 'sit' },
                    { letter: 'O', sound: '"o" (toy ny hot)', example: 'hot' },
                    { letter: 'U', sound: '"a" (toy ny cup)', example: 'cup' },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 sm:px-4 text-gray-800 font-bold">{item.letter}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.sound}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Special Sound Combinations */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">🔤</span>
            Fitambaran'ny Litera manome feo manokana
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Misy litera miara-miasa ka mamoaka feo tokana.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Fitambaran-litera</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Feo</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Ohatra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { letters: 'sh', sound: '"sh"', example: 'ship, fish' },
                  { letters: 'ch', sound: '"tch"', example: 'chair, church' },
                  { letters: 'th (malefaka)', sound: '"th" (tsy misy feo)', example: 'think, bath' },
                  { letters: 'th (maneno)', sound: '"th" (maneno)', example: 'this, brother' },
                  { letters: 'oo (fohy)', sound: '"ou"', example: 'book, look' },
                  { letters: 'oo (lava)', sound: '"ouu"', example: 'food, moon' },
                  { letters: 'ai', sound: '"ei"', example: 'rain, day' },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 sm:px-4 text-gray-800 font-bold">{item.letters}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.sound}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Important Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔔</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-1">Tsarovy:</h3>
              <p className="text-base sm:text-lg text-yellow-700">
                Misy litera manana feo maro. Hianarantsika tsikelikely izany taty aoriana.
              </p>
            </div>
          </div>
        </div>

        {/* Practice Time */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">✏️</span>
            Practice Time!
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">Say the alphabet out loud:</span>
              </p>
              <p className="text-base sm:text-lg text-gray-800 font-mono bg-white p-3 rounded border border-gray-300">
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">Match the letter to a word:</span>
              </p>
              <ul className="space-y-2">
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">B</span> → ? (Answer: boy)
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">S</span> → ? (Answer: sun)
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">T</span> → ? (Answer: top)
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">What sound does the first letter make?</span>
              </p>
              <ul className="space-y-2">
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Cat</span> → /k/
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Fish</span> → /f/
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Jump</span> → /dʒ/
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">Which combination?</span>
              </p>
              <ul className="space-y-2">
                <li className="text-base sm:text-lg text-gray-700">
                  "ship" → <span className="font-bold">sh</span> /ʃ/
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  "chair" → <span className="font-bold">ch</span> /tʃ/
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  "this" → <span className="font-bold">th</span> /ð/
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-6 sm:mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2">Well done!</h3>
                <p className="text-base sm:text-lg text-green-700 mb-2">
                  Now you know the alphabet and some important sounds.
                </p>
                <p className="text-base sm:text-lg text-green-700">
                  In the next lesson, you will learn basic words like: cat, dog, run, red, I, you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnglishLesson1;