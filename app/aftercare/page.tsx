'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Droplet,
  Sun,
  Sparkles,
  XCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  Flame,
  Ban,
} from 'lucide-react';

type AftercareType = 'tattoo' | 'piercing';

/* ─────────────────── small reusable components ─────────────────── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-5 h-px bg-ink-accent" />
    <span className="text-[9px] font-bold tracking-[0.35em] text-ink-accent uppercase">{children}</span>
  </div>
);

const InfoRow = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <div className="flex items-start gap-4 p-5 bg-ink-900/30 border border-white/[0.06] rounded-xl">
    <Icon className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
    <p className="text-sm text-gray-400 leading-relaxed italic">{children}</p>
  </div>
);

/* ─────────────────── main content ─────────────────── */

const AftercareContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AftercareType>('tattoo');

  useEffect(() => {
    const type = searchParams.get('type');
    setActiveTab(type === 'piercing' ? 'piercing' : 'tattoo');
  }, [searchParams]);

  const handleTabChange = (tab: AftercareType) => {
    setActiveTab(tab);
    router.replace(`/aftercare?type=${tab}`);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-ink-accent selection:text-black overflow-x-hidden">

      {/* ── AMBIENT BACKGROUND ── */}
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

      {/* ── HERO HEADER ── */}
      <div className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Ghost watermark */}
        <div className="absolute inset-0 flex items-end justify-center pb-0 pointer-events-none overflow-hidden select-none">
          <span
            className="font-serif font-black text-white/[0.013] uppercase tracking-tighter leading-none"
            style={{ fontSize: 'clamp(8rem, 22vw, 22rem)' }}
          >
            CARE
          </span>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Studio label */}
          <div className="flex items-center justify-center gap-4 mb-8 anim-hero-badge">
            <div className="h-px w-8 bg-ink-accent/50" />
            <span className="text-[9px] font-bold tracking-[0.4em] text-ink-accent uppercase">
              InkSmith Studios — Post-Service Protocol
            </span>
            <div className="h-px w-8 bg-ink-accent/50" />
          </div>

          <h1
            className="font-serif font-black uppercase leading-[0.88] anim-hero-title"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', letterSpacing: '-0.025em' }}
          >
            <span className="text-white">Aftercare</span>{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F2D06B 50%, #C9A028 100%)' }}
            >
              Guide
            </span>
          </h1>

          <p className="mt-6 text-gray-500 text-sm font-light leading-relaxed max-w-lg mx-auto anim-hero-buttons">
            {activeTab === 'tattoo'
              ? 'Your new tattoo is a collaborative effort. We did our part — now it\'s up to you to ensure it heals perfectly.'
              : 'A piercing is a commitment. Proper hygiene and patience are the keys to a healthy, beautiful modification.'}
          </p>
        </div>
      </div>

      {/* ── TAB SWITCHER ── */}
      <div className="sticky top-16 z-30 bg-ink-950/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {(['tattoo', 'piercing'] as AftercareType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`relative px-8 py-5 text-[10px] font-black tracking-[0.35em] uppercase transition-all duration-300 ${
                  activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                {tab === 'tattoo' ? 'Tattoo Care' : 'Piercing Care'}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-32 relative z-10">

        {/* ════════════════ TATTOO TAB ════════════════ */}
        {activeTab === 'tattoo' ? (
          <div className="space-y-10">

            {/* Phase cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Phase 01 */}
              <div className="group relative bg-ink-900/40 border border-white/[0.07] hover:border-ink-accent/25 rounded-2xl overflow-hidden transition-all duration-500">
                {/* Gold top stripe */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ink-accent via-ink-accent/60 to-transparent" />
                {/* Ghost icon */}
                <Droplet className="absolute bottom-4 right-4 w-28 h-28 text-white/[0.03] group-hover:text-white/[0.055] transition-colors duration-500" />

                <div className="p-8 relative z-10">
                  {/* Phase label */}
                  <div className="flex items-center gap-4 mb-7">
                    <div className="w-10 h-10 rounded-full bg-ink-accent flex items-center justify-center text-black font-black text-sm shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                      1
                    </div>
                    <div>
                      <h3 className="font-serif font-black text-xl text-white uppercase tracking-wide">Immediate Care</h3>
                      <span className="text-[9px] font-bold tracking-[0.3em] text-ink-accent/70 uppercase">First 24 Hours</span>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-5 border-l border-white/[0.08] ml-5 pl-7">
                    {[
                      {
                        title: 'Remove & Rinse',
                        body: <>Remove the wrap once home. Rinse with <strong className="text-white">WARM</strong> water and mild antibacterial soap, then <strong className="text-white">COLD</strong> water to close pores.</>,
                      },
                      {
                        title: 'Repeat 3 Times',
                        body: 'Ensure all plasma and ink residue is completely washed away.',
                      },
                      {
                        title: 'Dry & Ointment',
                        body: <>Air dry or pat with paper towel. Apply a <em className="text-white">very thin</em> layer of Vitamin A&D ointment — the wound needs to breathe.</>,
                      },
                    ].map((step, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-ink-900 bg-ink-800 ring-1 ring-white/10" />
                        <p className="text-sm text-gray-400 leading-relaxed">
                          <strong className="text-white block mb-1">{step.title}</strong>
                          {step.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phase 02 */}
              <div className="group relative bg-ink-900/40 border border-white/[0.07] hover:border-ink-accent/25 rounded-2xl overflow-hidden transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ink-accent/40 via-ink-accent/20 to-transparent" />
                <Calendar className="absolute bottom-4 right-4 w-28 h-28 text-white/[0.03] group-hover:text-white/[0.055] transition-colors duration-500" />

                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-7">
                    <div className="w-10 h-10 rounded-full border border-ink-accent/40 flex items-center justify-center text-ink-accent font-black text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-serif font-black text-xl text-white uppercase tracking-wide">The Healing Phase</h3>
                      <span className="text-[9px] font-bold tracking-[0.3em] text-ink-accent/70 uppercase">Days 2 — 14+</span>
                    </div>
                  </div>

                  <div className="space-y-5 border-l border-white/[0.08] ml-5 pl-7">
                    {[
                      {
                        title: 'Consistency is Key',
                        body: <>Repeat the wash/ointment process <strong className="text-white">2× daily</strong> (morning & night) for 3 days.</>,
                      },
                      {
                        title: 'Switch to Lotion',
                        body: <>On day 4, stop using ointment. Switch to <strong className="text-white">unscented moisturizing lotion</strong>.</>,
                      },
                      {
                        title: 'Patience',
                        body: 'Healing takes 1–2 weeks or longer. Peeling and itching are completely normal.',
                      },
                    ].map((step, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-ink-900 bg-ink-800 ring-1 ring-white/10" />
                        <p className="text-sm text-gray-400 leading-relaxed">
                          <strong className="text-white block mb-1">{step.title}</strong>
                          {step.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prohibited section */}
            <div className="rounded-2xl border border-red-500/15 overflow-hidden">
              {/* Header strip */}
              <div className="flex items-center gap-4 px-8 py-5 bg-red-950/20 border-b border-red-500/10">
                <Ban className="w-5 h-5 text-red-400 shrink-0" />
                <h3 className="font-serif font-black text-lg text-white uppercase tracking-wide">Strictly Prohibited</h3>
                <span className="ml-auto text-[9px] font-bold tracking-[0.3em] text-red-400/60 uppercase">During Healing</span>
              </div>

              <div className="p-6 bg-red-950/[0.06]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { title: 'No Petroleum', desc: 'Vaseline, Vicks, oils, or heavy creams suffocate the skin.' },
                    { title: 'No Soaking', desc: 'No pools, oceans, jacuzzis, or baths — showers only.' },
                    { title: 'No Sun Exposure', desc: 'Direct sunlight destroys fresh ink. Keep it covered.' },
                    { title: 'No Picking', desc: 'Scabs protect the ink. Picking pulls color out and causes scarring.' },
                    { title: 'No Touching', desc: 'Dirty hands and pets are the #1 cause of infection.' },
                    { title: 'Dietary Care', desc: 'Avoid inflammatory foods (seafood, nuts) for faster healing.' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-red-900/[0.08] border border-red-500/[0.08] hover:border-red-500/20 transition-colors duration-300"
                    >
                      <XCircle className="w-4 h-4 text-red-400/60 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-red-200/80 mb-1">{item.title}</h4>
                        <p className="text-[11px] text-red-100/40 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer notices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={Info}>
                Redness and peeling are normal during healing. Do not panic if it looks <em>rough</em> for a few days — this is temporary.
              </InfoRow>
              <InfoRow icon={Sun}>
                Long-term: extreme sun exposure fades tattoos over years. Always use <strong className="text-white not-italic">SPF 25+</strong> on fully healed tattoos.
              </InfoRow>
            </div>
          </div>

        ) : (
          /* ════════════════ PIERCING TAB ════════════════ */
          <div className="space-y-10">

            {/* Critical warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  icon: Ban,
                  title: 'Do Not Touch',
                  body: 'The only time you touch your piercing is when cleaning it. Always wash your hands thoroughly first.',
                },
                {
                  icon: AlertTriangle,
                  title: 'Keep Jewelry In',
                  body: 'New piercings can shrink immediately. Do not remove or change jewelry until fully healed.',
                },
              ].map(({ icon: Icon, title, body }, i) => (
                <div
                  key={i}
                  className="group relative bg-red-950/15 border border-red-500/20 hover:border-red-500/40 rounded-2xl overflow-hidden transition-all duration-400 p-8"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/50 to-transparent" />
                  <Icon className="absolute bottom-3 right-4 w-24 h-24 text-red-500/[0.08] group-hover:text-red-500/[0.14] rotate-12 group-hover:rotate-0 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-red-400" />
                      </div>
                      <h3 className="font-serif font-black text-lg text-white uppercase tracking-wide">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cleaning ritual */}
            <div className="relative bg-ink-900/40 border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ink-accent via-ink-accent/40 to-transparent" />

              <div className="p-8 md:p-10">
                <SectionLabel>The Cleaning Ritual — Twice Daily</SectionLabel>

                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-ink-accent/8 rounded-xl border border-ink-accent/15">
                    <Sparkles className="w-6 h-6 text-ink-accent" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-2xl text-white uppercase">Step-by-Step Protocol</h3>
                    <p className="text-[9px] font-bold tracking-[0.3em] text-ink-accent/60 uppercase mt-0.5">Morning & Night</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                  {[
                    { n: '01', title: 'Wash Hands', desc: 'Thoroughly with antibacterial soap before touching anything.' },
                    { n: '02', title: 'Cleanse', desc: 'Gently rinse with water. Dry with disposable gauze or tissue — never cloth towels.' },
                    { n: '03', title: 'Treat', desc: 'Apply a small amount of Betadine (Povidone-iodine). Consult pharmacist if unavailable.' },
                    { n: '04', title: 'Repeat', desc: 'Continue until healed. Titanium: ~2 months. Stainless steel: ~6 months.' },
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex flex-col md:flex-row">
                      <div className="flex-1 pr-0 md:pr-6">
                        <div className="font-serif font-black text-5xl text-white/[0.06] leading-none mb-3 select-none">{step.n}</div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-2">{step.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                      </div>
                      {idx < 3 && (
                        <div className="hidden md:flex items-start pt-6 pr-6">
                          <div className="w-px h-full min-h-[80px] bg-white/[0.06]" />
                        </div>
                      )}
                      {idx < 3 && (
                        <div className="md:hidden h-px bg-white/[0.06] my-6" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Normal vs Avoid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Expectations */}
              <div className="bg-ink-900/30 border border-blue-500/15 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-7 py-5 border-b border-blue-500/10">
                  <Info className="w-4 h-4 text-blue-400/70 shrink-0" />
                  <h3 className="text-[10px] font-black tracking-[0.3em] text-blue-300/70 uppercase">What to Expect</h3>
                </div>
                <ul className="p-7 space-y-4">
                  {[
                    'Bleeding, bruising, and swelling initially.',
                    'Tenderness, redness, or itching for several days.',
                    'Secretion of whitish-yellow fluid (not pus) that dries into crust.',
                    'Healing is non-linear — it may seem healed then regress.',
                    'Mild odour if not cleaned daily (doesn\'t always mean infection).',
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400/40 shrink-0 mt-0.5" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avoid */}
              <div className="bg-ink-900/30 border border-ink-accent/15 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-7 py-5 border-b border-ink-accent/10">
                  <ShieldCheck className="w-4 h-4 text-ink-accent/70 shrink-0" />
                  <h3 className="text-[10px] font-black tracking-[0.3em] text-ink-accent/70 uppercase">Avoid for Fast Healing</h3>
                </div>
                <ul className="p-7 space-y-4">
                  {[
                    'Lotions, perfume, hair dye, or cosmetics near the piercing.',
                    'Alcohol-based mouthwash (for oral piercings).',
                    'Over-cleaning — this causes irritation.',
                    'Anti-inflammatory foods (nuts, avocado, seafood).',
                    'Submerging in water — pools, baths. Showers are fine.',
                    'Twisting, turning, or picking at crusties.',
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <XCircle className="w-3.5 h-3.5 text-ink-accent/35 shrink-0 mt-0.5" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── EMERGENCY NOTICE ── */}
        <div className="mt-14">
          <div className="relative rounded-2xl border border-red-500/20 bg-red-950/[0.08] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            <div className="flex items-start gap-5 px-8 py-7">
              <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h4 className="text-[9px] font-black tracking-[0.35em] uppercase text-red-400 mb-2">Medical Warning</h4>
                <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
                  If you notice extreme redness, spreading streaks, excessive swelling, or green/pus discharge after the first
                  few days, <strong className="text-white">contact us or a physician immediately</strong>. These may be signs of infection.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ─────────────────── export with Suspense ─────────────────── */

export default function Aftercare() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-ink-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AftercareContent />
    </Suspense>
  );
}
