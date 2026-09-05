import React from 'react';
import Link from 'next/link';

import type { Faq } from '../../content/types';

interface FaqSectionProps {
  faqs: Faq[];
  heading?: string;
  /** Heading level for the section title. Questions render one level below. */
  as?: 'h2' | 'h3';
  intro?: string;
  className?: string;
}

/**
 * A visible FAQ list.
 *
 * The questions are real headings and the answers are plain paragraphs, both
 * server-rendered — no accordion, no client JavaScript, nothing hidden behind
 * an interaction. That matters twice over: it is what makes the answers
 * extractable by search and answer engines, and it is what keeps the visible
 * content identical to the FAQPage JSON-LD the page emits.
 *
 * The JSON-LD itself is emitted by the page, from the same `faqs` array.
 */
export function FaqSection({
  faqs,
  heading = 'Frequently asked questions',
  as: Heading = 'h2',
  intro,
  className = '',
}: FaqSectionProps) {
  if (!faqs.length) return null;

  const QuestionHeading = Heading === 'h2' ? 'h3' : 'h4';

  return (
    <section className={className}>
      <Heading className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
        {heading}
      </Heading>
      {intro && (
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-2xl">{intro}</p>
      )}

      <div className="divide-y divide-white/5 border-t border-white/5">
        {faqs.map((faq) => (
          <div key={faq.id} className="py-7">
            <QuestionHeading className="text-white font-bold text-base mb-3">
              {faq.question}
            </QuestionHeading>
            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">{faq.answer}</p>
            {faq.link && (
              <Link
                href={faq.link.href}
                className="inline-block mt-3 text-ink-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                {faq.link.label} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
