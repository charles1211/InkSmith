import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, X } from 'lucide-react';

import AnswerBlock from '../../../components/seo/AnswerBlock';
import Breadcrumbs from '../../../components/seo/Breadcrumbs';
import CtaBand from '../../../components/seo/CtaBand';
import FaqSection from '../../../components/seo/FaqSection';
import JsonLd from '../../../components/seo/JsonLd';
import KeyFacts from '../../../components/seo/KeyFacts';
import PageHero from '../../../components/seo/PageHero';
import { faqsByIds, toSchemaFaqs } from '../../../content/faqs';
import { preparationChecklist, studioPolicies, thingsToAvoid } from '../../../content/policies';
import { getService, serviceOffers, services } from '../../../content/services';
import { serviceAreaNames } from '../../../content/service-areas';
import { buildMetadata, buildNoIndexMetadata } from '../../../lib/seo/metadata';
import { localBusinessSchema, pageGraph, serviceSchema } from '../../../lib/seo/schema';
import { siteConfig } from '../../../lib/seo/site.config';
import { absoluteUrl } from '../../../lib/seo/url';

interface PageProps {
  params: Promise<{ service: string }>;
}

/**
 * Backed entirely by local data, so these pages are fully static and cannot be
 * emptied by a database outage. Unknown slugs 404 rather than rendering a
 * blank page, which keeps thin URLs out of the index.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) return buildNoIndexMetadata('Not found', `/services/${slug}`);

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const path = `/services/${slug}`;
  const faqs = faqsByIds(service.faqIds);
  const related = service.relatedServiceSlugs
    .map((relatedSlug) => getService(relatedSlug))
    .filter(Boolean);

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: service.name, href: path },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <JsonLd
        data={pageGraph({
          path,
          name: service.metaTitle,
          description: service.metaDescription,
          crumbs,
          faqs: toSchemaFaqs(faqs),
          speakableSelectors: ['[data-answer]'],
          extra: [
            serviceSchema({
              slug: service.slug,
              name: service.name,
              description: service.answer,
              offers: serviceOffers(service),
              areaServed: serviceAreaNames(),
            }),
            localBusinessSchema({ url: absoluteUrl(path) }),
          ],
        })}
      />

      <Breadcrumbs items={crumbs} />
      <PageHero
        eyebrow={service.tagline}
        titleLead={service.name}
        titleAccent={`in ${siteConfig.contact.address.addressLocality}`}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <AnswerBlock label="In short" className="mb-14">
          {service.answer}
        </AnswerBlock>

        <div className="space-y-5 mb-16 max-w-3xl">
          {service.body.map((paragraph) => (
            <p key={paragraph} className="text-gray-300 text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <KeyFacts facts={service.keyFacts} title="At a glance" className="mb-20" />

        {service.options && (
          <section className="mb-20">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              {service.options.heading}
            </h2>
            {service.options.intro && (
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
                {service.options.intro}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {service.options.groups.map((group) => (
                <div key={group.label ?? group.values.join()}>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-ink-accent mb-4">
                    {group.label ?? 'Options'}
                  </h3>
                  <ul className="space-y-2">
                    {group.values.map((value) => (
                      <li
                        key={value}
                        className="flex items-start gap-3 text-sm text-gray-300"
                      >
                        <span
                          aria-hidden="true"
                          className="text-ink-accent text-[9px] mt-1.5 shrink-0"
                        >
                          ◆
                        </span>
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {service.sections.map((section) => (
          <section key={section.heading} className="mb-20">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              {section.heading}
            </h2>
            {section.intro && (
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
                {section.intro}
              </p>
            )}
            {section.body?.length ? (
              <div className="space-y-5 max-w-3xl">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-gray-300 text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            {section.items?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {section.items.map((item) => (
                  <div
                    key={item.title}
                    className="border border-white/[0.07] bg-ink-900/40 rounded-2xl p-6"
                  >
                    <h3 className="text-white font-bold text-sm mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}

        {service.slug === 'tattoo' && (
          <section className="mb-20">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              How to prepare for your session
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
              What to do in the days before, and what to leave alone.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-ink-accent mb-5">
                  <Check className="w-3 h-3" aria-hidden="true" /> Do this
                </h3>
                <ul className="space-y-4">
                  {preparationChecklist.map((item) => (
                    <li key={item.title}>
                      <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-red-400 mb-5">
                  <X className="w-3 h-3" aria-hidden="true" /> Avoid this
                </h3>
                <ul className="space-y-4">
                  {thingsToAvoid.map((item) => (
                    <li key={item.title}>
                      <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
            Studio policies you should know
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
            These apply to every appointment, and you will be asked to sign a
            consent form confirming them before any work starts.
          </p>
          <ol className="space-y-4 max-w-3xl">
            {studioPolicies.map((policy, index) => (
              <li key={policy.id} className="flex gap-4 text-sm text-gray-300 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="text-ink-accent font-black shrink-0 text-sm"
                >
                  {String(index + 1).padStart(2, '0')}.
                </span>
                {policy.text}
              </li>
            ))}
          </ol>
        </section>

        {service.aftercareSlug && (
          <section className="mb-20">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              Aftercare
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-3xl mb-6">
              Healing is the half of the work that happens after you leave the
              studio, and how you handle it decides how the finished piece looks.
              The full routine, timeline and warning signs are in the guide.
            </p>
            <Link
              href={`/aftercare/${service.aftercareSlug}`}
              className="group inline-flex items-center gap-2 text-ink-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Read the {service.aftercareSlug} aftercare guide
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </section>
        )}

        <FaqSection
          heading={`${service.name} questions`}
          faqs={faqs}
          className="mb-20"
        />

        <section className="mb-16">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-8">
            Also at the studio
          </h2>
          <div className="flex flex-wrap gap-4">
            {related.map((item) => (
              <Link
                key={item!.slug}
                href={`/services/${item!.slug}`}
                className="inline-flex items-center gap-2 text-ink-accent text-xs font-bold uppercase tracking-widest border border-ink-accent/30 hover:border-ink-accent px-6 py-4 transition-colors"
              >
                {item!.name}
              </Link>
            ))}
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:text-white px-6 py-4 transition-colors"
            >
              See our work
            </Link>
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:text-white px-6 py-4 transition-colors"
            >
              Meet the artists
            </Link>
          </div>
        </section>

        <CtaBand
          heading={`Book a ${service.navLabel.toLowerCase()} appointment`}
          body={`Send your concept through the booking form and the studio replies within 24 to 48 hours, or call ${siteConfig.contact.phone} during studio hours.`}
          bookLabel={`Book ${service.navLabel.toLowerCase()}`}
        />
      </div>
    </div>
  );
}
