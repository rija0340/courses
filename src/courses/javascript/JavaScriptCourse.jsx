import React from 'react';
import { Link } from 'react-router-dom';

const JavaScriptCourse = () => {
  return <CourseOverview />;
};

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

const CourseOverview = () => (
  <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">Aperçu du Cours JavaScript</h1>
    
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">#<strong>Qu'est-ce que JavaScript ? À quoi ça sert ? Un peu d'histoire et de contexte</strong></h2>
      <hr className="border-t border-gray-300 my-4 sm:my-6" />
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3"><strong>1. Définition simple</strong></h3>
      <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
        <strong>JavaScript</strong> (souvent abrégé <strong>JS</strong>) est un <strong>langage de programmation</strong> principalement utilisé pour <strong>rendre les pages web interactives</strong>.<br />
        Contrairement à HTML (structure) et CSS (style), <strong>JavaScript gère le comportement</strong> : → ce qui se passe quand vous cliquez, tapez, faites défiler, etc.
      </p>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3"><strong>2. À quoi sert JavaScript côté client ?</strong></h3>
      <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed">
        Le <strong>JavaScript côté client</strong> (ou <em>frontend</em>) s'exécute <strong>directement dans le navigateur</strong> de l'utilisateur. Il permet de :
      </p>
      <ul className="list-disc list-inside text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 space-y-1">
        <li>Réagir aux actions de l'utilisateur (clics, saisies, défilement…)</li>
        <li>Mettrer à jour le contenu d'une page <strong>sans la recharger</strong></li>
        <li>Valider des formulaires avant envoi</li>
        <li>Animer des éléments (menus, boutons, transitions)</li>
        <li>Charger ou afficher des données dynamiquement (ex : fil d'actualité)</li>
        <li>Améliorer l'expérience utilisateur (UX) en temps réel</li>
      </ul>
      
      <TipBox>
        <strong>💡 Exemples concrets :</strong><br />
        - Un panier d'achat qui se met à jour quand vous ajoutez un produit<br />
        - Une recherche qui affiche des suggestions au fur et à mesure que vous tapez<br />
        - Un bouton "Mode sombre" qui change l'apparence de la page
      </TipBox>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3"><strong>3. Un peu d'histoire</strong></h3>
      <ul className="list-disc list-inside text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 space-y-2">
        <li><strong>1995</strong> : JavaScript est créé en <strong>10 jours</strong> par <strong>Brendan Eich</strong> chez <strong>Netscape</strong> (éditeur du navigateur Netscape Navigator).</li>
        <li>Objectif initial : ajouter de la <strong>logique simple</strong> aux pages web, jusque-là statiques.</li>
        <li>À l'origine, il s'appelait <strong>Mocha</strong>, puis <strong>LiveScript</strong>, avant d'être renommé <strong>JavaScript</strong> pour profiter de la popularité de Java (même s'ils n'ont <strong>aucun lien technique</strong>).</li>
        <li><strong>1997</strong> : Standardisé sous le nom <strong>ECMAScript</strong> (par l'organisation ECMA), pour assurer la compatibilité entre navigateurs.</li>
        <li><strong>2000s–2010s</strong> : JavaScript devient de plus en plus puissant avec l'arrivée du <strong>DOM</strong>, d'<strong>AJAX</strong>, puis de frameworks comme <strong>jQuery</strong>, <strong>React</strong>, <strong>Vue</strong>, etc.</li>
        <li>Aujourd'hui : <strong>Langage incontournable du web</strong>, utilisé par <strong>98 % des sites web</strong> (source : W3Techs).</li>
      </ul>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3"><strong>4. JavaScript ≠ Java !</strong></h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0 mb-4 sm:mb-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JavaScript</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Java</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-900">Langage <strong>interprété</strong> dans le navigateur</td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">Langage <strong>compilé</strong>, exécuté sur une machine virtuelle</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-900">Principalement <strong>front-end</strong> (navigateur)</td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">Principalement <strong>back-end</strong> ou applications desktop</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-900">Syntaxe inspirée du C, mais <strong>dynamique et flexible</strong></td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">Typage strict, orienté objet classique</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <TipBox>
        <strong>🚫 <em>Mythe</em></strong> : « JavaScript est un sous-ensemble de Java » → <strong>Faux !</strong> Ce n'est qu'un coup de marketing de l'époque.
      </TipBox>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3"><strong>5. Où s'exécute JavaScript ?</strong></h3>
      <ul className="list-disc list-inside text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 space-y-2">
        <li><strong>Côté client</strong> (navigateur) : → Interaction avec l'utilisateur, manipulation de la page (DOM), appels à des APIs.</li>
        <li><strong>Côté serveur</strong> (avec <strong>Node.js</strong>, depuis 2009) : → Gestion de bases de données, authentification, logique métier.<br />→ Mais <strong>dans ce roadmap, on se concentre uniquement sur le côté client</strong>.</li>
      </ul>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3"><strong>6. Pourquoi apprendre JavaScript aujourd'hui ?</strong></h3>
      <ul className="list-disc list-inside text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 space-y-1">
        <li>C'est <strong>le seul langage natif des navigateurs</strong> → indispensable pour le web.</li>
        <li>Écosystème <strong>immense</strong> : bibliothèques, outils, communautés actives.</li>
        <li>Portes d'entrée vers des frameworks modernes (<strong>React</strong>, <strong>Vue</strong>, <strong>Svelte</strong>…).</li>
        <li>Compétence <strong>très demandée</strong> dans le développement web.</li>
      </ul>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3"><strong>7. En résumé</strong></h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0 mb-4 sm:mb-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aspect</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-900"><strong>Rôle</strong></td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900"><strong>rendre les pages web interactives et dynamiques</strong></td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-900"><strong>Exécution</strong></td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">Dans le <strong>navigateur</strong> (côté client)</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-900"><strong>Créé en</strong></td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">1995 par Brendan Eich (Netscape)</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-900"><strong>Standard</strong></td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">ECMAScript</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-900"><strong>À ne pas confondre avec</strong></td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">Java (langage totalement différent)</td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-900"><strong>Utilisation typique</strong></td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900">Clics, formulaires, mises à jour en temps réel, animations</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <TipBox>
        <strong>✅ <em>Prochaine étape</em></strong> : Passer à la <strong>Leçon 1</strong> du roadmap → les bases de la syntaxe JavaScript.<br />
        Vous avez maintenant le <strong>contexte</strong> nécessaire pour comprendre <strong>pourquoi</strong> et <strong>comment</strong> JavaScript est utilisé dans le navigateur.
      </TipBox>
    </div>
    
    <div className="mt-6 sm:mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r-lg w-full overflow-x-hidden">
      <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2 sm:mb-3">Démarrer votre apprentissage</h3>
      <p className="text-yellow-700 mb-4 sm:mb-6">Maintenant que vous avez une vue d'ensemble de JavaScript, plongez dans la première leçon pour commencer à apprendre les bases de ce langage puissant.</p>
      <Link
        to="/programmation/javascript/lesson1"
        className="inline-block bg-yellow-500 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-base sm:text-lg"
      >
        Accéder à la Première Leçon
      </Link>
    </div>
    
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Structure du Cours JavaScript</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
        Bienvenue dans notre cours JavaScript complet ! Ce cours vous mènera du niveau débutant au niveau intermédiaire.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Ce que vous apprendrez :</h3>
          <ul className="space-y-2 text-sm sm:text-base text-gray-600">
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Fondamentaux de JavaScript</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Variables et types de données</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Fonctions et portée</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Travail avec les tableaux et objets</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Manipulation du DOM</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Événements et programmation asynchrone</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Gestion des événements</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Asynchronisme (callbacks, Promises, async/await)</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>API Fetch</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Manipulation du DOM avancée</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Formulaires (validation, gestion des données, événements)</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Stockage client (localStorage, sessionStorage, cookies)</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Modules ES6 (import/export)</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Outils de développement (DevTools, débogage)</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Bonnes pratiques (organisation du code, lisibilité, performance)</li>
            <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span>Introduction aux frameworks (optionnel : React, Vue, etc.)</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Détails du Cours :</h3>
          <ul className="space-y-2 text-sm sm:text-base text-gray-600">
            <li><strong>Durée :</strong> 15 leçons</li>
            <li><strong>Niveau :</strong> Débutant à Intermédiaire</li>
            <li><strong>Prérequis :</strong> Compétences informatiques de base</li>
            <li><strong>Format :</strong> Leçons interactives</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <Link
          to="/programmation/javascript/lesson1"
          className="inline-block bg-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-sm sm:text-base"
        >
          Commencer avec la Leçon 1
        </Link>
      </div>
    </div>
  </div>
);

export default JavaScriptCourse;
