import { ImageResponse } from 'next/og';

import { OgIcon } from '../lib/seo/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(<OgIcon size={size.width} />, { ...size });
}
