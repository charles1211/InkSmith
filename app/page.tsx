import React from 'react';
import type { Metadata } from 'next';

import JsonLd from '../components/seo/JsonLd';
import { faqsByTopic, toSchemaFaqs } from '../content/faqs';
import { serviceAreaNames } from '../content/service-areas';
import { services } from '../content/services';
import {
  getPiercingTypes,
  getRecentWorks,
  getStudioImages,
} from '../lib/data/public-content';
import { buildMetadata } from '../lib/seo/metadata';
import { localBusinessSchema, pageGraph } from '../lib/seo/schema';
import { siteConfig } from '../lib/seo/site.config';
import { absoluteUrl } from '../lib/seo/url';
import HomeClient from './HomeClient';

/**
 * The home page's studio marquee, recent-work gallery and piercing grid are now
 * read on the server and passed into the client component.
 *
 * All three previously loaded in browser effects, so the initial HTML contained
 * skeleton placeholders where the studio photos, tattoo titles and piercing
 * placements should have been — none of it was visible to a crawler. The
 * animations, lightbox and marquee are untouched.
 */
export const revalidate = 900;

const TITLE = `${siteConfig.name} | ${siteConfig.tagline}`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  // The home page carries the full brand string rather than the `%s | Name`
  // template, which would otherwise repeat the studio name twice.
  titleAbsolute: true,
  description: siteConfig.description,
  path: '/',
});

export default async function HomePage() {
  const [studio, works, piercings] = await Promise.all([
    getStudioImages(),
    getRecentWorks(8),
    getPiercingTypes(),
  ]);

  return (
    <>
      <JsonLd
        data={pageGraph({
          path: '/',
          name: TITLE,
          description: siteConfig.description,
          faqs: toSchemaFaqs(faqsByTopic('general', 6)),
          primaryImage: absoluteUrl('/opengraph-image'),
          speakableSelectors: ['[data-answer]'],
          extra: [
            localBusinessSchema({
              areaServed: serviceAreaNames(),
              makesOffer: services.map((service) => ({
                name: service.name,
                description: service.tagline,
                url: absoluteUrl(`/services/${service.slug}`),
              })),
            }),
          ],
        })}
      />
      <HomeClient
        initialStudioImages={studio.data}
        studioFetchFailed={studio.failed}
        initialRecentWorks={works.data}
        worksFetchFailed={works.failed}
        initialPiercingTypes={piercings.data}
        piercingFetchFailed={piercings.failed}
      />
    </>
  );
}
