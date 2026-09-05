import React from 'react';

/**
 * Renders a JSON-LD graph.
 *
 * Server component — the script lands in the initial HTML, which is what
 * crawlers and generative engines read. Rendering it inside the page body is
 * valid; it does not need to be in <head>.
 *
 * `<` is escaped so a stray character in user-supplied content (an artist bio,
 * a portfolio title) can never break out of the script element.
 */
export function JsonLd({ data }: { data: object | undefined | null }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\u003c'),
      }}
    />
  );
}

export default JsonLd;
