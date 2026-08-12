-- Flexible vocab item attributes (synonyms, antonyms, context, particle, …)
-- Stored as JSONB so new profile fields do not require a migration each time.

alter table public.vocab_items
  add column if not exists attrs jsonb default '{}'::jsonb;

comment on column public.vocab_items.attrs is
  'Extra lexical fields: synonyms[], antonyms[], context{i18n}, particle, pattern, register, notes{i18n}';
