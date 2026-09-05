import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import AnswerBlock from '../../components/seo/AnswerBlock';
import Breadcrumbs from '../../components/seo/Breadcrumbs';
import CtaBand from '../../components/seo/CtaBand';
import FaqSection from '../../components/seo/FaqSection';
import JsonLd from '../../components/seo/JsonLd';
import PageHero from '../../components/seo/PageHero';
import { faqs, faqsByTopic, toSchemaFaqs } from '../../content/faqs';
import type { FaqTopic } from '../../content/types';
import { buildMetadata } from '../../lib/seo/metadata';
import { localBusinessSchema, pageGraph } from '../../lib/seo/schema';
import { siteConfig } from '../../lib/seo/site.config';
import { absoluteUrl } from '../../lib/seo/url';

const PATH = '/faq';

const TITLE = 'Frequently Asked Questions';
const DESCRIPTION =
  'Answers about booking, deposits, studio policies, tattoo and piercing services, and aftercare at InkSmith Studios in Hamilton, Bermuda.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'FAQ', href: PATH },
];

/** Grouped for readability. Every question still appears exactly once. */
const GROUPS: { heading: string; topic: FaqTopic; intro: string }[] = [
  {
    heading: 'Booking and appointments',
    topic: 'booking',
    intro: 'How to reserve a slot, what happens next, and what the studio needs from you.',
  },
  {
    heading: 'Pricing and deposits',
    topic: 'pricing',
    intro: 'What a piece costs depends on the piece. Here is how the studio handles money.',
  },
  {
    heading: 'Studio policies',
    topic: 'policy',
    intro: 'The rules that apply to every appointment, and the reasons behind them.',
  },
  {
    heading: 'Tattoos',
    topic: 'tattoo',
    intro: 'Styles, cover-ups, pain, and what to expect from a session.',
  },
  {
    heading: 'Piercings',
    topic: 'piercing',
    intro: 'Placements, jewellery, healing times and jewellery changes.',
  },
  {
    heading: 'Aftercare and healing',
    topic: 'aftercare',
    intro: 'What to do once you leave, and when something needs medical attention.',
  },
  {
    heading: 'Visiting the studio',
    topic: 'location',
    intro: 'Where the studio is, when it is open, and how to reach it.',
  },
];

export default function FaqPage() {
  // Each question is assigned to the first group that claims it, so the page
  // shows every FAQ exactly once even though topics overlap.
  const assigned = new Set<string>();
  const sections = GROUPS.map((group) => {
    const groupFaqs = faqsByTopic(group.topic).filter((faq) => {
      if (assigned.has(faq.id)) return false;
      assigned.add(faq.id);
      return true;
    });
    return { ...group, faqs: groupFaqs };
  }).filter((section) => section.faqs.length > 0);

  const headline = faqsByTopic('general', 3);

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      {/*
        One FAQPage node carrying every question — never several per page.

        Note that Google restricted FAQ *rich results* to government and health
        sites in 2023. This markup is retained deliberately: Bing still uses it,
        and question/answer pairs are among the structures generative engines
        extract most reliably. Do not strip it on the grounds that "FAQ rich
        results are gone".
      */}
      <JsonLd
        data={pageGraph({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          crumbs: CRUMBS,
          faqs: toSchemaFaqs(faqs),
          speakableSelectors: ['[data-answer]'],
          extra: [localBusinessSchema({ url: absoluteUrl(PATH) })],
        })}
      />

      <Breadcrumbs items={CRUMBS} />
      <PageHero
        eyebrow="Everything you asked"
        titleLead="Frequently Asked"
        titleAccent="Questions"
        intro={`${faqs.length} answers about booking, pricing, policies, services and aftercare at ${siteConfig.name}.`}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <AnswerBlock label="The three most asked" className="mb-16">
          {headline[0]?.answer}
        </AnswerBlock>

        <nav aria-label="Question topics" className="mb-16">
          <ul className="flex flex-wrap gap-3">
            {sections.map((section) => (
              <li key={section.topic}>
                <a
                  href={`#${section.topic}`}
                  className="inline-block px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-full transition-colors"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16">
          {sections.map((section) => (
            <div key={section.topic} id={section.topic} className="scroll-mt-28">
              <FaqSection
                heading={section.heading}
                intro={section.intro}
                faqs={section.faqs}
              />
            </div>
          ))}
        </div>

        <section className="mt-20 mb-16">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-8">
            Still have a question?
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-ink-accent text-xs font-bold uppercase tracking-widest border border-ink-accent/30 hover:border-ink-accent px-6 py-4 transition-colors"
            >
              Message the studio
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:text-white px-6 py-4 transition-colors"
            >
              Browse services
            </Link>
            <Link
              href="/aftercare"
              className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:text-white px-6 py-4 transition-colors"
            >
              Aftercare guides
            </Link>
          </div>
        </section>

        <CtaBand
          heading="Book your appointment"
          body={`Free consultations, walk-ins welcome, and a reply within 24 to 48 hours. Call ${siteConfig.contact.phone} or use the booking form.`}
        />
      </div>
    </div>
  );
}
