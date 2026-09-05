/**
 * Content data types.
 *
 * `content/` holds data and copy only — no JSX, no imports from `app/`. That
 * separation is what makes the whole SEO layer portable: point it at a
 * different business by replacing `lib/seo/site.config.ts` and these files.
 */

/* ────────────────────────────── services ──────────────────────────── */

export interface ServiceSection {
  /** Rendered as an h2. Phrase it as something a person would actually type. */
  heading: string;
  intro?: string;
  body?: string[];
  /** Rendered as h3 sub-items. */
  items?: { title: string; text: string }[];
}

export interface ServiceOptionGroup {
  label?: string;
  values: string[];
}

export interface Service {
  slug: string;
  /** Full service name, e.g. 'Custom Tattoos'. */
  name: string;
  /** Short label for navigation and breadcrumbs. */
  navLabel: string;
  /**
   * Answer-first: one or two self-contained sentences that fully answer
   * "what is this and can I get it here" with no surrounding context.
   */
  answer: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  body: string[];
  sections: ServiceSection[];
  /** Concrete choices. Drives both page content and the schema OfferCatalog. */
  options?: { heading: string; intro?: string; groups: ServiceOptionGroup[] };
  keyFacts: { label: string; value: string }[];
  faqIds: string[];
  relatedServiceSlugs: string[];
  aftercareSlug?: AftercareSlug;
  /** Must match a service id in the booking form. */
  bookingServiceId: string;
}

/* ──────────────────────────── service areas ───────────────────────── */

export interface AreaTravel {
  /** Distinct per area — this is what stops these reading as doorway pages. */
  summary: string;
  byCar?: { text: string; approxMinutes?: number };
  /** Route numbers are optional so unverified ones are simply omitted. */
  byBus?: { text: string; routes?: string[] };
  byFerry?: { text: string; routes?: string[] };
  byScooter?: string;
  parking?: string;
  landmarks?: string[];
}

export interface ServiceArea {
  slug: string;
  name: string;
  /** e.g. 'City of Hamilton' or 'Paget Parish'. Affects the h1 and schema. */
  designation: string;
  /** True only for the parish the studio physically sits in. */
  isStudioLocation: boolean;
  answer: string;
  metaTitle: string;
  metaDescription: string;
  /** Genuinely area-specific prose. Enforced by scripts/check-content.mjs. */
  intro: string[];
  travel: AreaTravel;
  /** At least two questions unique to this area. */
  localFaqs: { question: string; answer: string }[];
  serviceSlugs: string[];
  nearbyAreaSlugs: string[];
}

/* ─────────────────────────────── faqs ─────────────────────────────── */

export type FaqTopic =
  | 'booking'
  | 'tattoo'
  | 'piercing'
  | 'aftercare'
  | 'pricing'
  | 'policy'
  | 'location'
  | 'general';

export interface Faq {
  id: string;
  question: string;
  /** One self-contained paragraph. No "see above", no dangling pronouns. */
  answer: string;
  topics: FaqTopic[];
  /** Rendered after the visible answer only — never included in JSON-LD. */
  link?: { label: string; href: string };
}

/* ───────────────────────────── aftercare ──────────────────────────── */

export type AftercareSlug = 'tattoo' | 'piercing';

export interface AftercarePhase {
  number: string;
  title: string;
  subtitle: string;
  steps: { title: string; body: string }[];
}

export interface AftercareGuide {
  slug: AftercareSlug;
  title: string;
  navLabel: string;
  heroSubtitle: string;
  answer: string;
  metaTitle: string;
  metaDescription: string;
  /** ISO 8601 duration for HowTo.totalTime, e.g. 'P14D'. */
  totalTime?: string;
  supply?: string[];
  phases?: AftercarePhase[];
  prohibitions?: { title: string; desc: string }[];
  warnings?: { title: string; body: string }[];
  ritual?: { n: string; title: string; desc: string }[];
  expectations?: string[];
  avoid?: string[];
  notices?: string[];
  faqIds: string[];
}

/* ──────────────────────────── policies/prep ───────────────────────── */

export interface StudioPolicy {
  id: string;
  /** Plain text — no markup, so the same string is safe in JSON-LD. */
  text: string;
}

export interface PrepItem {
  title: string;
  body: string;
}
