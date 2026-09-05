/**
 * Slug helpers shared by artists, services and service areas.
 *
 * Artists are stored with a free-text primary key rather than a slug column, so
 * their URL slug is derived from the name here. A real `slug` column on the
 * `artists` table would be a better long-term fix.
 */

export function slugify(value: string): string {
  return (value || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface SluggableArtist {
  id: string;
  name: string;
}

/** Stable URL slug for an artist. Falls back to the id when the name is empty. */
export function artistSlug(artist: SluggableArtist): string {
  return slugify(artist.name) || `artist-${slugify(artist.id) || artist.id}`;
}

/**
 * Resolves a URL parameter to an artist.
 *
 * Matches the derived slug first, then the raw id, so links that were built
 * from an id still resolve. Duplicate names are disambiguated deterministically
 * by appending a short suffix derived from the id.
 */
export function resolveArtist<T extends SluggableArtist>(
  artists: T[],
  param: string
): T | null {
  const target = slugify(param);
  if (!target) return null;

  const withSlugs = withUniqueSlugs(artists);
  const bySlug = withSlugs.find((entry) => entry.slug === target);
  if (bySlug) return bySlug.artist;

  const byId = artists.find((artist) => slugify(artist.id) === target);
  return byId ?? null;
}

/**
 * Assigns each artist a unique slug. Collisions (two artists named "Chris") get
 * a deterministic suffix from the id so the URL never changes between builds.
 */
export function withUniqueSlugs<T extends SluggableArtist>(
  artists: T[]
): { artist: T; slug: string }[] {
  const seen = new Map<string, number>();
  return artists.map((artist) => {
    const base = artistSlug(artist);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    if (count === 0) return { artist, slug: base };
    const suffix = slugify(artist.id).slice(0, 6) || String(count + 1);
    return { artist, slug: `${base}-${suffix}` };
  });
}
