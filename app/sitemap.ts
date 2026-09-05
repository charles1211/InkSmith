import type { MetadataRoute } from 'next';

import { aftercareGuides } from '../content/aftercare';
import { services } from '../content/services';
import { serviceAreas } from '../content/service-areas';
import { getArtists } from '../lib/data/public-content';
import { sitemapRoutes } from '../lib/seo/routes';
import { withUniqueSlugs } from '../lib/seo/slug';
import { absoluteUrl } from '../lib/seo/url';

export const revalidate = 3600;

/**
 * Only indexable, canonical URLs appear here.
 *
 * Everything except the artist entries comes from local TypeScript data, so
 * the sitemap cannot be emptied by a database outage. The artist lookup is
 * fail-soft and additionally wrapped, because a broken sitemap is worse than
 * an incomplete one.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = sitemapRoutes().map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const areaEntries: MetadataRoute.Sitemap = serviceAreas.map((area) => ({
    url: absoluteUrl(`/locations/${area.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: area.isStudioLocation ? 0.8 : 0.7,
  }));

  let artistEntries: MetadataRoute.Sitemap = [];
  try {
    const { data, failed } = await getArtists();
    if (!failed) {
      artistEntries = withUniqueSlugs(data).map(({ slug }) => ({
        url: absoluteUrl(`/artists/${slug}`),
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('[sitemap] artist entries skipped:', error);
  }

  // Aftercare leaves are already in the static registry; this guards against
  // a guide being added to content/ without a matching route entry.
  const knownPaths = new Set(staticEntries.map((entry) => entry.url));
  const aftercareEntries: MetadataRoute.Sitemap = aftercareGuides
    .map((guide) => absoluteUrl(`/aftercare/${guide.slug}`))
    .filter((url) => !knownPaths.has(url))
    .map((url) => ({
      url,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...areaEntries,
    ...aftercareEntries,
    ...artistEntries,
  ];
}
