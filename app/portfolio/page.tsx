import React from 'react';
import type { Metadata } from 'next';

import Breadcrumbs from '../../components/seo/Breadcrumbs';
import JsonLd from '../../components/seo/JsonLd';
import { faqsByTopic, toSchemaFaqs } from '../../content/faqs';
import { getPortfolioItems } from '../../lib/data/public-content';
import { buildMetadata } from '../../lib/seo/metadata';
import { imageObjectSchema, itemListSchema, pageGraph, ID } from '../../lib/seo/schema';
import { siteConfig } from '../../lib/seo/site.config';
import PortfolioClient from './PortfolioClient';

/**
 * The gallery is now read on the server and passed into the client component.
 *
 * Previously every image, title, category and artist name was fetched in a
 * browser effect, which meant a crawler saw nothing but skeleton placeholders —
 * the entire portfolio was invisible to search and to answer engines. The
 * interactive filtering, masonry layout and lightbox are unchanged; only the
 * source of the first render moved.
 *
 * 15 minute ISR bounds how stale the crawler-visible snapshot can get if a
 * build happens to run while the free-tier database is paused.
 */
export const revalidate = 900;

const PATH = '/portfolio';

const TITLE = 'Tattoo Portfolio — Work from Our Hamilton Studio';
const DESCRIPTION =
  'Browse tattoo work by the artists at InkSmith Studios in Hamilton, Bermuda. Realism, traditional, Japanese, blackwork, fine line, colour and watercolour pieces.';

export const metadata: Metadata = buildMetadata({
  title: 'Portfolio',
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Portfolio', href: PATH },
];

/** How many pieces get an ImageObject node. Enough to describe the gallery. */
const SCHEMA_IMAGE_LIMIT = 24;

export default async function PortfolioPage() {
  const { data: items, failed } = await getPortfolioItems();

  const imageNodes = items
    .slice(0, SCHEMA_IMAGE_LIMIT)
    .map((item) =>
      imageObjectSchema({
        url: item.src,
        name: item.title || undefined,
        caption: [item.title, item.category].filter(Boolean).join(' — ') || undefined,
        creator: item.artist || undefined,
      })
    );

  return (
    <>
      <JsonLd
        data={pageGraph({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          pageType: 'CollectionPage',
          crumbs: CRUMBS,
          faqs: toSchemaFaqs(faqsByTopic('tattoo', 4)),
          primaryImage: items[0]?.src,
          extra: [
            itemListSchema({
              id: ID.itemList(PATH),
              name: `Tattoo work by ${siteConfig.name}`,
              items: imageNodes,
            }),
          ],
        })}
      />
      <Breadcrumbs items={CRUMBS} />
      <PortfolioClient initialItems={items} fetchFailed={failed} />
    </>
  );
}
