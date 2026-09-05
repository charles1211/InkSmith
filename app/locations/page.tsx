import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

import AnswerBlock from '../../components/seo/AnswerBlock';
import Breadcrumbs from '../../components/seo/Breadcrumbs';
import CtaBand from '../../components/seo/CtaBand';
import FaqSection from '../../components/seo/FaqSection';
import JsonLd from '../../components/seo/JsonLd';
import KeyFacts from '../../components/seo/KeyFacts';
import PageHero from '../../components/seo/PageHero';
import { faqsByTopic, toSchemaFaqs } from '../../content/faqs';
import { serviceAreaNames, serviceAreas, studioArea } from '../../content/service-areas';
import { services } from '../../content/services';
import { fullAddress, napFacts } from '../../lib/seo/facts';
import { buildMetadata } from '../../lib/seo/metadata';
import { itemListSchema, localBusinessSchema, pageGraph, ID } from '../../lib/seo/schema';
import { siteConfig } from '../../lib/seo/site.config';
import { absoluteUrl } from '../../lib/seo/url';

const PATH = '/locations';

const TITLE = 'Areas We Serve Across Bermuda';
const DESCRIPTION =
  'InkSmith Studios has one studio, at 39 King St in Hamilton, and welcomes clients from every parish in Bermuda. Travel details, studio hours and booking information.';

export const metadata: Metadata = buildMetadata({
  title: 'Areas We Serve',
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Areas We Serve', href: PATH },
];

export default function LocationsPage() {
  const studio = studioArea();
  const otherAreas = serviceAreas.filter((area) => !area.isStudioLocation);
  const faqs = faqsByTopic('location');

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <JsonLd
        data={pageGraph({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          pageType: 'CollectionPage',
          crumbs: CRUMBS,
          faqs: toSchemaFaqs(faqs),
          speakableSelectors: ['[data-answer]'],
          extra: [
            localBusinessSchema({
              url: absoluteUrl(PATH),
              areaServed: serviceAreaNames(),
              makesOffer: services.map((service) => ({
                name: service.name,
                description: service.tagline,
                url: absoluteUrl(`/services/${service.slug}`),
              })),
            }),
            itemListSchema({
              id: ID.itemList(PATH),
              name: `Areas served by ${siteConfig.name}`,
              items: serviceAreas.map((area) => ({
                '@type': 'Place',
                name: area.name,
                url: absoluteUrl(`/locations/${area.slug}`),
              })),
            }),
          ],
        })}
      />

      <Breadcrumbs items={CRUMBS} />
      <PageHero
        eyebrow="Across the island"
        titleLead="Areas We"
        titleAccent="Serve"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/*
          The honest framing matters here. This is not a network of branches,
          and saying so plainly is both accurate and the thing that keeps these
          pages from reading as a location farm.
        */}
        <AnswerBlock label="In short" className="mb-16">
          InkSmith Studios operates one studio, at {fullAddress()}, and welcomes
          clients from every parish in Bermuda. The studio does not travel to
          clients — all tattooing and piercing is done at 39 King St, which sits
          a few minutes from both the Hamilton bus terminal and the ferry
          terminal.
        </AnswerBlock>

        {studio && (
          <section className="mb-20">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              Our studio
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-3xl mb-8">
              {studio.answer}
            </p>
            <KeyFacts facts={napFacts()} className="mb-8" />
            <Link
              href={`/locations/${studio.slug}`}
              className="group inline-flex items-center gap-2 text-ink-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Directions, parking and walk-in details
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </section>
        )}

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
            Getting here from your parish
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
            Bermuda is small but slow — the island-wide speed limit is 35 km/h,
            and visitors cannot rent cars. Each parish page covers the routes
            that actually work from there.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {otherAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/locations/${area.slug}`}
                className="group border border-white/[0.07] hover:border-ink-accent/30 bg-ink-900/40 rounded-2xl p-6 transition-all duration-500"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <MapPin className="w-4 h-4 text-ink-accent shrink-0" aria-hidden="true" />
                  <h3 className="font-serif font-black text-lg text-white uppercase tracking-wide">
                    {area.name}
                  </h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {area.travel.summary}
                </p>
                <span className="inline-flex items-center gap-2 text-ink-accent text-[10px] font-black uppercase tracking-[0.25em]">
                  {area.name} details
                  <ArrowRight
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
            Studio hours and walk-ins
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
            The studio is open {siteConfig.openingHoursSummary}, seven days a
            week. Walk-ins are welcome during those hours, though whether you are
            seen depends on which artists are free at the time. If you are
            travelling in from outside Pembroke, booking ahead on{' '}
            {siteConfig.contact.phone} or through the online form is the way to
            avoid a wasted trip.
          </p>
        </section>

        <FaqSection
          heading="Questions about visiting"
          faqs={faqs}
          className="mb-16"
        />

        <CtaBand
          heading="Book from anywhere on the island"
          body="Send your concept and a reference image through the booking form before you travel, and the studio will reply within 24 to 48 hours."
        />
      </div>
    </div>
  );
}
