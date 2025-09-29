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

const Lesson4 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 4: Manipulation du DOM</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Apprendre à sélectionner, modifier et créer des éléments HTML avec JavaScript pour interagir dynamiquement avec la page.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-sélection-déléments">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Sélection d'éléments</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Pour manipuler le DOM, il faut d'abord sélectionner les éléments HTML.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Sélecteurs DOM :</h4>
          <CodeBlock language="javascript">
{`// Par ID
let titre = document.getElementById("titre_principal");

// Par classe CSS
let paragraphes = document.getElementsByClassName("texte");

// Par balise HTML
let boutons = document.getElementsByTagName("button");

// Par sélecteur CSS (le plus polyvalent)
let premierParagraphe = document.querySelector("p");
let tousLesLiens = document.querySelectorAll("a");`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">querySelector</code> et <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">querySelectorAll</code> sont les plus puissants car ils acceptent tous les sélecteurs CSS.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-modification-du-contenu">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Modification du contenu</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Changer le contenu textuel ou HTML des éléments sélectionnés.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">textContent vs innerHTML :</h4>
          <CodeBlock language="javascript">
{`let element = document.getElementById("monElement");

// Pour le texte brut (sécurisé)
element.textContent = "Nouveau texte";

// Pour le code HTML
element.innerHTML = "<strong>Texte en gras</strong>";

// Accéder au contenu
console.log(element.textContent); // Le texte sans balises HTML
console.log(element.innerHTML);   // Le contenu avec balises HTML`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Attributs et propriétés :</h4>
          <CodeBlock language="javascript">
{`let img = document.querySelector("img");

// Lire un attribut
console.log(img.src);

// Changer un attribut
img.src = "nouvelle_image.jpg";
img.alt = "Description de l'image";

// Classes CSS
let div = document.querySelector("#maDiv");
div.className = "nouvelle-classe"; // Remplace toutes les classes
div.classList.add("classe-additionnelle"); // Ajoute une classe
div.classList.remove("ancienne-classe"); // Supprime une classe
div.classList.toggle("classe-optionnelle"); // Ajoute/supprime selon l'état`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-creation-déléments">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Création d'éléments</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Créer de nouveaux éléments HTML et les ajouter au DOM.</p>

          <CodeBlock language="javascript">
{`// Créer un nouvel élément
let nouveauParagraphe = document.createElement("p");

// Ajouter du contenu
nouveauParagraphe.textContent = "Ce paragraphe a été créé avec JavaScript !";

// Ajouter au document
document.body.appendChild(nouveauParagraphe);

// Autre exemple : créer une liste
let liste = document.createElement("ul");
let items = ["Pomme", "Banane", "Orange"];

items.forEach(item => {
  let li = document.createElement("li");
  li.textContent = item;
  liste.appendChild(li);
});

document.body.appendChild(liste);`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-style-css">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Manipulation du style CSS</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Changer l'apparence des éléments.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Avec la propriété style :</h4>
          <CodeBlock language="javascript">
{`let element = document.querySelector(".important");

// Changer des propriétés CSS spécifiques
element.style.color = "red";
element.style.fontSize = "20px";
element.style.backgroundColor = "yellow";

// Pour les propriétés avec tiret, utiliser camelCase
element.style.borderRadius = "10px";`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Avec les classes CSS :</h4>
          <CodeBlock language="javascript">
{`let bouton = document.querySelector("#monBouton");

// Ajouter/supprimer des classes pour le style
bouton.classList.add("bouton-actif");
bouton.classList.remove("bouton-inactif");

// Vérifier si une classe est présente
if (bouton.classList.contains("bouton-actif")) {
  console.log("Le bouton est actif");
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-suppression-déléments">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Suppression d'éléments</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Supprimer des éléments du DOM.</p>

          <CodeBlock language="javascript">
{`let elementASupprimer = document.querySelector(".temporaire");

// Supprimer l'élément
elementASupprimer.remove();

// Ou via son parent
let parent = elementASupprimer.parentNode;
parent.removeChild(elementASupprimer);`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-exemples-pratiques">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Exemples pratiques</h2>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Créer un compteur dynamique :</h4>
          <CodeBlock language="javascript">
{`// HTML : <button id="bouton-compteur">Cliquez moi !</button>
let bouton = document.getElementById("bouton-compteur");
let compteur = 0;

bouton.addEventListener("click", function() {
  compteur++;
  bouton.textContent = "Cliqué " + compteur + " fois";
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Changer le thème de la page :</h4>
          <CodeBlock language="javascript">
{`// HTML : <button id="change-theme">Changer thème</button>
let boutonTheme = document.getElementById("change-theme");
let estSombre = false;

boutonTheme.addEventListener("click", function() {
  if (estSombre) {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    boutonTheme.textContent = "Passer en mode sombre";
  } else {
    document.body.style.backgroundColor = "#333";
    document.body.style.color = "white";
    boutonTheme.textContent = "Passer en mode clair";
  }
  estSombre = !estSombre;
});`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez une page HTML avec une liste vide <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">&lt;ul id="liste-taches"&gt;&lt;/ul&gt;</code> et un champ de saisie.</p>
          <p className="mb-2 sm:mb-3">Écrivez un script JavaScript qui permet d'ajouter un élément à la liste lorsqu'on clique sur un bouton.</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <CodeBlock language="javascript">
{`// Lorsque l'utilisateur saisit "Acheter du pain" et clique sur le bouton
// La liste devrait contenir : <li>Acheter du pain</li>

// Astuce : Vous devrez créer des éléments <li> dynamiquement`}
          </CodeBlock>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson4;