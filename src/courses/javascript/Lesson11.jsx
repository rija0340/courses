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

const Lesson11 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 11: Stockage client (localStorage, sessionStorage, cookies)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Apprendre à stocker des données côté client dans le navigateur à l'aide de localStorage, sessionStorage et cookies, comprendre leurs différences et cas d'usage appropriés.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-introduction-au-stockage-client">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Introduction au stockage client</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Le stockage client permet de conserver des données sur l'ordinateur de l'utilisateur, ce qui permet de conserver des préférences, des sessions, ou des données hors ligne.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Types de stockage client :</h4>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">localStorage</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Permanente</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Même domaine</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">~5-10MB</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">sessionStorage</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Session navigateur</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Même domaine</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">~5-10MB</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">Cookies</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Configurable</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Domaine et sous-domaines</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">~4KB par cookie</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <TipBox>
            <strong>💡 Astuce :</strong> Utilisez <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">localStorage</code> pour des données persistantes, <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">sessionStorage</code> pour des données temporaires, et <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">cookies</code> pour les données envoyées au serveur.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-localstorage">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. localStorage</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">localStorage permet de stocker des données de manière persistante dans le navigateur, qui restent même après la fermeture du navigateur.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthodes disponibles :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">setItem(key, value)</code> - Stocke une paire clé-valeur</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">getItem(key)</code> - Récupère une valeur par clé</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">removeItem(key)</code> - Supprime une paire clé-valeur</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">clear()</code> - Supprime toutes les données</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">key(index)</code> - Récupère la clé à un index spécifique</li>
          </ul>
          
          <CodeBlock language="javascript">
{`// Stocker une valeur
localStorage.setItem('nomUtilisateur', 'JeanDupont');

// Récupérer une valeur
const nom = localStorage.getItem('nomUtilisateur');
console.log(nom); // 'JeanDupont'

// Stocker un objet (nécessite JSON)
const utilisateur = {
  nom: 'Jean',
  age: 30,
  ville: 'Paris'
};

// Convertir l'objet en JSON pour le stocker
localStorage.setItem('utilisateur', JSON.stringify(utilisateur));

// Récupérer et convertir l'objet
const utilisateurStocke = JSON.parse(localStorage.getItem('utilisateur'));
console.log(utilisateurStocke); // { nom: 'Jean', age: 30, ville: 'Paris' }

// Supprimer une valeur
localStorage.removeItem('nomUtilisateur');

// Supprimer toutes les données
// localStorage.clear();`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Gestion des erreurs avec localStorage :</h4>
          <CodeBlock language="javascript">
{`function setLocalStorage(key, value) {
  try {
    // Convertir la valeur en chaîne
    const valeurString = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, valeurString);
    return true;
  } catch (e) {
    if (e instanceof QuotaExceededError) {
      console.error('Stockage local plein');
      return false;
    }
    console.error('Erreur de stockage :', e);
    return false;
  }
}

function getLocalStorage(key) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return null;
    
    // Essayez de parser en JSON, sinon retournez la chaîne brute
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  } catch (e) {
    console.error('Erreur de récupération :', e);
    return null;
  }
}`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-sessionstorage">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. sessionStorage</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">sessionStorage fonctionne comme localStorage mais les données ne persistent que pendant la session du navigateur. Elles sont supprimées quand l'onglet est fermé.</p>
          
          <CodeBlock language="javascript">
{`// Stocker dans sessionStorage
sessionStorage.setItem('donneesTemp', 'temporaire');

// Récupérer une valeur
const donnees = sessionStorage.getItem('donneesTemp');
console.log(donnees); // 'temporaire'

// Stocker un objet
const panier = {
  produits: ['pomme', 'banane'],
  total: 2.50
};

sessionStorage.setItem('panier', JSON.stringify(panier));

// Récupérer l'objet
const panierRecupere = JSON.parse(sessionStorage.getItem('panier'));

// Supprimer une valeur
sessionStorage.removeItem('donneesTemp');

// Exemple d'utilisation : données de formulaire temporaire
const formulaire = document.getElementById('monForm');

// Sauvegarder les données du formulaire
formulaire.addEventListener('input', function() {
  const formData = new FormData(formulaire);
  const donneesSaisies = Object.fromEntries(formData.entries());
  sessionStorage.setItem('donneesFormulaire', JSON.stringify(donneesSaisies));
});

// Restaurer les données du formulaire
window.addEventListener('load', function() {
  const donneesSauvegardees = sessionStorage.getItem('donneesFormulaire');
  if (donneesSauvegardees) {
    const donnees = JSON.parse(donneesSauvegardees);
    Object.keys(donnees).forEach(key => {
      const element = formulaire.elements[key];
      if (element) {
        element.value = donnees[key];
      }
    });
  }
});`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Utilisez <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">sessionStorage</code> pour des données temporaires comme le panier d'achat, les données de formulaire non sauvegardées ou les préférences de session.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-cookies">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Cookies</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les cookies sont des petits morceaux de données envoyés par un serveur au navigateur, qui peuvent être renvoyés au serveur ultérieurement.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Propriétés d'un cookie :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">name</code> - Le nom du cookie</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">value</code> - La valeur du cookie</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">expires</code> - Date d'expiration</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">max-age</code> - Durée de vie en secondes</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">domain</code> - Domaine pour lequel le cookie est valide</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">path</code> - Chemin pour lequel le cookie est valide</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">secure</code> - Doit être transmis via HTTPS</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">httpOnly</code> - Accessible uniquement par le serveur HTTP</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">sameSite</code> - Contrôle les requêtes cross-site</li>
          </ul>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Fonctions utilitaires pour les cookies :</h4>
          <CodeBlock language="javascript">
{`// Fonction pour créer un cookie
function setCookie(nom, valeur, jours) {
  let date = new Date();
  date.setTime(date.getTime() + (jours * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = nom + "=" + encodeURIComponent(valeur) + ";" + expires + ";path=/";
}

// Fonction pour récupérer un cookie
function getCookie(nom) {
  const nomCookie = nom + "=";
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nomCookie) === 0) {
      return decodeURIComponent(cookie.substring(nomCookie.length, cookie.length));
    }
  }
  return null;
}

// Fonction pour supprimer un cookie
function supprimerCookie(nom) {
  document.cookie = nom + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Exemple d'utilisation
setCookie('utilisateur', 'Jean', 7); // Cookie valide pendant 7 jours
const utilisateur = getCookie('utilisateur');
console.log(utilisateur); // 'Jean'

// Stocker des objets dans des cookies
const preferences = { theme: 'sombre', langue: 'fr' };
setCookie('preferences', JSON.stringify(preferences), 30);

const preferencesRecuperees = JSON.parse(getCookie('preferences'));
console.log(preferencesRecuperees); // { theme: 'sombre', langue: 'fr' }`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-comparaison-des-methodes">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Comparaison des méthodes</h2>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caractéristique</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">localStorage</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">sessionStorage</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Durée</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Permanente</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Fermeture onglet</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Configurable</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Accès côté client</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Oui</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Oui</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Oui</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Accès côté serveur</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Non</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Non</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Oui</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Taille maximale</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">~5-10MB</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">~5-10MB</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">~4KB par cookie</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Automatique HTTP</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Non</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Non</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Oui</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Cas d'usage typique</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Préférences utilisateur, cache</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Données temporaires de session</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Authentification, tracking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-pratiques-recommandees">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Pratiques recommandées</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Sécurité :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li>Ne stockez pas d'informations sensibles dans localStorage/sessionStorage</li>
            <li>Utilisez le flag <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">httpOnly</code> pour les cookies contenant des jetons d'authentification</li>
            <li>Utilisez le flag <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">secure</code> pour les cookies transmis via HTTPS</li>
            <li>Mettez en place des mécanismes de validation coté serveur</li>
          </ul>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Gestion des erreurs :</h4>
          <CodeBlock language="javascript">
{`class GestionnaireStockage {
  static setItem(key, value, type = 'local') {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage;
      const valeurString = typeof value === 'string' ? value : JSON.stringify(value);
      storage.setItem(key, valeurString);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Le stockage est plein');
        this.demanderNettoyage(type);
      } else {
        console.error('Erreur de stockage :', e);
      }
      return false;
    }
  }
  
  static getItem(key, type = 'local') {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage;
      const value = storage.getItem(key);
      if (value === null) return null;
      
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (e) {
      console.error('Erreur de récupération :', e);
      return null;
    }
  }
  
  static removeItem(key, type = 'local') {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage;
      storage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Erreur de suppression :', e);
      return false;
    }
  }
  
  static demanderNettoyage(type) {
    if (confirm('Le stockage est plein. Voulez-vous nettoyer les données de stockage ?')) {
      if (type === 'local') {
        const retenirCles = ['preferences_utilisateur']; // Clés à conserver
        const toutesCles = Object.keys(localStorage);
        
        toutesCles.forEach(key => {
          if (!retenirCles.includes(key)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        sessionStorage.clear();
      }
    }
  }
}

// Utilisation
GestionnaireStockage.setItem('donnees', { nom: 'Jean', age: 30 }, 'local');
const donnees = GestionnaireStockage.getItem('donnees', 'local');
console.log(donnees); // { nom: 'Jean', age: 30 }`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="7-exemples-d-utilisation">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">7. Exemples d'utilisation</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Stockage de préférences utilisateur :</h4>
          <CodeBlock language="javascript">
{`// Gestion des préférences de thème
class PreferencesUtilisateur {
  static getTheme() {
    return this.get('theme', 'clair');
  }
  
  static setTheme(theme) {
    this.set('theme', theme);
    document.body.className = theme + '-theme';
  }
  
  static getLangue() {
    return this.get('langue', 'fr');
  }
  
  static setLangue(langue) {
    this.set('langue', langue);
    document.documentElement.lang = langue;
  }
  
  static set(key, value) {
    localStorage.setItem('pref_' + key, JSON.stringify(value));
  }
  
  static get(key, defaultValue = null) {
    const value = localStorage.getItem('pref_' + key);
    return value ? JSON.parse(value) : defaultValue;
  }
}

// Utilisation
PreferencesUtilisateur.setTheme('sombre');
PreferencesUtilisateur.setLangue('en');

// Appliquer les préférences au chargement
document.addEventListener('DOMContentLoaded', () => {
  document.body.className = PreferencesUtilisateur.getTheme() + '-theme';
  document.documentElement.lang = PreferencesUtilisateur.getLangue();
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Stockage de données de formulaire :</h4>
          <CodeBlock language="javascript">
{`// Sauvegarde automatique du formulaire
class SauvegardeFormulaire {
  constructor(formulaireId, delai = 1000) {
    this.formulaire = document.getElementById(formulaireId);
    this.delai = delai;
    this.debouncer = null;
    
    this.init();
  }
  
  init() {
    // Charger les données sauvegardées
    this.chargerDonnees();
    
    // Écouter les changements
    this.formulaire.addEventListener('input', () => {
      this.enregistrerChangements();
    });
    
    // Sauvegarder avant de quitter
    window.addEventListener('beforeunload', () => {
      this.sauvegarder();
    });
    
    // Restaurer les données sauvegardées
    window.addEventListener('pageshow', () => {
      this.chargerDonnees();
    });
  }
  
  enregistrerChangements() {
    if (this.debouncer) {
      clearTimeout(this.debouncer);
    }
    
    this.debouncer = setTimeout(() => {
      this.sauvegarder();
    }, this.delai);
  }
  
  sauvegarder() {
    const formData = new FormData(this.formulaire);
    const donnees = Object.fromEntries(formData.entries());
    
    // Sauvegarder avec un timestamp
    const sauvegarde = {
      donnees: donnees,
      timestamp: Date.now()
    };
    
    localStorage.setItem('form_' + this.formulaire.id, JSON.stringify(sauvegarde));
  }
  
  chargerDonnees() {
    const sauvegarde = localStorage.getItem('form_' + this.formulaire.id);
    if (sauvegarde) {
      const { donnees, timestamp } = JSON.parse(sauvegarde);
      
      // Vérifier si la sauvegarde est récente (moins de 24h)
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        Object.keys(donnees).forEach(key => {
          const element = this.formulaire.elements[key];
          if (element) {
            element.value = donnees[key];
          }
        });
      } else {
        // Supprimer la sauvegarde périmée
        localStorage.removeItem('form_' + this.formulaire.id);
      }
    }
  }
  
  nettoyer() {
    localStorage.removeItem('form_' + this.formulaire.id);
  }
}

// Utilisation
const sauvegarde = new SauvegardeFormulaire('formulaireContact');`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez une application de gestion de notes qui utilise le stockage client :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Permettre de créer, lire, modifier et supprimer des notes</li>
            <li>Utiliser localStorage pour stocker les notes de manière persistante</li>
            <li>Utiliser sessionStorage pour stocker les modifications non sauvegardées</li>
            <li>Ajouter un système de recherche dans les notes</li>
            <li>Permettre de marquer des notes comme favorites</li>
          </ul>
          <p className="mb-2 sm:mb-3">Gérez correctement les erreurs (espace de stockage insuffisant) et assurez-vous que l'interface s'actualise correctement.</p>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Liste des notes persistante entre les sessions
// Bouton pour marquer comme favori
// Barre de recherche fonctionnelle
// Indicateur de stockage plein si nécessaire
// Interface réactive aux changements`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson11;