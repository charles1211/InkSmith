import { ImageResponse } from 'next/og';

import { getService, services } from '../../../content/services';
import { OgCard, OG_CONTENT_TYPE, OG_SIZE } from '../../../lib/seo/og';
import { siteConfig } from '../../../lib/seo/site.config';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `Services at ${siteConfig.name}`;

export function generateStaticParams() {
  return services.map((service) => ({ service: service.slug }));
}

/** Per-service card, so a shared service link previews as that service. */
export default async function Image({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service: slug } = await params;
  const service = getService(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${siteConfig.contact.address.addressLocality}, ${siteConfig.serviceAreaName}`}
        title={service?.name ?? siteConfig.name}
        subtitle={service?.tagline ?? siteConfig.tagline}
      />
    ),
    { ...size }
  );
}
