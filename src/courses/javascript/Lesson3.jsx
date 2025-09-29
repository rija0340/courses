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

const Lesson3 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 3: Tableaux et Objets</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Maîtriser la manipulation des tableaux et objets, structures de données fondamentales en JavaScript.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-tableaux">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Tableaux</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les tableaux permettent de stocker plusieurs valeurs dans une seule variable.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Création de tableaux :</h4>
          <CodeBlock language="javascript">
{`// Méthode 1 : notation littérale (recommandée)
let fruits = ["pomme", "banane", "orange"];

// Méthode 2 : constructeur Array
let legumes = new Array("carotte", "brocoli", "salade");`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Accéder aux éléments :</h4>
          <CodeBlock language="javascript">
{`console.log(fruits[0]); // "pomme"
console.log(fruits[fruits.length - 1]); // "orange" (dernier élément)

// Modification
fruits[1] = "poire"; // ["pomme", "poire", "orange"]`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-méthodes-utiles-tableaux">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Méthodes utiles pour les tableaux</h2>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Ajout/Suppression :</h4>
          <CodeBlock language="javascript">
{`let couleurs = ["rouge", "bleu"];

// Ajouter à la fin
couleurs.push("vert");
console.log(couleurs); // ["rouge", "bleu", "vert"]

// Ajouter au début
couleurs.unshift("jaune");
console.log(couleurs); // ["jaune", "rouge", "bleu", "vert"]

// Supprimer le dernier
couleurs.pop();
console.log(couleurs); // ["jaune", "rouge", "bleu"]

// Supprimer le premier
couleurs.shift();
console.log(couleurs); // ["rouge", "bleu"]`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Itération :</h4>
          <CodeBlock language="javascript">
{`let nombres = [1, 2, 3, 4, 5];

// forEach : exécute une fonction pour chaque élément
nombres.forEach(nombre => {
  console.log(nombre * 2);
}); // Affiche: 2, 4, 6, 8, 10

// map : crée un nouveau tableau avec les résultats
let carres = nombres.map(nombre => nombre * nombre);
console.log(carres); // [1, 4, 9, 16, 25]

// filter : crée un nouveau tableau avec les éléments qui passent le test
let pairs = nombres.filter(nombre => nombre % 2 === 0);
console.log(pairs); // [2, 4]`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-objets">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Objets</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les objets permettent de stocker des collections de données nommées.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Création d'objets :</h4>
          <CodeBlock language="javascript">
{`// Notation littérale (recommandée)
let personne = {
  prenom: "Alice",
  nom: "Dupont",
  age: 28,
  profession: "développeuse"
};`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Accéder aux propriétés :</h4>
          <CodeBlock language="javascript">
{`console.log(personne.prenom); // "Alice"
console.log(personne["nom"]); // "Dupont"

// Ajouter une propriété
personne.ville = "Paris";
personne["pays"] = "France";

// Supprimer une propriété
delete personne.profession;`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Utilisez la notation <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">personne.propriete</code> quand vous connaissez le nom de la propriété, et <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">personne["propriete"]</code> quand le nom est dynamique.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-methodes-objets">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Méthodes dans les objets</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les méthodes sont des propriétés de type fonction.</p>

          <CodeBlock language="javascript">
{`let utilisateur = {
  nom: "Alice",
  age: 28,
  
  // Méthode
  saluer: function() {
    return "Bonjour, je m'appelle " + this.nom;
  },
  
  // ES6+ syntaxe raccourcie
  presenter() {
    return this.nom + " a " + this.age + " ans";
  }
};

console.log(utilisateur.saluer()); // "Bonjour, je m'appelle Alice"
console.log(utilisateur.presenter()); // "Alice a 28 ans"`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-itération-objets">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Itération dans les objets</h2>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Boucle for...in :</h4>
          <CodeBlock language="javascript">
{`let voiture = {
  marque: "Toyota",
  modele: "Corolla",
  annee: 2020
};

for (let propriete in voiture) {
  console.log(propriete + ": " + voiture[propriete]);
}
// Affiche:
// marque: Toyota
// modele: Corolla
// annee: 2020`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-destructuring">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Déstructuration (Destructuring)</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Technique pour extraire des valeurs d'objets ou tableaux dans des variables distinctes.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Pour les objets :</h4>
          <CodeBlock language="javascript">
{`let personne = {
  nom: "Alice",
  age: 28,
  ville: "Paris"
};

// Déstructuration
let { nom, age } = personne;
console.log(nom); // "Alice"
console.log(age); // 28`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Pour les tableaux :</h4>
          <CodeBlock language="javascript">
{`let couleurs = ["rouge", "vert", "bleu"];

// Déstructuration
let [premiere, deuxieme] = couleurs;
console.log(premiere); // "rouge"
console.log(deuxieme); // "vert"`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez un objet <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">bibliotheque</code> contenant un tableau de livres.</p>
          <p className="mb-2 sm:mb-3">Chaque livre devrait avoir les propriétés : titre, auteur et annee.</p>
          <p className="mb-2 sm:mb-3">Ajoutez une méthode <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">trouverLivreParTitre</code> qui prend un titre et retourne le livre correspondant.</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <CodeBlock language="javascript">
{`let bibliotheque = {
  livres: [
    { titre: "1984", auteur: "George Orwell", annee: 1949 },
    { titre: "Le Petit Prince", auteur: "Antoine de Saint-Exupéry", annee: 1943 }
  ],
  
  trouverLivreParTitre: function(titre) {
    // Votre code ici
  }
};

console.log(bibliotheque.trouverLivreParTitre("1984"));
// Devrait retourner: { titre: "1984", auteur: "George Orwell", annee: 1949 }`}
          </CodeBlock>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson3;