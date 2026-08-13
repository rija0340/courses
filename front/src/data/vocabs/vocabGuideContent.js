import { pickLangText } from './vocabItemStructure';

export const VOCAB_GUIDE = {
  pageTitle: {
    fr: 'Guide d\'utilisation',
    en: 'User guide',
    mg: 'Torolalana fampiasana'
  },
  pageIntro: {
    fr: 'Comment naviguer, filtrer et réviser le vocabulaire de ce domaine.',
    en: 'How to browse, filter and revise vocabulary in this domain.',
    mg: 'Ahoana ny fikarohana, fisivanana ary famerenana ny voaboly amin\'ity sehatra ity.'
  },
  backToVocabs: {
    fr: 'Retour au vocabulaire',
    en: 'Back to vocabulary',
    mg: 'Miverina amin\'ny voaboly'
  },
  modes: {
    title: {
      fr: 'Modes d\'affichage',
      en: 'Display modes',
      mg: 'Fomba fisehoana'
    },
    body: {
      fr: 'Trois modes sont disponibles en haut de la page : Lecture affiche les trois langues (FR, EN, MG) ; Révision masque les langues non ciblées (flou + clic pour révéler) ; Image propose une navigation visuelle par catégories et photos.',
      en: 'Three modes are available at the top: Reading shows all three languages (FR, EN, MG); Revision hides non-target languages (blur + click to reveal); Image offers visual browsing by categories and pictures.',
      mg: 'Fomba telo no misy ambony ny pejy : Famakiana mampiseho ny fiteny telo ; Fanamarihana manafina ny fiteny tsy voafidy ; Sary manome fikarohana araka ny sokajy sy ny sary.'
    },
    lecture: {
      title: { fr: 'Lecture', en: 'Reading', mg: 'Famakiana' },
      body: {
        fr: 'Consultez chaque mot avec ses traductions FR, EN et MG visibles. Idéal pour découvrir ou relire.',
        en: 'View each word with FR, EN and MG translations visible. Ideal for discovery or review.',
        mg: 'Jereo ny teny tsirairay miaraka amin\'ny dikan-teny FR, EN sy MG. Tsara ho an\'ny fianarana na famakiana.'
      }
    },
    revision: {
      title: { fr: 'Révision', en: 'Revision', mg: 'Fanamarihana' },
      body: {
        fr: 'Choisissez la langue à réviser (FR, EN ou MG). Les autres langues sont floutées — cliquez pour révéler la réponse. Utilisez « Tout révéler » pour vérifier en bloc.',
        en: 'Pick the language to revise (FR, EN or MG). Other languages are blurred — click to reveal. Use "Reveal all" to check everything at once.',
        mg: 'Safidio ny fiteny hamerenana. Ny fiteny hafa dia mivonto — tsindrio hampisehoana. Ampiasao « Aseho ny rehetra » raha mila manamarina.'
      }
    },
    image: {
      title: { fr: 'Image', en: 'Image', mg: 'Sary' },
      body: {
        fr: 'Parcourez les catégories et sous-catégories sous forme de cartes visuelles. Cliquez sur une image pour l\'agrandir en plein écran.',
        en: 'Browse categories and subcategories as visual cards. Click an image to view it fullscreen.',
        mg: 'Mikaroka ny sokajy amin\'ny alalan\'ny karatra sary. Tsindrio ny sary hampisehoana amin\'ny efijery feno.'
      }
    }
  },
  revisionLang: {
    title: {
      fr: 'Langue de révision',
      en: 'Revision language',
      mg: 'Fiteny hamerenana'
    },
    body: {
      fr: 'En mode Révision, les pills FR / EN / MG définissent quelle langue vous testez. Ce choix est indépendant de la langue de l\'interface (header MG / FR / EN).',
      en: 'In Revision mode, the FR / EN / MG pills set which language you are testing. This is separate from the UI language in the header.',
      mg: 'Amin\'ny fomba Fanamarihana, ny FR / EN / MG no mamaritra ny fiteny hamerenana. Tsy mitovy amin\'ny fiteny fampiasa amin\'ny lohapejy.'
    }
  },
  tabs: {
    title: {
      fr: 'Onglets (type de contenu)',
      en: 'Tabs (content type)',
      mg: 'Tabs (karazana votoaty)'
    },
    body: {
      fr: 'Les onglets filtrent les mots par type : vocabulaire, symptômes, maladies, scénarios, etc. Ils occupent toute la largeur au-dessus des cartes et passent à la ligne si nécessaire. La recherche active ignore le filtre d\'onglet.',
      en: 'Tabs filter words by type: vocabulary, symptoms, conditions, scenarios, etc. They span the full content width above the cards and wrap when needed. Active search overrides the tab filter.',
      mg: 'Ny tabs manivana ny teny araka ny karazany. Mandrakotra ny sakany manontolo eo ambonin\'ny karatra izy ireo. Ny fikarohana manana laharam-pahamehana noho ny tab.'
    }
  },
  categories: {
    title: {
      fr: 'Catégories',
      en: 'Categories',
      mg: 'Sokajy'
    },
    body: {
      fr: 'L\'arbre à gauche (ou le bouton Catégories sur mobile) filtre par thème anatomique ou thématique. Sélectionner une catégorie parent inclut aussi les mots des sous-catégories.',
      en: 'The tree on the left (or Categories button on mobile) filters by topic. Selecting a parent category also includes words from subcategories.',
      mg: 'Ny hazo eo ankavia (na ny bokotra Sokajy amin\'ny finday) manivana araka ny lohahevitra. Ny sokajy ray dia ahitana ny teny amin\'ny zana-sokajy koa.'
    }
  },
  search: {
    title: {
      fr: 'Recherche',
      en: 'Search',
      mg: 'Fikarohana'
    },
    body: {
      fr: 'Tapez un mot en FR, EN ou MG. La recherche a priorité sur les onglets : tous les résultats correspondants s\'affichent, quelle que soit l\'onglet actif.',
      en: 'Type a word in FR, EN or MG. Search takes priority over tabs: all matching results show regardless of the active tab.',
      mg: 'Manorata teny amin\'ny FR, EN na MG. Ny fikarohana manana laharam-pahamehana noho ny tabs.'
    }
  },
  images: {
    title: {
      fr: 'Images',
      en: 'Images',
      mg: 'Sary'
    },
    body: {
      fr: 'Cliquez sur la miniature d\'un mot ou d\'une catégorie pour l\'ouvrir en plein écran. Appuyez sur Échap ou cliquez à l\'extérieur pour fermer.',
      en: 'Click a word or category thumbnail to open it fullscreen. Press Escape or click outside to close.',
      mg: 'Tsindrio ny sary kely hampisehoana amin\'ny efijery feno. Tsindrio Escape na ivelany hamonoana.'
    }
  },
  microHints: {
    lecture: {
      fr: 'Les trois langues sont visibles sur chaque carte.',
      en: 'All three languages are visible on each card.',
      mg: 'Ny fiteny telo dia hita amin\'ny karatra tsirairay.'
    },
    revision: {
      fr: 'Les autres langues sont masquées — cliquez pour révéler.',
      en: 'Other languages are hidden — click to reveal.',
      mg: 'Ny fiteny hafa dia miafina — tsindrio hampisehoana.'
    },
    image: {
      fr: 'Navigation visuelle par catégories et photos.',
      en: 'Visual browsing by categories and photos.',
      mg: 'Fikarohana araka ny sokajy sy sary.'
    }
  },
  seeGuide: {
    fr: 'Voir le guide',
    en: 'See guide',
    mg: 'Jereo ny torolalana'
  },
  tabSectionLabel: {
    fr: 'Type de contenu',
    en: 'Content type',
    mg: 'Karazana votoaty'
  }
};

export function getGuideText(obj, lang) {
  return pickLangText(obj, lang);
}
