import type { MetadataRoute } from 'next';

import { PRIVATE_PATHS } from '../lib/seo/routes';
import { getSiteUrl } from '../lib/seo/url';

/**
 * Preview deployments must never be indexed, or every branch build becomes a
 * duplicate of the production site competing with it in search results.
 * Production is detected via Vercel's own env var, with an explicit override
 * for self-hosted or non-Vercel production environments.
 */
function isProductionDeployment(): boolean {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true') return true;
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'false') return false;
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === 'production';
  return process.env.NODE_ENV === 'production';
}

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  if (!isProductionDeployment()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  const disallow = [
    ...PRIVATE_PATHS,
    ...PRIVATE_PATHS.map((path) => `${path}/`),
    '/api/',
    '/auth/',
  ];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      // AI and answer-engine crawlers are allowed deliberately. Being read by
      // them is the entire point of the structured, answer-first content on
      // this site — do not "harden" this into a block without a business
      // reason. They are listed explicitly so the intent is unambiguous.
      { userAgent: 'GPTBot', allow: '/', disallow },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow },
      { userAgent: 'ChatGPT-User', allow: '/', disallow },
      { userAgent: 'ClaudeBot', allow: '/', disallow },
      { userAgent: 'Claude-User', allow: '/', disallow },
      { userAgent: 'PerplexityBot', allow: '/', disallow },
      { userAgent: 'Google-Extended', allow: '/', disallow },
      { userAgent: 'Applebot-Extended', allow: '/', disallow },
      { userAgent: 'CCBot', allow: '/', disallow },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
