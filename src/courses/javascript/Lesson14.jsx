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

const Lesson14 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 14: Bonnes pratiques (organisation du code, lisibilité, performance)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Apprendre les meilleures pratiques de développement JavaScript pour écrire un code bien organisé, lisible, maintenable et performant.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-introduction-aux-bonnes-pratiques">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Introduction aux bonnes pratiques</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les bonnes pratiques en développement JavaScript sont essentielles pour produire un code de qualité, facile à maintenir, à comprendre et à faire évoluer.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Pourquoi suivre des bonnes pratiques ?</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Facilite la collaboration entre développeurs</li>
            <li>Réduit le temps de développement et de maintenance</li>
            <li>Améliore la lisibilité et la compréhension du code</li>
            <li>Augmente la performance et la sécurité</li>
            <li>Réduit les erreurs et les bugs</li>
          </ul>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-nomenclature-et-noms-descriptifs">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Nomenclature et noms descriptifs</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Donner des noms clairs et descriptifs à vos variables, fonctions et classes rend le code plus lisible.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Mauvais exemples vs bons exemples :</h4>
          <CodeBlock language="javascript">
{`// Mauvais noms
let d = new Date();  // Variable non descriptive
let x = 3.14159;     // Constante non claire
function doStuff() { /* ... */ }  // Fonction non descriptive
let u = getUsers();  // Variable abrégée

// Meilleurs noms
const dateCourante = new Date();
const PI = 3.14159;
function calculerSurfaceCercle(rayon) { /* ... */ }
const utilisateurs = getUsers();

// Noms pour les fonctions (verbes)
function validerEmail(email) { /* ... */ }
function filtrerProduits(critere) { /* ... */ }
function trierListe(liste) { /* ... */ }

// Noms pour les variables/constantes (noms)
const utilisateurCourant = { /* ... */ };
const produitsDisponibles = [ /* ... */ ];
const configurationApp = { /* ... */ };

// Noms pour les booléens (doivent indiquer une question/réponse)
const estConnecte = true;
const aTermine = false;
const peutTelecharger = true;

// Noms pour les fonctions qui retournent un booléen
function estValide(email) { /* ... */ }
function estPaire(nombre) { /* ... */ }
function contientErreur() { /* ... */ }`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Utilisez des noms qui décrivent non seulement ce qu'est une variable, mais aussi son utilité. Évitez les abréviations sauf si elles sont universellement connues.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-organisation-du-code">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Organisation du code</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Structure d'un fichier JavaScript :</h4>
          <CodeBlock language="javascript">
{`// 1. Imports/Requires
import { Calculateur } from './utils/Calculateur.js';
import { API } from './services/API.js';

// 2. Constantes globales
const CONFIG = {
  API_URL: 'https://api.exemple.com',
  MAX_REQUETES: 10,
  DELAI_REESSAI: 3000
};

// 3. Variables globales (si nécessaires, à limiter)
let utilisateurCourant = null;

// 4. Classes
class GestionnaireDonnees {
  constructor() {
    this.cache = new Map();
    this.enErreur = false;
  }
  
  async chargerDonnees(identifiant) {
    if (this.cache.has(identifiant)) {
      return this.cache.get(identifiant);
    }
    
    try {
      const donnees = await API.get(\`/donnees/\${identifiant}\`);
      this.cache.set(identifiant, donnees);
      return donnees;
    } catch (erreur) {
      this.enErreur = true;
      throw erreur;
    }
  }
}

// 5. Fonctions utilitaires
function formaterDate(date) {
  return date.toLocaleDateString('fr-FR');
}

function estObjetVide(objet) {
  return Object.keys(objet).length === 0;
}

// 6. Fonctions principales
function initialiserApplication() {
  // Logique d'initialisation
}

function gererChargement() {
  // Logique de gestion du chargement
}

// 7. Exports
export { formaterDate, estObjetVide };
export default { initialiserApplication, gererChargement };`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Organisation en modules :</h4>
          <pre className="bg-gray-100 p-3 sm:p-4 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words my-3 sm:my-4">
{`src/
├── constants/
│   ├── api.js
│   └── messages.js
├── utils/
│   ├── validation.js
│   ├── dates.js
│   └── chaines.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── cache.js
├── components/
│   ├── Formulaire.js
│   ├── Tableau.js
│   └── Modal.js
├── models/
│   ├── Utilisateur.js
│   └── Produit.js
└── app.js`}
          </pre>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-lisibilite-et-structure-du-code">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Lisibilité et structure du code</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Indentation et espacement :</h4>
          <CodeBlock language="javascript">
{`// Bonne indentation et espacement
function traiterCommande(commande) {
  // Validation initiale
  if (!commande || !commande.produits || commande.produits.length === 0) {
    throw new Error('Commande invalide');
  }
  
  // Calcul du total
  let total = 0;
  for (const produit of commande.produits) {
    if (produit.prix > 0 && produit.quantite > 0) {
      total += produit.prix * produit.quantite;
    }
  }
  
  // Application des taxes
  const taxes = total * 0.2;
  const totalAvecTaxes = total + taxes;
  
  // Mise à jour de la commande
  commande.total = totalAvecTaxes;
  commande.dateTraitement = new Date();
  
  return commande;
}

// Mauvaise lisibilité
function traitementMauvais(c){if(!c||!c.p||c.p.length===0){throw new Error('Erreur');}let t=0;for(const p of c.p){if(p.pr>0&&p.q>0){t+=p.pr*p.q;}}const tx=t*0.2;const tt=t+tx;c.t=tt;c.dt=new Date();return c;}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Commentaires stratégiques :</h4>
          <CodeBlock language="javascript">
{`// Bon usage des commentaires
class CalculateurTaxes {
  constructor(pays) {
    this.pays = pays;
    this.tauxTaxes = this.obtenirTauxTaxes(pays);
  }
  
  // Calcul du montant de taxe applicable à un produit
  // Prend en compte les taxes spécifiques au pays et à la catégorie de produit
  calculerTaxe(produit) {
    let taux = this.tauxTaxes.generales;
    
    // Les produits électroniques ont une taxe supplémentaire
    if (produit.categorie === 'electronique') {
      taux += this.tauxTaxes.electronique;
    }
    
    // Les produits alimentaires sont exonérés si inférieurs à 20€
    if (produit.categorie === 'alimentaire' && produit.prix < 20) {
      taux = 0;
    }
    
    return produit.prix * taux;
  }
  
  // Récupère les taux de taxes spécifiques à un pays
  // Format: { generales: 0.2, electronique: 0.05, ... }
  obtenirTauxTaxes(pays) {
    // Implémentation spécifique
  }
}

// Mauvais usage : commentaires évidents ou redondants
function additionner(a, b) {
  // Additionne a et b
  // a: le premier nombre
  // b: le deuxième nombre
  return a + b;  // Retourne la somme
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-gestion-des-erreurs">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Gestion des erreurs</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Mécanismes de gestion d'erreurs :</h4>
          <CodeBlock language="javascript">
{`// Bonne gestion des erreurs
class GestionnaireAPI {
  constructor(urlBase) {
    this.urlBase = urlBase;
  }
  
  async requete(chemin, options = {}) {
    try {
      const response = await fetch(\`\${this.urlBase}/\${chemin}\`, {
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
      
      // Vérifier le type de contenu avant de le traiter
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Réponse non-JSON reçue');
      }
      
      return await response.json();
    } catch (erreur) {
      // Enrichir l'erreur avec des détails contextuels
      const erreurElaboree = new Error(\`Échec de la requête à \${chemin}: \${erreur.message}\`);
      erreurElaboree.code = erreur.code || 'API_ERROR';
      erreurElaboree.origine = 'API';
      erreurElaboree.chemin = chemin;
      
      // Journaliser l'erreur pour diagnostic
      console.error('Erreur API:', erreurElaboree);
      
      throw erreurElaboree;
    }
  }
  
  // Méthode utilitaire pour les erreurs spécifiques
  async requeteAvecRetries(chemin, options = {}, maxTentatives = 3) {
    for (let i = 0; i < maxTentatives; i++) {
      try {
        return await this.requete(chemin, options);
      } catch (erreur) {
        if (i === maxTentatives - 1) {
          // Dernière tentative, relancer l'erreur
          throw erreur;
        }
        
        // Attendre avant la tentative suivante (exponentiel)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
}

// Utilisation
const api = new GestionnaireAPI('https://api.exemple.com');

api.requeteAvecRetries('/utilisateurs/123')
  .then(utilisateur => {
    console.log('Utilisateur:', utilisateur);
  })
  .catch(erreur => {
    console.error('Impossible de récupérer l\'utilisateur:', erreur.message);
  });`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Création d'erreurs personnalisées :</h4>
          <CodeBlock language="javascript">
{`// Création de classes d'erreurs personnalisées
class ErreurValidation extends Error {
  constructor(message, champ = null) {
    super(message);
    this.name = 'ErreurValidation';
    this.champ = champ;
  }
}

class ErreurAuthentification extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErreurAuthentification';
    this.code = 'AUTH_ERROR';
  }
}

class ErreurDonnees extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ErreurDonnees';
    this.code = code;
  }
}

// Utilisation
function validerEmail(email) {
  if (!email) {
    throw new ErreurValidation('Email requis', 'email');
  }
  
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!regex.test(email)) {
    throw new ErreurValidation('Email invalide', 'email');
  }
  
  return true;
}

// Gestion des erreurs spécifiques
try {
  validerEmail('');
} catch (erreur) {
  if (erreur instanceof ErreurValidation) {
    console.error(\`Erreur de validation pour le champ \${erreur.champ}: \${erreur.message}\`);
  } else {
    console.error('Erreur inattendue:', erreur);
  }
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-performance">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Performance</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Optimisation des boucles et des algorithmes :</h4>
          <CodeBlock language="javascript">
{`// Mauvaise performance
// Recherche dans un tableau à chaque itération
function obtenirUtilisateursActifs(mauvaisExemple) {
  const resultats = [];
  
  for (let i = 0; i < mauvaisExemple.utilisateurs.length; i++) {
    for (let j = 0; j < mauvaisExemple.statuts.length; j++) {
      if (mauvaisExemple.utilisateurs[i].statutId === mauvaisExemple.statuts[j].id) {
        if (mauvaisExemple.statuts[j].nom === 'actif') {
          resultats.push(mauvaisExemple.utilisateurs[i]);
        }
      }
    }
  }
  
  return resultats;
}

// Meilleure performance
function obtenirUtilisateursActifsOptimise(exempleOptimise) {
  // Créer un index pour les statuts
  const statutsMap = new Map();
  exempleOptimise.statuts.forEach(statut => {
    statutsMap.set(statut.id, statut.nom);
  });
  
  // ID du statut 'actif'
  const statutActifId = exempleOptimise.statuts
    .find(statut => statut.nom === 'actif')
    ?.id;
  
  // Filtrer une seule fois
  return exempleOptimise.utilisateurs
    .filter(utilisateur => utilisateur.statutId === statutActifId);
}

// Autres techniques d'optimisation
function optimisationExemples() {
  // 1. Éviter la conversion de type coûteuse dans les boucles
  const ids = ['1', '2', '3', '4'];
  
  // Mauvais
  for (let i = 0; i < 1000000; i++) {
    const nombre = parseInt(ids[i % ids.length]); // Conversion répétée
  }
  
  // Bon
  const nombres = ids.map(id => parseInt(id));
  for (let i = 0; i < 1000000; i++) {
    const nombre = nombres[i % nombres.length]; // Valeur déjà convertie
  }
  
  // 2. Utiliser les méthodes appropriées
  const tableau = [1, 2, 3, 4, 5];
  
  // Pour la recherche d'un élément
  const existe = tableau.includes(3); // plutôt que tableau.indexOf(3) !== -1
  
  // Pour trouver un objet spécifique
  const element = tableau.find(x => x === 3); // plutôt que boucle + condition
  
  // 3. Limiter les recalculs
  const carre = x => x * x; // Fonction simple
  const nombres = [1, 2, 3, 4, 5];
  
  // Mauvais : recalcul à chaque itération
  const resultats1 = nombres.map(x => {
    const intermediaire = carre(x);
    return intermediaire * 2;
  });
  
  // Bon : enchaînement logique
  const resultats2 = nombres
    .map(carre)  // [1, 4, 9, 16, 25]
    .map(x => x * 2);  // [2, 8, 18, 32, 50]
}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Gestion de la mémoire :</h4>
          <CodeBlock language="javascript">
{`// Bonne gestion de la mémoire
class GestionnaireEvenements {
  constructor() {
    this.evenements = new Map(); // Utiliser Map pour de meilleures performances
    this.ecouteurs = new Set();  // Utiliser Set pour les éléments uniques
  }
  
  ajouterEcouteur(element, type, gestionnaire) {
    // Conserver une référence pour le nettoyage ultérieur
    const id = Symbol('ecouteur');
    element.addEventListener(type, gestionnaire);
    
    this.ecouteurs.add({ id, element, type, gestionnaire });
    return id;
  }
  
  supprimerEcouteur(id) {
    const ecouteur = Array.from(this.ecouteurs).find(e => e.id === id);
    if (ecouteur) {
      ecouteur.element.removeEventListener(ecouteur.type, ecouteur.gestionnaire);
      this.ecouteurs.delete(ecouteur);
    }
  }
  
  nettoyer() {
    // Supprimer tous les écouteurs pour éviter les fuites de mémoire
    this.ecouteurs.forEach(({ element, type, gestionnaire }) => {
      element.removeEventListener(type, gestionnaire);
    });
    this.ecouteurs.clear();
  }
}

// Éviter les fuites de fermeture (closures)
function exempleFuiteFermeture() {
  const grosObjet = new Array(1000000).fill('données');
  
  // Mauvais : grosObjet est conservé dans la fermeture
  return function mauvais() {
    // grosObjet est accessible même si inutile
    return 'résultat';
  };
  
  // Bon : utiliser une fonction séparée pour éviter la fermeture inutile
  function resultat() {
    return 'résultat';
  }
  return resultat;
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="7-techniques-avancees">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">7. Techniques avancées</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Destructuration et paramètres :</h4>
          <CodeBlock language="javascript">
{`// Paramètres avec valeurs par défaut et destructuration
function creerUtilisateur({
  nom = 'Anonyme',
  email = '',
  age = 18,
  preferences = {}
} = {}) {
  return {
    nom,
    email,
    age,
    preferences: {
      theme: 'clair',
      notifications: true,
      ...preferences  // Fusion des préférences
    },
    dateInscription: new Date()
  };
}

// Utilisation
const utilisateur1 = creerUtilisateur({ nom: 'Jean', email: 'jean@example.com' });
const utilisateur2 = creerUtilisateur({ 
  nom: 'Marie', 
  preferences: { theme: 'sombre' } 
});

// Destructuration dans les paramètres de fonction
function traiterCommande({ produits, utilisateur: { nom, email }, total }) {
  console.log(\`Commande de \${nom} (\${email}) pour \${total}€\`);
  
  produits.forEach(produit => {
    console.log(\`- \${produit.nom}: \${produit.prix}€\`);
  });
}

// Gestion des paramètres rest
function sommePremiers(...nombres) {
  // Valider les paramètres
  if (nombres.some(n => typeof n !== 'number')) {
    throw new Error('Tous les arguments doivent être des nombres');
  }
  
  return nombres.reduce((acc, val) => acc + val, 0);
}

// Utilisation
const resultat = sommePremiers(1, 2, 3, 4, 5); // 15`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Programmation fonctionnelle :</h4>
          <CodeBlock language="javascript">
{`// Éviter les effets de bord et favoriser l'immuabilité
const utilisateurs = [
  { id: 1, nom: 'Alice', age: 25, actif: true },
  { id: 2, nom: 'Bob', age: 30, actif: false },
  { id: 3, nom: 'Charlie', age: 35, actif: true }
];

// Mauvais : mutation directe
function majAnciens(users) {
  for (const user of users) {
    if (user.age > 30) {
      user.estAncien = true; // Mutation de l'objet existant
    }
  }
  return users;
}

// Bon : transformation fonctionnelle
function ajouterIndicateurAncien(users) {
  return users.map(user => ({
    ...user,  // Copie de l'objet original
    estAncien: user.age > 30
  }));
}

// Autres techniques fonctionnelles
const utilisateursActifs = utilisateurs
  .filter(user => user.actif)
  .map(user => ({ ...user, nom: user.nom.toUpperCase() }))
  .sort((a, b) => b.age - a.age);

// Création de fonctions utilitaires réutilisables
const estActif = user => user.actif;
const estMajeur = user => user.age >= 18;
const transformerNom = user => ({ ...user, nom: user.nom.toUpperCase() });
const comparerAge = (a, b) => b.age - a.age;

// Réutilisation des fonctions
const resultat = utilisateurs
  .filter(estActif)
  .filter(estMajeur)
  .map(transformerNom)
  .sort(comparerAge);`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="8-outils-et-ressources">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">8. Outils et ressources</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Outils d'analyse de code :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><strong>ESLint</strong> : Vérification des erreurs et application des règles de code</li>
            <li><strong>Prettier</strong> : Formatage automatique du code</li>
            <li><strong>JSDoc</strong> : Documentation automatique du code</li>
            <li><strong>Airbnb Style Guide</strong> : Règles de style populaires</li>
          </ul>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple de configuration ESLint :</h4>
          <CodeBlock language="javascript">
{`// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',           // Avertissement sur console.log
    'no-unused-vars': 'error',      // Erreur sur variables inutilisées
    'prefer-const': 'error',        // Préférer 'const' à 'let'
    'no-var': 'error',              // Interdire 'var'
    'semi': ['error', 'always'],    // Obliger les points-virgules
    'quotes': ['error', 'single']   // Utiliser les guillemets simples
  }
};`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Documentation JSDoc :</h4>
          <CodeBlock language="javascript">
{`/**
 * Calcule la surface d'un cercle
 * @param {number} rayon - Le rayon du cercle
 * @param {boolean} [arrondir=false] - Si vrai, arrondir le résultat
 * @returns {number} La surface du cercle
 * @throws {Error} Si le rayon est négatif
 */
function calculerSurfaceCercle(rayon, arrondir = false) {
  if (rayon < 0) {
    throw new Error('Le rayon ne peut pas être négatif');
  }
  
  const surface = Math.PI * rayon * rayon;
  return arrondir ? Math.round(surface) : surface;
}

/**
 * Représente un utilisateur dans le système
 */
class Utilisateur {
  /**
   * Crée un nouvel utilisateur
   * @param {string} nom - Le nom de l'utilisateur
   * @param {string} email - L'email de l'utilisateur
   */
  constructor(nom, email) {
    this.nom = nom;
    this.email = email;
    this.dateInscription = new Date();
  }
  
  /**
   * Vérifie si l'utilisateur est premium
   * @returns {boolean} True si l'utilisateur a un compte premium
   */
  estPremium() {
    return this.statut === 'premium';
  }
}`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Prenez le code suivant et améliorez-le en appliquant les bonnes pratiques :</p>
          <CodeBlock language="javascript">
{`function processData(data, type, opts) {
  var result = [];
  if (type == "users") {
    for (var i = 0; i < data.length; i++) {
      if (data[i].active == true) {
        var user = {
          n: data[i].name,
          e: data[i].email,
          a: data[i].age
        };
        result.push(user);
      }
    }
  } else if (type == "products") {
    for (var j = 0; j < data.length; j++) {
      if (data[j].in_stock == true) {
        var prod = {
          n: data[j].name,
          p: data[j].price,
          c: data[j].category
        };
        result.push(prod);
      }
    }
  }
  return result;
}`}
          </CodeBlock>
          <p className="mb-2 sm:mb-3 mt-2">Appliquez les bonnes pratiques suivantes :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Noms descriptifs pour les variables et fonctions</li>
            <li>Utilisation de const/let au lieu de var</li>
            <li>Structuration du code pour plus de lisibilité</li>
            <li>Éviter la duplication de code</li>
            <li>Ajouter une gestion d'erreurs appropriée</li>
            <li>Améliorer la performance si possible</li>
          </ul>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Code réfactorisé respectant les bonnes pratiques
// Noms descriptifs, aucune duplication, bonnes conventions
// Gestion des erreurs, structure claire
// Code maintenable et lisible`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson14;