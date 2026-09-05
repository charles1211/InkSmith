import type { Metadata } from 'next';

import { siteConfig } from './site.config';
import { absoluteUrl, canonicalPath } from './url';

export interface OgImageInput {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface BuildMetadataInput {
  /** Page title. The root layout applies the `%s | <site name>` template. */
  title: string;
  /** Bypass the title template — the home page only. */
  titleAbsolute?: boolean;
  description: string;
  /**
   * The page's clean path. The canonical URL is derived from THIS and nothing
   * else, which is what keeps `?type=`, `?artistId=` and UTM-tagged URLs from
   * being indexed as separate documents.
   */
  path: string;
  keywords?: string[];
  /**
   * Omit to let Next fall back to the nearest `opengraph-image` file
   * convention. That fallback is what makes per-segment OG images work.
   */
  images?: OgImageInput[];
  noIndex?: boolean;
  ogType?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  languages?: Record<string, string>;
}

/**
 * `max-snippet: -1` and `max-image-preview: large` matter more than they look:
 * they are the two directives that most affect whether a page's text can be
 * surfaced in AI overviews and rich snippets.
 */
const INDEXABLE_ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

const NOINDEX_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const path = canonicalPath(input.path);
  const canonical = absoluteUrl(path);

  const openGraph: Metadata['openGraph'] = {
    type: input.ogType ?? 'website',
    url: canonical,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: input.title,
    description: input.description,
  };

  // Only set `images` when explicitly provided — otherwise Next resolves the
  // nearest opengraph-image.tsx for this route segment.
  if (input.images?.length) {
    openGraph.images = input.images.map((image) => ({
      url: image.url,
      width: image.width,
      height: image.height,
      alt: image.alt ?? input.title,
    }));
  }

  if (input.ogType === 'article') {
    (openGraph as Record<string, unknown>).publishedTime = input.publishedTime;
    (openGraph as Record<string, unknown>).modifiedTime = input.modifiedTime;
  }

  const twitter: Metadata['twitter'] = {
    card: siteConfig.twitter?.card ?? 'summary_large_image',
    title: input.title,
    description: input.description,
  };
  if (siteConfig.twitter?.site) twitter.site = siteConfig.twitter.site;
  if (siteConfig.twitter?.creator) twitter.creator = siteConfig.twitter.creator;
  if (input.images?.length) twitter.images = input.images.map((image) => image.url);

  return {
    title: input.titleAbsolute ? { absolute: input.title } : input.title,
    description: input.description,
    keywords: input.keywords?.length ? input.keywords : undefined,
    alternates: {
      // A noindex page gets no canonical. Emitting one would mean telling a
      // crawler to treat this URL as the preferred version of itself while also
      // telling it to drop the URL — two contradictory signals on one page.
      canonical: input.noIndex ? undefined : canonical,
      languages: input.languages,
    },
    openGraph,
    twitter,
    robots: input.noIndex ? NOINDEX_ROBOTS : INDEXABLE_ROBOTS,
  };
}

/**
 * Metadata for private, utility and duplicate pages.
 *
 * These pages are additionally covered by a robots.txt disallow and an
 * `X-Robots-Tag` response header, because they render their real content
 * client-side after an auth check — a crawler that ignored the meta tag would
 * otherwise index an empty shell.
 */
export function buildNoIndexMetadata(title: string, path: string): Metadata {
  return buildMetadata({
    title,
    description: `${title} — ${siteConfig.name}.`,
    path,
    noIndex: true,
  });
}

/** Verification tokens, omitted entirely when none are configured. */
export function buildVerification(): Metadata['verification'] | undefined {
  const config = siteConfig.verification;
  if (!config) return undefined;

  const verification: Record<string, string> = {};
  if (config.google) verification.google = config.google;
  if (config.bing) verification.other = config.bing;
  if (config.yandex) verification.yandex = config.yandex;

  return Object.keys(verification).length
    ? (verification as Metadata['verification'])
    : undefined;
}
