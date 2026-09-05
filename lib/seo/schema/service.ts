import { siteConfig } from '../site.config';
import { absoluteUrl } from '../url';
import { ID, node, ref } from './core';

export interface ServiceSchemaOptions {
  slug: string;
  name: string;
  description: string;
  /** The concrete choices within the service, rendered as an OfferCatalog. */
  offers?: { name: string; description?: string }[];
  /** Named areas. Defaults to the umbrella service area from siteConfig. */
  areaServed?: string[];
  image?: string;
  serviceType?: string;
}

export function serviceSchema(options: ServiceSchemaOptions) {
  const areaServed = options.areaServed?.length
    ? options.areaServed.map((name) => node('AdministrativeArea', { name }))
    : [node(siteConfig.serviceAreaType, { name: siteConfig.serviceAreaName })];

  return node('Service', {
    '@id': ID.service(options.slug),
    name: options.name,
    description: options.description,
    serviceType: options.serviceType ?? options.name,
    url: absoluteUrl(`/services/${options.slug}`),
    image: options.image,
    provider: ref(ID.organization()),
    areaServed,
    hasOfferCatalog: options.offers?.length
      ? node('OfferCatalog', {
          name: `${options.name} options`,
          itemListElement: options.offers.map((offer) =>
            node('Offer', {
              itemOffered: node('Service', {
                name: offer.name,
                description: offer.description,
              }),
            })
          ),
        })
      : undefined,
  });
}
