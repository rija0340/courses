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

const Lesson7 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 7: Asynchronisme (callbacks, Promises, async/await)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Comprendre la programmation asynchrone en JavaScript et maîtriser les différentes approches : callbacks, Promesses et async/await.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-introduction-a-l-asynchronisme">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Introduction à l'asynchronisme</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">JavaScript est un langage à exécution unique (single-threaded) mais capable d'opérations asynchrones.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Opérations synchrones vs asynchrones :</h4>
          <CodeBlock language="javascript">
{`// Opération synchrone - bloque l'exécution jusqu'à la fin
console.log('Début');
let resultat = 2 + 2;
console.log('Résultat :', resultat);
console.log('Fin');

// Sortie :
// Début
// Résultat : 4
// Fin

// Opération asynchrone - continue l'exécution immédiatement
console.log('Début');
setTimeout(() => {
  console.log('Opération asynchrone terminée');
}, 1000); // Délai de 1 seconde
console.log('Fin');

// Sortie :
// Début
// Fin
// Opération asynchrone terminée (après 1 seconde)`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> L'asynchronisme est essentiel pour les opérations qui prennent du temps (requêtes réseau, lecture fichiers, temporisations) sans bloquer l'exécution du reste du code.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-les-callbacks">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Les callbacks</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Une fonction de rappel (callback) est une fonction passée à une autre fonction en tant qu'argument et exécutée plus tard.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemples de callbacks :</h4>
          <CodeBlock language="javascript">
{`// setTimeout avec callback
setTimeout(() => {
  console.log('1 seconde s\'est écoulée');
}, 1000);

// Méthodes de tableau avec callbacks
const nombres = [1, 2, 3, 4];
nombres.forEach(nombre => console.log(nombre));

// Callback personnalisé
function faireQuelqueChose(callback) {
  console.log('Faire quelque chose...');
  callback();
}

faireQuelqueChose(() => {
  console.log('Callback exécuté');
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Callbacks avec gestion d'erreur :</h4>
          <CodeBlock language="javascript">
{`function operationAsynchrone(reussi, callback) {
  setTimeout(() => {
    if (reussi) {
      callback(null, 'Opération réussie !');
    } else {
      callback(new Error('Échec de l\'opération'), null);
    }
  }, 1000);
}

// Utilisation
operationAsynchrone(true, (erreur, resultat) => {
  if (erreur) {
    console.error('Erreur :', erreur.message);
  } else {
    console.log('Résultat :', resultat);
  }
});`}
          </CodeBlock>

          <TipBox>
            <strong>⚠️ Attention :</strong> Les callbacks peuvent entraîner un problème de "callback hell" (enfer des callbacks) avec des opérations imbriquées.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-le-probleme-du-callback-hell">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Le problème du callback hell</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Lorsque plusieurs opérations asynchrones doivent être enchaînées, cela peut créer un code difficile à lire.</p>
          
          <CodeBlock language="javascript">
{`// Enfer des callbacks (callback hell)
getData(1, (erreur, data1) => {
  if (erreur) {
    console.error(erreur);
    return;
  }
  
  getMoreData(data1.id, (erreur, data2) => {
    if (erreur) {
      console.error(erreur);
      return;
    }
    
    getEvenMoreData(data2.id, (erreur, data3) => {
      if (erreur) {
        console.error(erreur);
        return;
      }
      
      console.log('Données finales :', data3);
    });
  });
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Solution : Utiliser les Promesses</h4>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-les-promesses">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Les Promesses (Promises)</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les Promesses sont des objets qui représentent l'achèvement ou l'échec d'une opération asynchrone.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Création d'une Promesse :</h4>
          <CodeBlock language="javascript">
{`// Syntaxe : new Promise((resolve, reject) => {})
const promesse = new Promise((resolve, reject) => {
  // Simuler une opération asynchrone
  setTimeout(() => {
    const succes = true;
    
    if (succes) {
      resolve('Opération réussie !');
    } else {
      reject(new Error('Échec de l\'opération'));
    }
  }, 1000);
});

// Utilisation avec .then() et .catch()
promesse
  .then(resultat => {
    console.log('Résultat :', resultat);
  })
  .catch(erreur => {
    console.error('Erreur :', erreur.message);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Chaînage de Promesses :</h4>
          <CodeBlock language="javascript">
{`function getData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: id, nom: 'Donnée ' + id });
    }, 500);
  });
}

function getMoreData(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ ...data, details: 'Détails pour ' + data.nom });
    }, 500);
  });
}

// Chaînage de promesses pour éviter le callback hell
getData(1)
  .then(data => {
    console.log('Donnée 1 reçue :', data);
    return getMoreData(data); // Retourner une nouvelle promesse
  })
  .then(dataDetails => {
    console.log('Données complètes :', dataDetails);
    return dataDetails.id;
  })
  .then(id => {
    console.log('ID final :', id);
  })
  .catch(erreur => {
    console.error('Erreur dans la chaîne :', erreur.message);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthodes utilitaires pour les Promesses :</h4>
          <CodeBlock language="javascript">
{`// Promise.all() - attend que toutes les promesses soient résolues
const promesse1 = Promise.resolve('Résultat 1');
const promesse2 = new Promise(resolve => setTimeout(() => resolve('Résultat 2'), 1000));
const promesse3 = fetch('/api/data').then(res => res.json());

Promise.all([promesse1, promesse2, promesse3])
  .then(resultats => {
    console.log('Tous les résultats :', resultats);
  });

// Promise.race() - retourne la première promesse résolue
Promise.race([promesse1, promesse2])
  .then(resultat => {
    console.log('Premier résultat :', resultat); // 'Résultat 1'
  });

// Promise.allSettled() - attend la résolution de toutes les promesses, même si certaines échouent
Promise.allSettled([promesse1, promesse2, Promise.reject('Erreur')])
  .then(resultats => {
    console.log('Résultats (tous) :', resultats);
  });`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-async-await">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. async/await</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Syntaxe moderne pour travailler avec les promesses, rendant le code asynchrone plus lisible.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Syntaxe de base :</h4>
          <CodeBlock language="javascript">
{`// Déclarer une fonction asynchrone avec async
async function fonctionAsynchrone() {
  try {
    // Attendre la résolution d'une promesse avec await
    const resultat = await unePromesse();
    console.log('Résultat :', resultat);
    return resultat;
  } catch (erreur) {
    console.error('Erreur capturée :', erreur.message);
  }
}

// Exemple avec les fonctions définies précédemment
async function exempleAsyncAwait() {
  try {
    console.log('Récupération des données...');
    const data = await getData(1); // Attend la promesse
    console.log('Donnée reçue :', data);
    
    const dataDetails = await getMoreData(data); // Attend la promesse
    console.log('Données complètes :', dataDetails);
    
    return dataDetails;
  } catch (erreur) {
    console.error('Erreur dans la fonction :', erreur.message);
  }
}

// Appel de la fonction asynchrone
exempleAsyncAwait();`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Comparaison entre les approches :</h4>
          <CodeBlock language="javascript">
{`// Avec callbacks (ancienne approche)
getData(1, (err, data) => {
  if (err) return console.error(err);
  
  getMoreData(data.id, (err, moreData) => {
    if (err) return console.error(err);
    console.log(moreData);
  });
});

// Avec Promesses (approche moderne)
getData(1)
  .then(data => getMoreData(data.id))
  .then(moreData => console.log(moreData))
  .catch(err => console.error(err));

// Avec async/await (approche moderne + lisible)
async function faireQuelqueChose() {
  try {
    const data = await getData(1);
    const moreData = await getMoreData(data.id);
    console.log(moreData);
  } catch (err) {
    console.error(err);
  }
}`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">await</code> ne peut être utilisé que dans une fonction déclarée avec <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">async</code>. Il ne peut pas être utilisé dans le code synchrone global.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-gestion-des-erreurs">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Gestion des erreurs</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Avec les Promesses :</h4>
          <CodeBlock language="javascript">
{`maPromesse
  .then(resultat => {
    console.log('Succès :', resultat);
    // Traitement du résultat
  })
  .catch(erreur => {
    console.error('Erreur capturée :', erreur.message);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Avec async/await :</h4>
          <CodeBlock language="javascript">
{`async function exempleGestionErreur() {
  try {
    const resultat = await maPromesse;
    console.log('Succès :', resultat);
  } catch (erreur) {
    console.error('Erreur capturée :', erreur.message);
  }
}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Gestion d'erreurs multiples :</h4>
          <CodeBlock language="javascript">
{`async function exempleMultiErreur() {
  try {
    const resultat1 = await promesse1;
    const resultat2 = await promesse2;
    const resultat3 = await promesse3;
    
    return { resultat1, resultat2, resultat3 };
  } catch (erreur) {
    // Gère les erreurs de n'importe quelle promesse
    console.error('Une promesse a échoué :', erreur.message);
    throw erreur; // Relancer l'erreur si nécessaire
  }
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="7-exemple-complet">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">7. Exemple complet</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Voici un exemple complet montrant différentes approches pour une même opération :</p>
          
          <CodeBlock language="javascript">
{`// Simuler des opérations asynchrones
function fetchUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, nom: 'Utilisateur ' + userId });
    }, 800);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, titre: 'Post 1', userId: userId },
        { id: 2, titre: 'Post 2', userId: userId}
      ]);
    }, 1000);
  });
}

// Approche avec async/await (recommandée)
async function getUserAndPosts(userId) {
  try {
    console.log('Récupération de l\'utilisateur...');
    const user = await fetchUser(userId);
    console.log('Utilisateur reçu :', user);
    
    console.log('Récupération des posts...');
    const posts = await fetchUserPosts(user.id);
    console.log('Posts reçus :', posts);
    
    return { user, posts };
  } catch (erreur) {
    console.error('Erreur lors de la récupération :', erreur.message);
    throw erreur;
  }
}

// Utilisation
getUserAndPosts(123)
  .then(resultat => {
    console.log('Données complètes :', resultat);
  })
  .catch(erreur => {
    console.error('Erreur finale :', erreur.message);
  });`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez une application qui simule une série d'opérations asynchrones :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Un utilisateur est récupéré via une API simulée</li>
            <li>Des articles sont récupérés pour l'utilisateur</li>
            <li>Des commentaires sont récupérés pour chaque article</li>
          </ul>
          <p className="mb-2 sm:mb-3">Implémentez cette logique en utilisant :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Des Promesses avec chaînage (.then/.catch)</li>
            <li>async/await</li>
          </ul>
          <p className="mb-2 sm:mb-3">Assurez-vous de gérer correctement les erreurs dans les deux cas.</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Avec Promesses : Affiche "Utilisateur : {id: 1, nom: 'Jean'}", puis "Articles : [...]", 
// puis "Commentaires récupérés pour l'article 1", etc.
// Avec async/await : Même résultat
// Gestion des erreurs : Affiche "Erreur : [message]" en cas d'erreur`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson7;