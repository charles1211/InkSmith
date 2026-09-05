import type { MetadataRoute } from 'next';

import { siteConfig } from '../lib/seo/site.config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: siteConfig.brand.background,
    theme_color: siteConfig.brand.themeColor,
    // Both are generated at request time by app/icon.tsx and app/apple-icon.tsx.
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
