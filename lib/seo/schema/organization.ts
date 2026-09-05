import { siteConfig } from '../site.config';
import { absoluteUrl, getSiteUrl } from '../url';
import { ID, node, ref } from './core';

/** Social profile URLs that are actually configured, for `sameAs`. */
function sameAs(): string[] {
  return Object.values(siteConfig.social).filter(
    (url): url is string => typeof url === 'string' && url.trim() !== ''
  );
}

function postalAddress() {
  const { address } = siteConfig.contact;
  return node('PostalAddress', {
    streetAddress: address.streetAddress,
    addressLocality: address.addressLocality,
    addressRegion: address.addressRegion,
    postalCode: address.postalCode,
    addressCountry: address.addressCountry,
  });
}

function openingHoursSpecification() {
  return siteConfig.openingHours.map((slot) =>
    node('OpeningHoursSpecification', {
      dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
      opens: slot.opens,
      closes: slot.closes,
    })
  );
}

function geoCoordinates() {
  const { geo } = siteConfig.contact;
  // Unset in site.config.ts until real coordinates are available. `node`
  // returns undefined here and `compact` removes the key entirely.
  if (!geo) return undefined;
  return node('GeoCoordinates', {
    latitude: geo.latitude,
    longitude: geo.longitude,
  });
}

function aggregateRating() {
  // Unset unless a genuine review source is wired up. Never populate by hand.
  const rating = siteConfig.schema.aggregateRating;
  if (!rating) return undefined;
  return node('AggregateRating', {
    ratingValue: rating.ratingValue,
    reviewCount: rating.reviewCount,
    bestRating: rating.bestRating,
  });
}

export function organizationSchema() {
  return node([siteConfig.schema.organizationType, siteConfig.schema.businessType], {
    '@id': ID.organization(),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.shortName,
    description: siteConfig.longDescription,
    url: getSiteUrl(),
    logo: absoluteUrl('/icon'),
    image: absoluteUrl('/opengraph-image'),
    telephone: siteConfig.contact.phoneE164,
    email: siteConfig.contact.email,
    address: postalAddress(),
    geo: geoCoordinates(),
    hasMap: siteConfig.contact.mapsUrl,
    openingHoursSpecification: openingHoursSpecification(),
    priceRange: siteConfig.schema.priceRange,
    currenciesAccepted: siteConfig.schema.currenciesAccepted,
    paymentAccepted: siteConfig.schema.paymentAccepted,
    aggregateRating: aggregateRating(),
    sameAs: sameAs(),
    foundingDate: siteConfig.foundingYear
      ? String(siteConfig.foundingYear)
      : undefined,
    areaServed: node(siteConfig.serviceAreaType, {
      name: siteConfig.serviceAreaName,
    }),
  });
}

export interface LocalBusinessOptions {
  /** Named areas for a location-scoped variant of the business node. */
  areaServed?: string[];
  /** Overrides the canonical URL — used by location pages. */
  url?: string;
  /** Overrides the business name, e.g. "InkSmith Studios — serving Paget". */
  name?: string;
  description?: string;
  image?: string;
  makesOffer?: { name: string; description?: string; url?: string }[];
  /** Distinct @id so a location-scoped node does not collide with the main one. */
  id?: string;
}

export function localBusinessSchema(options: LocalBusinessOptions = {}) {
  const scoped = Boolean(options.id);

  const areaServed = options.areaServed?.length
    ? options.areaServed.map((name) => node('AdministrativeArea', { name }))
    : [node(siteConfig.serviceAreaType, { name: siteConfig.serviceAreaName })];

  const offerCatalog = options.makesOffer?.length
    ? node('OfferCatalog', {
        name: `${siteConfig.name} services`,
        itemListElement: options.makesOffer.map((offer) =>
          node('Offer', {
            itemOffered: node('Service', {
              name: offer.name,
              description: offer.description,
              url: offer.url,
            }),
          })
        ),
      })
    : undefined;

  return node([siteConfig.schema.organizationType, siteConfig.schema.businessType], {
    '@id': options.id ?? ID.organization(),
    name: options.name ?? siteConfig.name,
    description: options.description ?? siteConfig.longDescription,
    url: options.url ?? getSiteUrl(),
    image: options.image ?? absoluteUrl('/opengraph-image'),
    logo: absoluteUrl('/icon'),
    telephone: siteConfig.contact.phoneE164,
    email: siteConfig.contact.email,
    address: postalAddress(),
    geo: geoCoordinates(),
    hasMap: siteConfig.contact.mapsUrl,
    openingHoursSpecification: openingHoursSpecification(),
    priceRange: siteConfig.schema.priceRange,
    aggregateRating: aggregateRating(),
    sameAs: sameAs(),
    areaServed,
    makesOffer: offerCatalog,
    // A location-scoped node is a branch of the main entity, not a rival one.
    parentOrganization: scoped ? ref(ID.organization()) : undefined,
  });
}
