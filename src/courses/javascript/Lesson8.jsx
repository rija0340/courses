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

const Lesson8 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 8: API Fetch (requêtes HTTP, gestion des réponses)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Apprendre à effectuer des requêtes HTTP avec l'API Fetch, gérer les réponses et les erreurs, et comprendre les différentes options disponibles.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-introduction-a-fetch">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Introduction à l'API Fetch</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">L'API Fetch est une interface moderne pour effectuer des requêtes HTTP dans le navigateur, remplaçant XMLHttpRequest.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Fonctionnalités principales :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Basée sur les Promesses (Promise-based)</li>
            <li>Retourne une Promesse résolvant en réponse</li>
            <li>Supporte toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)</li>
            <li>Peut traiter différentes données (JSON, texte, blob, etc.)</li>
          </ul>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Syntaxe de base :</h4>
          <CodeBlock language="javascript">
{`// Syntaxe simple pour une requête GET
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erreur :', error));

// Syntaxe avec options (méthode POST)
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer votre-token'
  },
  body: JSON.stringify({
    title: 'Mon nouveau post',
    body: 'Contenu du post',
    userId: 1
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erreur :', error));`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-requetes-get">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Requêtes GET</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">La méthode GET est la plus courante, utilisée pour récupérer des données.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">GET simple :</h4>
          <CodeBlock language="javascript">
{`// Récupérer des données
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(posts => {
    console.log('Posts récupérés :', posts);
  })
  .catch(error => {
    console.error('Erreur de récupération :', error);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">GET avec paramètres de requête :</h4>
          <CodeBlock language="javascript">
{`// Construire une URL avec des paramètres
const userId = 1;
const url = new URL('https://jsonplaceholder.typicode.com/posts');
url.searchParams.append('userId', userId);

fetch(url)
  .then(response => response.json())
  .then(posts => {
    console.log('Posts de l\'utilisateur :', posts);
  })
  .catch(error => {
    console.error('Erreur :', error);
  });

// Ou directement dans l'URL
fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
  .then(response => response.json())
  .then(posts => {
    console.log('Posts de l\'utilisateur :', posts);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">GET avec options (headers, etc.) :</h4>
          <CodeBlock language="javascript">
{`fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer votre-token-ici'
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur HTTP: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Données récupérées :', data);
  })
  .catch(error => {
    console.error('Erreur :', error.message);
  });`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-requetes-post-put-delete">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Requêtes POST, PUT, DELETE</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">POST - Créer une ressource :</h4>
          <CodeBlock language="javascript">
{`const nouveauPost = {
  title: 'Mon nouveau post',
  body: 'Contenu de mon post',
  userId: 1
};

fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(nouveauPost)
})
  .then(response => response.json())
  .then(data => {
    console.log('Nouveau post créé :', data);
  })
  .catch(error => {
    console.error('Erreur lors de la création :', error);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">PUT - Mettre à jour une ressource :</h4>
          <CodeBlock language="javascript">
{`const postModifie = {
  id: 1,
  title: 'Titre mis à jour',
  body: 'Contenu mis à jour',
  userId: 1
};

fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postModifie)
})
  .then(response => response.json())
  .then(data => {
    console.log('Post mis à jour :', data);
  })
  .catch(error => {
    console.error('Erreur lors de la mise à jour :', error);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">DELETE - Supprimer une ressource :</h4>
          <CodeBlock language="javascript">
{`fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'DELETE'
})
  .then(response => {
    if (response.ok) {
      console.log('Post supprimé avec succès');
    } else {
      throw new Error('Erreur lors de la suppression');
    }
  })
  .catch(error => {
    console.error('Erreur :', error);
  });`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-gestion-des-reponses">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Gestion des réponses</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">L'objet Response contient de nombreuses propriétés utiles pour analyser la réponse.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Propriétés de l'objet Response :</h4>
          <CodeBlock language="javascript">
{`fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {
    console.log('Statut :', response.status);           // 200, 404, 500, etc.
    console.log('OK ?', response.ok);                    // true si statut entre 200-299
    console.log('URL :', response.url);                  // URL complète de la requête
    console.log('Headers :', response.headers);          // En-têtes de réponse
    console.log('Type :', response.type);                // basic, cors, error, opaque, etc.
    
    // Vérifier si la requête a réussi
    if (!response.ok) {
      throw new Error('Erreur HTTP: ' + response.status);
    }
    
    return response.json();  // Parse le JSON
  })
  .then(data => {
    console.log('Données :', data);
  })
  .catch(error => {
    console.error('Erreur :', error.message);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthodes pour lire le corps de la réponse :</h4>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retourne</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">.json()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Parse le corps comme JSON</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Promesse résolvant en objet/array JSON</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">.text()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Récupère le corps comme texte</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Promesse résolvant en chaîne de caractères</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">.blob()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Récupère le corps comme objet Blob</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Promesse résolvant en objet Blob</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">.arrayBuffer()</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Récupère le corps comme ArrayBuffer</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Promesse résolvant en ArrayBuffer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-gestion-des-erreurs">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Gestion des erreurs</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Il est essentiel de gérer les erreurs correctement pour une expérience utilisateur robuste.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Erreurs réseau vs erreurs HTTP :</h4>
          <CodeBlock language="javascript">
{`fetch('https://api-exemple.com/donnees')
  .then(response => {
    // Les erreurs réseau (serveur injoignable, etc.) vont dans .catch()
    // Les erreurs HTTP (404, 500, etc.) sont des réponses valides et restent dans .then()
    
    if (!response.ok) {
      // Gestion des erreurs HTTP
      throw new Error('Erreur HTTP: ' + response.status + ' - ' + response.statusText);
    }
    
    return response.json();
  })
  .then(data => {
    console.log('Données reçues :', data);
  })
  .catch(error => {
    // Erreurs réseau ou erreurs HTTP capturées avec throw
    console.error('Erreur de requête :', error.message);
    
    // Gestion d'erreurs spécifiques
    if (error.message.includes('404')) {
      console.log('Ressource non trouvée');
    } else if (error.message.includes('500')) {
      console.log('Erreur serveur interne');
    } else {
      console.log('Autre erreur réseau');
    }
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple de fonction de requête avec gestion d'erreurs complète :</h4>
          <CodeBlock language="javascript">
{`async function faireRequete(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error(\`Erreur HTTP: \${response.status} - \${response.statusText}\`);
    }

    // Déterminer le type de contenu pour le parser correctement
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    // Erreurs réseau ou autres erreurs
    console.error('Erreur de requête :', error);
    throw error; // Relancer pour que l'appelant puisse gérer
  }
}

// Utilisation
async function recupererUtilisateur(id) {
  try {
    const utilisateur = await faireRequete(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
    console.log('Utilisateur :', utilisateur);
    return utilisateur;
  } catch (error) {
    console.error('Impossible de récupérer l\'utilisateur :', error.message);
    // Retourner une valeur par défaut ou gérer l'erreur
    return null;
  }
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-traitement-des-differentes-types-de-reponses">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Traitement des différents types de réponses</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Traitement de JSON :</h4>
          <CodeBlock language="javascript">
{`fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => {
    console.log('Données JSON :', data);
    console.log('Titre :', data.title);
    console.log('Auteur :', data.userId);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Traitement de texte :</h4>
          <CodeBlock language="javascript">
{`fetch('https://exemple.com/fichier.txt')
  .then(response => response.text())
  .then(texte => {
    console.log('Contenu du fichier :', texte);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Traitement d'images/binaires :</h4>
          <CodeBlock language="javascript">
{`fetch('https://exemple.com/image.jpg')
  .then(response => response.blob())
  .then(blob => {
    // Créer une URL pour l'image
    const imageUrl = URL.createObjectURL(blob);
    
    // Afficher l'image
    const img = document.createElement('img');
    img.src = imageUrl;
    document.body.appendChild(img);
  });`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="7-headers-et-authentification">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">7. Headers et authentification</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les headers permettent de spécifier le type de contenu, l'authentification et d'autres métadonnées.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Headers communs :</h4>
          <CodeBlock language="javascript">
{`// En-têtes pour une requête avec authentification
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',       // Indique que le corps est du JSON
    'Accept': 'application/json',             // Attend une réponse JSON
    'Authorization': 'Bearer votre-jeton-ici', // Jeton d'authentification
    'X-API-Key': 'votre-cle-api'             // Clé API si requise
  },
  body: JSON.stringify({
    nom: 'Nouvel utilisateur',
    email: 'email@example.com'
  })
};

fetch('https://api-exemple.com/utilisateurs', options)
  .then(response => response.json())
  .then(data => console.log(data));`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Gestion de l'authentification avec jeton :</h4>
          <CodeBlock language="javascript">
{`class ApiClient {
  constructor(baseUrl, token = null) {
    this.baseUrl = baseUrl;
    this.token = token;
  }
  
  setToken(token) {
    this.token = token;
  }
  
  async requete(chemin, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (this.token) {
      headers['Authorization'] = 'Bearer ' + this.token;
    }
    
    const response = await fetch(this.baseUrl + chemin, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error('Erreur API: ' + response.status);
    }
    
    return await response.json();
  }
  
  async get(chemin) {
    return this.requete(chemin);
  }
  
  async post(chemin, data) {
    return this.requete(chemin, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

// Utilisation
const api = new ApiClient('https://api-exemple.com');
api.setToken('votre-jeton-d-authentification');
const resultats = await api.get('/utilisateurs');`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="8-exemple-complet">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">8. Exemple complet</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Voici un exemple complet d'une application qui effectue différentes opérations CRUD avec l'API Fetch :</p>
          
          <CodeBlock language="javascript">
{`class GestionnaireAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  // GET - Récupérer tous les éléments
  async getAll(chemin) {
    try {
      const response = await fetch(\`\${this.baseURL}/\${chemin}\`);
      if (!response.ok) {
        throw new Error('Erreur de récupération: ' + response.status);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur GET:', error);
      throw error;
    }
  }
  
  // GET - Récupérer un élément spécifique
  async getById(chemin, id) {
    try {
      const response = await fetch(\`\${this.baseURL}/\${chemin}/\${id}\`);
      if (!response.ok) {
        throw new Error('Erreur de récupération: ' + response.status);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur GET by ID:', error);
      throw error;
    }
  }
  
  // POST - Créer un nouvel élément
  async create(chemin, donnees) {
    try {
      const response = await fetch(\`\${this.baseURL}/\${chemin}\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donnees)
      });
      
      if (!response.ok) {
        throw new Error('Erreur de création: ' + response.status);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur POST:', error);
      throw error;
    }
  }
  
  // PUT - Mettre à jour un élément
  async update(chemin, id, donnees) {
    try {
      const response = await fetch(\`\${this.baseURL}/\${chemin}/\${id}\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donnees)
      });
      
      if (!response.ok) {
        throw new Error('Erreur de mise à jour: ' + response.status);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur PUT:', error);
      throw error;
    }
  }
  
  // DELETE - Supprimer un élément
  async delete(chemin, id) {
    try {
      const response = await fetch(\`\${this.baseURL}/\${chemin}/\${id}\`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erreur de suppression: ' + response.status);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur DELETE:', error);
      throw error;
    }
  }
}

// Utilisation
const api = new GestionnaireAPI('https://jsonplaceholder.typicode.com');

// Utilisation avec async/await
async function exempleUtilisation() {
  try {
    // Récupérer tous les posts
    console.log('Récupération des posts...');
    const posts = await api.getAll('posts');
    console.log('Nombre de posts :', posts.length);
    
    // Créer un nouveau post
    console.log('Création d\'un nouveau post...');
    const nouveauPost = await api.create('posts', {
      title: 'Nouveau post via Fetch',
      body: 'Contenu du nouveau post',
      userId: 1
    });
    console.log('Post créé :', nouveauPost);
    
    // Mettre à jour le post
    console.log('Mise à jour du post...');
    const postMisAJour = await api.update('posts', nouveauPost.id, {
      ...nouveauPost,
      title: 'Post mis à jour'
    });
    console.log('Post mis à jour :', postMisAJour);
    
    // Supprimer le post
    console.log('Suppression du post...');
    const suppression = await api.delete('posts', nouveauPost.id);
    console.log('Post supprimé :', suppression);
  } catch (error) {
    console.error('Erreur dans l\'exemple :', error.message);
  }
}

exempleUtilisation();`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez une application qui permet de :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Afficher une liste d'utilisateurs provenant de l'API JSONPlaceholder</li>
            <li>Ajouter un nouvel utilisateur</li>
            <li>Modifier un utilisateur existant</li>
            <li>Supprimer un utilisateur</li>
          </ul>
          <p className="mb-2 sm:mb-3">Implémentez votre application en utilisant l'API Fetch avec async/await, et assurez-vous de gérer correctement les erreurs.</p>
          <p className="mb-2 sm:mb-3">Affichez des messages d'état appropriés à chaque opération (chargement, succès, erreur).</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Affiche "Chargement des utilisateurs..." puis la liste
// Lors de l'ajout : "Utilisateur ajouté avec succès" 
// Lors de la modification : "Utilisateur mis à jour"
// Lors de la suppression : "Utilisateur supprimé"
// En cas d'erreur : "Erreur : [message d'erreur]"`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson8;