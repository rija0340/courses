import React from 'react';

const EnglishLesson1 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            📘 Lesson 1: Ny Abidy & Feo Fototra (Prononciation combinée: "le-son" → "lé-son")
          </h1>
          <p className="text-base sm:text-lg text-gray-600 italic mb-3">
            (Prononciation: "le-sôn" - "l" + "é" + "s" + "on") (Fanazavana: "lesson" = lesona, "first" = voalohany)
          </p>
          <div className="w-20 h-1 bg-blue-500 rounded-full mt-2"></div>
        </header>

        {/* Introduction */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">❓</span>
            Inona no atao hoe Abidy?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            Ny abidy dia fitambarana litera. (Prononciation: "ah-bid" - a-bi-dy)
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Ny teny anglisy dia mampiasa litera <strong className="text-blue-600 font-medium">26</strong> hanoratana teny rehetra. (Prononciation combinée: "teny anglisy" → "tên-ny an-ghli-si")
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
            <p className="text-sm sm:text-base text-gray-600 mt-3">
              <em>Fanampin'ny prononciation: "English alphabet" → "Eng-lish al-pha-bet" (Prononciation combinée)</em>
            </p>
          </div>

          {/* Examples */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <p className="text-base sm:text-lg text-blue-800 mb-3 sm:mb-4">
              Ampiasaintsika ireo litera ireo hanamboarana teny, ohatra:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">cat</span> → C-A-T (prononcé "ka-t" - /kæt/)<br />
                <span className="text-sm text-gray-600">(Prononciation combinée: "ca" → "ka", "t" → "t")</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">dog</span> → D-O-G (prononcé "do-g" - /dɔg/)<br />
                <span className="text-sm text-gray-600">(Prononciation combinée: "do" → "do", "g" → "g")</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">red</span> → R-E-D (prononcé "re-d" - /rɛd/)<br />
                <span className="text-sm text-gray-600">(Prononciation combinée: "re" → "re", "d" → "d")</span>
              </div>
            </div>
          </div>
        </section>

        {/* Letter Names Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">🔤</span>
            Anaran'ny Litera (Letter Names)
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
            Ireto no anaran'ny litera anglisy: (Prononciation combinée: "anaran'ny" → "ah-nah-ran-ny")
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Litera</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Anarana (fomba fanonona)</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Prononciation IPA</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Fanampin'ny Malagasy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { letter: 'A', name: '"ei" (prononcé "èi")', ipa: '/eɪ/', malagasy: 'A (eo amin\'ny teny Malagasy: "ah")' },
                  { letter: 'B', name: '"bi" (prononcé "bi")', ipa: '/biː/', malagasy: 'B (eo amin\'ny teny Malagasy: "be")' },
                  { letter: 'C', name: '"si" (prononcé "si")', ipa: '/siː/', malagasy: 'C (eo amin\'ny teny Malagasy: "ce")' },
                  { letter: 'D', name: '"di" (prononcé "di")', ipa: '/diː/', malagasy: 'D (eo amin\'ny teny Malagasy: "de")' },
                  { letter: 'E', name: '"i" (prononcé "i" - "i court")', ipa: '/iː/', malagasy: 'E (eo amin\'ny teny Malagasy: "eh")' },
                  { letter: 'F', name: '"ef" (prononcé "ef")', ipa: '/ef/', malagasy: 'F (eo amin\'ny teny Malagasy: "ef")' },
                  { letter: 'G', name: '"dji" (prononcé "ji")', ipa: '/dʒiː/', malagasy: 'G (eo amin\'ny teny Malagasy: "je")' },
                  { letter: 'H', name: '"eitsh" (prononcé "èitch")', ipa: '/eɪtʃ/', malagasy: 'H (eo amin\'ny teny Malagasy: "hach")' },
                  { letter: 'I', name: '"ai" (prononcé "ai")', ipa: '/aɪ/', malagasy: 'I (eo amin\'ny teny Malagasy: "ih")' },
                  { letter: 'J', name: '"djei" (prononcé "ji")', ipa: '/dʒeɪ/', malagasy: 'J (eo amin\'ny teny Malagasy: "ji")' },
                  { letter: 'K', name: '"kei" (prononcé "kèi")', ipa: '/keɪ/', malagasy: 'K (eo amin\'ny teny Malagasy: "ka")' },
                  { letter: 'L', name: '"el" (prononcé "el")', ipa: '/el/', malagasy: 'L (eo amin\'ny teny Malagasy: "el")' },
                  { letter: 'M', name: '"em" (prononcé "em")', ipa: '/em/', malagasy: 'M (eo amin\'ny teny Malagasy: "em")' },
                  { letter: 'N', name: '"en" (prononcé "en")', ipa: '/en/', malagasy: 'N (eo amin\'ny teny Malagasy: "en")' },
                  { letter: 'O', name: '"ou" (prononcé "ou")', ipa: '/oʊ/', malagasy: 'O (eo amin\'ny teny Malagasy: "oh")' },
                  { letter: 'P', name: '"pi" (prononcé "pi")', ipa: '/piː/', malagasy: 'P (eo amin\'ny teny Malagasy: "pe")' },
                  { letter: 'Q', name: '"kiou" (prononcé "kiou")', ipa: '/kjuː/', malagasy: 'Q (eo amin\'ny teny Malagasy: "ku")' },
                  { letter: 'R', name: '"ar" (prononcé "ar")', ipa: '/ɑːr/', malagasy: 'R (eo amin\'ny teny Malagasy: "er")' },
                  { letter: 'S', name: '"es" (prononcé "es")', ipa: '/es/', malagasy: 'S (eo amin\'ny teny Malagasy: "es")' },
                  { letter: 'T', name: '"ti" (prononcé "ti")', ipa: '/tiː/', malagasy: 'T (eo amin\'ny teny Malagasy: "te")' },
                  { letter: 'U', name: '"iou" (prononcé "iou")', ipa: '/juː/', malagasy: 'U (eo amin\'ny teny Malagasy: "u")' },
                  { letter: 'V', name: '"vi" (prononcé "vi")', ipa: '/viː/', malagasy: 'V (eo amin\'ny teny Malagasy: "ve")' },
                  { letter: 'W', name: '"dabolyou" (prononcé "dab-bl-you", "double U")', ipa: '/ˈdʌbəl.juː/', malagasy: 'W (eo amin\'ny teny Malagasy: "w" - "dabolio")' },
                  { letter: 'X', name: '"eks" (prononcé "eks")', ipa: '/eks/', malagasy: 'X (eo amin\'ny teny Malagasy: "ix")' },
                  { letter: 'Y', name: '"wai" (prononcé "wai")', ipa: '/waɪ/', malagasy: 'Y (eo amin\'ny teny Malagasy: "y" - "waie")' },
                  { letter: 'Z', name: '"zi" (prononcé "zi", "zed" amin\'ny British English)', ipa: '/ziː/ (/zed/ BR)', malagasy: 'Z (eo amin\'ny teny Malagasy: "zeta")' },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-800 font-bold text-lg">{item.letter}</td>
                    <td className="py-3 px-4 text-gray-700">{item.name}</td>
                    <td className="py-3 px-4 text-gray-700">{item.ipa}</td>
                    <td className="py-3 px-4 text-gray-700">{item.malagasy}</td>
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
              Feo mahazatra amin'ny Kônsônà (consonne) - Prononciation combinée: "con-sonant" → "kon-son-ant"
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Litera</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Feo</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">IPA</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Ohatra</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Fampahalalam-baovao (Malagasy)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { letter: 'B', sound: '"b" (prononcé "bè")', ipa: '/b/', example: 'boy (prononcé "boi" - /bɔɪ/)', malagasy: 'be (feo miteny B)' },
                    { letter: 'C', sound: '"k" (prononcé "kè")', ipa: '/k/', example: 'cat (prononcé "ka-t" - /kæt/)', malagasy: 'ke (feo manao "k")' },
                    { letter: 'C', sound: '"s" (prononcé "ès")', ipa: '/s/', example: 'city (prononcé "si-ti" - /ˈsɪti/)', malagasy: 'se (feo manao "s" amin\'ny teny "city")' },
                    { letter: 'D', sound: '"d" (prononcé "dè")', ipa: '/d/', example: 'dog (prononcé "do-g" - /dɔɡ/)', malagasy: 'de (feo miteny D)' },
                    { letter: 'F', sound: '"f" (prononcé "èf")', ipa: '/f/', example: 'fish (prononcé "fi-sh" - /fɪʃ/)', malagasy: 'ef (feo manao "f")' },
                    { letter: 'G', sound: '"g" (prononcé "djè")', ipa: '/ɡ/', example: 'go (prononcé "go" - /ɡoʊ/)', malagasy: 'je (feo manao "g")' },
                    { letter: 'G', sound: '"dj" (prononcé "dji")', ipa: '/dʒ/', example: 'giraffe (prononcé "djie-rafe" - /dʒɪˈræf/)', malagasy: 'je (feo "dji" amin\'ny teny "giraffe")' },
                    { letter: 'H', sound: '"h" (prononcé "ach")', ipa: '/h/', example: 'house (prononcé "haos" - /haʊs/)', malagasy: 'hach (feo manao "h")' },
                    { letter: 'L', sound: '"l" (prononcé "el")', ipa: '/l/', example: 'love (prononcé "lov" - /lʌv/)', malagasy: 'el (feo miteny L)' },
                    { letter: 'M', sound: '"m" (prononcé "em")', ipa: '/m/', example: 'man (prononcé "maen" - /mæn/)', malagasy: 'em (feo manao "m")' },
                    { letter: 'N', sound: '"n" (prononcé "en")', ipa: '/n/', example: 'nose (prononcé "noz" - /noʊz/)', malagasy: 'en (feo manao "n")' },
                    { letter: 'P', sound: '"p" (prononcé "pé")', ipa: '/p/', example: 'pen (prononcé "pen" - /pɛn/)', malagasy: 'pe (feo manao "p")' },
                    { letter: 'R', sound: '"r" (prononcé "er")', ipa: '/r/', example: 'red (prononcé "red" - /rɛd/)', malagasy: 'er (feo miteny R - toa "er" am-bavany)' },
                    { letter: 'S', sound: '"s" (prononcé "ès")', ipa: '/s/', example: 'sun (prononcé "san" - /sʌn/)', malagasy: 'es (feo manao "s")' },
                    { letter: 'S', sound: '"z" (prononcé "èz")', ipa: '/z/', example: 'season (prononcé "sizan" - /ˈsiːzən/)', malagasy: 'ez (feo manao "z" amin\'ny teny "season")' },
                    { letter: 'T', sound: '"t" (prononcé "té")', ipa: '/t/', example: 'top (prononcé "top" - /tɑːp/)', malagasy: 'te (feo manao "t")' },
                    { letter: 'V', sound: '"v" (prononcé "vé")', ipa: '/v/', example: 'van (prononcé "vaen" - /væn/)', malagasy: 've (feo manao "v")' },
                    { letter: 'W', sound: '"w" (prononcé "dabolioo")', ipa: '/w/', example: 'we (prononcé "wi" - /wiː/)', malagasy: 'w (feo manao "w")' },
                    { letter: 'Y', sound: '"y" (prononcé "wai")', ipa: '/j/', example: 'yes (prononcé "yèz" - /jɛs/)', malagasy: 'ya (feo manao "y")' },
                    { letter: 'Z', sound: '"z" (prononcé "zèt")', ipa: '/z/', example: 'zoo (prononcé "zou" - /zuː/)', malagasy: 'zeta (feo manao "z")' },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 sm:px-4 text-gray-800 font-bold">{item.letter}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.sound}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.ipa}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.example}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.malagasy}</td>
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
              Feo mahazatra amin'ny Voyelle - Prononciation combinée: "vo-wel" → "vo-wel"
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Litera</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Karazana Feo</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">IPA</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Ohatra</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Fampahalalam-baovao (Malagasy)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { letter: 'A/a', sound: '"a" court / "a" long', ipa: '/æ/ /ɑː/', example: 'cat / father (prononcé "ka-t" / "fa-dher")', malagasy: '"a" fohy / "a" lava (toerana samihafa: cat=/æ/, father=/ɑː/)' },
                    { letter: 'E/e', sound: '"e" court / "e" long', ipa: '/ɛ/ /iː/', example: 'bed / me (prononcé "bed" / "mi")', malagasy: '"e" fohy / "e" lava (toerana samihafa: bed=/ɛ/, me=/iː/)' },
                    { letter: 'I/i', sound: '"i" court / "i" long', ipa: '/ɪ/ /aɪ/', example: 'sit / kite (prononcé "sit" / "kait")', malagasy: '"i" fohy / "i" lava (toerana samihafa: sit=/ɪ/, kite=/aɪ/)' },
                    { letter: 'O/o', sound: '"o" court / "o" long', ipa: '/ɒ//ɑː/ /oʊ/', example: 'hot / go (prononcé "hot" / "gou")', malagasy: '"o" fohy / "o" lava (toerana samihafa: hot=/ɒ/, go=/oʊ/)' },
                    { letter: 'U/u', sound: '"u" court / "u" long', ipa: '/ʌ/ /uː/', example: 'cup / blue (prononcé "kap" / "blou")', malagasy: '"u" fohy / "u" lava (toerana samihafa: cup=/ʌ/, blue=/uː/)' },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 sm:px-4 text-gray-800 font-bold">{item.letter}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.sound}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.ipa}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.example}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-700">{item.malagasy}</td>
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
            Fitambaran'ny Litera manome feo manokana (Digraphs) - Prononciation combinée: "di-graphs" → "di-gra-f"
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Misy fitambarana litera miara-miasa ka mamoaka feo tokana. Ireo dia antsoina hoe "digraphs" (prononcé "daigrèf").
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Fitambaran-litera</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Feo</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">IPA</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Ohatra</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Fampahalalam-baovao (Malagasy)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { letters: 'sh', sound: '"sh" (prononcé "èch")', ipa: '/ʃ/', example: 'ship (prononcé "chip" - /ʃɪp/), fish (prononcé "fich" - /fɪʃ/)', malagasy: '"sh" (feo manao "ch" toy "ch" amin\'ny teny Malagasy)' },
                  { letters: 'ch', sound: '"tch" (prononcé "tch")', ipa: '/tʃ/', example: 'chair (prononcé "tcher" - /tʃer/), church (prononcé "tcherch" - /tʃɜːrtʃ/)', malagasy: '"ch" (feo manao "ch" - toa "tch")' },
                  { letters: 'th (malefaka)', sound: '"th" (prononcé "th", feo tsy misy volana)', ipa: '/θ/', example: 'think (prononcé "cink" - /θɪŋk/), bath (prononcé "baeth" - /bæθ/)', malagasy: '"th" (feo tsy misy volana, toa "s" amin\'ny teny Malagasy)' },
                  { letters: 'th (maneno)', sound: '"th" (prononcé "th", feo maneno)', ipa: '/ð/', example: 'this (prononcé "dhis" - /ðɪs/), brother (prononcé "bra-dher" - /ˈbrʌðər/)', malagasy: '"th" (feo maneno, toa "z" amin\'ny teny Malagasy)' },
                  { letters: 'oo (fohy)', sound: '"ou" (prononcé "ou", "oo" fohy)', ipa: '/ʊ/', example: 'book (prononcé "bok" - /bʊk/), look (prononcé "lok" - /lʊk/)', malagasy: '"oo" (feo fohy, toa "u" amin\'ny teny Malagasy)' },
                  { letters: 'oo (lava)', sound: '"ouu" (prononcé "ou", "oo" lava)', ipa: '/uː/', example: 'food (prononcé "fiid" - /fuːd/), moon (prononcé "muun" - /muːn/)', malagasy: '"oo" (feo lava, toa "oo" amin\'ny teny Malagasy)' },
                  { letters: 'ai', sound: '"ei" (prononcé "èi")', ipa: '/eɪ/', example: 'rain (prononcé "rein" - /reɪn/), day (prononcé "dei" - /deɪ/)', malagasy: '"ai" (feo manao "èi", toa "è" amin\'ny teny Malagasy)' },
                  { letters: 'oa', sound: '"ou" (prononcé "ou")', ipa: '/oʊ/', example: 'boat (prononcé "bout" - /boʊt/), road (prononcé "roud" - /roʊd/)', malagasy: '"oa" (feo manao "ou", toa "o" amin\'ny teny Malagasy)' },
                  { letters: 'ee', sound: '"i" (prononcé "i", "ee" lava)', ipa: '/iː/', example: 'see (prononcé "si" - /siː/), tree (prononcé "tri" - /triː/)', malagasy: '"ee" (feo lava, toa "e" amin\'ny teny Malagasy)' },
                  { letters: 'ea', sound: '"i" (prononcé "i", "ea" lava)', ipa: '/iː/', example: 'sea (prononcé "si" - /siː/), tea (prononcé "ti" - /tiː/)', malagasy: '"ea" (feo manao "i", toa "e" amin\'ny teny Malagasy)' },
                  { letters: 'ue', sound: '"ou" (prononcé "ou", "ue" lava)', ipa: '/juː/', example: 'blue (prononcé "blou" - /bluː/), due (prononcé "dou" - /djuː/)', malagasy: '"ue" (feo manao "ou", toa "u" amin\'ny teny Malagasy)' },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 sm:px-4 text-gray-800 font-bold">{item.letters}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.sound}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.ipa}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.example}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.malagasy}</td>
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
              <h3 className="text-lg font-semibold text-yellow-800 mb-1">Tsarovy: (Prononciation: "sarovy" - "sa-ro-vy")</h3>
              <p className="text-base sm:text-lg text-yellow-700">
                Misy litera manana feo maro. Hianarantsika tsikelikely izany taty aoriana. (Prononciation combinée: "feo ma-ro" → "fé-o ma-ro")
              </p>
              <p className="text-base sm:text-lg text-yellow-700 mt-2">
                <strong>Fanampin'izay:</strong> Ny feo dia mety hisiana amin'ny maha "short" (fohy) sy "long" (lava). 
                Ohatra: "a" amin'ny "cat" (/æ/ - fohy) != "a" amin'ny "cake" (/eɪ/ - lava) 
                (Prononciation: "shot" sy "long" → "chot" sy "lon")
              </p>
            </div>
          </div>
        </div>

        {/* Practice Time */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">✏️</span>
            Practice Time! - Prononciation: "prak-tis taim" → "pra-k-tis teim"
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">Say the alphabet out loud:</span> (Raito ny abidy amin’ny vava)
              </p>
              <p className="text-base sm:text-lg text-gray-800 font-mono bg-white p-3 rounded border border-gray-300">
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <em>Fanampin'ny prononciation: A (/eɪ/), B (/biː/), C (/siː/), D (/diː/), E (/iː/), F (/ef/), G (/dʒiː/)</em>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">Match the letter to a word:</span> (Hampifanarina ny litera amin’ny teny)
              </p>
              <ul className="space-y-2">
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">B</span> → ? (Answer: boy /bɔɪ/ - "boi") (Valiny: bai)
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">S</span> → ? (Answer: sun /sʌn/ - "san") (Valiny: soli)
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">T</span> → ? (Answer: top /tɑːp/ - "top") (Valiny: ambony)
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">What sound does the first letter make?</span> (Inona no feon'ny litera voalohany?)
              </p>
              <ul className="space-y-2">
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Cat /kæt/</span> → /k/ (Prononcé "ka-t", feo: "k")
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Fish /fɪʃ/</span> → /f/ (Prononcé "fi-ch", feo: "f")
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Jump /dʒʌmp/</span> → /dʒ/ (Prononcé "djamp", feo: "dj")
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">Which combination?</span> (Inona no fitambarana?)
              </p>
              <ul className="space-y-2">
                <li className="text-base sm:text-lg text-gray-700">
                  "ship /ʃɪp/" → <span className="font-bold">sh</span> /ʃ/ (Prononcé "chip", fitambarana: "ch") 
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  "chair /tʃer/" → <span className="font-bold">ch</span> /tʃ/ (Prononcé "tcher", fitambarana: "ch") 
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  "this /ðɪs/" → <span className="font-bold">th</span> /ð/ (Prononcé "dhis", fitambarana: "th") 
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">Try pronouncing these words:</span> (Andramo amakiana ireo teny ireo)
              </p>
              <ul className="space-y-2">
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Cat /kæt/</span> → C-A-T ("ka-t", feo /kæ/)
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Dog /dɔg/</span> → D-O-G ("do-g", feo /dɔ/)
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Ship /ʃɪp/</span> → SH-I-P ("chip", feo /ʃ/)
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">Fish /fɪʃ/</span> → F-I-SH ("fich", feo /ʃ/)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Common Vocabulary with Malagasy Translations */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">📚</span>
            Teny tsotra miaraka amin'ny fandaharana - Basic Vocabulary with Pronunciation
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4">
            Ireo teny voalohany ampiasaina amin'ny teny anglisy, miaraka amin'ny prononciation sy fanazavana amin'ny teny Malagasy.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Teny Anglisy</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Prononciation</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">IPA</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Teny Malagasy</th>
                  <th className="py-3 px-3 sm:px-4 text-left text-gray-700 font-semibold border-b border-gray-200">Fanampin'ny Fampahalalam-baovao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { english: 'cat', pronunciation: 'kat', ipa: '/kæt/', malagasy: 'saka', note: 'Prononcé "ka-t", feo "a" fohy' },
                  { english: 'dog', pronunciation: 'doug', ipa: '/dɔɡ/', malagasy: 'alika', note: 'Prononcé "do-g", feo "o" fohy' },
                  { english: 'book', pronunciation: 'buk', ipa: '/bʊk/', malagasy: 'boky', note: 'Prononcé "boo-k", feo "oo" fohy' },
                  { english: 'man', pronunciation: 'man', ipa: '/mæn/', malagasy: 'nahy', note: 'Prononcé "man", feo "a" fohy' },
                  { english: 'woman', pronunciation: 'wou-maen', ipa: '/ˈwʊmən/', malagasy: 'vehivavy', note: 'Prononcé "wou-maen", feo "ou" fohy' },
                  { english: 'water', pronunciation: 'wo-ta', ipa: '/ˈwɔːtər/', malagasy: 'rano', note: 'Prononcé "wo-ta", feo "o" lava' },
                  { english: 'food', pronunciation: 'fiid', ipa: '/fuːd/', malagasy: 'sakafo', note: 'Prononcé "fiid", feo "oo" lava' },
                  { english: 'house', pronunciation: 'haous', ipa: '/haʊs/', malagasy: 'trano', note: 'Prononcé "haous", fitambarana "ou"' },
                  { english: 'sun', pronunciation: 'san', ipa: '/sʌn/', malagasy: 'masoandro', note: 'Prononcé "san", feo "u" fohy' },
                  { english: 'moon', pronunciation: 'muun', ipa: '/muːn/', malagasy: 'volana', note: 'Prononcé "muun", feo "oo" lava' },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 sm:px-4 text-gray-800 font-bold">{item.english}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.pronunciation}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.ipa}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.malagasy}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-6 sm:mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2">Well done! - Prononciation: "wel dôn" → "wel don"</h3>
                <p className="text-base sm:text-lg text-green-700 mb-2">
                  Now you know the alphabet and some important sounds. (Ankehitriny dia efa tana am-bidy kely ilay abidy sy ny feo sasany.)
                </p>
                <p className="text-base sm:text-lg text-green-700 mb-2">
                  Remember: English has 26 letters but many more sounds! (Tadioro: Misy litera 26 ny anglisy fa misy feo maro kokoa!)
                </p>
                <p className="text-base sm:text-lg text-green-700">
                  In the next lesson, you will learn basic words like: cat, dog, run, red, I, you. (Amin'ny lesona manaraka dia hisiana teny tsotra toy ny: cat, dog, run, red, I, you.)
                </p>
                
                <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
                  <h4 className="font-semibold text-green-800 mb-2">💡 Tips for learning:</h4>
                  <ul className="list-disc list-inside text-green-700 space-y-1">
                    <li>Practice saying the alphabet every day - "A B C D E F G..."</li>
                    <li>Listen to English pronunciation guides online</li>
                    <li>Try to hear the sounds in words you already know</li>
                    <li>Remember that one letter can have multiple sounds (example: "a" in "cat" vs "cake")</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnglishLesson1;