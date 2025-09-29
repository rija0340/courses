import React from 'react';
import CodeBlock from '../../components/SyntaxHighlighter';

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

const ExerciseBox = ({ children }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-300 p-3 sm:p-4 lg:p-6 my-4 sm:my-6 lg:my-8 rounded-lg w-full overflow-x-hidden">
      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-yellow-800 mb-2 sm:mb-3 lg:mb-4 flex items-center break-words">
        <span className="mr-2 text-lg sm:text-xl lg:text-2xl flex-shrink-0">🎯</span>
        <span>Exercice simple</span>
      </h3>
      <div className="text-yellow-900 text-sm sm:text-base break-words">{children}</div>
    </div>
  );
};

const Lesson1 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 1: Bases de JavaScript (Côté client)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Comprendre les fondamentaux de la syntaxe JavaScript pour écrire du code fonctionnel dans un navigateur.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-où-écrire-du-javascript">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Où écrire du JavaScript dans une page web ?</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Dans une balise <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">&lt;script&gt;</code> en HTML :</p>
          
          <CodeBlock language="html">
{`<!DOCTYPE html>
<html>
<head>
  <title>Ma page</title>
</head>
<body>
  <h1>Bonjour !</h1>
  <script>
    // Votre code JavaScript ici
    console.log("Bonjour depuis JS !");
  </script>
</body>
</html>`}
          </CodeBlock>
          <CodeBlock language="javascript" showLineNumbers={true} highlightLines="1">
            {`let sum = 10 + 5; // 15`}
          </CodeBlock>
          

          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Ou dans un fichier externe (recommandé) :</p>
          <CodeBlock language="html">{`<script src="script.js"></script>`}</CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Placez <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">&lt;script&gt;</code> juste avant la fermeture <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">&lt;/body&gt;</code> pour que le HTML se charge avant l'exécution JS.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-variables">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Variables</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Utilisées pour stocker des données.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">let</code> : variable modifiable (la plus couramment utilisée)</h4>
          <CodeBlock language="javascript">{`let age = 25;
age = 26; // allowed`}</CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">const</code> : variable constante (ne peut pas être réassignée)</h4>
          <CodeBlock language="javascript">{`const name = "Alice";
// name = "Bob"; → Erreur !`}</CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">var</code> : ancienne méthode (à éviter aujourd'hui)</h4>
          <div className="bg-green-50 border border-green-300 p-3 sm:p-4 rounded-lg">
            <strong className="text-green-800 text-sm sm:text-base">✅ Règle simple :</strong> <span className="text-sm sm:text-base">utilisez <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">const</code> par défaut, <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">let</code> si vous devez modifier la valeur.</span>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-types-de-données">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Types de données de base</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exemple</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">string</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">"Hello" or 'Hi'</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Texte</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">number</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">42, 3.14, -10</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Nombre entier ou décimal</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">boolean</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">true ou false</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Vrai / Faux</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">null</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">null</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Valeur intentionnellement vide</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">undefined</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">let x; → x est undefined</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Variable déclarée mais non initialisée</td>
                </tr>
              </tbody>
            </table>
          </div>

          <TipBox>
            <strong>💡 Astuce :</strong> utilisez <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">typeof</code> pour connaître le type :
            <CodeBlock language="javascript">{`console.log(typeof "text"); // "string"`}</CodeBlock>
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-opérateurs">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Opérateurs</h2>
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Arithmétiques : +, -, *, /, % (modulo)</h4>
          <CodeBlock language="javascript">{`let sum = 10 + 5; // 15`}</CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Comparaison : ==, ===, !=, !==, >, &lt;, etc.</h4>
          <CodeBlock language="javascript">{`5 === 5;   // true (égalité stricte : valeur + type)
5 == "5";  // true (mais à éviter → préférez ===)`}</CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Logiques : && (ET), || (OU), ! (NON)</h4>
          <CodeBlock language="javascript">{`true && false; // false
true || false; // true`}</CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-afficher-déboguer">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Affichage / Débogage</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base"><code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">console.log()</code> : affiche dans la console du navigateur (outil essentiel !)</p>
          <CodeBlock language="javascript">{`console.log("Ceci est un message");
console.log(age, name);`}</CodeBlock>
          <p className="text-gray-600 text-sm sm:text-base">Ouvrez la console avec F12 ou Ctrl+Shift+J (Chrome/Firefox).</p>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-bonnes-pratiques">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Bonnes Pratiques</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base">
            <li>Terminez vos lignes par ; (optionnel mais recommandé).</li>
            <li>Utilisez des noms de variables clairs : nombreUtilisateurs plutôt que n.</li>
            <li>Commentez avec // (une ligne) ou /* ... */ (plusieurs lignes).</li>
          </ul>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez un fichier HTML avec une balise <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">&lt;script&gt;</code>.</p>
          <p className="mb-2 sm:mb-3">Déclarez une variable <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">prenom</code> avec votre prénom (<code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">const</code>).</p>
          <p className="mb-2 sm:mb-3">Déclarez une variable <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">age</code> avec votre âge (<code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">let</code>).</p>
          <p className="mb-2 sm:mb-3">Affichez les deux dans la console avec <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">console.log</code>.</p>
          <p className="mb-2"><strong>✅ Résultat attendu dans la console :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">{`"Marie"
28`}</pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson1;