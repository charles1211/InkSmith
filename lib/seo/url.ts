/**
 * Canonical URL derivation — the single source of truth for every absolute URL
 * the site emits (canonicals, OG tags, JSON-LD @ids, sitemap entries, and the
 * links inside transactional emails).
 */

/** Used when no environment variable identifies the deployment. */
const FALLBACK_SITE_URL = 'https://ink-smith.vercel.app';

/**
 * The origin this deployment should present as canonical, without a trailing slash.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — set this once a custom domain is live.
 *   2. The Vercel production domain, but only on production deployments, so
 *      preview builds never canonicalise to themselves.
 *   3. The known project URL.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return stripTrailingSlash(explicit);

  const vercelProd =
    process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '';
  if (vercelProd) return stripTrailingSlash(vercelProd);

  return FALLBACK_SITE_URL;
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

/**
 * Normalises a path into the exact form used for canonicals:
 * leading slash, no query string, no hash, no trailing slash (except root).
 *
 * This is what prevents `/aftercare?type=tattoo`, `/book?artistId=x` and any
 * UTM-tagged URL from being treated as separate documents.
 */
export function canonicalPath(path: string): string {
  if (!path) return '/';
  const withoutQuery = path.split('?')[0].split('#')[0];
  const withLeadingSlash = withoutQuery.startsWith('/')
    ? withoutQuery
    : `/${withoutQuery}`;
  if (withLeadingSlash === '/') return '/';
  return stripTrailingSlash(withLeadingSlash) || '/';
}

/**
 * Absolute URL for a site-relative path.
 *
 * The root resolves to the bare origin with no trailing slash. That matches how
 * Next normalises canonical and og:url under the default `trailingSlash: false`,
 * so the sitemap, the canonical tag, the OG tags and every JSON-LD @id all agree
 * on one spelling of the home page.
 */
export function absoluteUrl(path = '/'): string {
  const normalised = canonicalPath(path);
  const base = getSiteUrl();
  return normalised === '/' ? base : `${base}${normalised}`;
}

/** Origin of the Supabase project, for a `preconnect` hint. Null when unset. */
export function getSupabaseOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}
