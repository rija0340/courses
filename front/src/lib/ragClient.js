import { supabase } from '../services/supabaseClient';

const DEFAULT_DOMAIN = 'medi-vocabs';

/**
 * Call Supabase Edge Function `chat` (RAG + Groq).
 */
export async function sendRagChat({ messages, domainId = DEFAULT_DOMAIN }) {
  if (!supabase) {
    throw new Error('Supabase non configuré (REACT_APP_SUPABASE_URL / ANON_KEY)');
  }

  const { data, error } = await supabase.functions.invoke('chat', {
    body: { messages, domainId },
  });

  if (error) {
    const detail = data?.error || error.message || 'Erreur chat';
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }
  if (data?.error) {
    throw new Error(data.error);
  }
  return data;
}

/**
 * Re-index English embeddings for a domain (admin session required).
 */
export async function runVocabIngest(domainId = DEFAULT_DOMAIN) {
  if (!supabase) {
    throw new Error('Supabase non configuré');
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) {
    throw new Error('Connexion admin requise pour l’indexation');
  }

  const { data, error } = await supabase.functions.invoke('ingest', {
    body: { domainId },
  });

  if (error) {
    const detail = data?.error || error.message || 'Erreur ingest';
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }
  if (data?.error) {
    throw new Error(data.error);
  }
  return data;
}
