import React from 'react';

import { siteConfig } from './site.config';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Shared Open Graph card.
 *
 * The project ships no logo asset, so the card is composed from siteConfig's
 * brand tokens and wordmark. A different business gets a different-looking
 * card by editing site.config.ts alone.
 *
 * Note on typography: ImageResponse renders through Satori, which cannot reach
 * a webfont without a font buffer being passed explicitly. Cinzel is therefore
 * unavailable here and the default sans is used. At the size these cards are
 * actually viewed, the letterspaced-caps treatment carries the brand well
 * enough; bundling a .ttf under public/fonts and passing it via `options.fonts`
 * is the upgrade path if that stops being true.
 *
 * Satori supports a subset of CSS — flexbox only, and every element with more
 * than one child needs an explicit `display: flex`.
 */
export function OgCard({
  title,
  eyebrow,
  subtitle,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
}) {
  const { brand } = siteConfig;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: brand.background,
        padding: 64,
        border: `2px solid ${brand.accent}33`,
      }}
    >
      {/* Header: wordmark + accent rule */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 14,
            color: brand.accent,
          }}
        >
          {siteConfig.wordmark}
        </div>
        <div
          style={{
            display: 'flex',
            flex: 1,
            height: 1,
            marginLeft: 28,
            background: `${brand.accent}55`,
          }}
        />
      </div>

      {/* Body: eyebrow, title, subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow && (
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 8,
              textTransform: 'uppercase',
              color: brand.accent,
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: title.length > 44 ? 62 : 78,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: brand.foreground,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: '#a3a3a3',
              marginTop: 24,
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Footer: real NAP so the card carries the entity even as an image */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 22,
          color: '#737373',
        }}
      >
        <div style={{ display: 'flex' }}>
          {siteConfig.contact.address.addressLocality}, {siteConfig.serviceAreaName}
        </div>
        <div
          style={{
            display: 'flex',
            width: 6,
            height: 6,
            borderRadius: 3,
            margin: '0 18px',
            background: brand.accent,
          }}
        />
        <div style={{ display: 'flex' }}>{siteConfig.contact.phone}</div>
      </div>
    </div>
  );
}

/** Square monogram used for the favicon and the Apple touch icon. */
export function OgIcon({ size }: { size: number }) {
  const { brand } = siteConfig;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: brand.background,
        color: brand.accent,
        fontSize: Math.round(size * 0.5),
        fontWeight: 800,
        letterSpacing: Math.max(1, Math.round(size * 0.02)),
        borderRadius: Math.round(size * 0.16),
      }}
    >
      {siteConfig.monogram}
    </div>
  );
}
