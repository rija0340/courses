// Storage Configuration for flexibility and maintainability
export const STORAGE_PROVIDERS = {
  LOCAL: 'local',
  SUPABASE: 'supabase'
};

const hasSupabaseEnv = !!(
  process.env.REACT_APP_SUPABASE_URL && 
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Fallback to local if env variables are not set
export const ACTIVE_PROVIDER = hasSupabaseEnv 
  ? (process.env.REACT_APP_STORAGE_PROVIDER || STORAGE_PROVIDERS.SUPABASE)
  : STORAGE_PROVIDERS.LOCAL;

console.log(`[Storage] Active provider: ${ACTIVE_PROVIDER} (Supabase configured: ${hasSupabaseEnv})`);
