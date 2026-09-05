import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Phone } from 'lucide-react';

import { siteConfig } from '../../lib/seo/site.config';

/**
 * The booking call to action, repeated at the foot of every content page.
 *
 * Both routes to an appointment are offered — the form and the phone number —
 * because the studio takes both, and a page that answers a question should end
 * by making the next step obvious.
 */
export function CtaBand({
  heading,
  body,
  bookLabel = 'Book an appointment',
  className = '',
}: {
  heading: string;
  body: string;
  bookLabel?: string;
  className?: string;
}) {
  return (
    <section
      className={`relative border border-ink-accent/20 bg-ink-900/40 rounded-2xl overflow-hidden p-8 sm:p-10 ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ink-accent/60 to-transparent" />
      <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-4">
        {heading}
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">{body}</p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/book"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-ink-accent text-black font-black tracking-widest uppercase text-xs hover:bg-white transition-colors duration-300"
        >
          <Calendar className="w-4 h-4" aria-hidden="true" />
          {bookLabel}
          <ArrowRight
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </Link>
        <a
          href={`tel:${siteConfig.contact.phoneE164}`}
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 px-6 py-4 transition-colors"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          {siteConfig.contact.phone}
        </a>
      </div>
    </section>
  );
}

export default CtaBand;
