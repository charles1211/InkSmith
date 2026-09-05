import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Bus, Car, Landmark, MapPin, Ship, SquareParking } from 'lucide-react';

import AnswerBlock from '../../../components/seo/AnswerBlock';
import Breadcrumbs from '../../../components/seo/Breadcrumbs';
import CtaBand from '../../../components/seo/CtaBand';
import FaqSection from '../../../components/seo/FaqSection';
import JsonLd from '../../../components/seo/JsonLd';
import KeyFacts from '../../../components/seo/KeyFacts';
import PageHero from '../../../components/seo/PageHero';
import { faqsByTopic, toSchemaFaqs } from '../../../content/faqs';
import { getServiceArea, nearbyAreas, serviceAreas } from '../../../content/service-areas';
import { getService } from '../../../content/services';
import type { Faq } from '../../../content/types';
import { fullAddress, napFacts } from '../../../lib/seo/facts';
import { buildMetadata, buildNoIndexMetadata } from '../../../lib/seo/metadata';
import { localBusinessSchema, pageGraph } from '../../../lib/seo/schema';
import { siteConfig } from '../../../lib/seo/site.config';
import { absoluteUrl } from '../../../lib/seo/url';

interface PageProps {
  params: Promise<{ area: string }>;
}

/**
 * Local-data only, so these pages are fully static and immune to a database
 * outage. That is deliberate: the pages that matter most for local search must
 * never depend on a free-tier database that pauses when idle.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ area: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area: slug } = await params;
  const area = getServiceArea(slug);
  if (!area) return buildNoIndexMetadata('Not found', `/locations/${slug}`);

  return buildMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    path: `/locations/${slug}`,
  });
}

export default async function AreaPage({ params }: PageProps) {
  const { area: slug } = await params;
  const area = getServiceArea(slug);
  if (!area) notFound();

  const path = `/locations/${slug}`;
  const nearby = nearbyAreas(area);
  const areaServices = area.serviceSlugs.map((s) => getService(s)).filter(Boolean);

  // Local questions are page-specific and are not part of the shared corpus, so
  // they are wrapped into the Faq shape rather than looked up by id.
  const localFaqs: Faq[] = area.localFaqs.map((faq, index) => ({
    id: `${area.slug}-local-${index}`,
    question: faq.question,
    answer: faq.answer,
    topics: ['location'],
  }));
  const schemaFaqs = toSchemaFaqs([...localFaqs, ...faqsByTopic('location', 3)]);

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Areas We Serve', href: '/locations' },
    { name: area.name, href: path },
  ];

  const travelRoutes = [
    area.travel.byCar && { icon: Car, label: 'By car', text: area.travel.byCar.text },
    area.travel.byBus && { icon: Bus, label: 'By bus', text: area.travel.byBus.text },
    area.travel.byFerry && { icon: Ship, label: 'By ferry', text: area.travel.byFerry.text },
    area.travel.byScooter && {
      icon: Car,
      label: 'By scooter',
      text: area.travel.byScooter,
    },
    area.travel.parking && {
      icon: SquareParking,
      label: 'Parking',
      text: area.travel.parking,
    },
  ].filter(Boolean) as { icon: React.ElementType; label: string; text: string }[];

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <JsonLd
        data={pageGraph({
          path,
          name: area.metaTitle,
          description: area.metaDescription,
          crumbs,
          faqs: schemaFaqs,
          speakableSelectors: ['[data-answer]'],
          extra: [
            // A location-scoped view of the same business, linked back to the
            // canonical organisation node by parentOrganization. It is not a
            // separate branch and must never be modelled as one.
            localBusinessSchema({
              id: `${absoluteUrl(path)}#business`,
              name: `${siteConfig.name} — serving ${area.name}`,
              description: area.answer,
              url: absoluteUrl(path),
              areaServed: [area.name],
            }),
          ],
        })}
      />

      <Breadcrumbs items={crumbs} />
      <PageHero
        eyebrow={area.designation}
        titleLead="Tattoo & Piercing"
        titleAccent={area.isStudioLocation ? `in ${area.name}` : `for ${area.name}`}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <AnswerBlock label="In short" className="mb-14">
          {area.answer}
        </AnswerBlock>

        <div className="space-y-5 mb-20 max-w-3xl">
          {area.intro.map((paragraph) => (
            <p key={paragraph} className="text-gray-300 text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {area.isStudioLocation ? (
          <>
            <section className="mb-20">
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
                Finding the studio
              </h2>
              <p className="text-gray-300 text-base leading-relaxed max-w-3xl mb-8">
                {area.travel.summary}
              </p>
              <KeyFacts facts={napFacts()} className="mb-8" />
              {siteConfig.contact.mapEmbedUrl && (
                <div className="border border-white/10 rounded-2xl overflow-hidden">
                  <iframe
                    src={siteConfig.contact.mapEmbedUrl}
                    title={`Map showing ${siteConfig.name} at ${fullAddress()}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-[320px] border-0 grayscale-[0.4]"
                  />
                </div>
              )}
              {siteConfig.contact.mapsUrl && (
                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 mt-6 text-ink-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  Get directions
                </a>
              )}
            </section>
          </>
        ) : (
          <section className="mb-20">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              Getting to the studio from {area.name}
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-3xl mb-8">
              {area.travel.summary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {travelRoutes.map((route) => (
                <div
                  key={route.label}
                  className="border border-white/[0.07] bg-ink-900/40 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <route.icon className="w-4 h-4 text-ink-accent shrink-0" aria-hidden="true" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-ink-accent">
                      {route.label}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{route.text}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl mt-8">
              The studio address is {fullAddress()}. Studio hours are{' '}
              {siteConfig.openingHoursSummary}.
            </p>
          </section>
        )}

        {area.travel.landmarks?.length ? (
          <section className="mb-20">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              Orienting yourself in {area.name}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-6">
              Useful reference points if you are giving or following directions.
            </p>
            <ul className="flex flex-wrap gap-3">
              {area.travel.landmarks.map((landmark) => (
                <li
                  key={landmark}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/10 text-gray-400 rounded-full"
                >
                  <Landmark className="w-3 h-3 text-ink-accent" aria-hidden="true" />
                  {landmark}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
            Services for {area.name} clients
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
            Everything the studio offers is available to everyone who comes in,
            wherever on the island they travel from.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {areaServices.map((service) => (
              <Link
                key={service!.slug}
                href={`/services/${service!.slug}`}
                className="group border border-white/[0.07] hover:border-ink-accent/30 bg-ink-900/40 rounded-2xl p-6 transition-all duration-500"
              >
                <h3 className="font-serif font-black text-lg text-white uppercase tracking-wide mb-2">
                  {service!.name}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {service!.tagline}
                </p>
                <span className="inline-flex items-center gap-2 text-ink-accent text-[10px] font-black uppercase tracking-[0.25em]">
                  Details
                  <ArrowRight
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <FaqSection
          heading={`${area.name} client questions`}
          faqs={localFaqs}
          className="mb-20"
        />

        {nearby.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-8">
              Nearby parishes
            </h2>
            <div className="flex flex-wrap gap-4">
              {nearby.map((other) => (
                <Link
                  key={other.slug}
                  href={`/locations/${other.slug}`}
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 px-6 py-4 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-ink-accent" aria-hidden="true" />
                  {other.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <CtaBand
          heading={`Booking from ${area.name}`}
          body={`Send your concept and a reference image through the booking form and the studio replies within 24 to 48 hours, or call ${siteConfig.contact.phone} during studio hours.`}
        />
      </div>
    </div>
  );
}
