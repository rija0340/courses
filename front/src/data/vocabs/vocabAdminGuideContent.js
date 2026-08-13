import { pickLangText } from './vocabItemStructure';

export const VOCAB_ADMIN_GUIDE = {
  pageTitle: {
    fr: 'Guide administrateur',
    en: 'Admin guide',
    mg: 'Torolalana mpitantana'
  },
  pageIntro: {
    fr: 'Comment gérer les catégories, les mots, l’organisation et les imports pour ce domaine.',
    en: 'How to manage categories, words, organization and imports for this domain.',
    mg: 'Ahoana ny fitantanana ny sokajy, ny teny, ny fandaminana ary ny fampidirana amin\'ity sehatra ity.'
  },
  backToAdmin: {
    fr: 'Retour à l’admin',
    en: 'Back to admin',
    mg: 'Miverina amin\'ny admin'
  },
  categoriesHub: {
    title: { fr: 'Hub Catégories', en: 'Categories hub', mg: 'Santionan\'ny sokajy' },
    body: {
      fr: 'L’onglet Catégories regroupe l’arbre, la recherche globale et l’édition inline. Sélectionnez un nœud pour voir ses mots. Le bloc Import / Export (JSON & CSV) permet de copier un modèle, coller un JSON validé, ou exporter — pour cet onglet, tous les onglets de la catégorie, ou tout le domaine.',
      en: 'The Categories tab combines the tree, global search and inline editing. Select a node to view its words. The Import / Export block (JSON & CSV) lets you copy a template, paste validated JSON, or export — for this tab, all tabs in the category, or the whole domain.',
      mg: 'Ny tab Sokajy manambatra ny hazo, fikarohana manontolo ary fanovana mivantana. Safidio ny node. Ampiasao Import / Export (JSON & CSV) hanampiana na hanondranana teny.'
    }
  },
  tabsOrg: {
    title: { fr: 'Onglets d’organisation', en: 'Organization tabs', mg: 'Tabs fandaminana' },
    body: {
      fr: 'Chaque onglet correspond à un type de contenu (vocabulaire, symptômes, maladies, scénarios…). Réordonnez-les avec les flèches haut/bas dans le panneau de la catégorie sélectionnée. Les compteurs indiquent le nombre de mots par onglet.',
      en: 'Each tab is a content type (vocabulary, symptoms, conditions, scenarios…). Reorder with up/down arrows in the selected category panel. Counts show words per tab.',
      mg: 'Ny tab tsirairay dia karazana votoaty. Avereno amboary amin\'ny zana-tsipika ambony/ambany.'
    }
  },
  import: {
    title: { fr: 'Import / Export', en: 'Import / Export', mg: 'Fampidirana / Fanondranana' },
    body: {
      fr: 'Dans Catégories uniquement : choisissez la portée (cet onglet / tous les onglets / tout le domaine), copiez le modèle JSON, collez ou importez un fichier, validez l’aperçu, puis confirmez. Exportez en CSV (Excel) ou JSON selon la même portée. Paramètres → Données ne propose plus que l’export global.',
      en: 'In Categories only: pick the scope (this tab / all tabs / whole domain), copy the JSON template, paste or upload a file, validate the preview, then confirm. Export CSV (Excel) or JSON with the same scope. Settings → Data only offers global export now.',
      mg: 'Ao amin\'ny Sokajy ihany: safidio ny halehibe, mandika modèle JSON, ampidiro, jereo ny preview. Azo atao ny CSV na JSON. Ny Paramètres dia fanondranana manontolo ihany.'
    }
  },
  images: {
    title: { fr: 'Images', en: 'Images', mg: 'Sary' },
    body: {
      fr: 'Ajoutez une image de catégorie (schéma) ou une image par mot depuis les panneaux respectifs. Les images s’affichent en plein écran côté public au clic.',
      en: 'Add a category diagram or per-word image from the respective panels. Images open fullscreen on the public side when clicked.',
      mg: 'Ampidiro sary ho an\'ny sokajy na ny teny. Aseho amin\'ny efijery feno eo amin\'ny lafiny ivelany.'
    }
  },
  globalAdmin: {
    title: { fr: 'Admin global', en: 'Global admin', mg: 'Admin ankapobeny' },
    body: {
      fr: 'Pour créer un tout nouveau domaine (nouvelle thématique), utilisez l’admin global depuis le menu. Vous y définissez l’identifiant, les titres trilingues, l’icône et les onglets par défaut — sans modifier le code.',
      en: 'To create a brand-new domain (new topic), use global admin from the menu. Set id, trilingual titles, icon and default tabs — no code changes needed.',
      mg: 'Hamoronana sehatra vaovao, ampiasao ny admin ankapobeny. Mametraha id, lohateny telo fiteny, kisary sy tabs default.'
    },
    linkLabel: {
      fr: 'Ouvrir l’admin global',
      en: 'Open global admin',
      mg: 'Sokafy ny admin ankapobeny'
    }
  },
  urlSharing: {
    title: { fr: 'URLs partageables', en: 'Shareable URLs', mg: 'URL azo zaraaina' },
    body: {
      fr: 'Côté public, l’URL reflète le fil d’Ariane (chemin catégories) et les filtres (onglet, mode, recherche). Partagez le lien pour retrouver exactement la même vue.',
      en: 'On the public side, the URL reflects the breadcrumb (category path) and filters (tab, mode, search). Share the link to restore the same view.',
      mg: 'Eo amin\'ny lafiny ivelany, ny URL maneho ny sokajy sy ny sivana. Zarao ny rohy hahazoana ny fijery mitovy.'
    }
  }
};

export function getAdminGuideText(obj, lang) {
  return pickLangText(obj, lang);
}
