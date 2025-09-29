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
        <span>Exercice</span>
      </h3>
      <div className="text-yellow-900 text-sm sm:text-base break-words">{children}</div>
    </div>
  );
};

const Lesson6 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 6: Modules et Bonnes Pratiques</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Apprendre à organiser votre code JavaScript avec les modules et à suivre les meilleures pratiques de développement.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-modules-es6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Modules ES6</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les modules permettent d'organiser et de réutiliser le code dans plusieurs fichiers.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exportation (export) :</h4>
          <CodeBlock language="javascript">
{`// maths.js
// Export nommé
export function additionner(a, b) {
  return a + b;
}

export function soustraire(a, b) {
  return a - b;
}

// Export par défaut
export default function multiplier(a, b) {
  return a * b;
}

// Ou exporter des variables
export const PI = 3.14159;`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Importation (import) :</h4>
          <CodeBlock language="javascript">
{`// app.js
// Importer les exports nommés
import { additionner, soustraire } from './maths.js';

// Importer l'export par défaut
import multiplier from './maths.js';

// Importer tout
import * as maths from './maths.js';

// Utilisation
console.log(additionner(5, 3)); // 8
console.log(multiplier(4, 6)); // 24
console.log(maths.PI); // 3.14159`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-organisation-du-code">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Organisation du code</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Structurer son code pour le rendre lisible et maintenable.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Structure de projet type :</h4>
          <pre className="bg-gray-100 p-3 sm:p-4 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words my-3 sm:my-4">
{`mon-projet/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── pages/
│   │   ├── Home.js
│   │   └── About.js
│   └── index.js
├── public/
│   ├── index.html
│   └── style.css
└── package.json`}
          </pre>

          <TipBox>
            <strong>💡 Astuce :</strong> Organisez votre code par fonctionnalités ou par types (composants, utilitaires, pages) plutôt que par technologie.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-techniques-avancées">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Techniques de programmation avancées</h2>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Destructuration et paramètres rest :</h4>
          <CodeBlock language="javascript">
{`// Destructuration d'objets avec valeurs par défaut
function afficherUtilisateur({ nom, age = 18, ville = "Inconnue" } = {}) {
  console.log(nom + " a " + age + " ans et habite à " + ville);
}

afficherUtilisateur({ nom: "Alice", age: 25 });
// "Alice a 25 ans et habite à Inconnue"

// Paramètres rest
function somme(...nombres) {
  return nombres.reduce((acc, val) => acc + val, 0);
}

console.log(somme(1, 2, 3, 4)); // 10`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Paramètres de fonction avec déstructuration :</h4>
          <CodeBlock language="javascript">
{`// Ancienne approche
function creerUtilisateur(options) {
  const nom = options.nom || "Anonyme";
  const age = options.age || 0;
  // ...
}

// Nouvelle approche avec déstructuration
function creerUtilisateur({ nom = "Anonyme", age = 0, email } = {}) {
  return { nom, age, email };
}

// Appel
const utilisateur = creerUtilisateur({ nom: "Bob", email: "bob@example.com" });
console.log(utilisateur); // { nom: "Bob", age: 0, email: "bob@example.com" }`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-programmation-fonctionnelle">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Programmation fonctionnelle de base</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Utiliser des fonctions pures et des méthodes de tableau pour manipuler les données.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Fonctions pures et méthodes de tableau :</h4>
          <CodeBlock language="javascript">
{`// Données
const utilisateurs = [
  { nom: "Alice", age: 25, actif: true },
  { nom: "Bob", age: 30, actif: false },
  { nom: "Charlie", age: 35, actif: true }
];

// Ne pas modifier les données originales
// Filtrer, transformer, trier sans effets secondaires
const utilisateursActifs = utilisateurs
  .filter(u => u.actif)           // Filtrer
  .map(u => ({ ...u, age: u.age + 1 }))  // Transformer (immuabilité)
  .sort((a, b) => a.age - b.age);        // Trier

console.log(utilisateursActifs);`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-gestion-des-erreurs">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Gestion des erreurs</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Comment gérer les erreurs correctement dans votre code.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Try-catch pour les erreurs synchrones :</h4>
          <CodeBlock language="javascript">
{`function diviser(a, b) {
  if (b === 0) {
    throw new Error("Division par zéro impossible");
  }
  return a / b;
}

try {
  let resultat = diviser(10, 0);
} catch (erreur) {
  console.error("Erreur:", erreur.message);
  // Gérer l'erreur de manière appropriée
}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Gestion des erreurs asynchrones :</h4>
          <CodeBlock language="javascript">
{`// Avec les promesses
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(erreur => console.error('Erreur:', erreur));

// Avec async/await
async function recupererDonnees() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (erreur) {
    console.error('Erreur de récupération:', erreur);
    // Retourner une valeur par défaut ou relancer l'erreur
    throw erreur;
  }
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-outils-et-bonnes-pratiques">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Outils et bonnes pratiques</h2>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Linter et formateur de code :</h4>
          <CodeBlock language="bash">
{`# Installation d'ESLint et Prettier (dans un projet Node.js)
npm install --save-dev eslint prettier
npm install --save-dev eslint-config-prettier eslint-plugin-prettier

# Fichier .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  plugins: [
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error'
  }
};`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Bonnes pratiques générales :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Utilisez des noms de variables et fonctions descriptifs</li>
            <li>Commentez votre code quand nécessaire, mais priorisez la clarté du code</li>
            <li>Évitez les fonctions trop longues - divisez-les en fonctions plus petites</li>
            <li>Utilisez des constantes pour les valeurs fixes</li>
            <li>Préférez <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">const</code> à <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">let</code>, et <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">let</code> à <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">var</code></li>
            <li>Structurez votre code en modules réutilisables</li>
            <li>Testez votre code régulièrement</li>
          </ul>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez un module <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">validateurs.js</code> avec des fonctions pour valider :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Si un email est valide : <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">estEmailValide(email)</code></li>
            <li>Si un mot de passe est suffisamment fort : <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">estMotDePasseFort(mdp)</code></li>
            <li>Si un nombre est dans une plage : <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">estDansPlage(nombre, min, max)</code></li>
          </ul>
          <p className="mb-2 sm:mb-3">Importez et testez ces validateurs dans un autre fichier.</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <CodeBlock language="javascript">
{`import { estEmailValide, estMotDePasseFort, estDansPlage } from './validateurs.js';

console.log(estEmailValide("test@example.com")); // true
console.log(estMotDePasseFort("MotDePasse123!")); // true
console.log(estDansPlage(5, 1, 10)); // true`}
          </CodeBlock>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson6;