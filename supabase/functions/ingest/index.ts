/**
 * Batch-embed English MediVocabs terms with gte-small → pgvector.
 * Auth: valid JWT (admin session) OR header x-ingest-secret matching INGEST_SECRET.
 */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-ingest-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const DEFAULT_DOMAIN = 'medi-vocabs';
const BATCH_SIZE = 32;

type VocabItem = {
  id: string;
  domain_id: string;
  en: string;
  fr: string;
  mg: string;
  category: string;
  tab: string;
  category_id: string | null;
  phonetic: string | null;
};

function buildContentEn(item: VocabItem): string {
  const parts = [item.en.trim()];
  if (item.category?.trim()) parts.push(`Category: ${item.category.trim()}`);
  if (item.tab?.trim()) parts.push(`Tab: ${item.tab.trim()}`);
  return parts.join('. ');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const ingestSecret = Deno.env.get('INGEST_SECRET') || '';
    const headerSecret = req.headers.get('x-ingest-secret') || '';
    const authHeader = req.headers.get('Authorization') || '';

    const secretOk = Boolean(ingestSecret) && headerSecret === ingestSecret;
    if (!secretOk && !authHeader.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // If no ingest secret, require a real user JWT (not only anon)
    if (!secretOk) {
      const anonClient = createClient(
        supabaseUrl,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data: userData, error: userErr } = await anonClient.auth.getUser();
      if (userErr || !userData?.user) {
        return jsonResponse({ error: 'Admin session required' }, 401);
      }
    }

    const body = await req.json().catch(() => ({}));
    const domainId = String(body.domainId || DEFAULT_DOMAIN);
    if (domainId !== DEFAULT_DOMAIN) {
      return jsonResponse({
        error: `Only domain "${DEFAULT_DOMAIN}" is supported for now`,
      }, 400);
    }

    const { data: items, error: fetchErr } = await supabase
      .from('vocab_items')
      .select('id, domain_id, en, fr, mg, category, tab, category_id, phonetic')
      .eq('domain_id', domainId)
      .neq('en', '');

    if (fetchErr) {
      return jsonResponse({ error: fetchErr.message }, 500);
    }

    const rows = (items || []) as VocabItem[];
    const model = new Supabase.ai.Session('gte-small');

    let processed = 0;
    let skipped = 0;
    const errors: { id: string; message: string }[] = [];

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      for (const item of batch) {
        const en = (item.en || '').trim();
        if (!en) {
          skipped += 1;
          continue;
        }

        try {
          const contentEn = buildContentEn(item);
          const embedding = await model.run(contentEn, {
            mean_pool: true,
            normalize: true,
          });

          const { error: upsertErr } = await supabase
            .from('vocab_embeddings')
            .upsert({
              id: item.id,
              domain_id: domainId,
              content_en: contentEn,
              metadata: {
                en: item.en,
                fr: item.fr,
                mg: item.mg,
                category: item.category,
                tab: item.tab,
                category_id: item.category_id,
                phonetic: item.phonetic,
              },
              embedding: JSON.stringify(embedding),
              embedded_at: new Date().toISOString(),
            });

          if (upsertErr) {
            errors.push({ id: item.id, message: upsertErr.message });
          } else {
            processed += 1;
          }
        } catch (e) {
          errors.push({
            id: item.id,
            message: e instanceof Error ? e.message : String(e),
          });
        }
      }
    }

    return jsonResponse({
      domainId,
      total: rows.length,
      processed,
      skipped,
      errorCount: errors.length,
      errors: errors.slice(0, 20),
    });
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});
