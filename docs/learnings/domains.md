# Domaines d'apprentissage (tags)

Chaque entrée de journal / décision doit porter **1–3 tags** précis (pas « code » ou « react » tout seul).

Utilise ces domaines. Si un nouveau domaine est nécessaire, **ajoute-le ici** avec une définition en une ligne.

| Tag | Signifie |
|-----|----------|
| `solid` | Principes SOLID (SRP, OCP, LSP, ISP, DIP) — nommer lequel |
| `dry` | Don't Repeat Yourself / abstraction partagée |
| `kiss` | Keep It Simple — éviter la sur-ingénierie |
| `yagni` | You Aren't Gonna Need It |
| `separation-of-concerns` | Couches, responsabilités séparées |
| `coupling` | Couplage fort/faible entre modules |
| `cohesion` | Cohésion d'un module / composant |
| `state` | Où vit l'état, synchro, source of truth |
| `data-flow` | Props, events, store, unidirectional flow |
| `react-rendering` | Re-renders, keys, composition, memo (si justifié) |
| `effects` | useEffect / sync vs events, dépendances |
| `hooks` | Custom hooks, règles des hooks |
| `performance` | Perf runtime, bundle, réseau, listes |
| `accessibility` | a11y, clavier, ARIA, focus |
| `visibility` | Ce que l'utilisateur voit / feedback UI / loading / empty / error |
| `ux` | Parcours, clarté, friction |
| `api-design` | Contrats API, erreurs, versioning |
| `security` | Auth, secrets, RLS, XSS, validation |
| `error-handling` | Erreurs, fallbacks, résilience |
| `testing` | Stratégie de test, ce qu'on vérifie |
| `observability` | Logs, métriques, debug |
| `architecture` | Structure app, boundaries, ADR-worthy |
| `data-modeling` | Schéma DB, normalise / dénormalise |
| `async` | Promesses, race conditions, loading states |
| `caching` | Cache, stale data, invalidation |
| `naming` | Noms clairs, intention révélée |
| `readability` | Lisibilité, complexité cognitive |
| `tooling` | CI, lint, build, scripts — ce qui casse avant le runtime |
| `learning` | Pédagogie, évaluation, feedback apprenant |

## Bonnes pratiques nommées (références)

Dans le journal, cite la pratique **par son nom** (pas un vague « bonne pratique »). Exemples :

| Domaine | Exemples de références à nommer |
|---------|----------------------------------|
| `solid` | Single Responsibility, Dependency Inversion |
| `state` | Colocate state, lift state up, single source of truth |
| `effects` | You Might Not Need an Effect (React docs) |
| `data-flow` | Unidirectional data flow, derived state |
| `performance` | Measure first, avoid premature memoization |
| `visibility` | Skeleton / optimistic UI / explicit empty & error states |
| `accessibility` | Focus management, accessible names |
| `security` | Least privilege, never trust client input |
| `error-handling` | Fail loudly in dev, fail safely in prod |
| `api-design` | Idempotency, explicit error codes |
| `architecture` | Feature folders, ports & adapters (si pertinent) |

Tu peux citer aussi : doc officielle React, ADR du repo, article/pattern nommé (ex. « compound components »).

## Diagrammes

Si le flux, le cycle de vie, ou la frontière de responsabilités n'est pas clair en 3 phrases → **ajoute un diagramme Mermaid** dans le plan, le journal ou l'ADR.

Cas typiques : data-flow, séquence async, états UI, dépendances entre modules.
