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

const Lesson5 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 5: Événements et Programmation Asynchrone</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Comprendre comment gérer les interactions utilisateur et les opérations asynchrones en JavaScript.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-événements-dom">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Événements DOM</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les événements permettent de réagir aux actions de l'utilisateur.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthode addEventListener :</h4>
          <CodeBlock language="javascript">
{`let bouton = document.querySelector("#monBouton");

// Ajouter un gestionnaire d'événement
bouton.addEventListener("click", function(event) {
  console.log("Le bouton a été cliqué !");
  console.log(event); // L'objet événement
});

// Autres événements courants
let input = document.querySelector("#monInput");

input.addEventListener("input", function() {
  console.log("Valeur changée: " + this.value);
});

input.addEventListener("focus", function() {
  console.log("Champ en focus");
});

input.addEventListener("blur", function() {
  console.log("Champ perdu focus");
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Types courants d'événements :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">click</code> - clic de souris</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">input</code> - changement de valeur d'un champ</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">submit</code> - envoi d'un formulaire</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">keydown</code> - appui sur une touche (maintenue)</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">keyup</code> - relâchement d'une touche</li>
          </ul>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-objets-événements">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Objets événements</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">L'objet événement contient des informations sur l'événement.</p>

          <CodeBlock language="javascript">
{`let formulaire = document.querySelector("#monFormulaire");

formulaire.addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche l'envoi du formulaire
  
  console.log("Formulaire soumis !");
  console.log("Target:", event.target); // L'élément qui a déclenché l'événement
});

let bouton = document.querySelector(".monBouton");

bouton.addEventListener("click", function(event) {
  console.log("Coordonnées: X=" + event.clientX + ", Y=" + event.clientY);
  event.stopPropagation(); // Empêche la propagation à l'élément parent
});`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-programmation-asynchrone">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Programmation asynchrone</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Exécuter du code sans bloquer l'exécution du reste du programme.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">setTimeout et setInterval :</h4>
          <CodeBlock language="javascript">
{`// Exécuter une fonction après un certain délai
setTimeout(function() {
  console.log("Ceci s'affiche après 2 secondes");
}, 2000);

// Exécuter une fonction à intervalles réguliers
let compteur = 0;
let intervalId = setInterval(function() {
  compteur++;
  console.log("Compteur: " + compteur);
  
  if (compteur >= 5) {
    clearInterval(intervalId); // Arrêter l'intervalle
    console.log("Arrêt du compteur");
  }
}, 1000); // Toutes les 1000ms (1 seconde)`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-promesses">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Promesses (Promises)</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Mécanisme pour gérer les opérations asynchrones.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Création d'une promesse :</h4>
          <CodeBlock language="javascript">
{`// Créer une promesse qui résout après 1 seconde
let promesse = new Promise(function(resolve, reject) {
  setTimeout(function() {
    let succes = true; // Simuler une opération qui réussit
    
    if (succes) {
      resolve("Opération réussie !");
    } else {
      reject("Erreur lors de l'opération");
    }
  }, 1000);
});

// Utiliser la promesse
promesse
  .then(function(resultat) {
    console.log(resultat); // "Opération réussie !" (après 1s)
  })
  .catch(function(erreur) {
    console.log(erreur);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Enchaînement de promesses :</h4>
          <CodeBlock language="javascript">
{`function attendreEtDoubler(valeur) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(valeur * 2);
    }, 500);
  });
}

attendreEtDoubler(5)
  .then(function(resultat1) {
    console.log(resultat1); // 10
    return attendreEtDoubler(resultat1); // Retourne une nouvelle promesse
  })
  .then(function(resultat2) {
    console.log(resultat2); // 20
    return attendreEtDoubler(resultat2);
  })
  .then(function(resultat3) {
    console.log(resultat3); // 40
  });`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-async-await">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. async/await</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Syntaxe moderne pour gérer les promesses de manière plus lisible.</p>

          <CodeBlock language="javascript">
{`function attendreEtDoubler(valeur) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(valeur * 2);
    }, 500);
  });
}

// Fonction asynchrone
async function exemple() {
  console.log("Début");
  
  let resultat1 = await attendreEtDoubler(5);
  console.log(resultat1); // 10
  
  let resultat2 = await attendreEtDoubler(resultat1);
  console.log(resultat2); // 20
  
  let resultat3 = await attendreEtDoubler(resultat2);
  console.log(resultat3); // 40
  
  console.log("Fin");
}

exemple();`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Utilisez <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">async/await</code> pour écrire du code asynchrone qui ressemble à du code synchrone - c'est plus lisible que les chaînes de <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">.then()</code>.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-fatch-api">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. API Fetch</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Méthode moderne pour effectuer des requêtes HTTP.</p>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Requête GET avec fetch :</h4>
          <CodeBlock language="javascript">
{`// Avec les promesses
fetch('https://api.example.com/data')
  .then(function(response) {
    return response.json(); // Convertir la réponse en JSON
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(erreur) {
    console.error('Erreur:', erreur);
  });

// Avec async/await
async function recupererDonnees() {
  try {
    let response = await fetch('https://api.example.com/data');
    let data = await response.json();
    console.log(data);
  } catch (erreur) {
    console.error('Erreur:', erreur);
  }
}`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez une fonction <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">obtenirMeteo</code> qui simule une API météo.</p>
          <p className="mb-2 sm:mb-3">La fonction devrait retourner une promesse qui résout avec un objet contenant la température.</p>
          <p className="mb-2 sm:mb-3">Utilisez <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">async/await</code> pour afficher la température dans la console.</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <CodeBlock language="javascript">
{`async function exempleMeteo() {
  let resultat = await obtenirMeteo("Paris");
  console.log("Température à Paris: " + resultat.temperature + "°C");
  // Afficherait par exemple: "Température à Paris: 22°C"
}`}
          </CodeBlock>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson5;