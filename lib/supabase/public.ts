import 'server-only';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * A cookie-free Supabase client for PUBLIC, unauthenticated reads.
 *
 * Why this exists alongside `server.ts`: that client awaits `cookies()`, which
 * is a Dynamic API in Next 15. Any page in its call chain is forced to dynamic
 * rendering and `export const revalidate` is silently ignored. Public marketing
 * pages need static generation and ISR, so they read through this client
 * instead. `server.ts` stays the correct choice for anything authenticated.
 *
 * Returns null when the environment is not configured, mirroring the
 * build-safe behaviour of `lib/supabase/client.ts`.
 */
export function createPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
