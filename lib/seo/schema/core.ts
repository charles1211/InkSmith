import { absoluteUrl, getSiteUrl } from '../url';

/**
 * JSON-LD primitives.
 *
 * `compact` is the mechanism that guarantees no fabricated or placeholder data
 * ever reaches a search engine. Builders write every field unconditionally —
 * including optional ones like `geo`, `priceRange` and `aggregateRating` — and
 * `compact` deletes whatever came back empty. There is no `if` ladder to forget
 * and no way for an unset config value to ship as `null` or `""`.
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'number') return Number.isNaN(value);
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
}

/**
 * Recursively strips undefined, null, empty strings, empty arrays, empty
 * objects and NaN. `0` and `false` are preserved — they are meaningful values.
 * Returns undefined when nothing survives.
 */
export function compact<T>(value: T): T | undefined {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => compact(item))
      .filter((item) => !isEmpty(item));
    return (cleaned.length ? cleaned : undefined) as T | undefined;
  }

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source)) {
      const cleaned = compact(source[key]);
      if (!isEmpty(cleaned)) result[key] = cleaned;
    }
    return (Object.keys(result).length ? result : undefined) as T | undefined;
  }

  return isEmpty(value) ? undefined : value;
}

/**
 * Builds a typed node. Returns undefined when compaction leaves nothing but the
 * `@type` (and optionally `@id`), so an entirely empty node never renders.
 */
export function node(
  type: string | string[],
  props: Record<string, unknown>
): Record<string, unknown> | undefined {
  const cleaned = compact(props) as Record<string, unknown> | undefined;
  if (!cleaned) return undefined;

  const meaningfulKeys = Object.keys(cleaned).filter((key) => key !== '@id');
  if (meaningfulKeys.length === 0) return undefined;

  return { '@type': type, ...cleaned };
}

/** A bare `@id` reference to another node in the graph. */
export function ref(id: string): { '@id': string } {
  return { '@id': id };
}

/** Assembles the page graph, dropping any node that compacted away. */
export function graph(
  ...nodes: (Record<string, unknown> | undefined | null)[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean) as Record<string, unknown>[],
  };
}

/**
 * Stable @id values. Nodes are cross-referenced by @id rather than nested, so a
 * crawler (or an LLM) reading any single page gets the whole entity graph.
 */
export const ID = {
  organization: () => `${getSiteUrl()}/#organization`,
  website: () => `${getSiteUrl()}/#website`,
  webPage: (path: string) => `${absoluteUrl(path)}#webpage`,
  breadcrumb: (path: string) => `${absoluteUrl(path)}#breadcrumb`,
  service: (slug: string) => `${absoluteUrl(`/services/${slug}`)}#service`,
  person: (slug: string) => `${absoluteUrl(`/artists/${slug}`)}#person`,
  faq: (path: string) => `${absoluteUrl(path)}#faq`,
  howTo: (path: string) => `${absoluteUrl(path)}#howto`,
  itemList: (path: string) => `${absoluteUrl(path)}#itemlist`,
};
