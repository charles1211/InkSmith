import React from 'react';
import type { Metadata } from 'next';

import { buildNoIndexMetadata } from '../../lib/seo/metadata';

/**
 * A server layout exists purely to carry `noindex` metadata: the page itself is
 * a client component, and a 'use client' module cannot export `metadata`.
 * This route is also disallowed in robots.txt and covered by an
 * `X-Robots-Tag` header from next.config.ts.
 */
export const metadata: Metadata = buildNoIndexMetadata('New Password', '/reset-password');

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
