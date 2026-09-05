import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import AnswerBlock from '../../components/seo/AnswerBlock';
import Breadcrumbs from '../../components/seo/Breadcrumbs';
import FaqSection from '../../components/seo/FaqSection';
import JsonLd from '../../components/seo/JsonLd';
import KeyFacts from '../../components/seo/KeyFacts';
import { faqsByTopic, toSchemaFaqs } from '../../content/faqs';
import { services } from '../../content/services';
import { getArtists } from '../../lib/data/public-content';
import { napFacts } from '../../lib/seo/facts';
import { buildMetadata } from '../../lib/seo/metadata';
import { localBusinessSchema, pageGraph } from '../../lib/seo/schema';
import { siteConfig } from '../../lib/seo/site.config';
import { absoluteUrl } from '../../lib/seo/url';
import BookClient from './BookClient';

/**
 * `searchParams` is deliberately NOT read here — doing so would opt the route
 * out of static rendering entirely. The `?artistId=` deep link is handled
 * inside BookClient, where a tiny ArtistParam component reads them behind its
 * own Suspense boundary. The canonical URL stays clean, so `/book?artistId=…`
 * never gets indexed as a duplicate.
 */
export const revalidate = 3600;

const PATH = '/book';

const TITLE = 'Book a Tattoo or Piercing Appointment in Hamilton, Bermuda';
const DESCRIPTION =
  'Book a tattoo, piercing or free consultation at InkSmith Studios, 39 King St, Hamilton. Three-step form, reply within 24 to 48 hours. Walk-ins also welcome.';

export const metadata: Metadata = buildMetadata({
  title: 'Book an Appointment',
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Book an Appointment', href: PATH },
];

export default async function BookPage() {
  const { data: artists, failed } = await getArtists();
  const faqs = faqsByTopic('booking');

  return (
    <>
      <JsonLd
        data={pageGraph({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          crumbs: CRUMBS,
          faqs: toSchemaFaqs(faqs),
          speakableSelectors: ['[data-answer]'],
          extra: [
            localBusinessSchema({
              url: absoluteUrl(PATH),
              makesOffer: services.map((service) => ({
                name: service.name,
                description: service.tagline,
                url: absoluteUrl(`/services/${service.slug}`),
              })),
            }),
          ],
        })}
      />
      <Breadcrumbs items={CRUMBS} />

      {/*
        Server-rendered context above the form. The booking wizard itself is a
        client component whose contents are largely inputs, so without this a
        crawler would find almost no readable text on the site's most important
        conversion page.
      */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AnswerBlock label="Before you start">
          Booking at {siteConfig.name} takes three steps: your details and age
          verification, the service you want, then your concept, a reference
          image and a preferred date. The studio replies within 24 to 48 hours to
          confirm the appointment and discuss pricing. Consultations are free; a
          deposit secures the slot and is non-refundable.
        </AnswerBlock>
      </section>

      <BookClient initialArtists={artists} artistsFetchFailed={failed} />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-6">
          Studio details
        </h2>
        <KeyFacts facts={napFacts()} className="mb-16" />

        <FaqSection heading="Booking questions" faqs={faqs} className="mb-12" />

        <div className="flex flex-wrap gap-4">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:text-white px-6 py-4 transition-colors"
            >
              About {service.name.toLowerCase()}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
