# Décisions

Tableau des choix techniques (relecture rapide : *quoi / tag / pratique / pourquoi / pas quoi*).

Tags : voir [`domains.md`](./domains.md).

| Date | Feature | Tags | Décision | Options rejetées | Pourquoi rejetée | Piège | Pratique / principe nommé |
|------|---------|------|----------|------------------|------------------|-------|---------------------------|
| 2026-08-12 | Admin tab-focus refresh | `effects` `state` | Hook `useSupabaseAdminSession` + deps `userId` | Désactiver autoRefresh Supabase ; refetchOnWindowFocus | Casse le refresh token ; pas de React Query | `SIGNED_IN` ≠ vrai login au focus | distinguish side-effect triggers ; stable dependency keys |
