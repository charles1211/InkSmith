'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

/**
 * Route-level error boundary. Returns a 500 to crawlers rather than a 404, so a
 * transient failure does not cost the page its place in the index.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-ink-950 text-white flex flex-col items-center justify-center px-6 py-32 text-center">
      <div className="w-24 h-24 rounded-full border border-ink-accent/20 bg-ink-accent/5 flex items-center justify-center mb-10">
        <AlertTriangle className="w-9 h-9 text-ink-accent/50" aria-hidden="true" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-ink-accent mb-5">
        Something Went Wrong
      </p>
      <h1 className="text-4xl md:text-6xl font-serif font-black text-white uppercase tracking-tighter mb-5">
        Temporarily Unavailable
      </h1>
      <p className="max-w-md text-gray-500 font-light leading-relaxed mb-12">
        We hit a problem loading this page. Try again in a moment — the studio is
        still open and booking still works.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center gap-3 px-10 py-5 bg-ink-accent text-black font-black tracking-widest uppercase text-sm hover:bg-white transition-colors duration-300"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-10 py-5 border border-white/10 hover:border-white/30 text-white font-bold tracking-widest uppercase text-sm transition-colors duration-300"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
