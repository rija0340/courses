/**
 * Batch-embed English MediVocabs terms with gte-small → pgvector.
 * Auth: valid JWT (admin session) OR header x-ingest-secret matching INGEST_SECRET.
 *
 * Appelé depuis le front admin via supabase.functions.invoke('ingest', …).
 *
 * Exemple d'entrée (body POST) :
 *   { "domainId": "medi-vocabs" }
 *
 * Exemple de sortie succès (HTTP 200) :
 *   {
 *     "domainId": "medi-vocabs",
 *     "total": 120,
 *     "processed": 118,
 *     "skipped": 0,
 *     "errorCount": 2,
 *     "errors": [{ "id": "abc-123", "message": "…" }]
 *   }
 */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

// --- Helpers CORS / réponse JSON ---
const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-ingest-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Construit une Response HTTP JSON + headers CORS.
 *
 * Exemple :
 *   jsonResponse({ error: 'Unauthorized' }, 401)
 *   → Response status 401, body '{"error":"Unauthorized"}'
 *
 *   jsonResponse({ processed: 10, total: 10 })
 *   → Response status 200, body '{"processed":10,"total":10}'
 */
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// --- Constantes & types ---
const DEFAULT_DOMAIN = 'medi-vocabs';
const BATCH_SIZE = 32;

/** Une ligne issue de public.vocab_items (champs utilisés pour l'embed). */
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

/**
 * Texte anglais à embedder : terme + catégorie + onglet (contexte pour la similarité).
 *
 * Exemple d'entrée (VocabItem) :
 *   { en: "Blood pressure", category: "Cardiology", tab: "Symptoms", … }
 *
 * Exemple de sortie (string) :
 *   "Blood pressure. Category: Cardiology. Tab: Symptoms"
 *
 * Sans category/tab :
 *   "Blood pressure"
 */
function buildContentEn(item: VocabItem): string {
  const parts = [item.en.trim()];
  if (item.category?.trim()) parts.push(`Category: ${item.category.trim()}`);
  if (item.tab?.trim()) parts.push(`Tab: ${item.tab.trim()}`);
  return parts.join('. ');
}

Deno.serve(async (req) => {
  // --- Handler HTTP : preflight CORS + POST uniquement ---
  // OPTIONS → body "ok" (preflight navigateur), status 200
  // GET/PUT/… → { "error": "Method not allowed" } status 405
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    // --- Auth : secret x-ingest-secret OU Bearer JWT admin ---
    // Échec → { "error": "Unauthorized" } status 401
    const ingestSecret = Deno.env.get('INGEST_SECRET') || '';
    const headerSecret = req.headers.get('x-ingest-secret') || '';
    const authHeader = req.headers.get('Authorization') || '';

    const secretOk = Boolean(ingestSecret) && headerSecret === ingestSecret;
    if (!secretOk && !authHeader.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    // --- Client Supabase (service_role = bypass RLS pour écrire les embeddings) ---
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Sans secret valide : vérifier qu'il y a un vrai utilisateur (pas seulement la clé anon)
    // Échec → { "error": "Admin session required" } status 401
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

    // --- Body : domainId (seul medi-vocabs est supporté pour l'instant) ---
    // Body invalide / vide → domainId = "medi-vocabs" (défaut)
    // Autre domaine → { "error": "Only domain \"medi-vocabs\" is supported for now" } status 400
    const body = await req.json().catch(() => ({}));
    const domainId = String(body.domainId || DEFAULT_DOMAIN);
    if (domainId !== DEFAULT_DOMAIN) {
      return jsonResponse({
        error: `Only domain "${DEFAULT_DOMAIN}" is supported for now`,
      }, 400);
    }

    // --- Fetch : tous les termes EN non vides du domaine ---
    // Exemple de sortie items :
    //   [
    //     { id: "uuid-1", domain_id: "medi-vocabs", en: "Scalpel", fr: "Scalpel",
    //       mg: "…", category: "Surgery", tab: "Tools", category_id: "…", phonetic: null }
    //   ]
    // Erreur SQL → { "error": "<message Postgres>" } status 500
    const { data: items, error: fetchErr } = await supabase
      .from('vocab_items')
      .select('id, domain_id, en, fr, mg, category, tab, category_id, phonetic')
      .eq('domain_id', domainId)
      .neq('en', '');

    if (fetchErr) {
      return jsonResponse({ error: fetchErr.message }, 500);
    }

    const rows = (items || []) as VocabItem[];
    // gte-small → vecteur float[] de 384 dimensions, ex. [-0.02, 0.15, …] (384 nombres)
    const model = new Supabase.ai.Session('gte-small');

    let processed = 0;
    let skipped = 0;
    const errors: { id: string; message: string }[] = [];

    // --- Boucle embeddings : gte-small par lots → upsert vocab_embeddings ---
    // Pour chaque item réussi, ligne upsertée dans vocab_embeddings :
    //   {
    //     id, domain_id, content_en: "Scalpel. Category: Surgery. Tab: Tools",
    //     metadata: { en, fr, mg, category, tab, category_id, phonetic },
    //     embedding: "[-0.02,0.15,…]",   // JSON string du vecteur 384-d
    //     embedded_at: "2026-08-05T05:00:00.000Z"
    //   }
    // Erreur par item → ajoutée dans errors[], sans faire échouer tout le batch
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

    // --- Réponse : stats pour le front admin ---
    // Exemple succès :
    //   { domainId: "medi-vocabs", total: 120, processed: 118, skipped: 0,
    //     errorCount: 2, errors: [ /* max 20 */ ] }
    return jsonResponse({
      domainId,
      total: rows.length,
      processed,
      skipped,
      errorCount: errors.length,
      errors: errors.slice(0, 20),
    });
  } catch (e) {
    // Erreur inattendue → { "error": "<message>" } status 500
    return jsonResponse({
      error: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});
