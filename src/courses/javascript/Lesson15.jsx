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

const Lesson15 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 15: Introduction aux frameworks (optionnel : React, Vue, etc.)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Découvrir les frameworks JavaScript populaires, comprendre leur intérêt et leurs concepts fondamentaux pour vous orienter dans votre prochaine étape d'apprentissage.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-introduction-aux-frameworks">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Introduction aux frameworks JavaScript</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Un framework JavaScript est une structure qui fournit des fonctionnalités et des conventions prédéfinies pour faciliter le développement d'applications web complexes.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Pourquoi utiliser un framework ?</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Structurer le code de manière cohérente</li>
            <li>Réutiliser des composants et des logiques</li>
            <li>Gérer l'état de manière centralisée</li>
            <li>Améliorer la productivité et la collaboration</li>
            <li>Accélérer le développement avec des fonctionnalités prêtes à l'emploi</li>
          </ul>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Quelques frameworks populaires :</h4>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Framework</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concept principal</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cas d'usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base font-mono font-semibold text-blue-600">React</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">2013</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Composants, Virtual DOM</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Applications web dynamiques</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base font-mono font-semibold text-blue-600">Vue</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">2014</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Données réactives, composants</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Applications progressives</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base font-mono font-semibold text-blue-600">Angular</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">2016</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">MVC, injection de dépendances</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Applications d'entreprise</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-concepts-fondamentaux">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Concepts fondamentaux</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Composants :</h4>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les composants sont des éléments réutilisables qui encapsulent à la fois le rendu visuel et la logique métier.</p>
          
          <CodeBlock language="javascript">
{`// Exemple conceptuel d'un composant (syntaxe simplifiée)
// Un composant est comme une fonction qui retourne une interface utilisateur

function Bouton({ texte, onClick, type = 'button' }) {
  return \`
    <button type="\${type}" onclick="\${onClick}">
      \${texte}
    </button>
  \`;
}

// Utilisation
const html = Bouton({ 
  texte: 'Cliquez-moi', 
  onClick: 'console.log("Cliqué !")' 
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Réactivité :</h4>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">La réactivité permet à l'interface de s'actualiser automatiquement quand les données changent.</p>
          
          <CodeBlock language="javascript">
{`// Exemple de réactivité conceptuelle
let compteur = 0;

// Observateur de changement
function observer(motif, callback) {
  // Quand 'motif' change, exécuter 'callback'
}

// L'interface est automatiquement mise à jour quand 'compteur' change
observer('compteur', function() {
  document.getElementById('affichage').textContent = 'Valeur: ' + compteur;
});

// Quand on modifie 'compteur', l'interface est mise à jour
compteur = 5; // L'interface s'actualise automatiquement`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-introduction-a-react">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Introduction à React</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">React est une bibliothèque JavaScript pour construire des interfaces utilisateur, développée par Facebook.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Concepts clés de React :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><strong>Composants</strong> : Bâtir l'interface avec des composants réutilisables</li>
            <li><strong>JSX</strong> : Syntaxe qui ressemble à HTML mais dans JavaScript</li>
            <li><strong>Virtual DOM</strong> : Version légère du DOM pour optimiser les rendus</li>
            <li><strong>Props</strong> : Données passées d'un composant parent à un composant enfant</li>
            <li><strong>State</strong> : Données internes à un composant qui peuvent changer</li>
            <li><strong>Hooks</strong> : Fonctions qui permettent d'utiliser l'état et d'autres fonctionnalités dans les composants fonctionnels</li>
          </ul>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple de composant React :</h4>
          <CodeBlock language="javascript">
{`import React, { useState } from 'react';

// Composant fonctionnel avec état
function Compteur() {
  // Déclaration d'une variable d'état 'compteur' avec useState
  const [compteur, setCompteur] = useState(0);

  return (
    <div>
      <p>Vous avez cliqué {compteur} fois</p>
      <button onClick={() => setCompteur(compteur + 1)}>
        Cliquez ici
      </button>
    </div>
  );
}

// Composant réutilisable
function Application() {
  return (
    <div>
      <h1>Mon Application</h1>
      <Compteur />
      <Compteur /> {/* Deux instances du même composant */}
    </div>
  );
}`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> React n'est pas un framework complet mais une bibliothèque pour construire l'interface utilisateur. On l'utilise souvent avec d'autres bibliothèques pour la gestion d'état (Redux), le routage (React Router), etc.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-introduction-a-vue">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Introduction à Vue.js</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Vue.js est un framework progressif pour construire des interfaces utilisateur, conçu pour être adopté de manière incrémentielle.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Concepts clés de Vue :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><strong>Données réactives</strong> : Les changements sont automatiquement reflétés dans l'interface</li>
            <li><strong>Directives</strong> : Attributs spéciaux dans le balisage qui donnent des instructions à Vue</li>
            <li><strong>Composants</strong> : Éléments réutilisables avec logique, état et interface</li>
            <li><strong>Template</strong> : Syntaxe proche de HTML avec capacités de rendu conditionnel et de boucles</li>
          </ul>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple de composant Vue :</h4>
          <CodeBlock language="javascript">
{`// Définition d'un composant Vue
const { createApp } = Vue;

createApp({
  // État du composant
  data() {
    return {
      compteur: 0,
      message: 'Bonjour Vue!'
    }
  },
  
  // Méthodes
  methods: {
    incrementer() {
      this.compteur++;
    },
    
    reinitialiser() {
      this.compteur = 0;
    }
  },
  
  // Calculs dérivés
  computed: {
    messageInverse() {
      return this.message.split('').reverse().join('');
    }
  }
}).mount('#app');

// Template HTML associé
/* 
<div id="app">
  <h1>{{ message }}</h1>
  <p>{{ messageInverse }}</p>
  <p>Compteur : {{ compteur }}</p>
  <button @click="incrementer">+1</button>
  <button @click="reinitialiser">Réinitialiser</button>
</div>
*/
`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-introduction-a-angular">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Introduction à Angular</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Angular est un framework complet pour construire des applications web et mobiles, développé par Google.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Concepts clés d'Angular :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><strong>Composants</strong> : Blocs de construction avec logique, modèle et style</li>
            <li><strong>Services</strong> : Classes avec une logique réutilisable</li>
            <li><strong>Dependency Injection</strong> : Gestion des dépendances</li>
            <li><strong>Templates</strong> : HTML avec des fonctionnalités étendues</li>
            <li><strong>Modules</strong> : Unités logiques qui regroupent des composants liés</li>
          </ul>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple de composant Angular :</h4>
          <CodeBlock language="javascript">
{`// composant.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-compteur',
  template: \`
    <div>
      <h2>Compteur Angular</h2>
      <p>Valeur: {{ compteur }}</p>
      <button (click)="incrementer()">+</button>
      <button (click)="decrementer()">-</button>
    </div>
  \`
})
export class CompteurComponent {
  compteur = 0;
  
  incrementer() {
    this.compteur++;
  }
  
  decrementer() {
    this.compteur--;
  }
}

// Module principal
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [CompteurComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [CompteurComponent]
})
export class AppModule { }
`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-comparaison-des-frameworks">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Comparaison des frameworks</h2>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Critère</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">React</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vue</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Angular</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-900">Apprentissage</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Modéré</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Facile</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Difficile</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-900">Taille</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Légère</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Légère</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Lourde</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-900">Flexibilité</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Élevée</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Élevée</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Faible</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-900">Écosystème</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Imposant</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Croissant</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Complet</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-900">Cas d'usage</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">SPA dynamiques</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Projets de tout type</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-500">Applications d'entreprise</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="7-choisir-son-framework">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">7. Choisir son framework</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Critères de choix :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-2">Considérations techniques :</h5>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1">
                <li>Complexité du projet</li>
                <li>Performance requise</li>
                <li>Intégration avec des systèmes existants</li>
                <li>Équipe de développement</li>
                <li>Temps de chargement</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-2">Considérations humaines :</h5>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1">
                <li>Niveau d'expérience de l'équipe</li>
                <li>Support et documentation</li>
                <li>Communauté active</li>
                <li>Évolution à long terme</li>
                <li>Facilité de maintenance</li>
              </ul>
            </div>
          </div>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 mt-4 sm:mt-6">Recommandations :</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
            <p className="text-sm sm:text-base text-blue-800">
              <strong>Pour débuter :</strong> Vue.js est souvent recommandé pour les débutants car il a une courbe d'apprentissage plus douce et ressemble davantage à du HTML/CSS/JS traditionnel.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
            <p className="text-sm sm:text-base text-green-800">
              <strong>Pour la flexibilité :</strong> React offre une grande liberté de choix concernant les bibliothèques externes à utiliser.
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-3">
            <p className="text-sm sm:text-base text-purple-800">
              <strong>Pour les applications d'entreprise :</strong> Angular fournit une structure complète avec des fonctionnalités intégrées pour les applications complexes.
            </p>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="8-outils-et-ecosysteme">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">8. Outils et écosystème</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Outils de développement :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><strong>Create React App</strong>, <strong>Vue CLI</strong>, <strong>Angular CLI</strong> - Outils de scaffolding</li>
            <li><strong>Webpack / Vite</strong> - Bundlers pour la gestion des modules</li>
            <li><strong>Redux / Vuex / NgRx</strong> - Gestion d'état</li>
            <li><strong>React DevTools / Vue DevTools</strong> - Extensions de navigateur pour le débogage</li>
            <li><strong>Jest / Cypress</strong> - Outils de test</li>
          </ul>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Installation d'un projet React :</h4>
          <CodeBlock language="bash">
{`# Création d'un nouveau projet React
npx create-react-app mon-app
cd mon-app
npm start

# Structure typique
mon-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   └── ...
├── package.json
└── ...
`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="9-aller-plus-loin">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">9. Aller plus loin</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Ressources pour approfondir :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Documentation officielle de chaque framework</li>
            <li>Cours en ligne (Udemy, Coursera, FreeCodeCamp)</li>
            <li>Communautés (GitHub, Stack Overflow, Discord)</li>
            <li>Exemples de projets open-source</li>
            <li>Conférences et meetups locaux</li>
          </ul>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Étapes suivantes :</h4>
          <ol className="list-decimal list-inside text-gray-600 text-sm sm:text-base space-y-2 mb-3 sm:mb-4">
            <li>Choisir un framework et créer un petit projet pour pratiquer</li>
            <li>Explorer les concepts avancés (routage, gestion d'état, tests)</li>
            <li>Rejoindre une communauté de développeurs</li>
            <li>Contribuer à des projets open-source</li>
            <li>Construire des applications de plus en plus complexes</li>
          </ol>

          <TipBox>
            <strong>✅ Bonne pratique :</strong> Maîtrisez bien les bases de JavaScript avant de vous plonger profondément dans un framework. Les frameworks changent souvent, mais les principes fondamentaux de JavaScript restent valables.
          </TipBox>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Explorez un framework de votre choix (React, Vue ou Angular) en :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Lisant la documentation initiale</li>
            <li>Créant une application simple avec ce framework</li>
            <li>Comparant la structure de base avec du JavaScript vanilla</li>
            <li>Identifiant les avantages et inconvénients de ce framework</li>
          </ul>
          <p className="mb-2 sm:mb-3">Faites un résumé comparatif des différences entre l'approche framework et l'approche vanilla JavaScript.</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Application créée avec le framework choisi
// Comparaison des approches identifiée
// Compréhension des concepts du framework
// Analyse des avantages du framework`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson15;