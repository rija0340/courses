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

const Lesson13 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 13: Outils de développement (DevTools, débogage)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Découvrir et maîtriser les outils de développement du navigateur (DevTools) pour déboguer efficacement le code JavaScript et analyser les performances.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-introduction-aux-devtools">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Introduction aux DevTools</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les DevTools (Outils de développement) sont un ensemble d'outils intégrés aux navigateurs modernes qui permettent d'inspecter, déboguer et profiler les applications web.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Comment accéder aux DevTools :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Touches de raccourci : <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">F12</code> ou <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Ctrl+Shift+I</code> (Windows/Linux) ou <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Cmd+Option+I</code> (Mac)</li>
            <li>Clic droit sur une page → "Inspecter" ou "Inspecter l'élément"</li>
            <li>Menu du navigateur → Outils de développement</li>
          </ul>
          
          <TipBox>
            <strong>💡 Astuce :</strong> Les DevTools sont disponibles dans tous les navigateurs modernes (Chrome, Firefox, Safari, Edge) avec des fonctionnalités similaires.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-onglet-console">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Onglet Console</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">La console est l'endroit où les messages d'erreur, avertissements et logs JavaScript s'affichent.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Fonctions de base de la console :</h4>
          <CodeBlock language="javascript">
{`// Afficher des messages
console.log('Message simple');
console.info('Information');
console.warn('Avertissement');
console.error('Erreur');

// Afficher des objets et tableaux
const utilisateur = { nom: 'Jean', age: 30 };
console.log(utilisateur);  // Affiche l'objet de manière interactive

// Tableau de données
const donnees = [
  { id: 1, nom: 'Produit A' },
  { id: 2, nom: 'Produit B' }
];
console.table(donnees);  // Affiche les données dans un tableau

// Mesurer des temps d'exécution
console.time('opération');
// Code à mesurer
for (let i = 0; i < 1000000; i++) {
  // Quelque chose
}
console.timeEnd('opération');

// Compter des occurrences
for (let i = 0; i < 5; i++) {
  console.count('itération');  // Affiche le nombre d'itérations
}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Filtres et recherche dans la console :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Utilisez les filtres <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">All</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Errors</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Warnings</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Info</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Logs</code></li>
            <li>Recherchez du texte avec <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Ctrl+F</code></li>
            <li>Effacez la console avec <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Ctrl+L</code> ou le bouton "Clear"</li>
          </ul>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-onglet-sources-et-debogage">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Onglet Sources et débogage</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">L'onglet Sources permet d'examiner et de déboguer le code JavaScript en temps réel.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Points d'arrêt (Breakpoints) :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Cliquez sur le numéro de ligne pour ajouter un point d'arrêt</li>
            <li>Utilisez <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">debugger;</code> dans votre code pour créer des points d'arrêt programmatiques</li>
            <li>Points d'arrêt conditionnels : droits sur un point d'arrêt → "Edit breakpoint"</li>
          </ul>
          
          <CodeBlock language="javascript">
{`function calculerPuissance(base, exposant) {
  if (exposant < 0) {
    throw new Error('Exposant négatif non supporté');
  }
  
  let resultat = 1;
  
  // Point d'arrêt conditionnel ici : exposant > 10
  debugger;  // Point d'arrêt programmatique
  
  for (let i = 0; i < exposant; i++) {
    resultat *= base;
  }
  
  return resultat;
}

// Utilisation
const puissance = calculerPuissance(2, 3);
console.log(puissance);  // 8`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Contrôles de débogage :</h4>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrôle</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raccourci</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">Step Over (F10)</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">F10</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Exécute la ligne suivante sans entrer dans les fonctions</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">Step Into (F11)</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">F11</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Entre dans la fonction appelée</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">Step Out (Shift+F11)</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Shift+F11</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Sort de la fonction actuelle</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">Continue (F8)</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">F8</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Continue l'exécution jusqu'au prochain point d'arrêt</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-inspection-des-variables-et-portee">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Inspection des variables et portée</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Lors du débogage, vous pouvez inspecter les variables dans différentes portées.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Inspection de variables :</h4>
          <CodeBlock language="javascript">
{`function traiterDonnees(nom, donnees) {
  // Lorsque le code est arrêté à un point d'arrêt :
  // - Variables locales : nom, donnees
  // - Variables globales : window, document
  // - Portée de la fonction : this, arguments
  
  const resultat = [];
  
  for (let i = 0; i < donnees.length; i++) {
    const element = donnees[i];
    
    // À ce point d'arrêt, vous pouvez inspecter :
    // - resultat (tableau vide pour l'instant)
    // - i (index courant)
    // - element (élément courant)
    debugger;  // Point d'arrêt pour inspection
    
    resultat.push({
      id: i,
      nom: nom,
      valeur: element
    });
  }
  
  return resultat;
}

// Appel de la fonction
const donnees = [10, 20, 30];
const resultat = traiterDonnees('valeurs', donnees);`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Console dans le contexte de débogage :</h4>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Lorsque vous êtes arrêté à un point d'arrêt, la console s'exécute dans le contexte exact de l'arrêt, vous permettant d'examiner et de manipuler les variables locales.</p>
          
          <CodeBlock language="javascript">
{`// Dans la console, lors d'un point d'arrêt à l'intérieur de la boucle :
typeof element;        // "number"
element + 10;          // Valeur de l'élément + 10
resultat.length;       // Nombre d'éléments déjà ajoutés
donnees.length - i;    // Éléments restants`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-outils-danalyse-et-de-performance">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Outils d'analyse et de performance</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Onglet Network (Réseau) :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Analyse des requêtes HTTP (XHR, Fetch)</li>
            <li>Temps de chargement des ressources</li>
            <li>En-têtes de requête/réponse</li>
            <li>Problèmes de chargement (erreurs 404, 500)</li>
          </ul>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Onglet Performance :</h4>
          <CodeBlock language="javascript">
{`// Pour profiler un morceau de code
performance.mark('debut-operation');

// Code à profiler
const resultat = Array.from({ length: 1000000 }, (_, i) => i * 2)
  .filter(n => n % 4 === 0)
  .map(n => n / 2);

performance.mark('fin-operation');
performance.measure('operation', 'debut-operation', 'fin-operation');

// Résultats dans l'onglet Console
const mesures = performance.getEntriesByType('measure');
console.table(mesures);`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Onglet Memory (Mémoire) :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Analyse des fuites de mémoire</li>
            <li>Prise d'empreintes mémoire (heap snapshots)</li>
            <li>Suivi des objets en mémoire</li>
          </ul>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-techniques-avancees-de-debogage">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Techniques avancées de débogage</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Points d'arrêt d'exception :</h4>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Le panneau Sources permet d'activer les points d'arrêt sur toutes les exceptions (pauses quand une erreur est levée).</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Points d'arrêt DOM :</h4>
          <CodeBlock language="javascript">
{`// Vous pouvez définir des points d'arrêt sur des modifications DOM
// Dans l'onglet Elements :
// - Cliquez droit sur un élément
// - Break on → subtree modifications, attribute modifications, node removal

// Exemple de code qui déclenchera un point d'arrêt DOM
const conteneur = document.getElementById('conteneur');
const nouvelElement = document.createElement('div');
nouvelElement.textContent = 'Nouvel élément';
conteneur.appendChild(nouvelElement);  // Déclenchera le point d'arrêt`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Points d'arrêt d'événements :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Dans l'onglet Sources → Event Listener Breakpoints</li>
            <li>Ajouter des points d'arrêt pour des événements spécifiques : click, keydown, load, etc.</li>
            <li>Utile pour identifier où un événement est géré dans le code</li>
          </ul>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Traces personnalisées :</h4>
          <CodeBlock language="javascript">
{`// Créer des traces pour suivre l'exécution
function traceAppel(fonction, nom) {
  return function(...args) {
    console.group(\`Appel de \${nom}\`);
    console.log('Arguments:', args);
    
    try {
      const resultat = fonction.apply(this, args);
      console.log('Résultat:', resultat);
      return resultat;
    } catch (erreur) {
      console.error('Erreur:', erreur);
      throw erreur;
    } finally {
      console.groupEnd();
    }
  };
}

// Utilisation
const additionnerTracee = traceAppel(function(a, b) {
  return a + b;
}, 'additionner');

additionnerTracee(5, 3);  // Affichera les détails de l'appel`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="7-outils-supplementaires">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">7. Outils supplémentaires</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Snippets (extraits de code) :</h4>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Dans les DevTools, vous pouvez sauvegarder des extraits de code réutilisables dans l'onglet Sources → Snippets.</p>
          
          <CodeBlock language="javascript">
{`// Exemple de snippet pour formater un objet JSON
(function(objet) {
  console.log(JSON.stringify(objet, null, 2));
})(%o);`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Outils de profilage :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Performance Profiler : Analyse de l'utilisation du CPU</li>
            <li>Memory Profiler : Analyse des fuites de mémoire</li>
            <li>Network Profiler : Analyse des requêtes réseau</li>
            <li>Rendering Profiler : Analyse des performances de rendu</li>
          </ul>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="8-exemples-de-debogage">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">8. Exemples de débogage</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Débogage d'une erreur logique :</h4>
          <CodeBlock language="javascript">
{`// Problème : calcul de moyenne incorrect
function calculerMoyenne(nombres) {
  let somme = 0;
  for (let i = 0; i < nombres.length; i++) {
    somme += nombres[i];
  }
  
  debugger;  // Point d'arrêt pour inspection
  const moyenne = somme / nombres.length;  // Erreur potentielle si nombres.length est 0
  return moyenne;
}

// Test avec données problématiques
const nombres = [1, 2, 3, 4, 5];
console.log(calculerMoyenne(nombres));  // 3

// Test avec tableau vide
console.log(calculerMoyenne([]));  // NaN - à déboguer`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Débogage d'une fuite de mémoire :</h4>
          <CodeBlock language="javascript">
{`// Exemple de code avec fuite de mémoire potentielle
class GestionnaireEvenements {
  constructor() {
    this.evenements = [];
    this.compteur = 0;
  }
  
  ajouterEvenement() {
    // Stockage d'événements qui ne sont jamais nettoyés
    this.evenements.push({
      id: this.compteur++,
      gestionnaire: function() { /* gestionnaire d'événement */ },
      donnees: new Array(10000).fill('données')
    });
  }
  
  nettoyer() {
    // Méthode pour nettoyer les événements
    this.evenements = [];
  }
}

// Utilisation dans une boucle - potentiellement problématique
const gestionnaire = new GestionnaireEvenements();
for (let i = 0; i < 1000; i++) {
  gestionnaire.ajouterEvenement();
}

// Utiliser l'onglet Memory pour détecter la fuite
// Prendre un heap snapshot avant et après le nettoyage`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthodes de débogage à utiliser :</h4>
          <ol className="list-decimal list-inside text-gray-600 text-sm sm:text-base space-y-2 mb-3 sm:mb-4">
            <li>Utiliser <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">console.log()</code> pour les valeurs simples</li>
            <li>Utiliser <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">debugger;</code> pour des inspections détaillées</li>
            <li>Utiliser l'onglet Network pour les requêtes AJAX</li>
            <li>Utiliser l'onglet Elements pour inspecter le DOM modifié</li>
            <li>Utiliser l'onglet Console pour tester des expressions</li>
            <li>Utiliser les points d'arrêt conditionnels pour des cas spécifiques</li>
            <li>Utiliser les outils de performance pour détecter les problèmes</li>
          </ol>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Analysez et déboguez le code suivant en utilisant les DevTools :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Identifiez les erreurs dans une fonction de tri de tableau</li>
            <li>Utilisez les points d'arrêt pour comprendre le flux d'exécution</li>
            <li>Inspectez les variables pendant l'exécution</li>
            <li>Utilisez la console pour tester des expressions</li>
            <li>Corrigez les erreurs identifiées</li>
          </ul>
          <CodeBlock language="javascript">
{`function trierTableau(tableau) {
  for (let i = 0; i < tableau.length; i++) {
    for (let j = 0; j < tableau.length; j++) { // Erreur 1
      if (tableau[i] > tableau[j]) { // Erreur 2
        let temp = tableau[i];
        tableau[i] = tableau[j];
        tableau[j] = temp;
      }
    }
  }
  return tableau;
}

const resultat = trierTableau([5, 2, 8, 1, 9]);
console.log(resultat);`}
          </CodeBlock>
          <p className="mt-2 sm:mt-3">Identifiez et corrigez les problèmes, puis testez votre solution avec différents tableaux.</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Utilisation des DevTools pour identifier les erreurs
// Tableau correctement trié dans l'ordre croissant
// Compréhension du flux d'exécution
// Correction des erreurs de logique`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson13;