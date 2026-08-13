# Pitfalls

Pièges rencontrés en BUILD. **Seulement** si le récit dépasse une cellule du tableau `decisions.md`.

Format :

```md
### YYYY-MM-DD - Titre court
**Tags :** `effects` `async`
**Bonne pratique manquée :** …
**Symptôme :** ...
**Cause :** ...
**Fix / règle :** ...
```

---

<!-- Les entrées commencent ci-dessous -->

### 2026-08-13 - Vercel rouge à cause d’un unused var CRA
**Tags :** `tooling` `error-handling`
**Bonne pratique manquée :** fail loudly in CI ; no dead assignments
**Symptôme :** 3 commits `master` → Vercel Production `failure` ; pas de GitHub Actions.
**Cause :** `react-scripts build` avec `CI=true` (défaut Vercel) transforme les warnings ESLint en erreurs. `canStart` calculé dans `QuizPracticePanel` mais plus branché sur le bouton après le refactor UI.
**Fix / règle :** brancher la variable (`disabled={loading || !canStart}`) plutôt que `CI=false` ou `DISABLE_ESLINT_PLUGIN`. Toujours vérifier avec `CI=true npm run build` dans `front/` avant de pousser.
