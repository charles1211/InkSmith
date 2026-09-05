import type { SiteConfig } from './types';

/**
 * THE ONLY business-specific file under `lib/seo/`.
 *
 * To repoint this site's SEO layer at a different business, replace this file
 * and the data files under `content/`. Nothing else needs to change.
 *
 * Every value below is sourced from verified copy already present in this
 * repository (contact page, footer, home page, booking policies). Facts that
 * are NOT in the repo are deliberately left unset — see the TODOs. Unset
 * optional fields are stripped from JSON-LD by `schema/core.ts#compact`, so
 * leaving them out is always safer than guessing.
 */
export const siteConfig: SiteConfig = {
  /* ── identity ── */
  name: 'InkSmith Studios',
  shortName: 'InkSmith',
  wordmark: 'INKSMITH',
  monogram: 'IS',
  tagline: "Bermuda's Premier Tattoo & Piercing Studio",
  description:
    'Custom tattoos and professional body piercing in Hamilton, Bermuda. Walk-ins welcome, free design consultations, sterile studio. Open seven days a week.',
  longDescription:
    'InkSmith Studios is a custom tattoo and body piercing studio at 39 King St in Hamilton, Bermuda. Our artists specialise in custom work across realism, traditional, Japanese, blackwork and fine line styles, and our piercers use implant-grade titanium and gold jewellery with single-use needles. Every piece starts with a free consultation.',
  locale: 'en_US',
  htmlLang: 'en',

  /* ── brand tokens (mirror app/globals.css @theme) ── */
  brand: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    accent: '#D4AF37',
    themeColor: '#0a0a0a',
  },

  /* ── schema.org typing ── */
  schema: {
    businessType: 'TattooParlor',
    organizationType: 'LocalBusiness',
    // priceRange: TODO — the studio publishes no prices. Booking policy states
    //   "quoted prices are estimates". Leave unset; omitted from JSON-LD.
    // aggregateRating: TODO — no genuine review source is wired up. NEVER invent
    //   ratings; fabricated review markup is a policy violation.
  },

  /* ── NAP ── */
  contact: {
    phone: '+1 (441) 261-8532',
    phoneE164: '+14412618532',
    email: 'inksmithbda@gmail.com',
    address: {
      streetAddress: '39 King St, 2nd Floor, Ratteray Bldg.',
      addressLocality: 'Hamilton',
      postalCode: 'HM 19',
      addressCountry: 'BM',
      // addressRegion: TODO — Bermuda's parishes are not schema.org regions. Unset.
    },
    // From the place marker on the studio's Google Business Profile listing.
    // Note this is the marker position, not the map viewport centre that also
    // appears in a Maps URL — the two differ by roughly 470 m here.
    geo: { latitude: 32.2952982, longitude: -64.778826 },
    mapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=39+King+St,+Hamilton+HM+19,+Bermuda',
    mapEmbedUrl:
      'https://maps.google.com/maps?q=39%20King%20St%2C%20Hamilton%20HM%2019%2C%20Bermuda&t=&z=17&ie=UTF8&iwloc=&output=embed',
  },

  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '12:00',
      closes: '20:00',
    },
    { days: ['Sunday'], opens: '11:00', closes: '19:00' },
  ],
  openingHoursSummary:
    'Monday to Saturday 12:00 PM – 8:00 PM, Sunday 11:00 AM – 7:00 PM',

  social: {
    instagram: 'https://instagram.com/inksmithtattoobda',
    facebook: 'https://www.facebook.com/inksmithtattoobda',
  },

  serviceAreaName: 'Bermuda',
  serviceAreaType: 'Country',

  verification: {
    google: 'TXKiAcNm1aEtVdyCqJL07jjhr9R0lszd0Rf5evnlN5g',
    // bing: TODO — quickest route is importing this property into Bing
    //   Webmaster Tools from Search Console, which needs no token at all.
  },

  twitter: {
    card: 'summary_large_image',
    // site / creator: TODO — the studio has no X account.
  },
};

export default siteConfig;
