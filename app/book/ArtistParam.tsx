'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Reads the `?artistId=` deep link and hands it to the booking form.
 *
 * This exists as its own component purely to keep the Suspense boundary tiny.
 * `useSearchParams` forces everything inside its boundary to be skipped during
 * static rendering, so calling it directly in the booking form would have
 * dropped the entire form — including its h1 — out of the prerendered HTML.
 * Isolated here, it renders nothing and costs nothing.
 */
export function ArtistParam({ onResolve }: { onResolve: (artistId: string) => void }) {
  const searchParams = useSearchParams();
  const artistId = searchParams.get('artistId');

  useEffect(() => {
    if (artistId) onResolve(artistId);
  }, [artistId, onResolve]);

  return null;
}

export default ArtistParam;
