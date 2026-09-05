import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, PenTool, Zap } from 'lucide-react';

import {
  AftercareHero,
  AftercareTabs,
  AmbientBackground,
  EmergencyNotice,
} from '../../components/aftercare/AftercareShared';
import AnswerBlock from '../../components/seo/AnswerBlock';
import Breadcrumbs from '../../components/seo/Breadcrumbs';
import FaqSection from '../../components/seo/FaqSection';
import JsonLd from '../../components/seo/JsonLd';
import KeyFacts from '../../components/seo/KeyFacts';
import { aftercareGuides, healingTimelines } from '../../content/aftercare';
import { faqsByTopic, toSchemaFaqs } from '../../content/faqs';
import { buildMetadata } from '../../lib/seo/metadata';
import { pageGraph } from '../../lib/seo/schema';
import { siteConfig } from '../../lib/seo/site.config';

const PATH = '/aftercare';

const TITLE = 'Tattoo & Piercing Aftercare Guides';
const DESCRIPTION =
  'How to care for a new tattoo or piercing: washing routines, healing timelines, what to avoid, and the warning signs that need a doctor. From InkSmith Studios, Hamilton.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Aftercare', href: PATH },
];

/**
 * The aftercare hub.
 *
 * This is deliberately a real page rather than a redirect to one of the guides.
 * "Aftercare" is its own search term, distinct from "tattoo aftercare" and
 * "piercing aftercare", and the navigation needs a destination for the parent
 * item. Each of the three URLs canonicalises to itself, because the content
 * genuinely differs — cross-canonicalising would suppress the guide pages that
 * carry the HowTo structured data.
 */
export default function AftercareHubPage() {
  const guideIcons = { tattoo: PenTool, piercing: Zap } as const;
  const faqs = faqsByTopic('aftercare');

  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-ink-accent selection:text-black overflow-x-hidden">
      <JsonLd
        data={pageGraph({
          path: PATH,
          name: TITLE,
          description: DESCRIPTION,
          pageType: 'CollectionPage',
          crumbs: CRUMBS,
          faqs: toSchemaFaqs(faqs),
          speakableSelectors: ['[data-answer]'],
        })}
      />

      <AmbientBackground />
      <Breadcrumbs items={CRUMBS} />
      <AftercareHero
        watermark="CARE"
        eyebrow={`${siteConfig.name} — Post-Service Protocol`}
        titleLead="Aftercare"
        titleAccent="Guide"
        subtitle="Healing is the half of the work that happens after you leave the studio. Here is exactly what to do, for both tattoos and piercings."
      />
      <AftercareTabs />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-32 relative z-10">
        <AnswerBlock label="The short version" className="mb-14">
          Wash a new tattoo with warm water and mild antibacterial soap three
          times on the first day, then twice daily for three days, switching to
          unscented lotion on day four. Clean a new piercing twice daily and
          leave the jewellery in until it has fully healed — around two months
          for titanium and around six months for stainless steel. In both cases,
          do not soak, do not sunbathe, and do not pick.
        </AnswerBlock>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-8">
          Choose your guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {aftercareGuides.map((guide) => {
            const Icon = guideIcons[guide.slug];
            return (
              <Link
                key={guide.slug}
                href={`/aftercare/${guide.slug}`}
                className="group relative bg-ink-900/40 border border-white/[0.07] hover:border-ink-accent/30 rounded-2xl p-8 transition-all duration-500"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ink-accent/40 to-transparent" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-ink-accent/8 rounded-xl border border-ink-accent/15">
                    <Icon className="w-5 h-5 text-ink-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif font-black text-xl text-white uppercase tracking-wide">
                    {guide.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-5">
                  {guide.heroSubtitle}
                </p>
                <span className="inline-flex items-center gap-2 text-ink-accent text-[10px] font-black uppercase tracking-[0.25em]">
                  Read the {guide.navLabel.toLowerCase()} guide
                  <ArrowRight
                    className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
          How long does healing take?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-2xl">
          Surface healing and full healing are different things. These are the
          timelines to plan around.
        </p>
        <KeyFacts facts={healingTimelines} className="mb-16" />

        <FaqSection
          heading="Aftercare questions"
          faqs={faqs}
          intro="The questions clients ask most often once they are home."
        />

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/services/tattoo"
            className="inline-flex items-center gap-2 text-ink-accent text-xs font-bold uppercase tracking-widest border border-ink-accent/30 hover:border-ink-accent px-6 py-4 transition-colors"
          >
            Tattoo services
          </Link>
          <Link
            href="/services/piercing"
            className="inline-flex items-center gap-2 text-ink-accent text-xs font-bold uppercase tracking-widest border border-ink-accent/30 hover:border-ink-accent px-6 py-4 transition-colors"
          >
            Piercing services
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:text-white px-6 py-4 transition-colors"
          >
            All studio questions
          </Link>
        </div>

        <EmergencyNotice />
      </div>
    </div>
  );
}
