import { Cinzel, Inter } from 'next/font/google';

/**
 * Self-hosted fonts via next/font.
 *
 * This replaces a raw <link> to fonts.googleapis.com in the document head,
 * which was a render-blocking cross-origin request with no preconnect and
 * therefore one of the larger contributors to LCP. next/font downloads the
 * files at build time, serves them from this origin, and inlines the @font-face
 * rules, removing both round trips.
 *
 * The CSS variables are consumed by the Tailwind @theme block in globals.css,
 * so `font-serif` and `font-sans` keep working unchanged across the app.
 */
export const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
  display: 'swap',
  preload: true,
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});
