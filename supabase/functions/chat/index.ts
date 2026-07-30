/**
 * RAG chat: embed query (gte-small) → match_vocab_embeddings → Groq.
 * Scope: medi-vocabs English embeddings only.
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
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MAX_HISTORY = 12;

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

type MatchRow = {
  id: string;
  domain_id: string;
  content_en: string;
  metadata: Record<string, unknown> | null;
  similarity: number;
};

function buildSystemPrompt(contextBlock: string, domainId: string): string {
  return `You are MediVocabs Tutor, a helpful medical vocabulary assistant for the domain "${domainId}".
Answer using the retrieved vocabulary context below. Prefer English medical terms; you may also give French (fr) and Malagasy (mg) translations from the context when useful.
If the context does not contain enough information, say so briefly and suggest related terms from context if any.
Keep answers concise and educational. Do not invent vocabulary IDs.

Retrieved context:
${contextBlock || '(no matching vocabulary found)'}`;
}

function formatContext(rows: MatchRow[]): string {
  if (!rows.length) return '';
  return rows
    .map((r, i) => {
      const m = r.metadata || {};
      const en = String(m.en || r.content_en || '');
      const fr = m.fr ? ` | fr: ${m.fr}` : '';
      const mg = m.mg ? ` | mg: ${m.mg}` : '';
      const cat = m.category ? ` | category: ${m.category}` : '';
      const sim = typeof r.similarity === 'number' ? r.similarity.toFixed(3) : '?';
      return `${i + 1}. [${r.id}] ${en}${fr}${mg}${cat} (similarity ${sim})`;
    })
    .join('\n');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const groqKey = Deno.env.get('GROQ_API_KEY') || '';
    if (!groqKey) {
      return jsonResponse({ error: 'GROQ_API_KEY not configured on Edge Function' }, 500);
    }

    const body = await req.json().catch(() => ({}));
    const domainId = String(body.domainId || DEFAULT_DOMAIN);
    if (domainId !== DEFAULT_DOMAIN) {
      return jsonResponse({
        error: `Only domain "${DEFAULT_DOMAIN}" is supported for now`,
      }, 400);
    }

    const messages = Array.isArray(body.messages) ? (body.messages as ChatMessage[]) : [];
    const lastUser = [...messages].reverse().find((m) => m.role === 'user' && m.content?.trim());
    if (!lastUser) {
      return jsonResponse({ error: 'messages must include a user message' }, 400);
    }

    const matchCount = Math.min(Number(body.matchCount) || 8, 20);
    const matchThreshold = Number(body.matchThreshold) || 0.45;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const model = new Supabase.ai.Session('gte-small');
    const queryEmbedding = await model.run(lastUser.content.trim(), {
      mean_pool: true,
      normalize: true,
    });

    const { data: matches, error: matchErr } = await supabase.rpc('match_vocab_embeddings', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
      filter_domain: domainId,
    });

    if (matchErr) {
      return jsonResponse({ error: matchErr.message }, 500);
    }

    const rows = (matches || []) as MatchRow[];
    const contextBlock = formatContext(rows);
    const systemPrompt = buildSystemPrompt(contextBlock, domainId);

    const history = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: String(m.content || '').slice(0, 4000) }));

    const groqModel = Deno.env.get('GROQ_MODEL') || 'llama-3.3-70b-versatile';
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: groqModel,
        temperature: 0.3,
        messages: [{ role: 'system', content: systemPrompt }, ...history],
      }),
    });

    const groqText = await groqRes.text();
    if (!groqRes.ok) {
      return jsonResponse({
        error: 'Groq request failed',
        status: groqRes.status,
        detail: groqText.slice(0, 500),
      }, 502);
    }

    let answer = '';
    try {
      const parsed = JSON.parse(groqText);
      answer = parsed?.choices?.[0]?.message?.content || '';
    } catch {
      return jsonResponse({ error: 'Invalid Groq response', detail: groqText.slice(0, 300) }, 502);
    }

    const sources = rows.map((r) => ({
      id: r.id,
      en: (r.metadata as Record<string, unknown>)?.en || r.content_en,
      fr: (r.metadata as Record<string, unknown>)?.fr || '',
      mg: (r.metadata as Record<string, unknown>)?.mg || '',
      category: (r.metadata as Record<string, unknown>)?.category || '',
      similarity: r.similarity,
    }));

    return jsonResponse({
      answer,
      sources,
      domainId,
      model: groqModel,
    });
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : String(e),
    }, 500);
  }
});
