'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, PenTool } from 'lucide-react';

/**
 * Shown when the artist directory cannot be reached.
 *
 * The page throws rather than calling notFound() in that case, so this renders
 * on a genuine outage while a missing artist still gets a real 404. Mirrors the
 * "Roster Unavailable" panel on the artists index.
 */
export default function ArtistError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-ink-950 text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 rounded-full border border-ink-accent/20 bg-ink-accent/5 flex items-center justify-center mb-10">
        <PenTool className="w-9 h-9 text-ink-accent/50" aria-hidden="true" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-ink-accent mb-5">
        Temporarily Offline
      </p>
      <h1 className="text-4xl md:text-6xl font-serif font-black text-white uppercase tracking-tighter mb-5">
        Profile Unavailable
      </h1>
      <p className="max-w-md text-gray-500 font-light leading-relaxed mb-12">
        We could not reach our roster just now. Please try again in a moment —
        booking is still open.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center gap-3 px-10 py-5 bg-ink-accent text-black font-black tracking-widest uppercase text-sm hover:bg-white transition-colors duration-300"
        >
          Try Again
        </button>
        <Link
          href="/book"
          className="inline-flex items-center gap-3 px-10 py-5 border border-white/10 hover:border-white/30 text-white font-bold tracking-widest uppercase text-sm transition-colors duration-300"
        >
          <Calendar className="w-4 h-4" aria-hidden="true" />
          Book a Consultation
        </Link>
      </div>
    </div>
  );
}
