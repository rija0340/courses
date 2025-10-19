import React from 'react';

const TipBox = ({ children }) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 my-4 sm:my-6 rounded-r-lg w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start">
        <div className="text-xl sm:text-2xl mb-2 sm:mb-0 sm:mr-2 lg:mr-3 flex-shrink-0">💡</div>
        <div className="text-blue-800 text-sm sm:text-base break-words">{children}</div>
      </div>
    </div>
  );
};

const EnglishLesson3 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            🌟 <strong>Comment Construire des Phrases Anglaises – Étape par Étape</strong>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 italic mb-2">(Avec une Introduction Claire aux Parties du Discours)</p>
          <div className="w-20 h-1 bg-blue-500 rounded-full mt-2"></div>
        </header>

        {/* Introduction */}
        <section className="mb-6 sm:mb-8">
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Les phrases anglaises sont construites à partir de <strong className="text-blue-600 font-medium">différents types de mots</strong>, chacun ayant une fonction. 
            Ces types de mots sont appelés <strong className="text-blue-600 font-medium">parties du discours</strong> (ou classes de mots).
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Il existe 8 parties du discours principales, mais en tant que débutant, vous n'avez besoin de vous concentrer que sur 
            <strong className="text-blue-600 font-medium"> 5 essentielles</strong> au début :
          </p>
          
          {/* Parts of Speech Table */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part of Speech (Partie du Discours)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job (Rôle)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examples (Exemples)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Noun (Nom)</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Nomme une personne, un lieu, une chose ou une idée</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">dog, Maria, water, happiness</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Pronoun (Pronom)</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Remplace un nom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">I, you, he, she, it, we, they</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Verb (Verbe)</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Montre une action ou un état</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">run, eat, is, sleep, love</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Adjective (Adjectif)</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Décrit un nom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">big, red, happy, old</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Adverb (Adverbe)</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Décrit un verbe (ou un adjectif/adverbe)</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">quickly, very, yesterday, well</td>
                </tr>
              </tbody>
            </table>
          </div>

          <TipBox>
            <strong>💡 Tip:</strong> Les <strong>Déterminants</strong> (comme <em>the, a, my</em>) sont un petit groupe important qui précède les noms. 
            Nous les traiterons comme des aides pour les noms.
          </TipBox>
        </section>

        {/* Step 1: Simple Subject + Verb */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Étape 1 : La Phrase la Plus Simple – <strong>Sujet + Verbe (S + V)</strong>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Toute phrase anglaise complète a besoin :
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 text-base sm:text-lg mb-4">
            <li>D'un <strong>subject</strong> (qui ou de quoi parle la phrase) → généralement un <strong>nom</strong> ou un <strong>pronom</strong></li>
            <li>D'un <strong>verbe</strong> (ce que le sujet fait ou est)</li>
          </ul>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-4">
            <p className="text-green-800 font-semibold mb-3">🔹 <strong>Verbe = action</strong> (courir, chanter) <strong>ou état</strong> (être, sembler, se sentir)</p>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <span className="font-bold text-gray-800">Birds fly.</span> (Les oiseaux volent.)<br />
                → <span className="text-blue-600">Birds</span> = <strong className="text-blue-600">nom</strong> (sujet)<br />
                → <span className="text-purple-600">fly</span> = <strong className="text-purple-600">verbe</strong>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <span className="font-bold text-gray-800">She sings.</span> (Elle chante.)<br />
                → <span className="text-blue-600">She</span> = <strong className="text-blue-600">pronom</strong> (sujet)<br />
                → <span className="text-purple-600">sings</span> = <strong className="text-purple-600">verbe</strong>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <span className="font-bold text-gray-800">Water boils.</span> (L'eau bout.)<br />
                → <span className="text-blue-600">Water</span> = <strong className="text-blue-600">nom</strong><br />
                → <span className="text-purple-600">boils</span> = <strong className="text-purple-600">verbe</strong>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
            <p className="text-yellow-800 font-semibold mb-2">✅ C'est une phrase complète !</p>
            <p className="text-yellow-700">Aucun mot supplémentaire n'est nécessaire.</p>
          </div>

          <TipBox>
            <strong>💡 Tip:</strong> Les verbes comme <em>sleep</em> (dormir), <em>run</em> (courir) ou <em>laugh</em> (rire) n'ont pas besoin de complément d'objet. 
            On les appelle des <strong>verbes intransitifs</strong>.
          </TipBox>
        </section>

        {/* Step 2: Adding Object */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Étape 2 : Ajouter un Complément d'Objet – <strong>Sujet + Verbe + Objet (S + V + O)</strong>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Certains verbes ont besoin de quelque chose pour <strong>recevoir l'action</strong>. 
            C'est le <strong>complément d'objet</strong> (CO) — généralement un <strong>nom</strong>, un <strong>pronom</strong> ou un <strong>groupe nominal</strong>.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-4">
            <p className="text-green-800 font-semibold mb-3">🔹 <strong>Objet = qui ou quoi est affecté par le verbe</strong></p>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <span className="font-bold text-gray-800">I eat apples.</span> (Je mange des pommes.)<br />
                → <span className="text-blue-600">I</span> = pronom (sujet)<br />
                → <span className="text-purple-600">eat</span> = verbe<br />
                → <span className="text-green-600">apples</span> = <strong className="text-green-600">nom</strong> (objet)
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <span className="font-bold text-gray-800">She loves music.</span> (Elle aime la musique.)<br />
                → <span className="text-green-600">music</span> = <strong className="text-green-600">nom</strong> (objet)
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <span className="font-bold text-gray-800">He sees her.</span> (Il la voit.)<br />
                → <span className="text-green-600">her</span> = <strong className="text-green-600">pronom objet</strong> (PAS le pronom sujet <em>she</em>)
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4">
            <p className="text-blue-800 font-semibold mb-2">✅ <strong>Important</strong> :</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Certains verbes <strong>peuvent</strong> avoir un complément d'objet (<em>eat, drink, read</em> - manger, boire, lire)</li>
              <li>Certains verbes <strong>doivent</strong> en avoir un (<em>need, love, buy</em> - avoir besoin de, aimer, acheter)</li>
              <li>Certains <strong>n'en prennent jamais</strong> (<em>sleep, arrive, die</em> - dormir, arriver, mourir)</li>
            </ul>
          </div>

          <TipBox>
            <strong>💡 Tip:</strong> Les verbes qui prennent un complément d'objet sont appelés <strong>verbes transitifs</strong>.
          </TipBox>
        </section>

        {/* Step 3: What Can Be a Subject */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Étape 3 : Qu'est-ce qui Peut Être un <strong>Sujet</strong> ? (Utilisation des Parties du Discours)
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Le sujet est construit à partir de <strong>noms et de leurs aides</strong> :
          </p>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type (Type)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part of Speech Breakdown (Analyse des Parties du Discours)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example (Exemple)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Nom simple</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Nom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900"><span className="font-bold">Dogs</span> (Les chiens) bark (aboient).</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Pronom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Pronom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900"><span className="font-bold">He</span> (Il) runs (court).</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Gérondif</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Verbe + <em>-ing</em> agissant comme un <strong>nom</strong></td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900"><span className="font-bold">Swimming</span> (Nager) is fun (est amusant).</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Groupe nominal</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Déterminant + (Adjectif) + Nom + (supplémentaire)</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900"><span className="font-bold">The big dog</span> (Le grand chien) barks (aboie).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mt-4">
            <h3 className="font-semibold text-gray-800 mb-3">🔍 À l'intérieur d'un groupe nominal :</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Déterminant</strong> : <em>The, a, my</em> → nous dit <em>lequel</em> ou <em>à qui</em></li>
              <li><strong>Adjectif</strong> : <em>big, calm, red</em> → décrit le nom</li>
              <li><strong>Nom</strong> : le mot principal (ex. <em>chien, sœur, thé</em>)</li>
              <li><strong>Information supplémentaire</strong> : locutions prépositionnelles comme <em>of tea</em> (de thé), <em>from Paris</em> (de Paris)</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mt-4">
            <p className="text-blue-800 font-semibold mb-2">🧱 Modèle :</p>
            <p className="text-blue-700"><strong>[Déterminant] + [Adjectif(s)] + NOM + [détails facultatifs]</strong></p>
          </div>
        </section>

        {/* Step 4: What Can Be an Object */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Étape 4 : Qu'est-ce qui Peut Être un <strong>Objet</strong> ?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Le complément d'objet utilise les mêmes parties du discours que le sujet — mais avec des <strong>pronoms objets</strong> :
          </p>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type (Type)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part of Speech (Partie du Discours)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example (Exemple)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Nom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500"><strong className="text-green-600">Nom</strong></td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">I drink <span className="font-bold">water</span> (Je bois de <em>l'eau</em>).</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Pronom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500"><strong className="text-green-600">Pronom objet</strong></td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">She helps <span className="font-bold">me</span> (Elle <em>m'</em>aide).</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Groupe nominal</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Déterminant + Adjectif + Nom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">He bought <span className="font-bold">a red car</span> (Il a acheté <em>une voiture rouge</em>).</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Gérondif</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500"><strong className="text-green-600">Verbe en -ing comme nom</strong></td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">She enjoys <span className="font-bold">dancing</span> (Elle aime <em>danser</em>).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mt-4">
            <p className="text-red-800 font-semibold mb-2">⚠️ Utilisez les <strong>pronoms objets</strong> :</p>
            <p className="text-red-700"><strong>me, you, him, her, it, us, them</strong> (moi/m', toi/t', lui/le/l', elle/la/l', il/le/l', nous/nous, eux/les)</p>
            <p className="text-red-700 mt-2">❌ Jamais : <em>He sees she.</em> → ✅ <em>He sees her.</em> (Il la voit.)</p>
          </div>
        </section>

        {/* Step 5: Adding Details with Adjectives and Adverbs */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Étape 5 : Ajouter des Détails avec les <strong>Adjectifs</strong> et les <strong>Adverbes</strong>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Maintenant, enrichissez votre phrase en utilisant deux autres parties du discours :
          </p>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold text-blue-800 mb-3">🔸 <strong>Adjectifs</strong> → décrivent des <strong>noms</strong> (dans le sujet ou l'objet)</h3>
              <ul className="space-y-2 text-blue-700">
                <li><span className="font-bold">The <em className="text-purple-600">big</em> dog</span> barks. (Le <em className="text-purple-600">grand</em> chien aboie.) → <em className="text-purple-600">big</em> = <strong className="text-purple-600">adjectif</strong> (décrit <em>dog</em>)</li>
                <li>I ate a <em className="text-purple-600">sweet</em> apple. (J'ai mangé une pomme <em className="text-purple-600">douce</em>.) → <em className="text-purple-600">sweet</em> = <strong className="text-purple-600">adjectif</strong></li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold text-purple-800 mb-3">🔸 <strong>Adverbes</strong> → décrivent des <strong>verbes</strong> (comment ? quand ? où ?)</h3>
              <ul className="space-y-2 text-purple-700">
                <li>She sings <em className="text-green-600">loudly</em>. (Elle chante <em className="text-green-600">fort</em>.) → <em className="text-green-600">loudly</em> = <strong className="text-green-600">adverbe</strong> (comment chante-t-elle ?)</li>
                <li>They arrived <em className="text-green-600">yesterday</em>. (Ils sont arrivés <em className="text-green-600">hier</em>.) → <em className="text-green-600">yesterday</em> = <strong className="text-green-600">adverbe</strong> (quand ?)</li>
                <li>He walks <em className="text-green-600">very slowly</em>. (Il marche <em className="text-green-600">très lentement</em>.) → <em className="text-green-600">very</em> (adverbe) modifie <em className="text-green-600">slowly</em> (également adverbe)</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mt-4">
            <h3 className="font-semibold text-gray-800 mb-3">📝 Rappelez-vous :</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Adjectif</strong> → répond à : <em>Quel genre ? Lequel ? Combien ?</em> → modifie les <strong>noms</strong></li>
              <li><strong>Adverbe</strong> → répond à : <em>Comment ? Quand ? Où ? À quelle fréquence ?</em> → modifie les <strong>verbes, les adjectifs ou d'autres adverbes</strong></li>
            </ul>
          </div>
        </section>

        {/* Step 6: Complete Example */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Étape 6 : Exemple Complet – Toutes les Parties Fonctionnent Ensemble
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Construisons :<br />
            <strong>"My calm sister drinks green tea quietly."</strong><br />
            <strong>"(Ma sœur calme boit du thé vert tranquillement.)"</strong>
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Word (Mot)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part of Speech (Partie du Discours)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role (Rôle)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">My</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Déterminant (possessif)</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Montre la possession</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">calm</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Adjectif</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Décrit <em>sister</em> (sœur)</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">sister</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Nom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Tête du sujet</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">drinks</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Verbe</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Action principale</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">green</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Adjectif</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Décrit <em>tea</em> (thé)</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">tea</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Nom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Complément d'Objet</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">quietly</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Adverbe</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Décrit <em>comment</em> elle boit</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
            <ul className="space-y-2 text-green-700">
              <li>✅ Sujet = <em>My calm sister</em> (groupe nominal)</li>
              <li>✅ Verbe = <em>drinks</em></li>
              <li>✅ Objet = <em>green tea</em> (groupe nominal)</li>
              <li>✅ Adverbe = <em>quietly</em></li>
            </ul>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">🧠</span>
            Résumé Final – Les Parties du Discours dans la Construction de Phrases
          </h2>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part of Speech (Partie du Discours)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role in Sentence (Rôle dans la Phrase)</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appears in… (Apparaît dans…)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Nom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Nomme les choses</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Sujet ou objet</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Pronom</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Remplace les noms</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Sujet (<em>I, he</em>) ou objet (<em>me, him</em>)</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Verbe</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Montre l'action/l'état</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500"><strong className="text-red-600">Toujours requis</strong> — le cœur de la phrase</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Adjectif</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Décrit les noms</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Avant les noms dans le sujet/objet</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Adverbe</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Décrit les verbes</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Habituellement à la fin ou près du verbe</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">Déterminant</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">Introduit les noms</td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500"><em>the, a, my, some</em> — avant les noms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Learning Tip */}
        <section className="mb-6 sm:mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <span className="mr-2">🌱</span>
              Conseil d'Apprentissage :
            </h3>
            <p className="text-blue-700 mb-3">
              Commencez petit. Maîtrisez <strong>S + V</strong>. Ajoutez ensuite <strong>une partie du discours à la fois</strong> :
            </p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li><em>Dogs bark.</em> (nom + verbe) (Les chiens aboient.)</li>
              <li><em>Big dogs bark.</em> (ajoutez <strong>adjectif</strong>) (De gros chiens aboient.)</li>
              <li><em>Big dogs bark loudly.</em> (ajoutez <strong>adverbe</strong>) (De gros chiens aboient fort.)</li>
              <li><em>The big dogs in the yard bark loudly.</em> (ajoutez <strong>déterminant + locution prépositionnelle</strong>) (Les gros chiens dans la cour aboient fort.)</li>
            </ul>
            <p className="text-blue-700 mt-3">
              Vous n'êtes pas seulement en train de mémoriser des mots, vous apprenez <strong>comment pense l'anglais</strong>.
            </p>
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
                  Vous savez maintenant construire des phrases anglaises étape par étape en utilisant différentes parties du discours.
                </p>
                <p className="text-base sm:text-lg text-green-700">
                  Dans la prochaine leçon, vous apprendrez des structures de phrases plus complexes et comment différents modèles de phrases fonctionnent ensemble.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnglishLesson3;