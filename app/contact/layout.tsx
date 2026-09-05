import React from 'react';
import type { Metadata } from 'next';

import Breadcrumbs from '../../components/seo/Breadcrumbs';
import JsonLd from '../../components/seo/JsonLd';
import { faqsByTopic, toSchemaFaqs } from '../../content/faqs';
import { buildMetadata } from '../../lib/seo/metadata';
import { localBusinessSchema, pageGraph } from '../../lib/seo/schema';

/**
 * A server layout carrying the contact page's metadata and structured data.
 *
 * The page itself is a client component because of the form, but its static
 * copy — the address, phone, email and opening hours — is server-rendered
 * regardless, so it is already crawlable. What was missing was the metadata
 * and the LocalBusiness node that ties those details to the entity.
 */
const TITLE = 'Contact InkSmith Studios in Hamilton, Bermuda';
const DESCRIPTION =
  'Call +1 (441) 261-8532, email inksmithbda@gmail.com, or visit InkSmith Studios at 39 King St, Hamilton HM 19. Open seven days a week. We reply within 24 to 48 hours.';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description: DESCRIPTION,
  path: '/contact',
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact' },
];

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: '/contact',
          name: TITLE,
          description: DESCRIPTION,
          pageType: 'ContactPage',
          crumbs: CRUMBS,
          faqs: toSchemaFaqs(faqsByTopic('location')),
          extra: [localBusinessSchema()],
        })}
      />
      <Breadcrumbs items={CRUMBS} />
      {children}
    </>
  );
}
