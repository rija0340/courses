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

const Lesson9 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 9: Manipulation du DOM avancée (création dynamique, fragments, performance)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Maîtriser les techniques avancées de manipulation du DOM, y compris la création d'éléments dynamiques, l'utilisation des fragments et les bonnes pratiques de performance.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-creation-dynamique-d-elements">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Création dynamique d'éléments</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Créer des éléments HTML dynamiquement avec JavaScript permet de construire des interfaces utilisateur interactives.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthodes de création d'éléments :</h4>
          <CodeBlock language="javascript">
{`// Création d'un élément avec createElement
const nouveauDiv = document.createElement('div');
nouveauDiv.textContent = 'Contenu du nouvel élément';
nouveauDiv.className = 'ma-classe';
nouveauDiv.id = 'mon-id';

// Ajout d'un attribut
nouveauDiv.setAttribute('data-info', 'valeur-importante');

// Ajout à un parent existant
document.body.appendChild(nouveauDiv);

// Autres exemples de création
const bouton = document.createElement('button');
bouton.textContent = 'Cliquez-moi';
bouton.addEventListener('click', () => alert('Bouton cliqué !'));

const lien = document.createElement('a');
lien.href = 'https://example.com';
lien.textContent = 'Lien vers example.com';
lien.target = '_blank'; // Ouvrir dans une nouvelle fenêtre`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Création d'éléments avec enfants imbriqués :</h4>
          <CodeBlock language="javascript">
{`// Création d'une structure complexe
const article = document.createElement('article');
article.className = 'article';

const titre = document.createElement('h2');
titre.textContent = 'Titre de l\'article';

const contenu = document.createElement('p');
contenu.textContent = 'Contenu de l\'article...';

const bouton = document.createElement('button');
bouton.textContent = 'Lire la suite';
bouton.addEventListener('click', () => {
  console.log('Lecture de l\'article');
});

// Assemblage de la structure
article.appendChild(titre);
article.appendChild(contenu);
article.appendChild(bouton);

// Ajout à la page
document.getElementById('conteneur').appendChild(article);`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-fragments-du-dom">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Fragments du DOM (DocumentFragment)</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">DocumentFragment est un document léger sans enfant unique, utile pour assembler un ensemble d'éléments en mémoire avant insertion dans le DOM.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Problème sans fragments :</h4>
          <CodeBlock language="javascript">
{`// Mauvaise approche - plusieurs modifications du DOM
const liste = document.getElementById('liste');

// Chaque appendChild() déclenche un recalcul du DOM
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('li');
  item.textContent = 'Item ' + i;
  liste.appendChild(item); // Chaque ajout provoque un reflow/layout
  // Cela peut être très lent avec beaucoup d'éléments
}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Solution avec DocumentFragment :</h4>
          <CodeBlock language="javascript">
{`// Meilleure approche - une seule modification du DOM
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const item = document.createElement('li');
  item.textContent = 'Item ' + i;
  fragment.appendChild(item); // Ajout au fragment, pas au DOM
}

// Une seule insertion dans le DOM
document.getElementById('liste').appendChild(fragment);
// Beaucoup plus performant, surtout avec beaucoup d'éléments`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple complet avec fragments :</h4>
          <CodeBlock language="javascript">
{`function creerListeElements(elements) {
  const fragment = document.createDocumentFragment();
  
  elements.forEach(element => {
    const li = document.createElement('li');
    li.className = 'item-liste';
    
    const span = document.createElement('span');
    span.textContent = element.titre;
    
    const bouton = document.createElement('button');
    bouton.textContent = 'Supprimer';
    bouton.addEventListener('click', () => {
      li.remove(); // Suppression de l'élément
    });
    
    li.appendChild(span);
    li.appendChild(bouton);
    fragment.appendChild(li);
  });
  
  return fragment;
}

// Utilisation
const elements = [
  { titre: 'Tâche 1' },
  { titre: 'Tâche 2' },
  { titre: 'Tâche 3' }
];

const liste = document.getElementById('ma-liste');
liste.appendChild(creerListeElements(elements));`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-performance-et-bonnes-pratiques">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Performance et bonnes pratiques</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Reflow et Repaint :</h4>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Le reflow (re-calcul de la disposition) et repaint (re-dessin) sont coûteux. Minimisez-les pour de meilleures performances.</p>
          
          <CodeBlock language="javascript">
{`// Mauvaise pratique - provoque plusieurs reflows
const element = document.getElementById('mon-element');
element.style.border = '1px solid black';
element.style.margin = '10px';
element.style.padding = '5px';
element.style.display = 'block'; // Chaque changement peut provoquer un reflow

// Meilleure pratique - minimise les reflows
const element = document.getElementById('mon-element');
// Utiliser les classes CSS plutôt que de modifier directement les styles
element.classList.add('style-personnalise');`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Batching des lectures et écritures :</h4>
          <CodeBlock language="javascript">
{`// Mauvaise pratique - lectures et écritures alternées
const element = document.getElementById('box');
element.style.left = (parseInt(element.style.left) || 0) + 10 + 'px';
const width = element.offsetWidth;  // Lecture
element.style.left = (parseInt(element.style.left) || 0) + 10 + 'px';
const height = element.offsetHeight; // Lecture

// Meilleure pratique - regrouper les lectures et écritures
const element = document.getElementById('box');

// 1. Toutes les lectures en premier
const currentLeft = parseInt(element.style.left) || 0;
const currentWidth = element.offsetWidth;
const currentHeight = element.offsetHeight;

// 2. Toutes les écritures ensuite
element.style.left = currentLeft + 20 + 'px';`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Lors de la manipulation de nombreux éléments, préférez les fragments, les classes CSS et modifiez les propriétés en lots pour éviter les recalculs fréquents.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-techniques-avancees-de-manipulation">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Techniques avancées de manipulation</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Insertion de contenu HTML :</h4>
          <CodeBlock language="javascript">
{`const conteneur = document.getElementById('conteneur');

// innerHTML - attention à XSS
conteneur.innerHTML = '<p>Contenu <strong>HTML</strong> inséré</p>';

// insertAdjacentHTML - plus flexible et plus sûr pour du contenu connu
conteneur.insertAdjacentHTML('beforeend', '<div class="nouvel-element">Contenu</div>');

// Méthodes disponibles avec insertAdjacentHTML :
// 'beforebegin' - avant l'élément
// 'afterbegin' - premier enfant
// 'beforeend' - dernier enfant  
// 'afterend' - après l'élément`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Clonage d'éléments :</h4>
          <CodeBlock language="javascript">
{`// Cloner un élément existant
const modele = document.getElementById('modele-ligne');
const nouvelleLigne = modele.cloneNode(true); // true = clonage profond (enfants inclus)

// Modifier les propriétés du clone
nouvelleLigne.id = 'ligne-' + Date.now(); // Nouvel ID unique
nouvelleLigne.querySelector('.titre').textContent = 'Nouveau titre';

// Ajouter le clone
document.getElementById('conteneur').appendChild(nouvelleLigne);`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Templates HTML :</h4>
          <CodeBlock language="javascript">
{`// Utilisation de l'élément <template>
const template = document.getElementById('modele-personne');
const clone = template.content.cloneNode(true);

// Remplir les données
clone.querySelector('.nom').textContent = 'Jean Dupont';
clone.querySelector('.email').textContent = 'jean@example.com';
clone.querySelector('.bouton').addEventListener('click', () => {
  console.log('Contact sélectionné');
});

// Ajouter le clone
document.getElementById('liste-contacts').appendChild(clone);`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-optimisation-de-la-performance">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Optimisation de la performance</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Utilisation de RequestAnimationFrame :</h4>
          <CodeBlock language="javascript">
{`// Pour les animations ou mises à jour fréquentes
function animerElement() {
  // Mise à jour des propriétés
  const element = document.getElementById('animable');
  element.style.transform = 'translateX(' + (Math.random() * 100) + 'px)';
  
  // Planifier la prochaine animation
  requestAnimationFrame(animerElement);
}

// Démarrer l'animation
requestAnimationFrame(animerElement);`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Virtualisation des listes (concept) :</h4>
          <CodeBlock language="javascript">
{`// Technique pour n'afficher que les éléments visibles
class ListeVirtuelle {
  constructor(elementContainer, hauteurElement = 50) {
    this.container = elementContainer;
    this.hauteurElement = hauteurElement;
    this.elements = [];
    this.elementsVisibles = [];
  }
  
  setElements(elements) {
    this.elements = elements;
    this.container.style.height = (this.elements.length * this.hauteurElement) + 'px';
    this.updateElementsVisibles();
  }
  
  updateElementsVisibles() {
    // Calculer les index des éléments visibles
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;
    
    const startIndex = Math.floor(scrollTop / this.hauteurElement);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / this.hauteurElement) + 5, // 5 éléments de plus pour fluide
      this.elements.length
    );
    
    // N'afficher que les éléments visibles + un peu plus
    this.renderElements(startIndex, endIndex);
  }
  
  renderElements(startIndex, endIndex) {
    // Vider le conteneur visible
    this.container.innerHTML = '';
    
    // Ajouter les éléments visibles
    for (let i = startIndex; i < endIndex; i++) {
      if (this.elements[i]) {
        const element = this.createElement(this.elements[i]);
        element.style.position = 'absolute';
        element.style.top = (i * this.hauteurElement) + 'px';
        this.container.appendChild(element);
      }
    }
  }
  
  createElement(data) {
    const div = document.createElement('div');
    div.textContent = data.text;
    div.style.height = this.hauteurElement + 'px';
    return div;
  }
}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Éviter la reflow à chaque itération :</h4>
          <CodeBlock language="javascript">
{`// Mauvaise pratique - lecture/écriture à chaque itération
const elements = document.querySelectorAll('.element');
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight; // Lecture (provoque reflow)
  elements[i].style.height = (height * 2) + 'px'; // Écriture
}

// Meilleure pratique - batch les lectures
const elements = document.querySelectorAll('.element');
const heights = [];

// 1. Lire toutes les hauteurs
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight);
}

// 2. Ensuite, modifier les hauteurs
for (let i = 0; i < elements.length; i++) {
  elements[i].style.height = (heights[i] * 2) + 'px';
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-methodes-de-selection-efficaces">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Méthodes de sélection efficaces</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Comparaison des méthodes de sélection :</h4>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retourne</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">getElementById()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Très rapide</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Par ID unique</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Un élément ou null</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">getElementsByClassName()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Rapide</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Par nom de classe</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">HTMLCollection dynamique</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">querySelector()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Modérément rapide</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Par sélecteur CSS</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Un élément ou null</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">querySelectorAll()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Modérément rapide</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Par sélecteur CSS</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">NodeList statique</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple de sélection optimisée :</h4>
          <CodeBlock language="javascript">
{`// Mauvaise pratique - sélection répétée
function updateElements() {
  for (let i = 0; i < 1000; i++) {
    document.getElementById('mon-element').style.color = 'red'; // Recherche à chaque fois
  }
}

// Meilleure pratique - sélection une fois
function updateElements() {
  const element = document.getElementById('mon-element'); // Une seule recherche
  for (let i = 0; i < 1000; i++) {
    element.style.color = 'red'; // Utilisation de la référence
  }
}

// Pour de multiples éléments
function updateMultipleElements() {
  // Une seule recherche pour tous les éléments
  const elements = document.querySelectorAll('.element-cible');
  
  elements.forEach(element => {
    element.style.color = 'blue';
  });
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="7-exemple-complet">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">7. Exemple complet</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Voici un exemple complet d'une application qui utilise les techniques avancées de manipulation du DOM :</p>
          
          <CodeBlock language="javascript">
{`class ListeDynamique {
  constructor(conteneur, options = {}) {
    this.conteneur = conteneur;
    this.elements = [];
    this.options = {
      hauteurElement: options.hauteurElement || 40,
      tailleCache: options.tailleCache || 100
    };
    
    this.creerStructure();
  }
  
  creerStructure() {
    this.conteneur.innerHTML = '';
    
    // Créer la liste
    this.liste = document.createElement('div');
    this.liste.className = 'liste-dynamique';
    this.conteneur.appendChild(this.liste);
    
    // Ajouter un gestionnaire de défilement pour la virtualisation
    this.liste.addEventListener('scroll', this.declencherMiseAJour.bind(this));
  }
  
  // Définir les données
  setData(nouveauxElements) {
    this.elements = nouveauxElements;
    this.mettreAJourHauteurTotale();
    this.mettreAJourElementsVisibles();
  }
  
  // Mettre à jour la hauteur totale (pour le défilement)
  mettreAJourHauteurTotale() {
    this.liste.style.height = (this.elements.length * this.options.hauteurElement) + 'px';
  }
  
  // Mettre à jour les éléments visibles
  mettreAJourElementsVisibles() {
    // Effacer les anciens éléments visibles
    const elementsExistant = this.liste.querySelectorAll('.element-cache');
    elementsExistant.forEach(el => el.remove());
    
    // Calculer les index visibles
    const startIndex = Math.floor(this.liste.scrollTop / this.options.hauteurElement);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.liste.clientHeight / this.options.hauteurElement) + 5,
      this.elements.length
    );
    
    // Créer un fragment pour les nouveaux éléments
    const fragment = document.createDocumentFragment();
    
    for (let i = startIndex; i < endIndex; i++) {
      if (this.elements[i]) {
        const element = this.creerElement(i, this.elements[i]);
        fragment.appendChild(element);
      }
    }
    
    // Ajouter le fragment au DOM (une seule opération)
    this.liste.appendChild(fragment);
  }
  
  // Créer un élément de la liste
  creerElement(index, donnees) {
    const element = document.createElement('div');
    element.className = 'element-cache';
    element.style.position = 'absolute';
    element.style.top = (index * this.options.hauteurElement) + 'px';
    element.style.height = this.options.hauteurElement + 'px';
    element.style.left = '0';
    element.style.right = '0';
    element.style.padding = '0 10px';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.borderBottom = '1px solid #eee';
    
    // Ajouter le contenu
    element.innerHTML = \`
      <span class="index">#\${index}</span>
      <span class="contenu">\${donnees.nom || donnees.text || donnees.titre}</span>
    \`;
    
    // Ajouter un événement
    element.addEventListener('click', () => {
      console.log('Élément sélectionné :', donnees);
    });
    
    return element;
  }
  
  // Gestionnaire de défilement
  declencherMiseAJour() {
    // Utiliser requestAnimationFrame pour optimiser les performances
    if (!this.enMiseAJour) {
      this.enMiseAJour = true;
      requestAnimationFrame(() => {
        this.mettreAJourElementsVisibles();
        this.enMiseAJour = false;
      });
    }
  }
  
  // Méthode pour ajouter un élément
  ajouterElement(element) {
    this.elements.push(element);
    this.mettreAJourHauteurTotale();
    
    // Si l'élément est dans la zone visible, le rajouter
    const index = this.elements.length - 1;
    const scrollTop = this.liste.scrollTop;
    const positionElement = index * this.options.hauteurElement;
    const hauteurVisible = this.liste.scrollTop + this.liste.clientHeight;
    
    if (positionElement >= scrollTop && positionElement < hauteurVisible) {
      const nouvelElement = this.creerElement(index, element);
      this.liste.appendChild(nouvelElement);
    }
  }
  
  // Méthode pour supprimer un élément
  supprimerElement(index) {
    if (index >= 0 && index < this.elements.length) {
      this.elements.splice(index, 1);
      // Recharger l'affichage
      this.liste.innerHTML = '';
      this.mettreAJourHauteurTotale();
      this.mettreAJourElementsVisibles();
    }
  }
}

// Utilisation
const liste = new ListeDynamique(document.getElementById('conteneur-liste'), {
  hauteurElement: 50
});

// Ajouter des données
const donnees = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  nom: 'Élément ' + i,
  description: 'Description de l\'élément ' + i
}));

liste.setData(donnees);`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez une application de gestion de tâches qui :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Affiche une liste dynamique de tâches (au moins 100 tâches simulées)</li>
            <li>Permet d'ajouter de nouvelles tâches</li>
            <li>Permet de supprimer des tâches</li>
            <li>Permet de marquer des tâches comme terminées</li>
          </ul>
          <p className="mb-2 sm:mb-3">Implémentez votre application en utilisant les techniques de performance avancées :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Utilisez DocumentFragment pour l'ajout multiple d'éléments</li>
            <li>Optimisez les sélections DOM</li>
            <li>Minimisez les reflows et repaints</li>
            <li>Implémentez une forme de virtualisation pour les grandes listes</li>
          </ul>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Affiche une liste fluide de tâches
// Ajout/suppression de tâches sans ralentissement
// Les tâches marquées terminées apparaissent différemment
// Performance optimisée même avec 1000+ tâches`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson9;