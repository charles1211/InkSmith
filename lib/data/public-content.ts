import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createPublicClient } from '../supabase/public';
import type { Artist } from '../../types';

/**
 * Fail-soft server-side reads for public pages.
 *
 * The Supabase project runs on the free tier and pauses when idle — there is a
 * scheduled workflow that pings it three times a day precisely because of this.
 * Every read here therefore returns `{ data, failed }` and NEVER throws, so:
 *
 *   - `next build` cannot hang or fail when the database is unreachable;
 *   - a page renders its existing empty state instead of a stack trace;
 *   - the caller can tell "genuinely empty" from "could not reach the database"
 *     and hand that distinction to the client component, which re-fetches in the
 *     browser as a fallback.
 */

export interface Fetched<T> {
  data: T;
  failed: boolean;
}

/**
 * Bounded so a prerender against a paused project cannot stall a build. The
 * client-side portfolio fetch already used a 10s budget; 6s is the right
 * server-side equivalent.
 */
const TIMEOUT_MS = 6000;

async function safeQuery<T>(
  run: (client: SupabaseClient) => PromiseLike<{ data: unknown; error: unknown }>,
  fallback: T,
  label: string
): Promise<Fetched<T>> {
  const supabase = createPublicClient();
  if (!supabase) {
    return { data: fallback, failed: true };
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = (await Promise.race([
      run(supabase),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS);
      }),
    ])) as { data: unknown; error: { message?: string } | null };

    if (result.error) {
      console.error(`[public-content] ${label}:`, result.error.message ?? result.error);
      return { data: fallback, failed: true };
    }

    return { data: (result.data ?? fallback) as T, failed: false };
  } catch (error) {
    console.error(`[public-content] ${label}:`, error);
    return { data: fallback, failed: true };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/* ────────────────────────────── shapes ────────────────────────────── */

export interface PortfolioItem {
  id: string;
  src: string;
  title: string;
  category: string;
  artist: string;
}

export interface PiercingType {
  name: string;
  img: string;
}

/* ────────────────────────────── readers ───────────────────────────── */

export async function getStudioImages(): Promise<Fetched<string[]>> {
  const result = await safeQuery<{ src: string }[]>(
    (client) =>
      client.from('studio_images').select('src').order('created_at', { ascending: false }),
    [],
    'studio_images'
  );
  return {
    data: result.data.map((row) => row.src).filter(Boolean),
    failed: result.failed,
  };
}

export async function getRecentWorks(limit = 8): Promise<Fetched<PortfolioItem[]>> {
  const result = await safeQuery<PortfolioItem[]>(
    (client) =>
      client
        .from('portfolio_images')
        .select('id, src, title, category, artist')
        .order('created_at', { ascending: false })
        .limit(limit),
    [],
    'portfolio_images (recent)'
  );
  return { data: normalisePortfolio(result.data), failed: result.failed };
}

export async function getPortfolioItems(): Promise<Fetched<PortfolioItem[]>> {
  const result = await safeQuery<PortfolioItem[]>(
    (client) =>
      client
        .from('portfolio_images')
        .select('*')
        .order('created_at', { ascending: false }),
    [],
    'portfolio_images'
  );
  return { data: normalisePortfolio(result.data), failed: result.failed };
}

export async function getPiercingTypes(): Promise<Fetched<PiercingType[]>> {
  const result = await safeQuery<{ src: string; name: string }[]>(
    (client) =>
      client
        .from('piercing_images')
        .select('src, name')
        .order('created_at', { ascending: false }),
    [],
    'piercing_images'
  );
  return {
    data: result.data
      .filter((row) => Boolean(row?.src))
      .map((row) => ({ name: row.name ?? '', img: row.src })),
    failed: result.failed,
  };
}

export async function getArtists(): Promise<Fetched<Artist[]>> {
  const result = await safeQuery<Record<string, unknown>[]>(
    (client) => client.from('artists').select('*').order('created_at', { ascending: true }),
    [],
    'artists'
  );
  return { data: result.data.map(toArtist), failed: result.failed };
}

/* ────────────────────────────── mapping ───────────────────────────── */

function normalisePortfolio(rows: unknown[]): PortfolioItem[] {
  return (rows as Record<string, unknown>[])
    .filter((row) => Boolean(row?.src))
    .map((row) => ({
      id: String(row.id ?? ''),
      src: String(row.src ?? ''),
      title: String(row.title ?? ''),
      category: String(row.category ?? ''),
      artist: String(row.artist ?? ''),
    }));
}

/** DB columns are snake_case; the TypeScript `Artist` interface is camelCase. */
function toArtist(row: Record<string, unknown>): Artist {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    specialties: (row.specialties as Artist['specialties']) ?? [],
    bio: String(row.bio ?? ''),
    imageUrl: String(row.image_url ?? ''),
    instagramHandle: String(row.instagram_handle ?? ''),
    highlights: (row.highlights as string[]) ?? [],
  };
}

/**
 * Resolves an artist by URL slug.
 *
 * `failed` is kept separate from a null artist on purpose: an unreachable
 * database must produce a 500 so crawlers retry, never a 404 that would
 * deindex a real artist's page during a transient outage.
 */
export async function getArtistBySlug(
  slug: string
): Promise<{ artist: Artist | null; artists: Artist[]; failed: boolean }> {
  const { data, failed } = await getArtists();
  if (failed) return { artist: null, artists: [], failed: true };

  const { resolveArtist } = await import('../seo/slug');
  return { artist: resolveArtist(data, slug), artists: data, failed: false };
}
