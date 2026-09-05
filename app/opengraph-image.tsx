import { ImageResponse } from 'next/og';

import { OgCard, OG_CONTENT_TYPE, OG_SIZE } from '../lib/seo/og';
import { siteConfig } from '../lib/seo/site.config';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

/**
 * Site-wide default Open Graph card.
 *
 * Pages that do not define their own opengraph-image inherit this one, because
 * `buildMetadata` deliberately leaves `openGraph.images` unset unless a caller
 * passes explicit images.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${siteConfig.contact.address.addressLocality}, ${siteConfig.serviceAreaName}`}
        title={siteConfig.name}
        subtitle={siteConfig.tagline}
      />
    ),
    { ...size }
  );
}
