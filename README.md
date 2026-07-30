# LearnHub / Raberia Courses

Monorepo : React (CRA) sur Vercel + Supabase Edge Functions (RAG MediVocabs).

```
courses/
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
