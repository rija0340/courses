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

const Lesson10 = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">Leçon 10: Formulaires (validation, gestion des données, événements)</h1>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">Objectif</h3>
          <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">Apprendre à créer, manipuler et valider des formulaires HTML avec JavaScript, gérer les données saisies et réagir aux événements liés aux formulaires.</p>
        </div>
      </header>

      <main className="space-y-6 sm:space-y-8">
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="1-introduction-aux-formulaires">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">1. Introduction aux formulaires</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les formulaires sont les éléments essentiels pour permettre aux utilisateurs d'interagir avec une application web en soumettant des données.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Éléments de base d'un formulaire :</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-3 sm:mb-4">
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">&lt;form&gt;</code> - Conteneur principal</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">&lt;input&gt;</code> - Champs de saisie</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">&lt;textarea&gt;</code> - Zones de texte</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">&lt;select&gt;</code> - Listes déroulantes</li>
            <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">&lt;button&gt;</code> - Boutons d'action</li>
          </ul>
          
          <CodeBlock language="html">
{`<form id="monFormulaire">
  <div>
    <label for="nom">Nom :</label>
    <input type="text" id="nom" name="nom" required>
  </div>
  
  <div>
    <label for="email">Email :</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div>
    <label for="message">Message :</label>
    <textarea id="message" name="message" rows="4"></textarea>
  </div>
  
  <div>
    <label for="categorie">Catégorie :</label>
    <select id="categorie" name="categorie">
      <option value="">Sélectionnez...</option>
      <option value="technique">Technique</option>
      <option value="commercial">Commercial</option>
    </select>
  </div>
  
  <button type="submit">Envoyer</button>
</form>`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="2-evenements-des-formulaires">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">2. Événements des formulaires</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Les formulaires et leurs éléments émettent des événements spécifiques que vous pouvez écouter.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Événements principaux :</h4>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Événement</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quand se produit-il</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">submit</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Soumission du formulaire</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Quand le formulaire est envoyé</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">input</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Changement de valeur</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">À chaque modification du champ</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">change</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Changement confirmé</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Quand le champ perd le focus</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">focus</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Champ prend le focus</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Quand le champ est sélectionné</td>
                </tr>
                <tr>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono font-semibold text-blue-600">blur</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">Champ perd le focus</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">Quand le champ n'est plus sélectionné</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exemple d'écoute d'événements :</h4>
          <CodeBlock language="javascript">
{`const formulaire = document.getElementById('monFormulaire');

// Écoute de la soumission du formulaire
formulaire.addEventListener('submit', function(event) {
  event.preventDefault(); // Empêche l'envoi traditionnel
  console.log('Formulaire soumis');
  // Traitement personnalisé
});

// Écoute des changements dans un champ
const champNom = document.getElementById('nom');
champNom.addEventListener('input', function(event) {
  console.log('Saisie :', event.target.value);
});

// Écoute du changement de sélection
const select = document.getElementById('categorie');
select.addEventListener('change', function(event) {
  console.log('Catégorie sélectionnée :', event.target.value);
});`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="3-acces-aux-donnees-des-formulaires">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">3. Accès aux données des formulaires</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthode 1 : Récupérer les valeurs individuellement :</h4>
          <CodeBlock language="javascript">
{`const formulaire = document.getElementById('monFormulaire');

formulaire.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Accès direct aux champs
  const nom = document.getElementById('nom').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const categorie = document.getElementById('categorie').value;
  
  console.log({
    nom: nom,
    email: email,
    message: message,
    categorie: categorie
  });
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthode 2 : Utiliser FormData :</h4>
          <CodeBlock language="javascript">
{`const formulaire = document.getElementById('monFormulaire');

formulaire.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Créer un objet FormData à partir du formulaire
  const formData = new FormData(formulaire);
  
  // Convertir en objet simple
  const donnees = Object.fromEntries(formData.entries());
  console.log('Données du formulaire :', donnees);
  
  // Ou itérer sur les paires clé-valeur
  for (const [cle, valeur] of formData.entries()) {
    console.log(cle + ' : ' + valeur);
  }
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Méthode 3 : Utiliser les propriétés du formulaire :</h4>
          <CodeBlock language="javascript">
{`const formulaire = document.getElementById('monFormulaire');

formulaire.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Accès aux champs par nom
  const nom = formulaire.elements['nom'].value;
  const email = formulaire.elements['email'].value;
  const message = formulaire.elements['message'].value;
  
  console.log({
    nom: nom,
    email: email,
    message: message
  });
});`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="4-validation-cote-client">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">4. Validation côté client</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">La validation côté client améliore l'expérience utilisateur en fournissant un retour immédiat.</p>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Validation simple :</h4>
          <CodeBlock language="javascript">
{`function validerFormulaire(formulaire) {
  let estValide = true;
  const messagesErreur = [];
  
  // Validation du nom
  const nom = formulaire.elements['nom'];
  if (!nom.value.trim()) {
    messagesErreur.push('Le nom est requis');
    nom.style.borderColor = 'red';
    estValide = false;
  } else {
    nom.style.borderColor = '';
  }
  
  // Validation de l'email
  const email = formulaire.elements['email'];
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!email.value.trim()) {
    messagesErreur.push('L\'email est requis');
    email.style.borderColor = 'red';
    estValide = false;
  } else if (!emailRegex.test(email.value)) {
    messagesErreur.push('Email invalide');
    email.style.borderColor = 'red';
    estValide = false;
  } else {
    email.style.borderColor = '';
  }
  
  // Afficher les messages d'erreur
  if (messagesErreur.length > 0) {
    afficherErreurs(messagesErreur);
  }
  
  return estValide;
}

function afficherErreurs(messages) {
  // Supprimer les messages d'erreur précédents
  const erreursExistantes = document.querySelectorAll('.erreur-message');
  erreursExistantes.forEach(el => el.remove());
  
  // Afficher les nouveaux messages
  messages.forEach(message => {
    const divErreur = document.createElement('div');
    divErreur.className = 'erreur-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-2';
    divErreur.textContent = message;
    document.body.appendChild(divErreur);
  });
}

// Utilisation
const formulaire = document.getElementById('monFormulaire');
formulaire.addEventListener('submit', function(event) {
  event.preventDefault();
  
  if (validerFormulaire(formulaire)) {
    console.log('Formulaire valide, prêt à être envoyé');
    // Envoi des données
  } else {
    console.log('Formulaire contient des erreurs');
  }
});`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Validation en temps réel :</h4>
          <CodeBlock language="javascript">
{`// Validation en temps réel sur chaque champ
const nom = document.getElementById('nom');
const email = document.getElementById('email');

nom.addEventListener('input', function() {
  validerChampNom(this);
});

email.addEventListener('input', function() {
  validerChampEmail(this);
});

function validerChampNom(champ) {
  if (champ.value.trim().length < 2) {
    afficherMessageErreur(champ, 'Le nom doit contenir au moins 2 caractères');
    return false;
  } else {
    retirerMessageErreur(champ);
    return true;
  }
}

function validerChampEmail(champ) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!champ.value.trim()) {
    afficherMessageErreur(champ, 'L\'email est requis');
    return false;
  } else if (!emailRegex.test(champ.value)) {
    afficherMessageErreur(champ, 'Email invalide');
    return false;
  } else {
    retirerMessageErreur(champ);
    return true;
  }
}

function afficherMessageErreur(champ, message) {
  retirerMessageErreur(champ);
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'text-red-500 text-sm mt-1';
  messageDiv.textContent = message;
  messageDiv.dataset.error = 'true';
  
  champ.parentNode.appendChild(messageDiv);
  champ.style.borderColor = 'red';
}

function retirerMessageErreur(champ) {
  const messageExistant = champ.parentNode.querySelector('[data-error]');
  if (messageExistant) {
    messageExistant.remove();
  }
  champ.style.borderColor = '';
}`}
          </CodeBlock>

          <TipBox>
            <strong>💡 Astuce :</strong> Combinez la validation HTML native (attributs <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">required</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">pattern</code>, etc.) avec la validation JavaScript pour une meilleure accessibilité et expérience utilisateur.
          </TipBox>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="5-techniques-avancees-de-validation">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">5. Techniques avancées de validation</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Validation avec contraintes complexes :</h4>
          <CodeBlock language="javascript">
{`// Validateur personnalisé avec plusieurs règles
class ValidateurForm {
  constructor() {
    this.regles = new Map();
  }
  
  ajouterRegle(champ, regles) {
    this.regles.set(champ, regles);
    return this;
  }
  
  valider() {
    let tousValides = true;
    const erreurs = new Map();
    
    for (const [champ, regles] of this.regles) {
      const valeur = champ.value;
      const nomChamp = champ.name || champ.id;
      
      for (const [typeRegle, params] of Object.entries(regles)) {
        let estValide = false;
        
        switch (typeRegle) {
          case 'requis':
            estValide = this.regleRequis(valeur);
            break;
          case 'longueur':
            estValide = this.regleLongueur(valeur, params);
            break;
          case 'email':
            estValide = this.regleEmail(valeur);
            break;
          case 'motdepasse':
            estValide = this.regleMotDePasse(valeur);
            break;
          default:
            estValide = true;
        }
        
        if (!estValide) {
          tousValides = false;
          if (!erreurs.has(champ)) {
            erreurs.set(champ, []);
          }
          erreurs.get(champ).push(this.getMessageErreur(typeRegle, nomChamp, params));
          break; // Arrêter à la première erreur pour ce champ
        }
      }
    }
    
    return { estValide: tousValides, erreurs };
  }
  
  regleRequis(valeur) {
    return valeur.trim().length > 0;
  }
  
  regleLongueur(valeur, params) {
    if (params.min && valeur.length < params.min) return false;
    if (params.max && valeur.length > params.max) return false;
    return true;
  }
  
  regleEmail(valeur) {
    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return regex.test(valeur);
  }
  
  regleMotDePasse(valeur) {
    // Doit contenir majuscule, minuscule, chiffre et caractère spécial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/;
    return regex.test(valeur) && valeur.length >= 8;
  }
  
  getMessageErreur(typeRegle, nomChamp, params) {
    switch (typeRegle) {
      case 'requis':
        return \`\${nomChamp} est requis\`;
      case 'longueur':
        if (params.min && params.max) {
          return \`\${nomChamp} doit contenir entre \${params.min} et \${params.max} caractères\`;
        } else if (params.min) {
          return \`\${nomChamp} doit contenir au moins \${params.min} caractères\`;
        } else {
          return \`\${nomChamp} doit contenir au maximum \${params.max} caractères\`;
        }
      case 'email':
        return 'Adresse email invalide';
      case 'motdepasse':
        return 'Mot de passe faible (8+ caractères, majuscule, minuscule, chiffre, caractère spécial)';
      default:
        return 'Valeur invalide';
    }
  }
}

// Utilisation
const validateur = new ValidateurForm();
validateur
  .ajouterRegle(document.getElementById('nom'), {
    requis: true,
    longueur: { min: 2, max: 50 }
  })
  .ajouterRegle(document.getElementById('email'), {
    requis: true,
    email: true
  });

const formulaire = document.getElementById('monFormulaire');
formulaire.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const resultat = validateur.valider();
  
  if (resultat.estValide) {
    console.log('Tous les champs sont valides');
    // Traiter les données du formulaire
  } else {
    console.log('Erreurs de validation :', resultat.erreurs);
    // Afficher les erreurs à l'utilisateur
  }
});`}
          </CodeBlock>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" id="6-gestion-des-donnees-et-envoi">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">6. Gestion des données et envoi</h2>
          
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Envoi des données avec Fetch :</h4>
          <CodeBlock language="javascript">
{`async function envoyerFormulaire(donnees) {
  try {
    const response = await fetch('/api/formulaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donnees)
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi: ' + response.status);
    }
    
    const resultat = await response.json();
    console.log('Formulaire envoyé avec succès:', resultat);
    return resultat;
  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    throw error;
  }
}

// Intégration complète
const formulaire = document.getElementById('monFormulaire');
formulaire.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  // Validation
  const resultatValidation = validerFormulaire(formulaire);
  if (!resultatValidation) {
    return; // Arrêter si validation échoue
  }
  
  // Récupération des données
  const formData = new FormData(formulaire);
  const donnees = Object.fromEntries(formData.entries());
  
  // Afficher un indicateur de chargement
  const boutonSubmit = formulaire.querySelector('button[type="submit"]');
  const texteOriginal = boutonSubmit.textContent;
  boutonSubmit.textContent = 'Envoi en cours...';
  boutonSubmit.disabled = true;
  
  try {
    await envoyerFormulaire(donnees);
    afficherSuccess('Formulaire envoyé avec succès !');
    formulaire.reset(); // Réinitialiser le formulaire
  } catch (error) {
    afficherErreur('Erreur lors de l\'envoi: ' + error.message);
  } finally {
    // Réinitialiser le bouton
    boutonSubmit.textContent = texteOriginal;
    boutonSubmit.disabled = false;
  }
});

function afficherSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded my-2';
  successDiv.textContent = message;
  formulaire.parentNode.insertBefore(successDiv, formulaire.nextSibling);
  
  // Supprimer après quelques secondes
  setTimeout(() => successDiv.remove(), 5000);
}

function afficherErreur(message) {
  afficherErreurs([message]);
}`}
          </CodeBlock>

          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Gestion des fichiers dans les formulaires :</h4>
          <CodeBlock language="javascript">
{`// Formulaire avec téléchargement de fichiers
const formulaire = document.getElementById('formulaireAvecFichiers');

formulaire.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  // Créer FormData avec les fichiers
  const formData = new FormData(formulaire);
  
  // Accéder aux fichiers
  const fichiersInput = formulaire.elements['fichiers'];
  if (fichiersInput.files.length > 0) {
    for (let i = 0; i < fichiersInput.files.length; i++) {
      const fichier = fichiersInput.files[i];
      console.log('Fichier:', fichier.name, 'Taille:', fichier.size, 'Type:', fichier.type);
      
      // Ajouter des métadonnées
      formData.append('fichier_' + i + '_name', fichier.name);
      formData.append('fichier_' + i + '_size', fichier.size);
    }
  }
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData // Ne pas spécifier Content-Type pour FormData
    });
    
    if (response.ok) {
      console.log('Fichiers envoyés avec succès');
    }
  } catch (error) {
    console.error('Erreur d\'upload:', error);
  }
});`}
          </CodeBlock>
        </section>

        <ExerciseBox>
          <p className="mb-2 sm:mb-3">Créez un formulaire d'inscription complet avec :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Champ nom (requis, 2-50 caractères)</li>
            <li>Champ email (requis, format valide)</li>
            <li>Champ mot de passe (requis, 8+ caractères, majuscule, minuscule, chiffre)</li>
            <li>Champ confirmation mot de passe (doit correspondre au premier)</li>
            <li>Case à cocher pour les conditions d'utilisation (requis)</li>
          </ul>
          <p className="mb-2 sm:mb-3">Implémentez :</p>
          <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1 mb-2 sm:mb-3">
            <li>Validation en temps réel pour chaque champ</li>
            <li>Validation de la correspondance des mots de passe</li>
            <li>Envoi asynchrone avec Fetch</li>
            <li>Indicateurs de chargement</li>
            <li>Gestion des erreurs et succès</li>
          </ul>
          <p className="mb-2"><strong>✅ Résultat attendu :</strong></p>
          <pre className="bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
{`// Formulaire avec validation visuelle en temps réel
// Messages d'erreur affichés près des champs invalides
// Bouton de soumission désactivé si validation échoue
// Message de succès après envoi réussi
// Réinitialisation du formulaire après envoi`}
          </pre>
        </ExerciseBox>
      </main>
    </div>
  );
};

export default Lesson10;