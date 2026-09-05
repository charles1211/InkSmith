import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Providers } from './providers';
import { cinzel, inter } from './fonts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { siteConfig } from '../lib/seo/site.config';
import { buildVerification } from '../lib/seo/metadata';
import { getSiteUrl, getSupabaseOrigin } from '../lib/seo/url';
import './globals.css';

export const metadata: Metadata = {
  // Every relative URL in page metadata resolves against this. Set once, here.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: getSiteUrl() }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  // Lets mobile browsers linkify the studio's phone number and address.
  formatDetection: { telephone: true, address: true, email: true },
  alternates: { canonical: '/' },
  verification: buildVerification(),
  category: 'Tattoo & Body Piercing Studio',
};

export const viewport: Viewport = {
  themeColor: siteConfig.brand.themeColor,
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseOrigin = getSupabaseOrigin();

  return (
    <html
      lang={siteConfig.htmlLang}
      className={`${cinzel.variable} ${inter.variable}`}
    >
      <head>
        {/* Every gallery, studio and artist image is served from this origin. */}
        {supabaseOrigin && (
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="" />
        )}
      </head>
      <body className="flex flex-col min-h-screen bg-ink-950 text-white font-sans selection:bg-ink-accent selection:text-white">
        <Providers>
          <Navbar />
          <ScrollToTop />
          <main className="grow">
            {children}
          </main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
