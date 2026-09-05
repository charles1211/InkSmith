import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AftercareGuideView from '../../../components/aftercare/AftercareGuide';
import {
  AftercareHero,
  AftercareTabs,
  AmbientBackground,
  EmergencyNotice,
} from '../../../components/aftercare/AftercareShared';
import AnswerBlock from '../../../components/seo/AnswerBlock';
import Breadcrumbs from '../../../components/seo/Breadcrumbs';
import JsonLd from '../../../components/seo/JsonLd';
import FaqSection from '../../../components/seo/FaqSection';
import { aftercareSteps, getAftercareGuide } from '../../../content/aftercare';
import { faqsByIds, toSchemaFaqs } from '../../../content/faqs';
import { buildMetadata } from '../../../lib/seo/metadata';
import { howToSchema, pageGraph } from '../../../lib/seo/schema';
import { siteConfig } from '../../../lib/seo/site.config';

const SLUG = 'tattoo';
const PATH = '/aftercare/tattoo';
const guide = getAftercareGuide(SLUG);

export const metadata: Metadata = buildMetadata({
  title: guide?.metaTitle ?? 'Tattoo Aftercare',
  description: guide?.metaDescription ?? '',
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Aftercare', href: '/aftercare' },
  { name: 'Tattoo Aftercare', href: PATH },
];

export default function TattooAftercarePage() {
  if (!guide) notFound();

  const faqs = faqsByIds(guide.faqIds);

  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-ink-accent selection:text-black overflow-x-hidden">
      <JsonLd
        data={pageGraph({
          path: PATH,
          name: guide.metaTitle,
          description: guide.metaDescription,
          crumbs: CRUMBS,
          faqs: toSchemaFaqs(faqs),
          speakableSelectors: ['[data-answer]'],
          extra: [
            howToSchema({
              path: PATH,
              name: 'How to care for a new tattoo',
              description: guide.answer,
              totalTime: guide.totalTime,
              supply: guide.supply,
              steps: aftercareSteps(guide),
            }),
          ],
        })}
      />

      <AmbientBackground />
      <Breadcrumbs items={CRUMBS} />
      <AftercareHero
        watermark="CARE"
        eyebrow={`${siteConfig.name} — Post-Service Protocol`}
        titleLead="Tattoo"
        titleAccent="Aftercare"
        subtitle={guide.heroSubtitle}
      />
      <AftercareTabs active={SLUG} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-32 relative z-10">
        <AnswerBlock label="The short version" className="mb-12">
          {guide.answer}
        </AnswerBlock>

        <AftercareGuideView guide={guide} />
        <FaqSection
          heading="Tattoo aftercare questions"
          faqs={faqs}
          className="mt-16"
        />
        <EmergencyNotice />
      </div>
    </div>
  );
}
