-- Mini-examples (symptoms/conditions) + long dialogues (scenarios) on vocab_items
alter table public.vocab_items
  add column if not exists example jsonb,
  add column if not exists dialogue jsonb;

comment on column public.vocab_items.example is
  'Mini patient/doctor exchange: { patient: {en,fr,mg}, doctor: {en,fr,mg} }. mg optional.';
comment on column public.vocab_items.dialogue is
  'Scenario turns: [{ role: patient|doctor, en, fr, mg }]. mg optional per turn.';
