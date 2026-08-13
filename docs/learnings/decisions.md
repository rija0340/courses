# Décisions

Tableau des choix techniques (relecture rapide : *quoi / tag / pratique / pourquoi / pas quoi*).

Tags : voir [`domains.md`](./domains.md).

| Date | Feature | Tags | Décision | Options rejetées | Pourquoi rejetée | Piège | Pratique / principe nommé |
|------|---------|------|----------|------------------|------------------|-------|---------------------------|
| 2026-08-13 | React #31 i18n child | `error-handling` `visibility` `data-modeling` | pickLangText / coerceDisplayText avant tout JSX (y compris `meta.title` pratique) | String(obj) ; try/catch ErrorBoundary seul | `[object Object]` ; l’UI crash quand même | `{fr,en,mg}` dans un `<p>` mixte = reconcileChildrenArray | coerce at boundaries
| 2026-08-13 | Card utterance assessment | `ux` `learning` `api-design` | Juge phrase dédié (contexte 45%) ; oral = transcribe puis même juge | Réutiliser written-turn ; overlap pronunciation | Dialogue hors sujet ; pénalise les mots en trop | Répéter l’exemple ≠ seule réponse valide | SRP ; ports & adapters ; fail safely in prod |
| 2026-08-13 | Vercel build quiz unused var | `tooling` `error-handling` | Réutiliser `canStart` sur le bouton quiz | `CI=false` / disable ESLint | Cache le signal ; casse le garde-fou UX | Vercel `CI=true` = warning ESLint = fail | fail loudly in CI ; no dead assignments |
| 2026-08-12 | Admin tab-focus refresh | `effects` `state` | Hook `useSupabaseAdminSession` + deps `userId` | Désactiver autoRefresh Supabase ; refetchOnWindowFocus | Casse le refresh token ; pas de React Query | `SIGNED_IN` ≠ vrai login au focus | distinguish side-effect triggers ; stable dependency keys |
| 2026-08-12 | Vocab structure racine | `data-modeling` `ux` | itemStructure sur racine + héritage ; EN requis ; translate par colonne | Profils nommés ; table-only | Trop figé / mauvais mobile | Confondre tabs et structure | SSOT ; Open/Closed |
| 2026-08-12 | Colonnes rename/add/delete | `data-modeling` `ux` | label override + presets + custom id + delete/reorder | Renommer l’id ; presets-only | Cassure données / trop rigide | id ≠ label | Open/Closed ; presentation ≠ identity |
| 2026-08-12 | VocabCard EN-first compact | `ux` `visibility` | Titre EN + IPA ; FR/MG dessous ; accent catégorie léger | Titre = langue UI ; couleurs saturées | Hiérarchie floue / fatigue visuelle | — | primary language as hierarchy anchor |
| 2026-08-12 | category/IPA/practice | `data-modeling` `ux` | category vide ; coercePhoneticString ; practice all EN cards | Badge Organe ; String(obj) ; expressions-only | Tag ≠ thème ; [object Object] | phonetic i18n object | coerce at boundaries |
| 2026-08-12 | Simulation domain-aware | `architecture` `learning` | Profils medical/general + presets + prompts | Simulation médicale partout ; hide hors Medi | Couplage domaine | — | domain-aware defaults |
| 2026-08-12 | i18n display + card wrap + A/B sim | `visibility` `ux` `data-modeling` | coerceDisplayText récursif ; colonnes flex-wrap centrées ; simu défaut A/B | String(obj) ; grid égale ; médical pour tout medi-vocabs | Cache-misère / largeur forcée / fuite doctor-patient | nested i18n → `[object Object]` | coerce at boundaries ; density by content role |
