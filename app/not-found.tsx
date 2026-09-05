import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass } from 'lucide-react';

import { buildNoIndexMetadata } from '../lib/seo/metadata';

/**
 * A 404 should be noindexed but still useful. The links out are the real
 * content here — a dead end wastes a visit and any crawl budget spent on it.
 */
export const metadata: Metadata = buildNoIndexMetadata('Page Not Found', '/404');

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/artists', label: 'Artists' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/aftercare', label: 'Aftercare' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-950 text-white flex flex-col items-center justify-center px-6 py-32 text-center">
      <div className="w-24 h-24 rounded-full border border-ink-accent/20 bg-ink-accent/5 flex items-center justify-center mb-10">
        <Compass className="w-9 h-9 text-ink-accent/50" aria-hidden="true" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-ink-accent mb-5">
        Error 404
      </p>
      <h1 className="text-4xl md:text-6xl font-serif font-black text-white uppercase tracking-tighter mb-5">
        Page Not Found
      </h1>
      <p className="max-w-md text-gray-500 font-light leading-relaxed mb-12">
        That page does not exist, or it has moved. Everything the studio offers
        is one of the links below.
      </p>
      <nav aria-label="Site" className="flex flex-wrap gap-3 justify-center max-w-2xl mb-12">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-full transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/book"
        className="inline-flex items-center gap-3 px-10 py-5 bg-ink-accent text-black font-black tracking-widest uppercase text-sm hover:bg-white transition-colors duration-300"
      >
        Book an Appointment
      </Link>
    </div>
  );
}
