import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Instagram, Calendar, ArrowRight, PenTool } from 'lucide-react';

import Breadcrumbs from '../../components/seo/Breadcrumbs';
import JsonLd from '../../components/seo/JsonLd';
import { faqsByTopic, toSchemaFaqs } from '../../content/faqs';
import { getArtists } from '../../lib/data/public-content';
import { buildMetadata } from '../../lib/seo/metadata';
import { pageGraph, itemListSchema, personSchema, ID } from '../../lib/seo/schema';
import { siteConfig } from '../../lib/seo/site.config';
import { withUniqueSlugs } from '../../lib/seo/slug';

/**
 * The roster changes rarely, so this is generated statically and refreshed on a
 * 15 minute cycle. That also self-heals the page if a build happened to run
 * while the free-tier database was paused.
 */
export const revalidate = 900;

const TITLE = 'Tattoo Artists in Hamilton, Bermuda';
const DESCRIPTION =
  'Meet the tattoo artists at InkSmith Studios in Hamilton, Bermuda. Each artist specialises in different styles, from hyper-realism to traditional Irezumi. Book directly.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/artists',
});

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Artists', href: '/artists' },
];

const Artists = async () => {
  // A paused or unreachable database is indistinguishable from an empty roster
  // unless the failure flag is kept, so the reader returns both.
  const { data: artists, failed: error } = await getArtists();

  const totalStyles = [...new Set(artists.flatMap(a => a.specialties))].length;

  const artistNodes = withUniqueSlugs(artists).map(({ artist, slug }) =>
    personSchema({
      slug,
      name: artist.name,
      description: artist.bio || undefined,
      image: artist.imageUrl || undefined,
      jobTitle: 'Tattoo Artist',
      knowsAbout: artist.specialties,
      sameAs: artist.instagramHandle
        ? [`https://instagram.com/${artist.instagramHandle.replace('@', '')}`]
        : undefined,
    })
  );

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <JsonLd
        data={pageGraph({
          path: '/artists',
          name: TITLE,
          description: DESCRIPTION,
          pageType: 'CollectionPage',
          crumbs: CRUMBS,
          faqs: toSchemaFaqs(faqsByTopic('tattoo', 4)),
          speakableSelectors: ['[data-answer]'],
          extra: [
            itemListSchema({
              id: ID.itemList('/artists'),
              name: `Artists at ${siteConfig.name}`,
              items: artistNodes,
            }),
          ],
        })}
      />
      <Breadcrumbs items={CRUMBS} />

      {/* ── Header ── */}
      <div className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-ink-accent/6 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-900/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px w-16 bg-ink-accent" />
            <span className="text-ink-accent text-[11px] font-black uppercase tracking-[0.35em]">Our Collective</span>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-10">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-serif font-black tracking-tighter text-white uppercase leading-none">
              Meet<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-accent via-yellow-400 to-ink-accent/70">
                The Artists
              </span>
            </h1>

            <div className="xl:max-w-sm space-y-8">
              <p className="text-gray-400 text-lg font-light leading-relaxed">
                Our collective of world-class artists brings your vision to life.
                Each specializing in a unique style — from hyper-realism to traditional Irezumi.
              </p>

              {artists.length > 0 && (
                <div className="flex items-center gap-8 py-6 border-t border-white/10">
                  {[
                    { value: artists.length, label: 'Artists' },
                    { value: `${totalStyles}+`, label: 'Styles' },
                    { value: '10+', label: 'Years' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-3xl font-serif font-black text-white">{stat.value}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-[0.25em] mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Artists ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-40">
        {artists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-48 text-center">
            <div className="relative mb-12">
              <div className="w-36 h-36 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-ink-accent/20 bg-ink-accent/5 flex items-center justify-center">
                  <PenTool className="w-10 h-10 text-ink-accent/50" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-ink-accent/5 blur-3xl -z-10" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-ink-accent mb-5">
              {error ? 'Temporarily Offline' : 'Coming Soon'}
            </p>
            <h2 className="text-4xl md:text-6xl font-serif font-black text-white uppercase tracking-tighter mb-5">
              {error ? 'Roster Unavailable' : 'Artists Unavailable'}
            </h2>
            <p className="max-w-md text-gray-500 font-light leading-relaxed mb-12">
              {error
                ? "We couldn't reach our roster just now. Please refresh in a moment — booking is still open."
                : 'Our roster is being curated. Check back soon to meet the talented artists joining InkSmith.'}
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 px-10 py-5 bg-ink-accent text-black font-black tracking-widest uppercase text-sm hover:bg-white transition-colors duration-300"
            >
              <Calendar className="w-4 h-4" />
              Book a Consultation
            </Link>
          </div>
        ) : (
          <div className="space-y-48">
            {withUniqueSlugs(artists).map(({ artist, slug }, index) => (
              <article
                key={artist.id}
                className={`group relative flex flex-col lg:flex-row gap-16 xl:gap-24 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Ghost number */}
                <div
                  className={`hidden xl:block absolute -top-10 text-[200px] font-black font-serif text-white/[0.03] leading-none select-none pointer-events-none z-0 ${index % 2 === 1 ? 'right-0' : 'left-0'}`}
                >
                  0{index + 1}
                </div>

                {/* ── Image ── */}
                <div className="w-full lg:w-5/12 relative z-10">
                  <div className="relative">
                    {/* Offset decorative frame */}
                    <div className={`absolute inset-0 border border-ink-accent/20 z-0 transition-transform duration-700 group-hover:translate-x-1 group-hover:translate-y-1 ${index % 2 === 1 ? 'translate-x-4 -translate-y-4' : '-translate-x-4 translate-y-4'}`} />

                    <div className="relative aspect-[3/4] overflow-hidden shadow-2xl shadow-black/60 z-10">
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent z-10 group-hover:from-ink-950/40 transition-all duration-700" />
                      <img
                        src={artist.imageUrl}
                        alt={`${artist.name}, tattoo artist at ${siteConfig.name}`}
                        width={900}
                        height={1200}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />

                      {/* Instagram on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <a
                          href={`https://instagram.com/${artist.instagramHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-white/60 hover:text-ink-accent transition-colors duration-300 text-xs font-bold uppercase tracking-widest"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          {artist.instagramHandle}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="w-full lg:w-7/12 lg:pt-12 xl:pt-20 space-y-8 relative z-10">

                  {/* Number + specialties row */}
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-ink-accent/40 tracking-widest">0{index + 1}</span>
                    <div className="flex flex-wrap gap-2">
                      {artist.specialties.map(style => (
                        <span
                          key={style}
                          className="px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-ink-accent/30 bg-ink-accent/8 text-ink-accent rounded-full"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <h2 className="text-5xl sm:text-6xl md:text-7xl font-black font-sans uppercase tracking-tighter text-white leading-none">
                    <Link
                      href={`/artists/${slug}`}
                      className="hover:text-ink-accent transition-colors duration-300"
                    >
                      {artist.name}
                    </Link>
                  </h2>

                  {/* Gradient divider */}
                  <div className={`h-px bg-gradient-to-r from-ink-accent/60 to-transparent ${index % 2 === 1 ? 'bg-gradient-to-l' : ''}`} />

                  {/* Highlights / Bio */}
                  {artist.highlights?.filter(h => h.trim()).length ? (
                    <ul className="space-y-4">
                      {artist.highlights.filter(h => h.trim()).map((point, i) => (
                        <li key={i} className="flex items-start gap-4 group/item">
                          <span className="text-ink-accent text-[10px] mt-2 shrink-0 transition-transform duration-300 group-hover/item:scale-125">◆</span>
                          <span className="text-gray-300 text-base leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {artist.bio && (
                    <p className="text-gray-500 text-sm font-light leading-relaxed">{artist.bio}</p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-5 pt-4">
                    <Link
                      href={`/book?artistId=${artist.id}`}
                      className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-ink-accent text-black font-black tracking-widest uppercase text-xs hover:bg-white transition-colors duration-300 shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:shadow-none"
                    >
                      <Calendar className="w-4 h-4" />
                      Book {artist.name.split(' ')[0]}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href={`/artists/${slug}`}
                      className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 px-5 py-4"
                    >
                      View {artist.name.split(' ')[0]}&rsquo;s profile
                    </Link>

                    <a
                      href={`https://instagram.com/${artist.instagramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 px-5 py-4"
                    >
                      <Instagram className="w-4 h-4" />
                      Follow
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists;
