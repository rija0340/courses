-- =====================================================================
-- SQL SCHEMA FOR SUPABASE (LEARNHUB: VOCABS + COURSE PACKS)
-- Idempotent: safe to re-run. Run in Supabase SQL Editor.
--
-- DASHBOARD CHECKLIST:
-- 1. Project Settings > API : copy URL + anon key into .env.local
--      REACT_APP_SUPABASE_URL=...
--      REACT_APP_SUPABASE_ANON_KEY=...
--      REACT_APP_STORAGE_PROVIDER=supabase
-- 2. Authentication > Providers > Email : enable Email (sign up / password)
-- 3. Run THIS entire script in SQL Editor (tables + Storage + course_packs)
-- 4. Storage > Buckets : confirm public bucket "vocab-images" exists
--    Allowed MIME: image/jpeg, image/png, image/webp, image/gif, image/svg+xml
-- 5. Create an admin user (signup) then sign in before uploading / importing
-- 6. Course packs: table public.course_packs (section 5) — JSON per course
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =====================================================================
-- SECTION 1: TABLES
-- =====================================================================

-- 1a. vocab_domains — stores metadata + organization (tabs, category tree)
CREATE TABLE IF NOT EXISTS public.vocab_domains (
    id           TEXT        PRIMARY KEY,                 -- e.g. 'medi-vocabs'
    meta         JSONB       NOT NULL DEFAULT '{}'::jsonb, -- { title: {fr,en,mg}, description: {fr,en,mg} }
    organization JSONB       NOT NULL DEFAULT '{}'::jsonb, -- { tabs: [...], categories: [...] }
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1b. vocab_items — vocabulary words, one row per word per domain
CREATE TABLE IF NOT EXISTS public.vocab_items (
    id          TEXT        PRIMARY KEY,
    domain_id   TEXT        NOT NULL REFERENCES public.vocab_domains(id) ON DELETE CASCADE,
    en          TEXT        NOT NULL DEFAULT '',
    fr          TEXT        NOT NULL DEFAULT '',
    mg          TEXT        NOT NULL DEFAULT '',
    category    TEXT        NOT NULL DEFAULT '',   -- free-text type: 'Organe', 'Maladie', etc.
    tab         TEXT        NOT NULL DEFAULT '',   -- tab id: 'vocab', 'maladies', etc.
    category_id TEXT,                              -- references a node id in organization.categories
    phonetic    TEXT,
    -- Image stored as Supabase Storage public URL (preferred) or base64 fallback
    image_url   TEXT,                              -- Supabase Storage URL (e.g. https://xxx.supabase.co/storage/v1/object/public/vocab-images/items/...)
    image       TEXT,                              -- Legacy base64 fallback (still supported)
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocab_items_domain      ON public.vocab_items(domain_id);
CREATE INDEX IF NOT EXISTS idx_vocab_items_category_id ON public.vocab_items(category_id);
CREATE INDEX IF NOT EXISTS idx_vocab_items_tab         ON public.vocab_items(tab);

-- 1c. vocab_category_images — category illustration images
CREATE TABLE IF NOT EXISTS public.vocab_category_images (
    category_id TEXT        PRIMARY KEY,
    domain_id   TEXT        NOT NULL REFERENCES public.vocab_domains(id) ON DELETE CASCADE,
    -- Image stored as Supabase Storage public URL (preferred) or base64 fallback
    image_url   TEXT,                              -- Supabase Storage URL
    image       TEXT,                              -- Legacy base64 fallback
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocab_category_images_domain ON public.vocab_category_images(domain_id);


-- =====================================================================
-- SECTION 2: AUTO-UPDATE TIMESTAMPS
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_vocab_domains_timestamp        ON public.vocab_domains;
DROP TRIGGER IF EXISTS trigger_update_vocab_items_timestamp          ON public.vocab_items;
DROP TRIGGER IF EXISTS trigger_update_vocab_category_images_timestamp ON public.vocab_category_images;

CREATE TRIGGER trigger_update_vocab_domains_timestamp
    BEFORE UPDATE ON public.vocab_domains
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_update_vocab_items_timestamp
    BEFORE UPDATE ON public.vocab_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_update_vocab_category_images_timestamp
    BEFORE UPDATE ON public.vocab_category_images
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =====================================================================
-- SECTION 3: ROW LEVEL SECURITY (RLS)
-- =====================================================================

ALTER TABLE public.vocab_domains          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab_items            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab_category_images  ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DROP POLICY IF EXISTS "public_read_domains"       ON public.vocab_domains;
DROP POLICY IF EXISTS "auth_insert_domains"       ON public.vocab_domains;
DROP POLICY IF EXISTS "auth_update_domains"       ON public.vocab_domains;
DROP POLICY IF EXISTS "auth_delete_domains"       ON public.vocab_domains;

DROP POLICY IF EXISTS "public_read_items"         ON public.vocab_items;
DROP POLICY IF EXISTS "auth_insert_items"         ON public.vocab_items;
DROP POLICY IF EXISTS "auth_update_items"         ON public.vocab_items;
DROP POLICY IF EXISTS "auth_delete_items"         ON public.vocab_items;

DROP POLICY IF EXISTS "public_read_cat_images"    ON public.vocab_category_images;
DROP POLICY IF EXISTS "auth_insert_cat_images"    ON public.vocab_category_images;
DROP POLICY IF EXISTS "auth_update_cat_images"    ON public.vocab_category_images;
DROP POLICY IF EXISTS "auth_delete_cat_images"    ON public.vocab_category_images;

-- vocab_domains policies
CREATE POLICY "public_read_domains"  ON public.vocab_domains FOR SELECT USING (true);
CREATE POLICY "auth_insert_domains"  ON public.vocab_domains FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_domains"  ON public.vocab_domains FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_domains"  ON public.vocab_domains FOR DELETE USING (auth.role() = 'authenticated');

-- vocab_items policies
CREATE POLICY "public_read_items"    ON public.vocab_items FOR SELECT USING (true);
CREATE POLICY "auth_insert_items"    ON public.vocab_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_items"    ON public.vocab_items FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_items"    ON public.vocab_items FOR DELETE USING (auth.role() = 'authenticated');

-- vocab_category_images policies
CREATE POLICY "public_read_cat_images"   ON public.vocab_category_images FOR SELECT USING (true);
CREATE POLICY "auth_insert_cat_images"   ON public.vocab_category_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_cat_images"   ON public.vocab_category_images FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_cat_images"   ON public.vocab_category_images FOR DELETE USING (auth.role() = 'authenticated');


-- =====================================================================
-- SECTION 4: SUPABASE STORAGE BUCKET + POLICIES
-- =====================================================================
-- Run this block ONCE after creating the bucket in the Supabase dashboard,
-- OR use the dashboard UI to create a public bucket named 'vocab-images'.
-- Accepted formats: jpg, jpeg, png, webp, gif, svg
-- =====================================================================

-- Create the storage bucket (safe to run; will do nothing if it already exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'vocab-images',
    'vocab-images',
    true,       -- public: anyone can read via URL
    10485760,   -- 10 MB per file
    ARRAY[
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public             = true,
    file_size_limit    = 10485760,
    allowed_mime_types = ARRAY[
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml'
    ];

-- Storage RLS (drop + recreate idempotent pattern)
DROP POLICY IF EXISTS "storage_public_read"              ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_insert"              ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_update"              ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_delete"              ON storage.objects;
DROP POLICY IF EXISTS "vocab_images_public_read"         ON storage.objects;
DROP POLICY IF EXISTS "vocab_images_auth_insert"         ON storage.objects;
DROP POLICY IF EXISTS "vocab_images_auth_update"         ON storage.objects;
DROP POLICY IF EXISTS "vocab_images_auth_delete"         ON storage.objects;

-- Anyone can read/download images
CREATE POLICY "vocab_images_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'vocab-images');

-- Only authenticated users can upload
CREATE POLICY "vocab_images_auth_insert"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'vocab-images' AND auth.role() = 'authenticated');

-- Only authenticated users can overwrite/update
CREATE POLICY "vocab_images_auth_update"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'vocab-images' AND auth.role() = 'authenticated')
    WITH CHECK (bucket_id = 'vocab-images' AND auth.role() = 'authenticated');

-- Only authenticated users can delete
CREATE POLICY "vocab_images_auth_delete"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'vocab-images' AND auth.role() = 'authenticated');


-- =====================================================================
-- SECTION 5: COURSE PACKS (dynamic lessons — JSON import/paste)
-- =====================================================================
-- One row per course: full hierarchy levels → chapters → lessons →
-- sections + exercises stored in payload jsonb.
-- Run this block in Supabase SQL Editor after the vocab sections above.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.course_packs (
    course_id   TEXT        PRIMARY KEY,                 -- e.g. 'english'
    payload     JSONB       NOT NULL DEFAULT '{}'::jsonb, -- full course pack document
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_packs_updated_at ON public.course_packs(updated_at DESC);

DROP TRIGGER IF EXISTS trigger_update_course_packs_timestamp ON public.course_packs;
CREATE TRIGGER trigger_update_course_packs_timestamp
    BEFORE UPDATE ON public.course_packs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.course_packs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_course_packs"  ON public.course_packs;
DROP POLICY IF EXISTS "auth_insert_course_packs"  ON public.course_packs;
DROP POLICY IF EXISTS "auth_update_course_packs"  ON public.course_packs;
DROP POLICY IF EXISTS "auth_delete_course_packs"  ON public.course_packs;

-- Anyone can read course content (learner UI)
CREATE POLICY "public_read_course_packs"
    ON public.course_packs FOR SELECT USING (true);

-- Only authenticated admins can write packs (JSON import)
CREATE POLICY "auth_insert_course_packs"
    ON public.course_packs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_update_course_packs"
    ON public.course_packs FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_delete_course_packs"
    ON public.course_packs FOR DELETE
    USING (auth.role() = 'authenticated');

-- Optional future table (NOT created yet — phase 2 user scores):
-- CREATE TABLE public.user_exercise_attempts (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--   course_id TEXT NOT NULL,
--   lesson_id TEXT NOT NULL,
--   exercise_id TEXT NOT NULL,
--   score NUMERIC NOT NULL DEFAULT 0,
--   max_score NUMERIC NOT NULL DEFAULT 0,
--   answers JSONB,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );
