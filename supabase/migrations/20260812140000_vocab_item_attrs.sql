-- Flexible vocab item attributes (synonyms, antonyms, context, …)
alter table public.vocab_items
  add column if not exists attrs jsonb default '{}'::jsonb;

comment on column public.vocab_items.attrs is
  'Extra lexical fields driven by root itemStructure';
