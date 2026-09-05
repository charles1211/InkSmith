import { ImageResponse } from 'next/og';

import { OgIcon } from '../lib/seo/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** Favicon, generated from the brand tokens — the project ships no logo file. */
export default function Icon() {
  return new ImageResponse(<OgIcon size={size.width} />, { ...size });
}
