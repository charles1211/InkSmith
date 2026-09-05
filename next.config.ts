import type { NextConfig } from 'next';

/** Private, utility and auth routes. Kept in sync with lib/seo/routes.ts. */
const NOINDEX_PATHS = [
  '/admin',
  '/admin/:path*',
  '/my-bookings',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

const NOINDEX_HEADER = {
  key: 'X-Robots-Tag',
  value: 'noindex, nofollow, noarchive',
};

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback — both are far smaller than the source
    // PNG/JPEG assets this site ships.
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [
      {
        // Wildcard rather than the project ref, so this survives a project
        // migration. Scoped to the public storage prefix so the optimizer can
        // never be used as an open proxy.
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  async redirects() {
    return [
      // The aftercare guides used to live behind a `?type=` query param on a
      // single route. They are now real pages. `has` matching leaves the bare
      // /aftercare hub untouched, so it still serves its own content.
      {
        source: '/aftercare',
        has: [{ type: 'query', key: 'type', value: 'tattoo' }],
        destination: '/aftercare/tattoo',
        permanent: true,
      },
      {
        source: '/aftercare',
        has: [{ type: 'query', key: 'type', value: 'piercing' }],
        destination: '/aftercare/piercing',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      // Belt and braces alongside robots.txt and the per-route `noindex`
      // metadata. These pages render their real content client-side after an
      // auth check, so a crawler that ignored the meta tag would otherwise
      // index an empty shell. A response header cannot be missed that way.
      ...NOINDEX_PATHS.map((source) => ({
        source,
        headers: [NOINDEX_HEADER],
      })),
    ];
  },
};

export default nextConfig;
