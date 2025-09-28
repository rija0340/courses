import React from 'react';

const EnglishLesson2 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            📘 Lesson 2 - parts of speech (Ny Sokajin-teny)
          </h1>
          <div className="w-20 h-1 bg-blue-500 rounded-full mt-2"></div>
        </header>

        {/* Introduction */}
        <section className="mb-6 sm:mb-8">
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Alohan’ny ianarana mamorona fahezanteny (sentence) dia tsy maintsy mahay vocabulaire aloha, misy ireo vocabulaire tsotratsotra azo anombohana azy, ka itako fa mahamora ny fianarana azy ny fanasokajiana azy ireo , izay ilaina amin’ny tohin’ny fianarana rehetra.
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Ny sokajin-teny dia misy 09 ao amin’ny Fitsipi-pitenenana Anglisy
          </p>
        </section>

        {/* 1st Part of Speech - Noun */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">1️⃣</span>
            Noun
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Anaran’olona, biby, toerana, na zavatra – izy no anaran’ny zavatra)
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <p className="text-base sm:text-lg text-blue-800 mb-3 sm:mb-4">
              Examples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">dog 🐶</span> (alika)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Ali</span> (Ali)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">school 🏫</span> (sekoly)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">water 💧</span> (rano)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">book 📖</span> (boky) 🎤
              </div>
            </div>
          </div>
        </section>

        {/* 2nd Part of Speech - Verb */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">2️⃣</span>
            Verb
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Teny mampiseho asa na toe-javatra)
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <p className="text-base sm:text-lg text-blue-800 mb-3 sm:mb-4">
              Examples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">run 🏃</span> (mihazakazaka)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">eat 🍕</span> (mihinana)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">play 🎮</span> (milalao)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">is / are 👌</span> (dia)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">have 🤲</span> (manana)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">like ❤️</span> (tia)
              </div>
            </div>
          </div>
        </section>

        {/* 3rd Part of Speech - Adjective */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">3️⃣</span>
            Adjective
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Teny mamaritra anarana – mampiseho endrika, loko, na toetra)
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <p className="text-base sm:text-lg text-blue-800 mb-3 sm:mb-4">
              Examples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">red 🟥</span> (mena)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">big 📏</span> (lehibe)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">happy 😊</span> (faly)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">cold ❄️</span> (mangatsiaka)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">soft 🧸</span> (malemy)
              </div>
            </div>
          </div>
        </section>

        {/* 4th Part of Speech - Adverb */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">4️⃣</span>
            Adverb
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Teny mamaritra matoanteny – mampiseho hoe ahoana, rahoviana, na aiza)
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed italic">
            👉 "I tell HOW, WHEN, or WHERE the verb happens!"
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <p className="text-base sm:text-lg text-blue-800 mb-3 sm:mb-4">
              Examples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">quickly 🏃‍♂️💨</span> (haingana)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">slowly 🐢</span> (miadana)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">happily 😄</span> (amim-pifaliana)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">today 📅</span> (androany)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">here 📍</span> (eto)
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm sm:text-base text-yellow-700">
                <span className="font-bold">🎯 Example:</span><br />
                He runs quickly → Mihazakazaka haingana izy<br />
                She is here → Eto izy
              </p>
            </div>
          </div>
        </section>

        {/* 5th Part of Speech - Pronoun */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">5️⃣</span>
            Pronoun
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Solon-anarana – manolo anarana mba tsy hamerimberenana azy)
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed italic">
            👉 "I replace a noun so we don't repeat it!"
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <p className="text-base sm:text-lg text-blue-800 mb-3 sm:mb-4">
              Examples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">I</span> (izaho)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">you</span> (ianao)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">he</span> (izy (l.))
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">she</span> (izy (v.))
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">it</span> (izy)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">we</span> (isika)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">they</span> (izy ireo)
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm sm:text-base text-yellow-700">
                <span className="font-bold">🎯 Example:</span><br />
                "Lina likes apples." → "She likes apples." (Lina soloina She)
              </p>
            </div>
          </div>
        </section>

        {/* 6th Part of Speech - Preposition */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">6️⃣</span>
            Preposition
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Teny mampiseho toerana na fotoana – mampiseho aiza na rahoviana)
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed italic">
            👉 "I show position: where or when something is!"
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <p className="text-base sm:text-lg text-blue-800 mb-3 sm:mb-4">
              Examples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">in 📦</span> (ao anatiny)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">on 🪑</span> (eo ambonin'ny)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">under 🛏️</span> (eo ambanin'ny)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">next to 🚶‍♂️🚶‍♀️</span> (eo akaikin'ny)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">behind 🚗</span> (ao aorian'ny)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">at ⏰</span> (amin'ny)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">to ➡️</span> (mankany)
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm sm:text-base text-yellow-700">
                <span className="font-bold">🎯 Example:</span><br />
                The cat is on the box → Ilay saka dia eo ambonin'ny boaty<br />
                The book is under the table → Ilay boky dia eo ambanin'ny latabatra
              </p>
            </div>
          </div>
        </section>

        {/* 7th Part of Speech - Conjunction */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">7️⃣</span>
            Conjunction
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Mpanjohy teny – mampijohy teny na fehezanteny)
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed italic">
            👉 "I join words or sentences!"
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <p className="text-base sm:text-lg text-blue-800 mb-3 sm:mb-4">
              Examples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">and ➕</span> (sy)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">but ❌</span> (fa)
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">or ➰</span> (na)
              </div>
            </div>
            
            <div className="mt-4 bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm sm:text-base text-yellow-700">
                <span className="font-bold">🎯 Example:</span><br />
                I like apples and bananas → Tia paoma sy akondro aho<br />
                I like tea but not coffee → Tia dite fa tsy kafe aho<br />
                Tea or coffee? → Dite na kafe?
              </p>
            </div>
          </div>
        </section>

        {/* 8th Part of Speech - Article/Determiner */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">8️⃣</span>
            Article / Determiner
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Mpanondro – mampiseho hoe zavatra tokana na manokana)
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed italic">
            👉 "I come before a noun to give more info!"
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Miditra alohan’ny anarana aho mba hanomezana fanazavana fanampiny!)
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200 mb-4">
            <div className="mb-3">
              <span className="font-bold text-gray-800">a / an</span> → one thing (not specific) (zavatra iray, tsy manokana)<br />
              <span className="text-gray-700">a dog 🐶 (alika iray) - an apple 🍎 (paoma iray – ampiasao an alohan’ny zanapeo: a, e, i, o, u)</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">the</span> → this one, we both know it (ity iray ity, fantatsika roa)<br />
              <span className="text-gray-700">Ex: the sun ☀️ (ny masoandro) - the teacher 👩‍🏫 (ilay mpampianatra)</span>
            </div>
          </div>
        </section>

        {/* 9th Part of Speech - Interjection */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">9️⃣</span>
            Interjection
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            (Tenim-pahatsiarovana – mampiseho fihetseham-po)
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed italic">
            👉 "I show how you feel — surprise, joy, pain, or even silence!"
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            They can stand alone — no grammar rules! 🎭
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹 1.</span>
              Joy / Happiness 🎉 (hafaliana)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Yay!</span> → Haha!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Yay! I won!</span> → Haha! Namonjy aho!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Wow!</span> → Azo!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Wow! Big dog!</span> → Azo! Hena be!
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹 2.</span>
              Surprise 😲 (fahatairana na fahagagana)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Oh!</span> → Ah!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Oh! I see!</span> → Ah! Mahita aho!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">What!</span> → Inona!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">What! No school?</span> → Inona! Tsy misy sekoly?
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹 3.</span>
              Pain 😖 (Ranomaso)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Ouch!</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Ouch! I fell!</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Ow!</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Ow! That hurts!</span> →
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹 4.</span>
              Disgust 🤢 (Fahakiviana)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Yuck!</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Yuck! Bad taste!</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Ew!</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Ew! Smelly sock!</span> →
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹 5.</span>
              Approval 👍 (Fankasitrahana)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Bravo!</span> → Bravo!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Bravo! Well done!</span> → Bravo!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Great!</span> → Mazoto!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Great! You can swim!</span> →
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹 6.</span>
              Attention 👋 ()
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Hey!</span> → He!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Hey! Come here!</span> → He! Azo eto!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Hi!</span> → Salama!
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Hi! My friend!</span> → Salama! Namako!
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹 7.</span>
              Anger 😡 (hatezarana)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Grr!</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Grr! I'm angry!</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Ugh!</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Ugh! Not again!</span> →
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🔹 8.</span>
              Thinking 🤔
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Hmm...</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Hmm... I don't know.</span> → Mmh... Tsy haiko
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Uh...</span> →
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800">Uh... what's your name?</span> →
              </div>
            </div>
          </div>
        </section>

        {/* Practice Time */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">✏️</span>
            Practice Time!
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                <span className="font-semibold">Identify the parts of speech:</span>
              </p>
              <ul className="space-y-2">
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">The</span> cat <span className="font-bold">runs</span> <span className="font-bold">quickly</span> in the <span className="font-bold">garden</span>.<br />
                  (Article: The, Noun: cat, Verb: runs, Adverb: quickly, Noun: garden)
                </li>
                <li className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold">I</span> <span className="font-bold">love</span> the <span className="font-bold">red</span> <span className="font-bold">apple</span> over <span className="font-bold">there</span>.<br />
                  (Pronoun: I, Verb: love, Adjective: red, Noun: apple, Adverb: there)
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
                  Now you know the 9 parts of speech and their functions.
                </p>
                <p className="text-base sm:text-lg text-green-700">
                  In the next lesson, you will learn how to make simple sentences using these parts of speech.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnglishLesson2;