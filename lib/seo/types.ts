/**
 * Central SEO type definitions.
 *
 * Nothing in this file is specific to any one business. The single instantiation
 * lives in `site.config.ts` — swap that file (plus `content/*`) to repoint the
 * entire SEO layer at a different business.
 *
 * Design rule: every fact that cannot be verified is OPTIONAL. Unset optional
 * fields are stripped from JSON-LD by `schema/core.ts#compact` rather than being
 * filled with plausible-looking placeholders. Never invent addresses, ratings,
 * prices or coordinates.
 */

export type Weekday =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface OpeningHours {
  days: Weekday[];
  /** 24h `HH:MM`, schema.org OpeningHoursSpecification format. */
  opens: string;
  /** 24h `HH:MM`. */
  closes: string;
}

export interface PostalAddress {
  streetAddress: string;
  addressLocality: string;
  /** State / province / region. Omit where the country has no meaningful subdivision. */
  addressRegion?: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2, e.g. 'BM', 'US', 'GB'. */
  addressCountry: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface SocialProfiles {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
  linkedin?: string;
  pinterest?: string;
}

/**
 * Only ever populate this from a real, auditable review source.
 * Fabricated ratings are a structured-data policy violation and can earn a
 * manual action. When in doubt, leave it unset.
 */
export interface AggregateRatingConfig {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}

export interface BrandTokens {
  background: string;
  foreground: string;
  accent: string;
  themeColor: string;
}

export interface SchemaConfig {
  /**
   * The most specific schema.org LocalBusiness subtype that fits.
   * e.g. 'TattooParlor' | 'Dentist' | 'HairSalon' | 'Restaurant' | 'LocalBusiness'.
   * This single value re-types every business node across the site.
   */
  businessType: string;
  /** 'LocalBusiness' for a business with premises, 'Organization' otherwise. */
  organizationType: string;
  /** e.g. '$$'. Omit unless the business actually publishes a price level. */
  priceRange?: string;
  currenciesAccepted?: string;
  paymentAccepted?: string[];
  /** Omit unless backed by real, verifiable reviews. */
  aggregateRating?: AggregateRatingConfig;
}

export interface ContactConfig {
  /** Human-readable, e.g. '+1 (441) 261-8532'. */
  phone: string;
  /** E.164, e.g. '+14412618532'. Used for `tel:` hrefs and schema. */
  phoneE164: string;
  email: string;
  address: PostalAddress;
  /** Omit unless verified. Never approximate coordinates from an address. */
  geo?: GeoCoordinates;
  /** Google Maps directions link. */
  mapsUrl?: string;
  /** Google Maps embed URL for an iframe. */
  mapEmbedUrl?: string;
}

export interface VerificationConfig {
  google?: string;
  bing?: string;
  yandex?: string;
  pinterest?: string;
  facebookDomain?: string;
}

export interface SearchActionConfig {
  /** e.g. 'https://example.com/search?q={search_term_string}' */
  urlTemplate: string;
  /** e.g. 'required name=search_term_string' */
  queryInput: string;
}

export interface TwitterConfig {
  site?: string;
  creator?: string;
  card?: 'summary_large_image' | 'summary';
}

export interface SiteConfig {
  /* ── identity ── */
  name: string;
  shortName: string;
  /** Letterspaced wordmark used by the generated OG image. */
  wordmark: string;
  /** 1–2 characters, used by the generated favicon. */
  monogram: string;
  legalName?: string;
  /** One line. Appears in the home-page title and OG cards. */
  tagline: string;
  /** <=160 chars. The default meta description. */
  description: string;
  /** 2–3 sentences. Used for Organization.description and the About page. */
  longDescription: string;
  foundingYear?: number;
  /** BCP 47 with underscore, e.g. 'en_US'. Used for og:locale. */
  locale: string;
  /** The `lang` attribute on <html>, e.g. 'en'. */
  htmlLang: string;

  /* ── brand tokens, reused by icon/OG generators and the web manifest ── */
  brand: BrandTokens;

  /* ── schema.org typing ── */
  schema: SchemaConfig;

  /* ── NAP ── */
  contact: ContactConfig;

  openingHours: OpeningHours[];
  /** Free-text hours line for humans and answer-first content blocks. */
  openingHoursSummary: string;

  social: SocialProfiles;

  /** The umbrella region served, e.g. 'Bermuda'. */
  serviceAreaName: string;
  /** schema.org type for the umbrella region: 'Country' | 'State' | 'City' | 'AdministrativeArea'. */
  serviceAreaType: string;

  /* ── search-engine plumbing ── */
  verification?: VerificationConfig;
  /** Only set when a real on-site search endpoint exists. */
  searchAction?: SearchActionConfig;
  /** Path to a static OG image. Unset ⇒ the generated `opengraph-image` is used. */
  defaultOgImage?: string;
  twitter?: TwitterConfig;
}
