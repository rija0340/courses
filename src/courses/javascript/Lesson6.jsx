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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 6: Gestion des événements (écouteurs, propagation, objets d'événement)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Apprendre à capturer et gérer les événements utilisateur dans le navigateur, comprendre le modèle d'événements et les objets d'événement.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-introduction-aux-evenements">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Introduction aux événements</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les événements sont des signaux envoyés par le navigateur lorsqu'une action se produit (clic, saisie, chargement de page, etc.).</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Types courants d'événements :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">click</code> - Clic de souris</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">mouseover</code> - Passage de la souris sur un élément</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">keydown</code> - Appui sur une touche du clavier</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">change</code> - Changement de valeur dans un formulaire</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">submit</code> - Envoi d'un formulaire</li>
          </ul>
          
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Exemple simple d'écouteur d'événement :</p>
          <CodeBlock language="javascript">
{`// Sélection de l'élément et ajout d'un écouteur
const bouton = document.querySelector('#monBouton');
bouton.addEventListener('click', function() {
  alert('Bouton cliqué !');
});`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-ajout-et-suppression-d-ecouteurs">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Ajout et suppression d'écouteurs d'événements</h2>
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthode addEventListener() :</h4>
          <CodeBlock language="javascript">
{`// Syntaxe : element.addEventListener(type, fonction, options)
const bouton = document.getElementById('bouton');

// Méthode 1 : Fonction nommée
function handleClick() {
  console.log('Clic détecté');
}
bouton.addEventListener('click', handleClick);

// Méthode 2 : Fonction fléchée
bouton.addEventListener('click', (event) => {
  console.log('Clic avec flèche', event);
});

// Méthode 3 : Fonction anonyme
bouton.addEventListener('click', function(event) {
  console.log('Clic avec fonction anonyme', event);
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Suppression d'un écouteur :</h4>
          <CodeBlock language="javascript">
{`// Pour supprimer un écouteur, il faut utiliser la même fonction
bouton.removeEventListener('click', handleClick);`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Utilisez <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">addEventListener</code> plutôt que les attributs HTML comme <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">onclick</code> pour une meilleure séparation du code.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-objets-d-evenement">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Objets d'événement</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Lorsqu'un événement se produit, le navigateur crée un objet événement contenant des informations sur l'événement.</p>
          
          <CodeBlock language="javascript">
{`const bouton = document.getElementById('bouton');

bouton.addEventListener('click', function(event) {
  console.log('Type d\'événement :', event.type);      // 'click'
  console.log('Élément ciblé :', event.target);        // L'élément cliqué
  console.log('Élément courant :', event.currentTarget); // Élément auquel est attaché l'écouteur
  console.log('Coordonnées X :', event.clientX);       // Position X dans la fenêtre
  console.log('Coordonnées Y :', event.clientY);       // Position Y dans la fenêtre
  console.log('Touche spéciale :', event.ctrlKey);     // true si Ctrl est pressé
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Propriétés utiles de l'objet événement :</h4>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriété</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exemple</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">target</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Élément qui a déclenché l'événement</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">button, input, etc.</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">type</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Type d'événement</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">click, keydown, etc.</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">preventDefault()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Empêche l'action par défaut</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Empêcher envoi de formulaire</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">stopPropagation()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Arrête la propagation de l'événement</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Prévenir l'écouteur parent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-propagation-des-evenements">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Propagation des événements</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Il existe deux phases de propagation : la phase de capture et la phase de bouillonnement (bubbling).</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Phase de capture :</h4>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">L'événement traverse l'arbre DOM du haut vers le bas, du parent le plus éloigné vers la cible.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Phase de bouillonnement :</h4>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">L'événement remonte du bas vers le haut, de la cible vers le parent le plus éloigné.</p>
          
          <CodeBlock language="javascript">
{`<div id="parent">
  <button id="enfant">Cliquez-moi</button>
</div>

// L'écouteur en mode capture (troisième paramètre à true)
document.getElementById('parent').addEventListener('click', function() {
  console.log('Phase de capture - parent');
}, true);

document.getElementById('enfant').addEventListener('click', function() {
  console.log('Élément cible');
});

// L'écouteur en mode bouillonnement (paramètre optionnel false ou absent)
document.getElementById('parent').addEventListener('click', function() {
  console.log('Phase de bouillonnement - parent');
}, false);  // ou simplement sans le troisième paramètre

// Résultat du clic :
// 1. Phase de capture - parent
// 2. Élément cible  
// 3. Phase de bouillonnement - parent`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-delegation-d-evenements">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Délégation d'événements</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Technique qui consiste à attacher un seul écouteur à un élément parent pour gérer les événements de ses enfants.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Avantages :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Moins de mémoire utilisée</li>
            <li>Fonctionne avec les éléments ajoutés dynamiquement</li>
            <li>Meilleure performance</li>
          </ul>
          
          <CodeBlock language="javascript">
{`// Mauvaise approche : créer des écouteurs pour chaque élément
const boutons = document.querySelectorAll('.bouton');
boutons.forEach(bouton => {
  bouton.addEventListener('click', function() {
    console.log('Bouton cliqué');
  });
});

// Meilleure approche : délégation d'événements
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('bouton')) {
    console.log('Bouton cliqué');
  }
});`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-annulation-du-comportement-par-defaut">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Annulation du comportement par défaut</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Utilisez <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">event.preventDefault()</code> pour empêcher le comportement habituel d'un élément.</p>
          
          <CodeBlock language="javascript">
{`// Empêcher un lien de rediriger
const lien = document.querySelector('a');
lien.addEventListener('click', function(event) {
  event.preventDefault(); // Empêche la redirection
  console.log('Lien cliqué mais pas de redirection');
});

// Empêcher l'envoi d'un formulaire
const formulaire = document.querySelector('form');
formulaire.addEventListener('submit', function(event) {
  event.preventDefault(); // Empêche l'envoi traditionnel
  // Traitement personnalisé du formulaire
  console.log('Formulaire envoyé avec traitement personnalisé');
});

// Empêcher la copie dans un champ
const champ = document.getElementById('champ');
champ.addEventListener('copy', function(event) {
  event.preventDefault();
  alert('La copie est interdite !');
});`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez une page HTML avec :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Un conteneur avec plusieurs boutons (5-10)</li>
            <li>Un formulaire avec un champ de texte et un bouton d'envoi</li>
            <li>Un lien vers une autre page</li>
          </ul>
          <p className="mb-2 sm:mb-3">Implémentez les fonctionnalités suivantes :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Utilisez la délégation d'événements pour gérer les clics sur les boutons</li>
            <li>Empêchez l'envoi du formulaire et affichez les données dans la console</li>
            <li>Empêchez le lien de rediriger et affichez un message</li>
            <li>Surveillez les touches pressées dans le champ de texte et affichez-les</li>
          </ul>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Lorsqu'un bouton est cliqué : "Bouton X cliqué"
// Lorsqu'une touche est pressée dans le champ : "Touche pressée: [valeur]"
// Lors de la soumission du formulaire : "Formulaire soumis avec données: [valeur du champ]"
// Lors d'un clic sur le lien : "Lien cliqué, redirection empêchée"`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson6;