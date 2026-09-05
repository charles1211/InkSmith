import React from 'react';

/**
 * The shared hero for content pages, matching the studio's existing eyebrow +
 * oversized-serif idiom so the new pages do not read as bolted on.
 */
export function PageHero({
  eyebrow,
  titleLead,
  titleAccent,
  intro,
}: {
  eyebrow: string;
  titleLead: string;
  titleAccent?: string;
  intro?: string;
}) {
  return (
    <header className="relative pt-8 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-ink-accent/6 rounded-full blur-[160px] pointer-events-none"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div aria-hidden="true" className="h-px w-12 bg-ink-accent" />
          <span className="text-ink-accent text-[10px] font-black uppercase tracking-[0.35em]">
            {eyebrow}
          </span>
        </div>

        <h1 className="font-serif font-black uppercase tracking-tighter leading-[0.95] text-4xl sm:text-6xl lg:text-7xl">
          <span className="text-white">{titleLead}</span>
          {titleAccent && (
            <>
              {' '}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #D4AF37 0%, #F2D06B 50%, #C9A028 100%)',
                }}
              >
                {titleAccent}
              </span>
            </>
          )}
        </h1>

        {intro && (
          <p className="mt-8 text-gray-400 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}

export default PageHero;
