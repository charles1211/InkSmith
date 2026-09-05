import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Instagram } from 'lucide-react';

import AnswerBlock from '../../../components/seo/AnswerBlock';
import Breadcrumbs from '../../../components/seo/Breadcrumbs';
import CtaBand from '../../../components/seo/CtaBand';
import JsonLd from '../../../components/seo/JsonLd';
import { getArtistBySlug, getArtists, getPortfolioItems } from '../../../lib/data/public-content';
import { buildMetadata, buildNoIndexMetadata } from '../../../lib/seo/metadata';
import { imageObjectSchema, itemListSchema, pageGraph, personSchema, ID } from '../../../lib/seo/schema';
import { siteConfig } from '../../../lib/seo/site.config';
import { artistSlug, withUniqueSlugs } from '../../../lib/seo/slug';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * `dynamicParams` stays true so a build that runs while the free-tier database
 * is paused simply prerenders nothing and renders profiles on demand instead.
 * A paused database at build time therefore costs nothing permanent.
 */
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const { data, failed } = await getArtists();
  if (failed) return [];
  return withUniqueSlugs(data).map(({ slug }) => ({ slug }));
}

function instagramUrl(handle: string): string | undefined {
  const cleaned = handle?.replace('@', '').trim();
  return cleaned ? `https://instagram.com/${cleaned}` : undefined;
}

function describe(artist: { name: string; specialties: string[] }): string {
  const styles = artist.specialties.slice(0, 3).join(', ');
  return styles
    ? `${artist.name} is a tattoo artist at ${siteConfig.name} in Hamilton, Bermuda, specialising in ${styles}. Book directly or request a free consultation.`
    : `${artist.name} is a tattoo artist at ${siteConfig.name} in Hamilton, Bermuda. Book directly or request a free consultation.`;
}

/**
 * A slug with no matching artist renders the not-found page, but Next serves it
 * with a 200 rather than a 404 on this route. These URLs are not linked anywhere
 * and are absent from the sitemap, and the noindex below is the standard remedy
 * for a soft 404 — it keeps them out of the index regardless of status code.
 *
 * buildNoIndexMetadata also omits the canonical tag, so the page no longer
 * nominates itself as canonical while simultaneously asking to be dropped.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { artist, failed } = await getArtistBySlug(slug);
  if (failed || !artist) return buildNoIndexMetadata('Artist', `/artists/${slug}`);

  return buildMetadata({
    title: `${artist.name} — Tattoo Artist`,
    description: artist.bio?.trim() ? artist.bio.slice(0, 160) : describe(artist),
    path: `/artists/${slug}`,
    ogType: 'profile',
    images: artist.imageUrl ? [{ url: artist.imageUrl, alt: artist.name }] : undefined,
  });
}

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params;
  const { artist, failed } = await getArtistBySlug(slug);

  // Never collapse "database unreachable" into "artist does not exist" — a 404
  // on a transient outage would deindex a page that is perfectly valid.
  if (failed) throw new Error('Artist directory temporarily unavailable');
  if (!artist) notFound();

  const path = `/artists/${artistSlug(artist)}`;
  const instagram = instagramUrl(artist.instagramHandle);
  const firstName = artist.name.split(' ')[0];

  const { data: portfolio } = await getPortfolioItems();
  const work = portfolio
    .filter((item) => item.artist && item.artist.toLowerCase() === artist.name.toLowerCase())
    .slice(0, 12);

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Artists', href: '/artists' },
    { name: artist.name, href: path },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <JsonLd
        data={pageGraph({
          path,
          name: artist.name,
          description: describe(artist),
          pageType: 'ProfilePage',
          crumbs,
          primaryImage: artist.imageUrl || undefined,
          speakableSelectors: ['[data-answer]'],
          extra: [
            personSchema({
              slug: artistSlug(artist),
              name: artist.name,
              description: artist.bio || describe(artist),
              image: artist.imageUrl || undefined,
              jobTitle: 'Tattoo Artist',
              knowsAbout: artist.specialties,
              sameAs: instagram ? [instagram] : undefined,
            }),
            work.length
              ? itemListSchema({
                  id: ID.itemList(path),
                  name: `Work by ${artist.name}`,
                  items: work.map((item) =>
                    imageObjectSchema({
                      url: item.src,
                      name: item.title || undefined,
                      caption: [item.title, item.category].filter(Boolean).join(' — ') || undefined,
                      creator: artist.name,
                    })
                  ),
                })
              : undefined,
          ],
        })}
      />

      <Breadcrumbs items={crumbs} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <header className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-20 pt-8 mb-20">
          <div className="lg:col-span-2">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 border border-ink-accent/20 -translate-x-4 translate-y-4"
              />
              <div className="relative aspect-[3/4] overflow-hidden shadow-2xl shadow-black/60">
                {artist.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={artist.imageUrl}
                    alt={`${artist.name}, tattoo artist at ${siteConfig.name}`}
                    width={900}
                    height={1200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-ink-900" />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 lg:pt-8">
            <div className="flex items-center gap-4 mb-8">
              <div aria-hidden="true" className="h-px w-12 bg-ink-accent" />
              <span className="text-ink-accent text-[10px] font-black uppercase tracking-[0.35em]">
                Tattoo Artist
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-sans uppercase tracking-tighter text-white leading-none mb-8">
              {artist.name}
            </h1>

            {artist.specialties.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-8">
                {artist.specialties.map((style) => (
                  <li
                    key={style}
                    className="px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-ink-accent/30 bg-ink-accent/8 text-ink-accent rounded-full"
                  >
                    {style}
                  </li>
                ))}
              </ul>
            )}

            <AnswerBlock className="mb-8">{describe(artist)}</AnswerBlock>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href={`/book?artistId=${artist.id}`}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-ink-accent text-black font-black tracking-widest uppercase text-xs hover:bg-white transition-colors duration-300"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Book {firstName}
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 px-5 py-4"
                >
                  <Instagram className="w-4 h-4" aria-hidden="true" />
                  {artist.instagramHandle}
                </a>
              )}
            </div>
          </div>
        </header>

        {(artist.bio || artist.highlights?.length) && (
          <section className="mb-20 max-w-3xl">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-6">
              About {firstName}
            </h2>
            {artist.highlights?.filter((h) => h.trim()).length ? (
              <ul className="space-y-4 mb-6">
                {artist.highlights
                  .filter((h) => h.trim())
                  .map((point) => (
                    <li key={point} className="flex items-start gap-4">
                      <span aria-hidden="true" className="text-ink-accent text-[10px] mt-2 shrink-0">
                        ◆
                      </span>
                      <span className="text-gray-300 text-base leading-relaxed">{point}</span>
                    </li>
                  ))}
              </ul>
            ) : null}
            {artist.bio && (
              <p className="text-gray-400 text-base font-light leading-relaxed">{artist.bio}</p>
            )}
          </section>
        )}

        {work.length > 0 && (
          <section className="mb-20">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              Work by {firstName}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
              A selection of {firstName}&rsquo;s pieces from the studio portfolio.
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {work.map((item) => (
                <li key={item.id} className="group">
                  <div className="aspect-square overflow-hidden bg-ink-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={
                        item.title
                          ? `${item.title}${item.category ? `, ${item.category} tattoo` : ''} by ${artist.name}`
                          : `Tattoo by ${artist.name}`
                      }
                      width={600}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {item.title && (
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {item.title}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 mt-8 text-ink-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              See the full portfolio →
            </Link>
          </section>
        )}

        <section className="mb-16">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-8">
            More from the studio
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:text-white px-6 py-4 transition-colors"
            >
              All artists
            </Link>
            <Link
              href="/services/tattoo"
              className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:text-white px-6 py-4 transition-colors"
            >
              Tattoo services
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:text-white px-6 py-4 transition-colors"
            >
              Studio FAQ
            </Link>
          </div>
        </section>

        <CtaBand
          heading={`Book a session with ${firstName}`}
          body={`Send your concept through the booking form and the studio replies within 24 to 48 hours, or call ${siteConfig.contact.phone} during studio hours.`}
          bookLabel={`Book ${firstName}`}
        />
      </div>
    </div>
  );
}
