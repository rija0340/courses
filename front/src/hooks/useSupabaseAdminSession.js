import { useEffect, useRef, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from '../services/storageConfig';

const usesSupabaseAuth = ACTIVE_PROVIDER === STORAGE_PROVIDERS.SUPABASE && !!supabase;

/** True sign-in / profile update — not Supabase tab-focus session recovery. */
export function shouldRefreshAdminData(event, hadSession) {
  if (event === 'USER_UPDATED') return true;
  if (event === 'SIGNED_IN' && !hadSession) return true;
  return false;
}

/**
 * Supabase session for admin pages. Ignores recovery SIGNED_IN emitted when the
 * browser tab becomes visible again (Supabase _recoverAndRefresh).
 */
export default function useSupabaseAdminSession(onAuthenticatedChange) {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(usesSupabaseAuth);
  const hadSessionRef = useRef(false);
  const onChangeRef = useRef(onAuthenticatedChange);
  onChangeRef.current = onAuthenticatedChange;

  useEffect(() => {
    if (!usesSupabaseAuth) {
      setCheckingAuth(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      hadSessionRef.current = !!s;
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      const hadSession = hadSessionRef.current;
      setSession(s);
      hadSessionRef.current = !!s;
      if (onChangeRef.current && s && shouldRefreshAdminData(event, hadSession)) {
        onChangeRef.current(event, s);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  return {
    session,
    checkingAuth,
    userId: session?.user?.id ?? null,
    usesSupabaseAuth,
  };
}
