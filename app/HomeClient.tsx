'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Star, Sparkles, ShieldCheck, MapPin, Clock,
  ChevronRight, ChevronLeft, PenTool, X, ExternalLink,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { createClient } from '../lib/supabase/client';

const Home: React.FC = () => {
  const [studioImages, setStudioImages] = useState<string[]>([]);
  const [studioLoading, setStudioLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('studio_images').select('src').order('created_at', { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) setStudioImages(data.map(r => r.src));
      setStudioLoading(false);
    });
  }, []);

  const carouselImages = [...studioImages, ...studioImages];

  const [recentWorks, setRecentWorks] = useState<{ id: string; src: string; category: string; title: string; artist: string }[]>([]);
  const [worksLoading, setWorksLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('portfolio_images')
      .select('id, src, title, category, artist')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data && data.length > 0)
          setRecentWorks(data.map(r => ({ id: r.id, src: r.src, title: r.title, category: r.category, artist: r.artist ?? '' })));
        setWorksLoading(false);
      });
  }, []);

  const [piercingTypes, setPiercingTypes] = useState<{ name: string; img: string }[]>([]);
  const [piercingLoading, setPiercingLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('piercing_images')
      .select('src, name')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0)
          setPiercingTypes(data.map(r => ({ name: r.name ?? '', img: r.src })));
        setPiercingLoading(false);
      });
  }, []);

  const features = [
    {
      number: '01',
      icon: Star,
      title: 'World Class Artists',
      desc: 'Award-winning specialists in Realism, Japanese, Blackwork, and Traditional styles — each with years of global experience.',
    },
    {
      number: '02',
      icon: ShieldCheck,
      title: 'Sterile Environment',
      desc: 'Hospital-grade sterilization protocols, single-use needles, and autoclave-certified equipment for your peace of mind.',
    },
    {
      number: '03',
      icon: Sparkles,
      title: 'Custom Design',
      desc: 'Every piece is unique to you. Our consultation-driven process turns your vision into permanent art.',
    },
  ];

  const [selectedPiercing, setSelectedPiercing] = useState<number | null>(null);
  const [carouselPaused, setCarouselPaused] = useState(false);

  const closeLightbox = useCallback(() => {
    setSelectedPiercing(null);
    document.body.style.overflow = 'unset';
  }, []);

  const openLightbox = (idx: number) => {
    setSelectedPiercing(idx);
    document.body.style.overflow = 'hidden';
  };

  const nextPiercing = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedPiercing(prev => prev === null ? null : (prev + 1) % piercingTypes.length);
  }, [piercingTypes.length]);

  const prevPiercing = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedPiercing(prev => prev === null ? null : (prev - 1 + piercingTypes.length) % piercingTypes.length);
  }, [piercingTypes.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedPiercing === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPiercing();
      if (e.key === 'ArrowLeft') prevPiercing();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPiercing, closeLightbox, nextPiercing, prevPiercing]);

  const intro = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const featuresSec = useScrollAnimation<HTMLElement>({ threshold: 0.15 });
  const studio = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const gallery = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const piercing = useScrollAnimation<HTMLElement>({ threshold: 0.08 });
  const cta = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <div className="flex flex-col min-h-screen bg-ink-950 text-white selection:bg-ink-accent selection:text-black">

      {/* Global texture background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/wall-4-light.png")`, backgroundRepeat: 'repeat' }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.15] mix-blend-soft-light"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")', filter: 'grayscale(100%)' }}
        />
      </div>

      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll-slow { animation: scroll 40s linear infinite; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* ─────────────────────────────────────────────
          1. HERO
      ───────────────────────────────────────────── */}
      <div className="relative h-screen flex items-end justify-center overflow-hidden z-10 pb-24 md:pb-32">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/charles.png")', backgroundPosition: 'center top' }} />
        <div className="absolute inset-0 z-0 bg-ink-950/55" />
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, transparent 40%, rgba(10,10,10,0.95) 100%)' }} />

        {/* Top fade */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-ink-950 to-transparent z-10" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6 anim-hero-badge">
              <div className="w-8 h-px bg-ink-accent" />
              <span className="text-ink-accent text-[11px] font-black uppercase tracking-[0.35em]">
                Established in Bermuda
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-none anim-hero-title mb-8" style={{ animationDelay: '0.15s' }}>
              Tattoo<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-accent via-yellow-300 to-ink-accent/70">
                &amp; Piercing
              </span>
            </h1>

            {/* Sub-tagline */}
            <p className="text-gray-300 text-lg md:text-xl font-light max-w-lg leading-relaxed mb-10 anim-hero-badge" style={{ animationDelay: '0.3s' }}>
              Bermuda&apos;s premier tattoo &amp; body piercing studio — where artistry meets precision.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 anim-hero-buttons" style={{ animationDelay: '0.45s' }}>
              <Link
                href="/book"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-ink-accent text-black font-black tracking-widest uppercase text-xs overflow-hidden relative shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)] transition-shadow duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Book Appointment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>

              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 hover:border-white/50 text-white font-bold tracking-widest uppercase text-xs backdrop-blur-sm transition-all duration-300 hover:bg-white/5"
              >
                View Our Work
                <ChevronRight className="w-4 h-4 text-ink-accent group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest rotate-90 mb-4">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent animate-float" />
        </div>

        {/* Floating PenTool badge */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3 px-5 py-2.5 bg-ink-950/60 border border-white/10 backdrop-blur-md rounded-full">
          <PenTool className="w-4 h-4 text-ink-accent" />
          <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Custom Tattoo &amp; Piercing</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          STATS STRIP
      ───────────────────────────────────────────── */}
      {/* <div className="relative z-10 border-y border-white/5 bg-ink-950/90 backdrop-blur-sm overflow-hidden"> */}
      {/* Subtle glow */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ink-accent/3 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '10+', label: 'Years in Bermuda' },
              { value: '5K+', label: 'Happy Clients' },
              { value: '7', label: 'Styles Offered' },
              { value: '100%', label: 'Custom Artwork' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`py-8 px-6 md:px-10 text-center group hover:bg-white/[0.02] transition-colors ${i > 0 ? 'border-l border-white/5' : ''}`}
              >
                <div className="text-3xl md:text-4xl font-serif font-black text-ink-accent mb-1.5 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {stat.value}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-[0.25em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* ─────────────────────────────────────────────
          2. INTRO
      ───────────────────────────────────────────── */}
      <section ref={intro.ref} className="py-28 lg:py-36 relative z-10 bg-ink-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">

            {/* Left */}
            <div className={`lg:col-span-7 space-y-10 ${intro.isVisible ? 'anim-slide-left' : 'scroll-hidden'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-ink-accent" />
                <span className="text-ink-accent text-[11px] font-black uppercase tracking-[0.3em]">About Us</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white uppercase leading-tight">
                Not Your <span className="text-ink-accent italic">Traditional</span>{' '}
                Tattoo Shop.
              </h2>

              <div className="space-y-5 text-base md:text-lg text-gray-400 font-light leading-relaxed">
                <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-white first-letter:float-left first-letter:mr-3 first-letter:mt-[-8px] first-letter:text-ink-accent">
                  We serve the island with the finest tattoo and piercing artists in the industry.
                  We pride ourselves on being original on every level — from our custom artwork
                  to our welcoming atmosphere and professional attitude.
                </p>
                <p>
                  Located in the heart of Hamilton, Inksmith provides innovative modifications
                  and specialized techniques in a sterile, high-end environment.
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=39+King+St+Hamilton+Bermuda"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-ink-accent hover:text-white transition-colors group"
              >
                <MapPin className="w-4 h-4" />
                <span className="border-b border-ink-accent/40 group-hover:border-white/40 transition-colors pb-0.5">
                  39 King St, 2nd Floor, Ratteray Bldg., Hamilton HM 19
                </span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </div>

            {/* Right: Hours card */}
            <div className={`lg:col-span-5 ${intro.isVisible ? 'anim-slide-right' : 'scroll-hidden'}`} style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {/* Glow */}
                <div className="absolute -inset-6 bg-ink-accent/6 blur-3xl rounded-full pointer-events-none" />

                <div className="relative border border-white/10 bg-ink-950/60 backdrop-blur-md overflow-hidden">
                  {/* Accent bar top */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-ink-accent via-yellow-400/60 to-transparent" />

                  <div className="p-8 md:p-10">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Opening Hours</h3>
                        <p className="text-xl font-serif font-bold text-white">Studio Schedule</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-ink-accent/10 border border-ink-accent/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-ink-accent" />
                      </div>
                    </div>

                    <div className="space-y-5">
                      {[
                        { day: 'Monday — Saturday', time: '12:00 PM – 8:00 PM' },
                        { day: 'Sunday', time: '11:00 AM – 7:00 PM' },
                      ].map(({ day, time }) => (
                        <div key={day} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                          <span className="text-sm text-gray-400">{day}</span>
                          <span className="text-white font-serif font-bold">{time}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Walk-ins Welcome</span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-600 italic">
                      *Deposits required for custom pieces.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          3. FEATURES
      ───────────────────────────────────────────── */}
      <section
        ref={featuresSec.ref}
        className="relative border-y border-white/5 overflow-hidden z-10"
        style={{ backgroundImage: 'url("/images/bg.jpg")', backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Deep dark base */}
        <div className="absolute inset-0 bg-ink-950/80" />
        {/* Gold warm tint blended over */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 50%, rgba(10,10,10,0.6) 100%)' }} />
        {/* Vignette edges */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.75) 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section label */}
          <div className="px-4 sm:px-6 lg:px-8 pt-16 pb-2 flex items-center gap-3">
            <div className="w-8 h-px bg-ink-accent" />
            <span className="text-ink-accent text-[11px] font-black uppercase tracking-[0.3em]">Why Choose Us</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group relative p-10 md:p-14 hover:bg-white/[0.025] transition-all duration-500 overflow-hidden ${featuresSec.isVisible ? `anim-flip-up-${idx + 1}` : 'scroll-hidden'}`}
              >
                {/* Ghost number */}
                <div className="absolute top-6 right-8 text-7xl font-black text-white/[0.04] font-serif select-none group-hover:text-white/[0.06] transition-colors duration-500">
                  {feature.number}
                </div>

                {/* Accent line on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-ink-accent to-transparent group-hover:w-full transition-all duration-500" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-ink-accent/10 border border-ink-accent/20 flex items-center justify-center mb-8 group-hover:bg-ink-accent/20 group-hover:border-ink-accent/40 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-ink-accent" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-4 uppercase tracking-wide group-hover:text-ink-accent transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 font-light leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          4. STUDIO SHOWCASE
      ───────────────────────────────────────────── */}
      {(studioLoading || studioImages.length > 0) && <section ref={studio.ref} className="py-28 overflow-hidden bg-ink-950/90 relative z-10">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 ${studio.isVisible ? 'anim-curtain-left' : 'scroll-hidden'}`}>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-ink-accent" />
                <span className="text-ink-accent text-[11px] font-black uppercase tracking-[0.3em]">The Space</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-black text-white uppercase leading-none">
                Inside The<br /> Studio
              </h2>
            </div>
            <div className="md:max-w-xs">
              <p className="text-gray-400 text-sm leading-relaxed">
                An inspiring environment designed for creativity, comfort, and cleanliness.
                Hover to pause the tour.
              </p>
            </div>
          </div>
        </div>

        {studioLoading ? (
          <div className="flex gap-6 px-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[260px] md:w-[360px] aspect-[3/4] flex-shrink-0 bg-ink-900/60 border border-white/4 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : (
          <div className={`w-full ${studio.isVisible ? 'anim-fade-scale' : 'scroll-hidden'}`}>
            <div
              className="flex w-max animate-scroll-slow"
              style={{ animationPlayState: carouselPaused ? 'paused' : 'running' }}
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
            >
              {carouselImages.map((src, index) => (
                <div key={index} className="w-[260px] md:w-[360px] aspect-[3/4] relative mx-3 overflow-hidden group flex-shrink-0">
                  <img
                    src={src}
                    alt="Studio Interior"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 brightness-50 group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 border border-white/8 pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">Paused</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>}

      {/* ─────────────────────────────────────────────
          5. TATTOO GALLERY
      ───────────────────────────────────────────── */}
      <section ref={gallery.ref} className="py-28 bg-ink-950/95 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 ${gallery.isVisible ? 'anim-gallery-title' : 'scroll-hidden'}`}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-ink-accent" />
                <span className="text-ink-accent text-[11px] font-black uppercase tracking-[0.3em]">Our Work</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white uppercase leading-none">
                Tattoo Gallery
              </h2>
            </div>

            <div className="lg:max-w-sm space-y-4">
              <p className="text-gray-400 font-light leading-relaxed text-sm">
                Every piece tells a story. Our artists collaborate closely with each client
                to create permanent art that&apos;s uniquely theirs.
              </p>
              <p className="text-ink-accent text-xs font-bold tracking-widest uppercase">
                @inksmithtattoobda
              </p>
            </div>
          </div>

          {/* Grid */}
          {worksLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-ink-900/60 border border-white/4 animate-pulse" style={{ animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
          ) : recentWorks.length > 0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {recentWorks.map((work, idx) => (
              <div
                key={work.id}
                className={`aspect-square relative group overflow-hidden bg-ink-900 cursor-zoom-in border border-white/5 hover:border-ink-accent/30 transition-colors duration-300 ${gallery.isVisible ? 'anim-mosaic' : 'scroll-hidden'}`}
                style={gallery.isVisible ? { animationDelay: `${idx * 0.07}s` } : undefined}
              >
                <img
                  src={work.src}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-5">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-px bg-ink-accent" />
                      <span className="text-ink-accent text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                        {work.category}
                      </span>
                    </div>
                    <h3 className="text-white font-serif font-bold text-sm md:text-base leading-tight">{work.title}</h3>
                    <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wide mt-0.5 block">by {work.artist}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>}

          {/* CTA */}
          <div
            className={`mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5 ${gallery.isVisible ? 'anim-mosaic' : 'scroll-hidden'}`}
            style={gallery.isVisible ? { animationDelay: '0.6s' } : undefined}
          >
            <p className="text-gray-500 text-sm">Showing {recentWorks.length} recent works from our artists</p>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-3 text-sm font-black tracking-widest text-white uppercase hover:text-ink-accent transition-colors border border-white/10 hover:border-ink-accent/40 px-6 py-3"
            >
              View Full Portfolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          6. PIERCING
      ───────────────────────────────────────────── */}
      <section ref={piercing.ref} className="py-28 bg-gradient-to-b from-ink-900 to-ink-950 relative z-10 border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-ink-accent/4 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-indigo-900/8 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header + Featured */}
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-center mb-24">
            <div className={`lg:w-1/2 space-y-8 ${piercing.isVisible ? 'anim-elastic-left' : 'scroll-hidden'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-ink-accent" />
                <span className="text-ink-accent text-[11px] font-black uppercase tracking-[0.3em]">Body Modification</span>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-tight uppercase">
                Adorn<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                  Your Body.
                </span>
              </h2>

              <div className="space-y-5 text-base text-gray-400 font-light leading-relaxed border-l-2 border-ink-accent/30 pl-6">
                <p>
                  Our piercing studio maintains the highest standards of sterilization and hygiene.
                  Every modification should be safe, comfortable, and a positive experience.
                </p>
                <p>
                  From classic ear curation to complex surface piercings, our specialists use
                  implant-grade titanium and gold jewelry for perfect healing and lasting beauty.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {[
                  { icon: ShieldCheck, label: 'Implant Grade Jewelry' },
                  { icon: Sparkles, label: 'Single-Use Needles' },
                  { icon: Star, label: 'Aftercare Support' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs font-bold text-gray-300 bg-white/3 border border-white/8 px-3 py-2.5 rounded-lg">
                    <Icon className="w-3.5 h-3.5 text-ink-accent shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              <Link
                href="/book"
                className="group inline-flex items-center gap-3 px-7 py-4 bg-ink-accent text-black font-black tracking-widest uppercase text-xs hover:bg-white transition-colors duration-300 shadow-[0_0_40px_rgba(212,175,55,0.15)]"
              >
                Book a Piercing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className={`lg:w-1/2 relative group ${piercing.isVisible ? 'anim-elastic-right' : 'scroll-hidden'}`} style={piercing.isVisible ? { animationDelay: '0.15s' } : undefined}>
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-accent/15 to-transparent rounded-2xl rotate-2 scale-105 opacity-60 group-hover:rotate-1 transition-transform duration-700" />
              <div className="relative h-[500px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/images/charles1.png"
                  alt="Professional Piercing"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="h-0.5 w-12 bg-ink-accent mb-4" />
                  <div className="text-white text-lg md:text-xl font-serif italic mb-1">&ldquo;Safety is our signature.&rdquo;</div>
                  <div className="text-ink-accent text-xs font-black tracking-[0.2em] uppercase">Head Piercer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-6 mb-16">
            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent flex-grow" />
            <div className="flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
              <Star className="w-3 h-3 text-ink-accent" />
              Placement Guide
              <Star className="w-3 h-3 text-ink-accent" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent flex-grow" />
          </div>

          {/* Piercing Grid */}
          {piercingLoading ? (
            <div>
              <div className="h-4 w-72 mx-auto bg-white/[0.04] rounded-full animate-pulse mb-10" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-xl bg-ink-900/60 border border-white/4 animate-pulse" style={{ animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>
            </div>
          ) : piercingTypes.length > 0 && <div>
            <p className={`text-center text-gray-500 text-sm mb-10 ${piercing.isVisible ? 'anim-cascade' : 'scroll-hidden'}`} style={piercing.isVisible ? { animationDelay: '0.3s' } : undefined}>
              Explore our most popular placements — click any to view full screen
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {piercingTypes.map((piercingItem, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx)}
                  className={`group relative aspect-[4/5] overflow-hidden rounded-xl bg-ink-800 border border-white/5 hover:border-ink-accent/30 shadow-lg cursor-zoom-in transition-colors duration-300 ${piercing.isVisible ? 'anim-cascade' : 'scroll-hidden'}`}
                  style={piercing.isVisible ? { animationDelay: `${0.35 + idx * 0.04}s` } : undefined}
                >
                  <img
                    src={piercingItem.img}
                    alt={piercingItem.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-3.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="w-0 h-0.5 bg-ink-accent mb-2.5 group-hover:w-6 transition-all duration-300" />
                    <span className="block text-sm font-bold text-white group-hover:text-ink-accent transition-colors leading-tight">
                      {piercingItem.name}
                    </span>
                    <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 block mt-0.5 uppercase tracking-wider">
                      Tap to view
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>}
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          7. CTA
      ───────────────────────────────────────────── */}
      <section ref={cta.ref} className="relative py-32 overflow-hidden z-10">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-950" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-dark.png")` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ink-accent/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ink-accent/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className={`max-w-4xl mx-auto px-4 text-center relative z-10 ${cta.isVisible ? 'anim-zoom-pulse' : 'scroll-hidden'}`}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-px bg-ink-accent/60" />
            <PenTool className="w-4 h-4 text-ink-accent" />
            <div className="w-12 h-px bg-ink-accent/60" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black text-white uppercase leading-tight tracking-tighter mb-6">
            Ready to Get<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-accent via-yellow-300 to-ink-accent/80">
              Inked or Pierced?
            </span>
          </h2>

          <p className="text-gray-400 text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed">
            Book your appointment today and let our artists bring your vision to life.
            Walk-ins welcome during studio hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-ink-accent text-black font-black tracking-widest uppercase text-sm hover:bg-white transition-colors duration-300 shadow-[0_0_60px_rgba(212,175,55,0.2)]"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/artists"
              className="inline-flex items-center gap-3 px-10 py-5 border border-white/20 hover:border-white/40 text-white font-bold tracking-widest uppercase text-sm hover:bg-white/5 transition-all duration-300"
            >
              Meet the Artists
              <ChevronRight className="w-4 h-4 text-ink-accent" />
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600 uppercase tracking-widest font-bold">
            {['Walk-ins Welcome', 'Custom Designs', 'Free Consultation', 'Bermuda Licensed'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <Star className="w-3 h-3 text-ink-accent/50" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          PIERCING LIGHTBOX
      ───────────────────────────────────────────── */}
      {selectedPiercing !== null && (
        <div className="fixed inset-0 z-[100] bg-ink-950/96 backdrop-blur-xl flex items-center justify-center">
          <button onClick={closeLightbox} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors z-50 group">
            <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <button onClick={prevPiercing} className="absolute left-4 md:left-8 p-3 bg-black/50 hover:bg-ink-accent text-white hover:text-black rounded-full transition-all z-50 backdrop-blur-md group">
            <ChevronLeft className="w-7 h-7 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button onClick={nextPiercing} className="absolute right-4 md:right-8 p-3 bg-black/50 hover:bg-ink-accent text-white hover:text-black rounded-full transition-all z-50 backdrop-blur-md group">
            <ChevronRight className="w-7 h-7 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="w-full h-full p-4 md:p-16 flex flex-col items-center justify-center" onClick={closeLightbox}>
            <div className="relative max-w-2xl max-h-[80vh] w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <img
                src={piercingTypes[selectedPiercing].img}
                alt={piercingTypes[selectedPiercing].name}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl shadow-black"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full flex items-center gap-4 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-ink-accent rounded-full" />
                <span className="text-white font-serif font-bold">{piercingTypes[selectedPiercing].name}</span>
                <span className="w-1.5 h-1.5 bg-ink-accent rounded-full" />
              </div>
            </div>
            <div className="mt-6 text-gray-600 text-xs uppercase tracking-widest">
              {selectedPiercing + 1} / {piercingTypes.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
