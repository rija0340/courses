-- MediVocabs RAG: pgvector + English-only embeddings (gte-small = 384 dims)

create extension if not exists vector with schema extensions;

create table if not exists public.vocab_embeddings (
  id           text        primary key
                           references public.vocab_items(id) on delete cascade,
  domain_id    text        not null
                           references public.vocab_domains(id) on delete cascade,
  content_en   text        not null,
  metadata     jsonb       not null default '{}'::jsonb,
  embedding    extensions.vector(384),
  embedded_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_vocab_embeddings_domain
  on public.vocab_embeddings(domain_id);

-- Inner-product ops (normalized gte-small vectors → IP ≈ cosine)
create index if not exists idx_vocab_embeddings_hnsw
  on public.vocab_embeddings
  using hnsw (embedding vector_ip_ops);

drop trigger if exists trigger_update_vocab_embeddings_timestamp on public.vocab_embeddings;
create trigger trigger_update_vocab_embeddings_timestamp
  before update on public.vocab_embeddings
  for each row execute function public.handle_updated_at();

alter table public.vocab_embeddings enable row level security;

drop policy if exists "public_read_embeddings" on public.vocab_embeddings;
drop policy if exists "auth_insert_embeddings" on public.vocab_embeddings;
drop policy if exists "auth_update_embeddings" on public.vocab_embeddings;
drop policy if exists "auth_delete_embeddings" on public.vocab_embeddings;

-- Public may read rows (RPC match also used by Edge Functions with service role)
create policy "public_read_embeddings"
  on public.vocab_embeddings for select
  using (true);

-- Writes only for authenticated admins (Edge ingest uses service_role, bypasses RLS)
create policy "auth_insert_embeddings"
  on public.vocab_embeddings for insert
  to authenticated
  with check (true);

create policy "auth_update_embeddings"
  on public.vocab_embeddings for update
  to authenticated
  using (true)
  with check (true);

create policy "auth_delete_embeddings"
  on public.vocab_embeddings for delete
  to authenticated
  using (true);

-- Similarity search: English embeddings, scoped by domain (default medi-vocabs)
create or replace function public.match_vocab_embeddings(
  query_embedding extensions.vector(384),
  match_threshold float default 0.45,
  match_count int default 8,
  filter_domain text default 'medi-vocabs'
)
returns table (
  id text,
  domain_id text,
  content_en text,
  metadata jsonb,
  similarity float
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    ve.id,
    ve.domain_id,
    ve.content_en,
    ve.metadata,
    (-(ve.embedding <#> query_embedding))::float as similarity
  from public.vocab_embeddings ve
  where ve.domain_id = filter_domain
    and ve.embedding is not null
    and (-(ve.embedding <#> query_embedding)) > match_threshold
  order by ve.embedding <#> query_embedding
  limit least(match_count, 50);
$$;

grant execute on function public.match_vocab_embeddings(extensions.vector, float, int, text)
  to anon, authenticated, service_role;
