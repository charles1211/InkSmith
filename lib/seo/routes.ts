import type { MetadataRoute } from 'next';

/**
 * The static route registry.
 *
 * One list, three consumers: `app/sitemap.ts`, the breadcrumb label resolver in
 * `lib/seo/breadcrumbs.ts`, and the validation script. Keeping them together is
 * what stops the sitemap and the breadcrumbs from drifting apart.
 *
 * Dynamic routes (`/services/[service]`, `/locations/[area]`, `/artists/[slug]`)
 * are NOT listed here — they are enumerated from `content/` and the database.
 */

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

export interface StaticRoute {
  path: string;
  /** Breadcrumb / nav label. */
  label: string;
  /** False for private, utility, or duplicate pages. */
  inSitemap: boolean;
  /** True for anything that must carry a robots `noindex`. */
  noIndex?: boolean;
  changeFrequency?: ChangeFrequency;
  priority?: number;
}

export const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', label: 'Home', inSitemap: true, changeFrequency: 'weekly', priority: 1.0 },

  { path: '/services', label: 'Services', inSitemap: true, changeFrequency: 'monthly', priority: 0.9 },
  { path: '/book', label: 'Book an Appointment', inSitemap: true, changeFrequency: 'monthly', priority: 0.9 },

  { path: '/artists', label: 'Artists', inSitemap: true, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/portfolio', label: 'Portfolio', inSitemap: true, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/locations', label: 'Areas We Serve', inSitemap: true, changeFrequency: 'monthly', priority: 0.8 },

  { path: '/aftercare', label: 'Aftercare', inSitemap: true, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/aftercare/tattoo', label: 'Tattoo Aftercare', inSitemap: true, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/aftercare/piercing', label: 'Piercing Aftercare', inSitemap: true, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', label: 'FAQ', inSitemap: true, changeFrequency: 'monthly', priority: 0.7 },

  { path: '/about', label: 'About', inSitemap: true, changeFrequency: 'yearly', priority: 0.6 },
  { path: '/contact', label: 'Contact', inSitemap: true, changeFrequency: 'yearly', priority: 0.6 },

  /* Private, utility and auth routes — excluded from the sitemap and noindexed. */
  { path: '/login', label: 'Client Login', inSitemap: false, noIndex: true },
  { path: '/signup', label: 'Create Account', inSitemap: false, noIndex: true },
  { path: '/forgot-password', label: 'Reset Password', inSitemap: false, noIndex: true },
  { path: '/reset-password', label: 'New Password', inSitemap: false, noIndex: true },
  { path: '/my-bookings', label: 'My Bookings', inSitemap: false, noIndex: true },
  { path: '/admin', label: 'Admin', inSitemap: false, noIndex: true },
];

/** Paths blocked in robots.txt and covered by an X-Robots-Tag header. */
export const PRIVATE_PATHS: string[] = [
  '/admin',
  '/my-bookings',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

export function getStaticRoute(path: string): StaticRoute | undefined {
  return STATIC_ROUTES.find((route) => route.path === path);
}

export function getRouteLabel(path: string, fallback?: string): string {
  return getStaticRoute(path)?.label ?? fallback ?? path;
}

export function sitemapRoutes(): StaticRoute[] {
  return STATIC_ROUTES.filter((route) => route.inSitemap);
}
