import React from 'react';
import {
  AlertTriangle,
  Ban,
  Calendar,
  CheckCircle2,
  Droplet,
  Info,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';

import type { AftercareGuide as Guide } from '../../content/types';
import { InfoRow, SectionLabel } from './AftercareShared';

/**
 * Renders one aftercare guide from data.
 *
 * Each block is shown only when the guide object actually defines it, rather
 * than branching on the slug. A third guide can therefore be added to
 * `content/aftercare.ts` with no new markup here.
 */
export function AftercareGuide({ guide }: { guide: Guide }) {
  return (
    <div className="space-y-10">
      {guide.warnings?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {guide.warnings.map((warning, index) => {
            const Icon = index === 0 ? Ban : AlertTriangle;
            return (
              <div
                key={warning.title}
                className="group relative bg-red-950/15 border border-red-500/20 hover:border-red-500/40 rounded-2xl overflow-hidden transition-all duration-400 p-8"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/50 to-transparent" />
                <Icon
                  aria-hidden="true"
                  className="absolute bottom-3 right-4 w-24 h-24 text-red-500/[0.08] group-hover:text-red-500/[0.14] rotate-12 group-hover:rotate-0 transition-all duration-500"
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-red-400" aria-hidden="true" />
                    </div>
                    <h2 className="font-serif font-black text-lg text-white uppercase tracking-wide">
                      {warning.title}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{warning.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {guide.phases?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guide.phases.map((phase, phaseIndex) => {
            const PhaseIcon = phaseIndex === 0 ? Droplet : Calendar;
            const isFirst = phaseIndex === 0;
            return (
              <div
                key={phase.number}
                className="group relative bg-ink-900/40 border border-white/[0.07] hover:border-ink-accent/25 rounded-2xl overflow-hidden transition-all duration-500"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ink-accent/40 via-ink-accent/20 to-transparent" />
                <PhaseIcon
                  aria-hidden="true"
                  className="absolute bottom-4 right-4 w-28 h-28 text-white/[0.03] group-hover:text-white/[0.055] transition-colors duration-500"
                />

                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-7">
                    <div
                      className={
                        isFirst
                          ? 'w-10 h-10 rounded-full bg-ink-accent flex items-center justify-center text-black font-black text-sm shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                          : 'w-10 h-10 rounded-full border border-ink-accent/40 flex items-center justify-center text-ink-accent font-black text-sm shrink-0'
                      }
                    >
                      {phaseIndex + 1}
                    </div>
                    <div>
                      <h2 className="font-serif font-black text-xl text-white uppercase tracking-wide">
                        {phase.title}
                      </h2>
                      <span className="text-[9px] font-bold tracking-[0.3em] text-ink-accent/70 uppercase">
                        {phase.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 border-l border-white/[0.08] ml-5 pl-7">
                    {phase.steps.map((step) => (
                      <div key={step.title} className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-ink-900 bg-ink-800 ring-1 ring-white/10"
                        />
                        <p className="text-sm text-gray-400 leading-relaxed">
                          <strong className="text-white block mb-1">{step.title}</strong>
                          {step.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {guide.ritual?.length ? (
        <div className="relative bg-ink-900/40 border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ink-accent via-ink-accent/40 to-transparent" />
          <div className="p-8 md:p-10">
            <SectionLabel>The cleaning ritual — twice daily</SectionLabel>

            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-ink-accent/8 rounded-xl border border-ink-accent/15">
                <Sparkles className="w-6 h-6 text-ink-accent" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-serif font-black text-2xl text-white uppercase">
                  Step-by-step protocol
                </h2>
                <p className="text-[9px] font-bold tracking-[0.3em] text-ink-accent/60 uppercase mt-0.5">
                  Morning &amp; night
                </p>
              </div>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-4 gap-0">
              {guide.ritual.map((step, index) => (
                <li key={step.n} className="relative flex flex-col md:flex-row">
                  <div className="flex-1 pr-0 md:pr-6">
                    <div
                      aria-hidden="true"
                      className="font-serif font-black text-5xl text-white/[0.06] leading-none mb-3 select-none"
                    >
                      {step.n}
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wide mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {index < guide.ritual.length - 1 && (
                    <>
                      <div aria-hidden="true" className="hidden md:flex items-start pt-6 pr-6">
                        <div className="w-px h-full min-h-[80px] bg-white/[0.06]" />
                      </div>
                      <div aria-hidden="true" className="md:hidden h-px bg-white/[0.06] my-6" />
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}

      {guide.prohibitions?.length ? (
        <section className="rounded-2xl border border-red-500/15 overflow-hidden">
          <div className="flex items-center gap-4 px-8 py-5 bg-red-950/20 border-b border-red-500/10">
            <Ban className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
            <h2 className="font-serif font-black text-lg text-white uppercase tracking-wide">
              Strictly prohibited
            </h2>
            <span className="ml-auto text-[9px] font-bold tracking-[0.3em] text-red-400/60 uppercase">
              During healing
            </span>
          </div>

          <div className="p-6 bg-red-950/[0.06]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {guide.prohibitions.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-red-900/[0.08] border border-red-500/[0.08] hover:border-red-500/20 transition-colors duration-300"
                >
                  <XCircle className="w-4 h-4 text-red-400/60 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-red-200/80 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-red-100/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {guide.expectations?.length || guide.avoid?.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {guide.expectations?.length ? (
            <section className="bg-ink-900/30 border border-blue-500/15 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-7 py-5 border-b border-blue-500/10">
                <Info className="w-4 h-4 text-blue-400/70 shrink-0" aria-hidden="true" />
                <h2 className="text-[10px] font-black tracking-[0.3em] text-blue-300/70 uppercase">
                  What to expect
                </h2>
              </div>
              <ul className="p-7 space-y-4">
                {guide.expectations.map((text) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-gray-400">
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-blue-400/40 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {guide.avoid?.length ? (
            <section className="bg-ink-900/30 border border-ink-accent/15 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-7 py-5 border-b border-ink-accent/10">
                <ShieldCheck className="w-4 h-4 text-ink-accent/70 shrink-0" aria-hidden="true" />
                <h2 className="text-[10px] font-black tracking-[0.3em] text-ink-accent/70 uppercase">
                  Avoid for fast healing
                </h2>
              </div>
              <ul className="p-7 space-y-4">
                {guide.avoid.map((text) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-gray-400">
                    <XCircle
                      className="w-3.5 h-3.5 text-ink-accent/35 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      {guide.notices?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.notices.map((notice) => (
            <InfoRow key={notice} icon={Info}>
              {notice}
            </InfoRow>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AftercareGuide;
