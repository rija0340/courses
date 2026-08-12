# Décisions

Tableau des choix techniques (relecture rapide : *quoi / tag / pratique / pourquoi / pas quoi*).

Tags : voir [`domains.md`](./domains.md).

| Date | Feature | Tags | Décision | Options rejetées | Pourquoi rejetée | Piège | Pratique / principe nommé |
|------|---------|------|----------|------------------|------------------|-------|---------------------------|
| 2026-08-12 | Admin tab-focus refresh | `effects` `state` | Hook `useSupabaseAdminSession` + deps `userId` | Désactiver autoRefresh Supabase ; refetchOnWindowFocus | Casse le refresh token ; pas de React Query | `SIGNED_IN` ≠ vrai login au focus | distinguish side-effect triggers ; stable dependency keys |
| 2026-08-12 | Vocab structure racine | `data-modeling` `ux` | itemStructure sur racine + héritage ; EN requis ; translate par colonne | Profils nommés ; table-only ; champs custom libres | Trop figé / mauvais mobile / pas de validation | Confondre tabs et structure | SSOT ; Open/Closed |
