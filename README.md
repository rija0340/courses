# LearnHub / Raberia Courses

Monorepo : React (CRA) sur Vercel + Supabase Edge Functions (RAG MediVocabs).

```
courses/
├── AGENTS.md              # Contrat agent (workflow d'apprentissage)
├── docs/
│   ├── plans/             # Plans de tâches non triviales
│   ├── adr/               # Décisions d'architecture (gros choix)
│   ├── learnings/         # domains, journal, decisions, pitfalls
│   └── templates/
├── front/                 # React app (Root Directory Vercel = front)
│   ├── src/
│   ├── api/               # Practice AI (Groq / Deepgram) — serverless Vercel
│   └── ...
└── supabase/
    ├── migrations/        # pgvector + vocab_embeddings
    └── functions/
        ├── ingest/        # embed English terms (gte-small)
        └── chat/          # RAG + Groq
```

## Setup local

```bash
# Env front
cp front/.env.example front/.env.local
# Remplir REACT_APP_SUPABASE_* + GROQ_API_KEY (pratique locale)

cd front && npm install && npm run start:all
# ou depuis la racine : npm start
```

## Vercel

Dans le projet Vercel : **Root Directory = `front`**.

Variables : `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`, `REACT_APP_STORAGE_PROVIDER=supabase`,
plus `GROQ_API_KEY` / `DEEPGRAM_API_KEY` pour `front/api/*`.

## Supabase RAG (medi-vocabs)

1. Appliquer la migration `supabase/migrations/*_enable_pgvector_medi_rag.sql`
2. Secrets Edge : `GROQ_API_KEY` (obligatoire pour `chat`), optionnel `INGEST_SECRET`
3. Déployer : `npx supabase functions deploy ingest` et `chat`
4. Admin → Paramètres → Connexions → **Ré-indexer medi-vocabs**
5. Front : `/vocabs/medi-vocabs/chat`

Embeddings : modèle **gte-small** (384 dims), texte anglais uniquement, stocké dans `vocab_embeddings.embedding`.

## Flow d'apprentissage (anti vibe-coding)

Objectif : comprendre les **concepts**, les **domaines** (SOLID, perf, visibility…), et les **bonnes pratiques nommées** — pas seulement du code qui marche.

Le contrat agent est dans [`AGENTS.md`](./AGENTS.md) (rappel Cursor : `.cursor/rules/learning-workflow.mdc`).

### Workflow

```
EXPLORE → PLAN → VALIDATE (ton ok) → BUILD → VERIFY → LOG
```

| Étape | Quoi |
|-------|------|
| EXPLORE | Lire le code existant, résumer patterns / contraintes |
| PLAN | Options + reco + **tags** + **pratique nommée** (+ diagramme si besoin) |
| VALIDATE | Tu valides ou tu challenges — pas de code avant |
| BUILD | Respecter les conventions du projet |
| VERIFY | Test, commande ou checklist manuelle pass/fail |
| LOG | Journal + décisions avec tags / pratique précise |

**Micro-tâche** (typo, 1 ligne, pas d'archi) → skip plan, code direct.  
**Mode rapide** → dis `mode: rapide` pour BUILD + VERIFY sans cérémonie.

### Apprentissage ciblé

Chaque apprentissage non trivial doit être **précis** :

1. **Tag(s)** — ex. `solid`, `performance`, `visibility`, `state` (liste : [`docs/learnings/domains.md`](./docs/learnings/domains.md))
2. **Bonne pratique nommée** — ex. « Single Responsibility », « You Might Not Need an Effect », pas « on a suivi les best practices »
3. **Diagramme Mermaid** — si le flux / les responsabilités ne sont pas clairs en 3 phrases

### Où est la mémoire

| Fichier | Rôle |
|---------|------|
| [`docs/learnings/domains.md`](./docs/learnings/domains.md) | Tags + exemples de pratiques nommées |
| [`docs/learnings/journal.md`](./docs/learnings/journal.md) | Mémoire pédagogique ciblée |
| [`docs/learnings/decisions.md`](./docs/learnings/decisions.md) | Tableau (tag + pratique + pourquoi) |
| [`docs/learnings/pitfalls.md`](./docs/learnings/pitfalls.md) | Pièges à ne pas refaire |
| [`docs/adr/`](./docs/adr/) | Gros choix structurants seulement |
| [`docs/plans/`](./docs/plans/) | Plans de tâches non triviales |

Templates : [`docs/templates/`](./docs/templates/).

### Habitude hebdo

Chaque vendredi (ou fin de sprint), demande à l'agent :

> Relis `journal.md` et `decisions.md` de la semaine. Synthèse **par tag** : patterns qui reviennent, erreurs répétées, 1 chose à approfondir.

Règle d'or : après une feature, tu dois pouvoir dire le **concept**, le **domaine**, la **pratique nommée**, et pourquoi pas l'autre option.
