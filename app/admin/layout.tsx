import React from 'react';
import type { Metadata } from 'next';

import { buildNoIndexMetadata } from '../../lib/seo/metadata';
import AdminShell from './AdminShell';

/**
 * A server layout wrapping the client admin shell.
 *
 * The shell itself must stay a client component (it uses usePathname and the
 * auth context), and a 'use client' module cannot export `metadata`. Splitting
 * the two lets this one export cascade `noindex` across /admin and all of its
 * children from a single file.
 *
 * The admin routes are additionally blocked in robots.txt and covered by an
 * `X-Robots-Tag` response header from next.config.ts, because they render
 * their real content client-side after an auth check.
 */
export const metadata: Metadata = buildNoIndexMetadata('Admin', '/admin');

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
