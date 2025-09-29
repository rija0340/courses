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

const Lesson12 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 12: Modules ES6 (import/export)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Apprendre à organiser et structurer votre code JavaScript avec les modules ES6, comprendre les différentes façons d'importer et exporter des fonctions, variables et classes.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-introduction-aux-modules">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Introduction aux modules ES6</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les modules ES6 (ECMAScript 2015) permettent d'organiser le code JavaScript en fichiers séparés, favorisant la réutilisabilité, la maintenabilité et l'encapsulation.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Avantages des modules :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Encapsulation : variables/fonctions locales au module</li>
            <li>Réutilisabilité : code partageable entre projets</li>
            <li>Maintenabilité : code organisé en unités logiques</li>
            <li>Chargement asynchrone : modules chargés à la demande</li>
            <li>Arborescence claire : structures de projet organisées</li>
          </ul>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Syntaxe de base :</h4>
          <CodeBlock language="javascript">
{`// Exporter une fonction
export function additionner(a, b) {
  return a + b;
}

// Exporter une variable
export const PI = 3.14159;

// Exporter une classe
export class Calculatrice {
  multiplier(a, b) {
    return a * b;
  }
}

// Importer dans un autre module
// import { additionner, PI, Calculatrice } from './maths.js';`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Les modules ES6 sont exécutés en mode strict par défaut, et le code est isolé dans chaque module (portée de module).
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-export-nomme">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Export nommé</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">L'export nommé permet d'exporter plusieurs valeurs d'un module, chacune avec un nom spécifique.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Syntaxe d'export nommé :</h4>
          <CodeBlock language="javascript">
{`// maths.js - Fichier de définition du module

// Exporter directement une fonction
export function additionner(a, b) {
  return a + b;
}

// Exporter une variable
export const PI = 3.14159;

// Exporter une constante d'objet
export const CONFIG = {
  precision: 2,
  unite: 'mètre'
};

// Exporter une classe
export class Forme {
  constructor(couleur) {
    this.couleur = couleur;
  }
}

// Déclarer des variables puis les exporter en fin de fichier
const nomModule = 'Mathématiques';
const version = '1.0';

export { nomModule, version };`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Import nommé :</h4>
          <CodeBlock language="javascript">
{`// app.js - Fichier qui importe

// Importer des éléments spécifiques
import { additionner, PI, Forme } from './maths.js';

console.log(additionner(5, 3)); // 8
console.log(PI); // 3.14159

const carre = new Forme('bleu');

// Importer avec des alias
import { additionner as add, PI as pi } from './maths.js';
console.log(add(2, 3)); // 5
console.log(pi); // 3.14159

// Importer plusieurs éléments
import { additionner, PI, CONFIG, Forme, nomModule, version } from './maths.js';

// Importer tous les exports nommés
import * as maths from './maths.js';
console.log(maths.additionner(2, 3)); // 5
console.log(maths.PI); // 3.14159`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-export-par-defaut">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Export par défaut</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">L'export par défaut permet d'exporter une seule valeur principale par module. Contrairement à l'export nommé, il n'a pas de nom spécifique.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Syntaxe d'export par défaut :</h4>
          <CodeBlock language="javascript">
{`// calculatrice.js - Module avec export par défaut

// Exporter une fonction directement
export default function calculer(operation, a, b) {
  switch(operation) {
    case 'addition':
      return a + b;
    case 'soustraction':
      return a - b;
    case 'multiplication':
      return a * b;
    case 'division':
      return b !== 0 ? a / b : NaN;
    default:
      throw new Error('Opération non supportée');
  }
}

// OU déclarer une variable puis l'exporter
const operations = ['addition', 'soustraction', 'multiplication', 'division'];
export { operations };

// OU exporter une expression
export default class Calculatrice {
  constructor() {
    this.historique = [];
  }
  
  calculer(operation, a, b) {
    const resultat = calculer(operation, a, b);
    this.historique.push({ operation, a, b, resultat });
    return resultat;
  }
}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Import par défaut :</h4>
          <CodeBlock language="javascript">
{`// app.js - Fichier qui importe

// Importer l'export par défaut (n'importe quel nom)
import calculerFunction from './calculatrice.js';
import Calculatrice from './calculatrice.js';

// Utilisation
console.log(calculerFunction('multiplication', 4, 5)); // 20
const calc = new Calculatrice();

// Importer à la fois export par défaut et nommés
import calculer, { operations } from './calculatrice.js';
console.log(operations); // ['addition', 'soustraction', 'multiplication', 'division']

// L'import par défaut peut avoir n'importe quel nom
import monCalculateur from './calculatrice.js';
console.log(monCalculateur('division', 10, 2)); // 5`}
          </CodeBlock>

          <TipBox>
            <strong>ℹ️ Information :</strong> Un module ne peut avoir qu'un seul export par défaut, mais peut avoir plusieurs exports nommés.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-combinaison-des-exports">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Combinaison des exports</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Un module peut combiner à la fois des exports nommés et un export par défaut.</p>
          
          <CodeBlock language="javascript">
{`// utils.js - Module combiné

// Export par défaut (une seule valeur)
export default class Utilitaires {
  static formaterDate(date) {
    return date.toLocaleDateString('fr-FR');
  }
  
  static genererId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Exports nommés
export const TYPES = {
  TEXTE: 'text',
  NOMBRE: 'number',
  DATE: 'date'
};

export function validerEmail(email) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}

export const CONFIG = {
  precision: 2,
  unite: 'mètre'
};

// Autres exports nommés
export { formaterDate, genererId } from './date-utils.js';`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Import combiné :</h4>
          <CodeBlock language="javascript">
{`// app.js - Fichier qui importe

// Importer à la fois le défaut et les nommés
import Utilitaires, { TYPES, validerEmail, CONFIG } from './utils.js';

// Utilisation
const utils = new Utilitaires();
console.log(utils.genererId());
console.log(TYPES.TEXTE); // 'text'
console.log(validerEmail('test@example.com')); // true

// Ou importer tout
import Utilitaires, * as utils from './utils.js';
console.log(utils.TYPES.TEXTE); // 'text'`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-chemins-d-importation">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Chemins d'importation</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les modules peuvent être importés avec différents types de chemins.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Types de chemins :</h4>
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
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-semibold text-blue-600">Relatif</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">./maths.js</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Fichier dans le même répertoire</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-semibold text-blue-600">Relatif</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">../utils/verification.js</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Fichier dans le répertoire parent</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-semibold text-blue-600">Absolu</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">/chemin/vers/module.js</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Chemin absolu depuis la racine</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-semibold text-blue-600">Noyau/Node</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">fs, path, etc.</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Modules du système (Node.js)</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-semibold text-blue-600">Tierce</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">lodash, react, etc.</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Paquets installés via npm</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemples de chemins d'importation :</h4>
          <CodeBlock language="javascript">
{`// Importer un fichier dans le même répertoire
import { fonctionUtil } from './utils.js';

// Importer un fichier dans un sous-répertoire
import { composant } from './composants/Composant.js';

// Importer un fichier dans un répertoire parent
import { configuration } from '../config/app.js';

// Importer un fichier dans une structure de dossiers
import { api } from '../../services/api.js';

// Importer un module externe
// import _ from 'lodash';  // Nécessite installation via npm`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-import-dynamique">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Import dynamique</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les imports dynamiques permettent de charger des modules à la demande, ce qui est utile pour le chargement conditionnel ou le chargement progressif.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Syntaxe d'import dynamique :</h4>
          <CodeBlock language="javascript">
{`// Import dynamique d'un module
async function chargerModule() {
  try {
    // L'import dynamique retourne une promesse
    const module = await import('./maths.js');
    
    // Utiliser les exports du module
    console.log(module.additionner(5, 3)); // 8
    console.log(module.PI); // 3.14159
  } catch (erreur) {
    console.error('Échec du chargement du module :', erreur);
  }
}

// Import conditionnel
async function chargerCalculateur(type) {
  let module;
  
  if (type === 'scientifique') {
    module = await import('./calculateur-scientifique.js');
  } else {
    module = await import('./calculateur-simple.js');
  }
  
  return module.Calculateur;
}

// Import basé sur une variable
async function chargerLangue(langue) {
  const module = await import(\`./langues/\${langue}.js\`);
  return module.messages;
}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple pratique d'import dynamique :</h4>
          <CodeBlock language="javascript">
{`// Application de chargement conditionnel
class ChargeurModule {
  constructor() {
    this.cache = new Map();
  }
  
  async chargerModule(chemin, force = false) {
    if (!force && this.cache.has(chemin)) {
      return this.cache.get(chemin);
    }
    
    try {
      const module = await import(chemin);
      this.cache.set(chemin, module);
      return module;
    } catch (erreur) {
      console.error('Échec du chargement de', chemin, ':', erreur);
      throw erreur;
    }
  }
  
  async chargerCalculateur(type) {
    let chemin;
    
    switch (type) {
      case 'math':
        chemin = './calculateurs/maths.js';
        break;
      case 'chaine':
        chemin = './calculateurs/chaine.js';
        break;
      case 'date':
        chemin = './calculateurs/date.js';
        break;
      default:
        throw new Error('Type de calculateur inconnu : ' + type);
    }
    
    return await this.chargerModule(chemin);
  }
}

// Utilisation
const chargeur = new ChargeurModule();

document.getElementById('btn-maths').addEventListener('click', async () => {
  const maths = await chargeur.chargerCalculateur('math');
  const resultat = maths.additionner(10, 5);
  console.log('Résultat :', resultat);
});`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="7-organisation-du-code">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">7. Organisation du code avec les modules</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Structure typique d'un projet :</h4>
          <pre className="bg-gray-100 p-3 sm:p-4 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words my-3 sm:my-4">
{`mon-projet/
├── src/
│   ├── modules/
│   │   ├── math/
│   │   │   ├── index.js
│   │   │   ├── operations.js
│   │   │   └── constants.js
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   ├── dates.js
│   │   │   └── chaines.js
│   │   └── api/
│   │       ├── client.js
│   │       └── endpoints.js
│   ├── composants/
│   │   ├── Formulaire.js
│   │   └── Tableau.js
│   ├── app.js
│   └── main.js
├── public/
│   └── index.html
└── package.json`}
          </pre>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple d'organisation en modules :</h4>
          <CodeBlock language="javascript">
{`// src/modules/validation.js
export function validerEmail(email) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}

export function validerMotDePasse(motDePasse) {
  // Doit contenir majuscule, minuscule, chiffre et caractère spécial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/;
  return regex.test(motDePasse) && motDePasse.length >= 8;
}

export default function validerFormulaire(donnees) {
  const erreurs = {};
  
  if (!validerEmail(donnees.email)) {
    erreurs.email = 'Email invalide';
  }
  
  if (!validerMotDePasse(donnees.motDePasse)) {
    erreurs.motDePasse = 'Mot de passe faible';
  }
  
  return { valide: Object.keys(erreurs).length === 0, erreurs };
}

// src/modules/api/auth.js
export const connexion = async (identifiants) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(identifiants)
  });
  
  if (!response.ok) {
    throw new Error('Échec de la connexion');
  }
  
  return response.json();
};

export const deconnexion = async () => {
  const response = await fetch('/api/auth/logout', { method: 'POST' });
  return response.ok;
};

// src/app.js
import validerFormulaire from './modules/validation.js';
import { connexion, deconnexion } from './modules/api/auth.js';

class Application {
  constructor() {
    this.formulaire = document.getElementById('formulaire');
    this.formulaire.addEventListener('submit', this.gererSoumission.bind(this));
  }
  
  async gererSoumission(event) {
    event.preventDefault();
    
    const formData = new FormData(this.formulaire);
    const donnees = Object.fromEntries(formData.entries());
    
    const { valide, erreurs } = validerFormulaire(donnees);
    
    if (valide) {
      try {
        const resultat = await connexion(donnees);
        console.log('Connexion réussie :', resultat);
      } catch (erreur) {
        console.error('Erreur de connexion :', erreur);
      }
    } else {
      this.afficherErreurs(erreurs);
    }
  }
  
  afficherErreurs(erreurs) {
    // Logique d'affichage des erreurs
    Object.entries(erreurs).forEach(([champ, message]) => {
      console.log(\`Erreur \${champ}: \${message}\`);
    });
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  new Application();
});`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="8-points-importants">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">8. Points importants</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Bonnes pratiques :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Utilisez des extensions <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">.js</code> dans les imports (obligatoire dans certains environnements)</li>
            <li>Préférez les exports nommés pour les bibliothèques de fonctions</li>
            <li>Utilisez un export par défaut pour les classes ou composants principaux</li>
            <li>Organisez vos modules par fonctionnalité/logique métier</li>
            <li>Documentez clairement les APIs de vos modules</li>
            <li>Évitez les cycles d'importation</li>
          </ul>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Erreurs courantes :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Oublier l'extension <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">.js</code> (peut causer des erreurs dans le navigateur)</li>
            <li>Importation incorrecte (nom erroné ou mauvais chemin)</li>
            <li>Essayer d'importer dans une condition (impossible avec les imports statiques)</li>
            <li>Cycles d'importation (module A importe B qui importe A)</li>
          </ul>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez une structure de modules pour une application de gestion de tâches :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Un module pour la gestion des tâches (ajout, suppression, modification)</li>
            <li>Un module pour la validation des données de tâches</li>
            <li>Un module pour la persistance des données (localStorage)</li>
            <li>Un module pour les utilitaires de date</li>
            <li>Un module principal qui orchestre tout</li>
          </ul>
          <p className="mb-2 sm:mb-3">Structurez vos modules avec des exports nommés et un export par défaut, utilisez l'import dynamique pour une fonctionnalité optionnelle.</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Structure de modules bien organisée
// Imports/exports correctement utilisés
// Code modulaire et réutilisable
// Utilisation d'imports dynamiques pour les fonctionnalités optionnelles`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson12;