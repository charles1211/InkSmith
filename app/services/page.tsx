import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import AnswerBlock from '../../components/seo/AnswerBlock';
import Breadcrumbs from '../../components/seo/Breadcrumbs';
import CtaBand from '../../components/seo/CtaBand';
import FaqSection from '../../components/seo/FaqSection';
import JsonLd from '../../components/seo/JsonLd';
import KeyFacts from '../../components/seo/KeyFacts';
import PageHero from '../../components/seo/PageHero';
import { faqsByTopic, toSchemaFaqs } from '../../content/faqs';
import { services } from '../../content/services';
import { serviceAreas } from '../../content/service-areas';
import { napFacts } from '../../lib/seo/facts';
import { buildMetadata } from '../../lib/seo/metadata';
import { localBusinessSchema, pageGraph } from '../../lib/seo/schema';
import { absoluteUrl } from '../../lib/seo/url';

const PATH = '/services';

const TITLE = 'Tattoo & Piercing Services in Hamilton, Bermuda';
const DESCRIPTION =
  'Custom tattoos, body piercing and free design consultations at InkSmith Studios, 39 King St, Hamilton. Walk-ins welcome, open seven days a week.';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: PATH },
];

const BOOKING_STEPS = [
  {
    title: 'Tell us who you are',
    body: 'Your name, contact details and age verification. Clients under 18 need a parent or legal guardian present with valid ID.',
  },
  {
    title: 'Choose your service',
    body: 'Tattoo, piercing or consultation — you can pick more than one. Select a tattoo style or a piercing placement, and a preferred artist if you have one.',
  },
  {
    title: 'Describe the work',
    body: 'Your concept, a reference image, and a preferred date. The studio replies within 24 to 48 hours to confirm the appointment and discuss pricing.',
  },
];

export default function ServicesPage() {
  const faqs = faqsByTopic('general');

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
      <PageHero
        eyebrow="What We Do"
        titleLead="Tattoo & Piercing"
        titleAccent="Services"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <AnswerBlock label="In short" className="mb-16">
          InkSmith Studios offers three services at 39 King St in Hamilton,
          Bermuda: custom tattooing in black and grey, colour and UV ink; body
          piercing across ear, facial, oral and body placements using
          implant-grade jewellery; and free design consultations. Walk-ins are
          welcome Monday to Saturday from 12:00 PM to 8:00 PM and Sunday from
          11:00 AM to 7:00 PM.
        </AnswerBlock>

        <div className="space-y-14 mb-20">
          {services.map((service) => (
            <section key={service.slug}>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-4">
                {service.name}
              </h2>
              <p className="text-gray-300 text-base leading-relaxed max-w-3xl mb-6">
                {service.answer}
              </p>

              {service.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mb-7">
                  {service.options.groups.map((group) => (
                    <div key={group.label ?? group.values.join()}>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-ink-accent mb-3">
                        {group.label ?? 'Options'}
                      </h3>
                      <ul className="flex flex-wrap gap-2">
                        {group.values.map((value) => (
                          <li
                            key={value}
                            className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/10 text-gray-400 rounded-full"
                          >
                            {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <Link
                href={`/services/${service.slug}`}
                className="group inline-flex items-center gap-2 text-ink-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                {service.name} in detail
                <ArrowRight
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </section>
          ))}
        </div>

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
            How booking works
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
            Three steps on the online form, then a reply from the studio.
            Consultations are free; a deposit secures the appointment slot and is
            non-refundable.
          </p>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BOOKING_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="border border-white/[0.07] bg-ink-900/40 rounded-2xl p-6"
              >
                <div
                  aria-hidden="true"
                  className="font-serif font-black text-4xl text-white/[0.07] leading-none mb-3"
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-20">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
            Where to find us
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
            One studio, in central Hamilton, serving clients from every parish in
            Bermuda.
          </p>
          <KeyFacts facts={napFacts()} />
          <div className="mt-8 flex flex-wrap gap-3">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/locations/${area.slug}`}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-full transition-colors"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </section>

        <FaqSection
          heading="Common questions"
          faqs={faqs}
          className="mb-16"
        />

        <CtaBand
          heading="Ready to book?"
          body="Start with a free consultation, or send your concept through the booking form and the studio will reply within 24 to 48 hours."
        />
      </div>
    </div>
  );
}
