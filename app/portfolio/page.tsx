'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  X, ChevronLeft, ChevronRight, Search, RotateCcw,
  Sparkles, Calendar, ChevronDown, User,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';

const CATEGORIES = ['All', 'Realism', 'Traditional', 'Japanese', 'Blackwork', 'Fine Line', 'Color', 'Watercolor'];

type PortfolioItem = { id: string; src: string; category: string; title: string; artist: string };

/* ─── Component ─── */
const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [artist, setArtist] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [imgFading, setImgFading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  /* fetch */
  const loadImages = useCallback(async () => {
    setFetchError(null);
    setIsLoaded(false);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      const mapped: PortfolioItem[] = (data ?? []).map((r) => ({
        id: r.id, src: r.src, title: r.title, category: r.category, artist: r.artist ?? '',
      }));
      setItems(mapped);
      setArtists([...new Set(mapped.map((i) => i.artist).filter(Boolean))]);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load images.');
    } finally {
      setTimeout(() => setIsLoaded(true), 80);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadImages();
  }, [loadImages]);

  /* filter */
  const filtered = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) &&
      (type === 'All' || item.category === type) &&
      (artist === 'All' || item.artist === artist)
    );
  }), [items, search, type, artist]);

  /* scroll reveal — runs AFTER isLoaded so gallery elements are in the DOM */
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, Element>>(new Map());

  const setRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) itemRefs.current.set(id, el);
    else itemRefs.current.delete(id);
  }, []);

  useEffect(() => {
    if (!isLoaded || fetchError || filtered.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).dataset.portfolioId;
            if (id) {
              setVisibleIds((prev) => new Set([...prev, id]));
              observer.unobserve(e.target);
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    itemRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isLoaded, fetchError, filtered]);

  const hasFilters = search !== '' || type !== 'All' || artist !== 'All';

  const clearAll = () => { setSearch(''); setType('All'); setArtist('All'); };

  /* lightbox */
  const openLightbox = (i: number) => { setLightboxIdx(i); document.body.style.overflow = 'hidden'; };
  const closeLightbox = useCallback(() => { setLightboxIdx(null); document.body.style.overflow = ''; }, []);
  const navigate = useCallback((dir: 1 | -1, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIdx === null || imgFading) return;
    setImgFading(true);
    setTimeout(() => {
      setLightboxIdx((p) => p === null ? null : (p + dir + filtered.length) % filtered.length);
      setImgFading(false);
    }, 120);
  }, [lightboxIdx, filtered.length, imgFading]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, closeLightbox, navigate]);

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-ink-accent selection:text-black">

      {/* ═══ HERO HEADER ═══ */}
      <header className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
        />
        {/* noise grain */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-3 mb-7">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-ink-accent/50" />
            <span className="text-ink-accent text-[9px] font-bold uppercase tracking-[0.35em]">InkSmith Studios</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-ink-accent/50" />
          </div>

          {/* title */}
          <h1
            className="font-serif font-black uppercase leading-[0.92] tracking-tighter mb-6"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            <span className="block text-white text-5xl md:text-7xl lg:text-[6rem]">Our</span>
            <span
              className="block text-transparent bg-clip-text text-6xl md:text-8xl lg:text-[7.5rem]"
              style={{ backgroundImage: 'linear-gradient(135deg, #B8960C 0%, #F5E17A 45%, #D4AF37 70%, #8B6914 100%)' }}
            >
              Masterpieces
            </span>
          </h1>

          {/* decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-ink-accent/30" />
            <span className="w-1 h-1 rounded-full bg-ink-accent/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-ink-accent" />
            <span className="w-1 h-1 rounded-full bg-ink-accent/60" />
            <span className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-ink-accent/30" />
          </div>

          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-[0.9375rem] leading-relaxed font-light">
            Each piece is a story etched in skin — crafted with precision, passion, and permanent artistry.
          </p>
        </div>
      </header>

      {/* ═══ STICKY FILTER BAR ═══ */}
      <div className="sticky top-16 z-40 bg-ink-950/92 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category pills */}
          <div
            className="flex items-center gap-2 py-4 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setType(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-200 ${type === cat
                    ? 'bg-ink-accent text-ink-950 shadow-[0_0_18px_rgba(212,175,55,0.35)]'
                    : 'bg-white/[0.04] text-gray-500 border border-white/[0.08] hover:bg-white/[0.08] hover:text-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search + Artist */}
          <div className="flex flex-col sm:flex-row gap-3 pb-4">
            {/* search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-ink-accent transition-colors z-10" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title…"
                className="w-full bg-ink-900/60 border border-white/[0.07] rounded-lg py-2.5 pl-10 pr-9 text-sm text-white focus:border-ink-accent/50 focus:bg-ink-900/80 outline-none transition-all placeholder-gray-700"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* artist */}
            <div className="relative sm:w-48 group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-ink-accent transition-colors pointer-events-none z-10" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none z-10" />
              <select
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full bg-ink-900/60 border border-white/[0.07] rounded-lg py-2.5 pl-10 pr-10 text-sm text-white focus:border-ink-accent/50 outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="All">All Artists</option>
                {artists.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* reset */}
            {hasFilters && (
              <button
                onClick={clearAll}
                className="sm:w-auto px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-gray-500 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══ RESULT META ROW ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex flex-wrap items-center justify-between gap-3 min-h-[48px]">
        {/* count */}
        <p className="text-[11px] uppercase tracking-widest text-gray-700">
          {isLoaded ? (
            <>
              <span className="text-ink-accent font-bold text-sm tabular-nums">{filtered.length}</span>
              {' '}{filtered.length === 1 ? 'piece' : 'pieces'}
              {hasFilters && <span className="text-gray-700"> found</span>}
            </>
          ) : (
            <span className="inline-block w-20 h-3 bg-white/[0.06] rounded-full animate-pulse" />
          )}
        </p>

        {/* active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2">
            {type !== 'All' && (
              <Chip label={type} onRemove={() => setType('All')} />
            )}
            {artist !== 'All' && (
              <Chip label={artist} onRemove={() => setArtist('All')} />
            )}
            {search && (
              <Chip label={`"${search}"`} onRemove={() => setSearch('')} />
            )}
          </div>
        )}
      </div>

      {/* ═══ GALLERY GRID ═══ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">

        {/* error state */}
        {isLoaded && fetchError && (
          <div className="flex flex-col items-center justify-center py-36 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <X className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">Could not load images</h3>
            <p className="text-gray-600 text-sm mb-2 max-w-sm">{fetchError}</p>
            <p className="text-gray-700 text-xs mb-8">Check that the <code className="text-gray-500">portfolio_images</code> table has a public read policy in Supabase.</p>
            <button
              onClick={loadImages}
              className="px-7 py-3 bg-ink-accent text-ink-950 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* loading skeletons */}
        {!isLoaded && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-xl overflow-hidden bg-ink-900/50 border border-white/[0.04]"
                style={{ height: `${240 + (i % 3) * 90}px` }}
              >
                <div className="w-full h-full animate-pulse" style={{ background: 'linear-gradient(160deg,#1a1a1a,#141414)' }} />
              </div>
            ))}
          </div>
        )}

        {/* gallery */}
        {isLoaded && !fetchError && filtered.length > 0 && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((item, idx) => {
              const visible = visibleIds.has(item.id);
              const colDelay = (idx % 3) * 75;
              return (
                <div
                  key={item.id}
                  data-portfolio-id={item.id}
                  ref={(el) => setRef(item.id, el)}
                  onClick={() => openLightbox(idx)}
                  className="break-inside-avoid relative group cursor-zoom-in rounded-xl overflow-hidden border border-white/[0.04] hover:border-ink-accent/30 transition-[border-color,box-shadow] duration-500"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.975)',
                    transition: `opacity 0.65s ease ${colDelay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${colDelay}ms, border-color 0.5s, box-shadow 0.5s`,
                    boxShadow: visible ? 'none' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(212,175,55,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* image */}
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto block transform transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  />

                  {/* permanent bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/10 to-transparent" />

                  {/* category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-[3px] bg-ink-950/75 backdrop-blur-sm border border-ink-accent/25 text-ink-accent text-[8px] font-bold uppercase tracking-[0.22em] rounded-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-5">
                    <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-350 ease-out">
                      <h3 className="font-serif font-bold text-white text-lg leading-tight tracking-wide">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-4 h-px bg-ink-accent/70" />
                        <span className="text-gray-400 text-[10px] uppercase tracking-wider">{item.artist}</span>
                      </div>
                    </div>
                  </div>

                  {/* zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="w-11 h-11 rounded-full bg-ink-accent/15 backdrop-blur-md border border-ink-accent/30 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Sparkles className="w-4 h-4 text-ink-accent" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* empty state */}
        {isLoaded && !fetchError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-36 text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full bg-ink-900/80 border border-white/[0.07] flex items-center justify-center">
                <Search className="w-7 h-7 text-gray-700" />
              </div>
              <div className="absolute inset-0 rounded-full border border-white/[0.04] scale-150 animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-3 tracking-wide">No pieces found</h3>
            <p className="text-gray-600 text-sm mb-8 max-w-xs">
              Adjust your search or filters to discover more of our work.
            </p>
            <button
              onClick={clearAll}
              className="px-7 py-3 bg-ink-accent text-ink-950 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-400 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* ═══ BOTTOM CTA ═══ */}
      {isLoaded && (
        <div className="border-t border-white/[0.05] bg-ink-900/25 py-20 px-4">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-ink-accent text-[9px] uppercase tracking-[0.35em] mb-5 block">Inspired by what you see?</span>
            <h2
              className="font-serif font-black uppercase leading-tight text-white mb-5 text-3xl md:text-4xl"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Make It Yours
            </h2>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              Book a consultation and bring your vision to life with one of our master artists.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2.5 px-9 py-3.5 bg-ink-accent text-ink-950 font-bold text-[10px] uppercase tracking-[0.22em] hover:bg-yellow-400 transition-all duration-200 group"
              style={{ boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(212,175,55,0.28)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(212,175,55,0.4)'; }}
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Your Session
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* ═══ LIGHTBOX ═══ */}
      {lightboxIdx !== null && filtered[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ animation: 'lb-fade-in 0.2s ease both' }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-ink-950/96 backdrop-blur-2xl"
            onClick={closeLightbox}
          />

          {/* close */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white transition-all group"
          >
            <X className="w-[18px] h-[18px] group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 text-[10px] uppercase tracking-widest text-gray-600">
            <span className="text-white font-semibold tabular-nums">{lightboxIdx + 1}</span>
            {' '}/ {filtered.length}
          </div>

          {/* prev */}
          <button
            onClick={(e) => navigate(-1, e)}
            className="absolute left-4 md:left-7 z-50 w-11 h-11 rounded-full bg-white/[0.04] hover:bg-ink-accent border border-white/[0.08] hover:border-ink-accent flex items-center justify-center text-white hover:text-ink-950 transition-all duration-200 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-px transition-transform" />
          </button>

          {/* next */}
          <button
            onClick={(e) => navigate(1, e)}
            className="absolute right-4 md:right-7 z-50 w-11 h-11 rounded-full bg-white/[0.04] hover:bg-ink-accent border border-white/[0.08] hover:border-ink-accent flex items-center justify-center text-white hover:text-ink-950 transition-all duration-200 group"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-px transition-transform" />
          </button>

          {/* image + info */}
          <div className="relative z-10 flex flex-col items-center gap-5 mx-14 md:mx-24 max-w-5xl w-full">
            <img
              key={lightboxIdx}
              src={filtered[lightboxIdx].src}
              alt={filtered[lightboxIdx].title}
              className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
              style={{ opacity: imgFading ? 0 : 1, transform: imgFading ? 'scale(0.97)' : 'scale(1)', transition: 'opacity 0.12s ease, transform 0.12s ease' }}
            />

            {/* meta pill */}
            <div className="flex items-center gap-4 bg-ink-900/85 backdrop-blur-xl border border-white/[0.07] rounded-full px-5 py-2.5 shadow-lg">
              <span className="text-ink-accent font-bold text-[9px] uppercase tracking-[0.22em]">
                {filtered[lightboxIdx].category}
              </span>
              <span className="w-px h-3 bg-white/15" />
              <span className="font-serif font-bold text-white text-sm tracking-wide">
                {filtered[lightboxIdx].title}
              </span>
              <span className="w-px h-3 bg-white/15" />
              <span className="text-gray-600 text-[9px] uppercase tracking-widest">
                {filtered[lightboxIdx].artist}
              </span>
            </div>

            {/* keyboard hint */}
            <p className="text-gray-700 text-[9px] uppercase tracking-widest hidden md:block">
              ← → to navigate · esc to close
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes lb-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        [style*="scrollbarWidth"] { scrollbar-width: none; }
        .columns-1 > *, .columns-2 > *, .columns-3 > * { break-inside: avoid; }
      `}</style>
    </div>
  );
};

/* ─── Chip sub-component ─── */
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink-accent/[0.08] border border-ink-accent/20 rounded-full text-ink-accent text-[9px] font-bold uppercase tracking-[0.18em]">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

export default Portfolio;
