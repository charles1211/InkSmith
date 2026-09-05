import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Users } from 'lucide-react';

import AnswerBlock from '../../components/seo/AnswerBlock';
import Breadcrumbs from '../../components/seo/Breadcrumbs';
import CtaBand from '../../components/seo/CtaBand';
import FaqSection from '../../components/seo/FaqSection';
import JsonLd from '../../components/seo/JsonLd';
import KeyFacts from '../../components/seo/KeyFacts';
import PageHero from '../../components/seo/PageHero';
import { faqsByTopic, toSchemaFaqs } from '../../content/faqs';
import { studioPolicies } from '../../content/policies';
import { services } from '../../content/services';
import { fullAddress, napFacts } from '../../lib/seo/facts';
import { buildMetadata } from '../../lib/seo/metadata';
import { localBusinessSchema, pageGraph } from '../../lib/seo/schema';
import { siteConfig } from '../../lib/seo/site.config';
import { absoluteUrl } from '../../lib/seo/url';

const PATH = '/about';

const TITLE = 'About InkSmith Studios';
const DESCRIPTION =
  'InkSmith Studios is a custom tattoo and body piercing studio at 39 King St in Hamilton, Bermuda. Our standards, our artists, and how we work.';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: PATH },
];

/**
 * Studio standards, taken from claims the site already makes on the home page.
 * Nothing here asserts a credential, certification or award that the studio has
 * not stated for itself.
 */
const STANDARDS = [
  {
    icon: ShieldCheck,
    title: 'Sterile environment',
    body: 'Hospital-grade sterilisation protocols, single-use needles, and autoclave-certified equipment.',
  },
  {
    icon: Users,
    title: 'Specialist artists',
    body: 'Specialists across realism, Japanese, blackwork and traditional styles, each with years of experience.',
  },
  {
    icon: Sparkles,
    title: 'Custom design',
    body: 'Every piece is unique to the person wearing it, developed through a consultation-driven process.',
  },
];

export default function AboutPage() {
  const faqs = faqsByTopic('general');

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <JsonLd
        data={pageGraph({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          pageType: 'AboutPage',
          crumbs: CRUMBS,
          faqs: toSchemaFaqs(faqs),
          speakableSelectors: ['[data-answer]'],
          extra: [localBusinessSchema({ url: absoluteUrl(PATH) })],
        })}
      />

      <Breadcrumbs items={CRUMBS} />
      <PageHero eyebrow="Who we are" titleLead="About" titleAccent="InkSmith" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <AnswerBlock label="In short" className="mb-16">
          {siteConfig.name} is a custom tattoo and body piercing studio at{' '}
          {fullAddress()}. The studio serves clients from across Bermuda with
          custom tattooing, professional piercing and free design consultations,
          and is open {siteConfig.openingHoursSummary}.
        </AnswerBlock>

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-6">
            What we do
          </h2>
          <div className="space-y-5 max-w-3xl text-gray-300 text-base leading-relaxed">
            <p>
              We serve the island with tattoo and piercing artists who work
              across a wide range of styles, and we pride ourselves on being
              original on every level — from the custom artwork to the
              atmosphere and the professional attitude that goes with it.
            </p>
            <p>
              Located in the heart of Hamilton, InkSmith provides innovative
              modifications and specialised techniques in a sterile, high-end
              environment. Every tattoo begins as a conversation about what you
              actually want, and every piercing begins with an honest assessment
              of whether the placement suits your anatomy.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
            Our studio and hygiene standards
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
            Body modification is a medical-adjacent procedure, and the studio
            treats it that way.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STANDARDS.map((standard) => (
              <div
                key={standard.title}
                className="border border-white/[0.07] bg-ink-900/40 rounded-2xl p-6"
              >
                <standard.icon className="w-5 h-5 text-ink-accent mb-4" aria-hidden="true" />
                <h3 className="text-white font-bold text-sm mb-2">{standard.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{standard.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-6">
            What we offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group border border-white/[0.07] hover:border-ink-accent/30 bg-ink-900/40 rounded-2xl p-6 transition-all duration-500"
              >
                <h3 className="font-serif font-black text-lg text-white uppercase tracking-wide mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">{service.tagline}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-6">
            Our artists
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl mb-6">
            The work is only ever as good as the person doing it. Each artist at
            InkSmith specialises in particular styles rather than claiming to do
            everything, which is why the booking form lets you choose who you
            work with. Their profiles list the styles they focus on and the work
            they are known for.
          </p>
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 text-ink-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Meet the artists →
          </Link>
        </section>

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-6">
            Visit us
          </h2>
          <KeyFacts facts={napFacts()} />
        </section>

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
            How we work
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
            A few of the policies that shape every appointment. The full list is
            on the service pages and in the FAQ.
          </p>
          <ul className="space-y-4 max-w-3xl">
            {studioPolicies.slice(0, 5).map((policy) => (
              <li key={policy.id} className="flex gap-4 text-sm text-gray-300 leading-relaxed">
                <span aria-hidden="true" className="text-ink-accent text-[10px] mt-1.5 shrink-0">
                  ◆
                </span>
                {policy.text}
              </li>
            ))}
          </ul>
          <Link
            href="/faq#policy"
            className="inline-flex items-center gap-2 mt-8 text-ink-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            All studio policies →
          </Link>
        </section>

        <FaqSection heading="Common questions" faqs={faqs} className="mb-16" />

        <CtaBand
          heading="Come and see the studio"
          body={`Walk in during studio hours, call ${siteConfig.contact.phone}, or book a free consultation online.`}
        />
      </div>
    </div>
  );
}
