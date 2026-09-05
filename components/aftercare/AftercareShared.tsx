import React from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';

import { medicalWarning } from '../../content/aftercare';

/**
 * Presentational pieces shared by the aftercare hub and the two guide pages.
 *
 * All server components — the aftercare section previously shipped a client
 * bundle purely to switch between two tabs, which are now real routes.
 */

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-5 h-px bg-ink-accent" />
    <span className="text-[9px] font-bold tracking-[0.35em] text-ink-accent uppercase">
      {children}
    </span>
  </div>
);

export const InfoRow = ({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-4 p-5 bg-ink-900/30 border border-white/[0.06] rounded-xl">
    <Icon className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
    <p className="text-sm text-gray-400 leading-relaxed italic">{children}</p>
  </div>
);

export const AmbientBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-40 left-0 w-[700px] h-[700px] bg-ink-accent/[0.02] rounded-full blur-[130px]" />
    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/[0.03] rounded-full blur-[110px]" />
    <div
      className="absolute inset-0 opacity-[0.016]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }}
    />
  </div>
);

export const AftercareHero = ({
  watermark,
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
}: {
  watermark: string;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
}) => (
  <div className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8">
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-end justify-center pb-0 pointer-events-none overflow-hidden select-none"
    >
      <span
        className="font-serif font-black text-white/[0.013] uppercase tracking-tighter leading-none"
        style={{ fontSize: 'clamp(8rem, 22vw, 22rem)' }}
      >
        {watermark}
      </span>
    </div>

    <div className="max-w-5xl mx-auto relative z-10 text-center">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px w-8 bg-ink-accent/50" />
        <span className="text-[9px] font-bold tracking-[0.4em] text-ink-accent uppercase">
          {eyebrow}
        </span>
        <div className="h-px w-8 bg-ink-accent/50" />
      </div>

      <h1
        className="font-serif font-black uppercase leading-[0.88]"
        style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', letterSpacing: '-0.025em' }}
      >
        <span className="text-white">{titleLead}</span>{' '}
        <span
          className="text-transparent bg-clip-text"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #D4AF37 0%, #F2D06B 50%, #C9A028 100%)',
          }}
        >
          {titleAccent}
        </span>
      </h1>

      <p className="mt-6 text-gray-500 text-sm font-light leading-relaxed max-w-lg mx-auto">
        {subtitle}
      </p>
    </div>
  </div>
);

/**
 * The tab switcher, now real navigation rather than client state.
 *
 * Each guide is its own indexable URL with its own HowTo schema, so these are
 * links; the previous implementation swapped a query param with router.replace,
 * which left one URL serving two different documents.
 */
export const AftercareTabs = ({ active }: { active?: 'tattoo' | 'piercing' }) => {
  const tabs = [
    { slug: 'tattoo' as const, label: 'Tattoo Care', href: '/aftercare/tattoo' },
    { slug: 'piercing' as const, label: 'Piercing Care', href: '/aftercare/piercing' },
  ];

  return (
    <nav
      aria-label="Aftercare guides"
      className="sticky top-16 z-30 bg-ink-950/80 backdrop-blur-xl border-b border-white/[0.06]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = active === tab.slug;
            return (
              <Link
                key={tab.slug}
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-8 py-5 text-[10px] font-black tracking-[0.35em] uppercase transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export const EmergencyNotice = () => (
  <div className="mt-14">
    <div className="relative rounded-2xl border border-red-500/20 bg-red-950/[0.08] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="flex items-start gap-5 px-8 py-7">
        <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
          <Flame className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <h2 className="text-[9px] font-black tracking-[0.35em] uppercase text-red-400 mb-2">
            {medicalWarning.title}
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
            {medicalWarning.body}
          </p>
        </div>
      </div>
    </div>
  </div>
);
