import { ImageResponse } from 'next/og';

import { getServiceArea, serviceAreas } from '../../../content/service-areas';
import { OgCard, OG_CONTENT_TYPE, OG_SIZE } from '../../../lib/seo/og';
import { siteConfig } from '../../../lib/seo/site.config';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${siteConfig.name} service areas`;

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ area: area.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;
  const area = getServiceArea(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow={area?.designation ?? siteConfig.serviceAreaName}
        title={
          area
            ? `Tattoo & Piercing${area.isStudioLocation ? ' in ' : ' for '}${area.name}`
            : siteConfig.name
        }
        subtitle={siteConfig.tagline}
      />
    ),
    { ...size }
  );
}
