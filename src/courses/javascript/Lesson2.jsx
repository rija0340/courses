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

const Lesson2 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 2: Fonctions et Portée (Scope)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Comprendre comment déclarer et utiliser des fonctions en JavaScript, ainsi que la gestion des variables dans différents contextes (scope).</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-déclaration-de-fonctions">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Déclaration de fonctions</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les fonctions sont des blocs de code réutilisables qui effectuent une tâche spécifique.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Fonction déclarée :</h4>
          <CodeBlock language="javascript">
{`function saluer(nom) {
  return "Bonjour, " + nom + " !";
}

console.log(saluer("Alice")); // "Bonjour, Alice !"`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Fonction fléchée (ES6+) :</h4>
          <CodeBlock language="javascript">
{`const saluer = (nom) => {
  return "Bonjour, " + nom + " !";
};

// Ou version concise pour une seule expression :
const carre = x => x * x; // Pour un seul paramètre, parenthèses optionnelles
console.log(carre(4)); // 16`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-arguments-et-paramètres">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Arguments et Paramètres</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les paramètres sont les variables dans la déclaration de la fonction ; les arguments sont les valeurs réelles passées lors de l'appel.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Paramètres par défaut :</h4>
          <CodeBlock language="javascript">
{`function multiplier(a, b = 1) {
  return a * b;
}

console.log(multiplier(5)); // 5
console.log(multiplier(5, 3)); // 15`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Paramètres rest (…) :</h4>
          <CodeBlock language="javascript">
{`function additionner(...nombres) {
  let somme = 0;
  for (let nombre of nombres) {
    somme += nombre;
  }
  return somme;
}

console.log(additionner(1, 2, 3, 4)); // 10`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-portée-des-variables">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Portée des variables (Scope)</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">La portée détermine où une variable peut être accédée dans votre code.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Portée globale :</h4>
          <CodeBlock language="javascript">
{`let nom = "Alice"; // Variable globale

function afficherNom() {
  console.log(nom); // Accès à la variable globale
}

afficherNom(); // "Alice"`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Portée locale :</h4>
          <CodeBlock language="javascript">
{`function exemple() {
  let message = "Bonjour"; // Variable locale
  console.log(message); // Fonctionne
}

console.log(message); // Erreur ! 'message' n'est pas défini`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Portée de bloc (let/const) :</h4>
          <CodeBlock language="javascript">
{`if (true) {
  let x = 1;
  const y = 2;
}
console.log(x); // Erreur ! 'x' n'est pas défini en dehors du bloc
console.log(y); // Erreur ! 'y' n'est pas défini en dehors du bloc`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Préférez <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">const</code> et <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">let</code> au lieu de <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">var</code> pour éviter les problèmes de portée.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-closure">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Closures</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Une closure est une fonction qui a accès à des variables de sa portée englobante même après que la fonction parente se soit terminée.</p>

          <CodeBlock language="javascript">
{`function createCompteur() {
  let compteur = 0;
  
  return function() {
    compteur++;
    return compteur;
  };
}

const compteur = createCompteur();
console.log(compteur()); // 1
console.log(compteur()); // 2
console.log(compteur()); // 3`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-bonnes-pratiques">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Bonnes Pratiques</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base">
            <li>Utilisez des noms de fonctions descriptifs</li>
            <li>Préférez les fonctions fléchées pour les fonctions courtes et simples</li>
            <li>Évitez les fonctions trop longues - divisez-les en fonctions plus petites</li>
            <li>Limitez la portée des variables autant que possible</li>
          </ul>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez une fonction <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">creerCalculateur</code> qui prend un opérateur en paramètre ("add", "multiply", etc.) et retourne une fonction qui effectue l'opération sur deux nombres.</p>
          <p className="mb-2 sm:mb-3">Utilisez cette fonction pour créer un "additionneur" et un "multiplieur".</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <CodeBlock language="javascript">
{`const additionneur = creerCalculateur("add");
const multiplieur = creerCalculateur("multiply");

console.log(additionneur(5, 3)); // 8
console.log(multiplieur(4, 6)); // 24`}
          </CodeBlock>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson2;