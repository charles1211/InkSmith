/**
 * Runtime SEO assertions against a running server.
 *
 * Usage:  npm run build && npm run start   (in one shell)
 *         npm run check:seo                (in another)
 *
 * These are the checks only a rendered page can answer: is the canonical
 * absolute and self-referential, is there exactly one h1, did any fabricated
 * value leak into the JSON-LD, and is the content actually server-rendered.
 */

const BASE = process.env.CHECK_BASE_URL || 'http://localhost:3000';

const PUBLIC_PAGES = [
  '/',
  '/about',
  '/faq',
  '/services',
  '/services/tattoo',
  '/services/piercing',
  '/services/consultation',
  '/locations',
  '/locations/hamilton',
  '/locations/paget',
  '/locations/sandys',
  '/artists',
  '/portfolio',
  '/book',
  '/contact',
  '/aftercare',
  '/aftercare/tattoo',
  '/aftercare/piercing',
];

const PRIVATE_PAGES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/my-bookings',
  '/admin',
];

/** The verified place-marker coordinates from lib/seo/site.config.ts. */
const EXPECTED_GEO = '"latitude":32.2952982,"longitude":-64.778826';

const errors = [];
const notes = [];
const fail = (m) => errors.push(m);

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  const body = res.status < 400 ? await res.text() : '';
  return { res, body };
}

function extractJsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return blocks.map((m) => JSON.parse(m[1].replace(/\u003c/g, '<')));
}

console.log(`checking ${BASE}\n`);

const titles = new Map();
const descriptions = new Map();

for (const path of PUBLIC_PAGES) {
  const { res, body } = await get(path);
  if (res.status !== 200) { fail(`${path}: HTTP ${res.status}`); continue; }

  const title = body.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) fail(`${path}: no <title>`);
  else {
    if (titles.has(title)) fail(`${path}: duplicate title, same as ${titles.get(title)}`);
    titles.set(title, path);
  }

  const description = body.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!description) fail(`${path}: no meta description`);
  else {
    if (descriptions.has(description)) fail(`${path}: duplicate description, same as ${descriptions.get(description)}`);
    descriptions.set(description, path);
  }

  const canonicals = [...body.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
  if (canonicals.length !== 1) fail(`${path}: expected 1 canonical, found ${canonicals.length}`);
  else {
    const canonical = canonicals[0];
    if (!canonical.startsWith('http')) fail(`${path}: canonical is not absolute (${canonical})`);
    // Compare by pathname: Next normalises the root to a bare origin.
    const canonicalPathname = new URL(canonical).pathname;
    if (canonicalPathname !== path) fail(`${path}: canonical points to ${canonicalPathname}`);
  }

  const h1Count = (body.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) fail(`${path}: expected exactly 1 <h1>, found ${h1Count}`);

  if (/noindex/i.test(body)) fail(`${path}: PUBLIC page carries noindex`);
  if (!/property="og:title"/.test(body)) fail(`${path}: no Open Graph title`);
  if (!/name="twitter:card"/.test(body)) fail(`${path}: no Twitter card`);

  let graphs;
  try { graphs = extractJsonLd(body); }
  catch (e) { fail(`${path}: JSON-LD does not parse — ${e.message}`); continue; }
  if (graphs.length === 0) { fail(`${path}: no JSON-LD`); continue; }

  const serialised = JSON.stringify(graphs);
  // The studio publishes no ratings or prices. If either appears, a builder has
  // started inventing values.
  for (const banned of ['aggregateRating', 'priceRange', 'reviewCount']) {
    if (serialised.includes(banned)) fail(`${path}: fabricated field "${banned}" in JSON-LD`);
  }
  // Coordinates ARE configured, from the studio's Google Business Profile — so
  // rather than banning geo, pin it. Anything else means someone approximated
  // a position from the street address, which is the failure mode that matters.
  if (serialised.includes('"geo"') && !serialised.includes(EXPECTED_GEO)) {
    fail(`${path}: geo coordinates do not match the configured location`);
  }
  if (/:(null|""|\[\]|\{\})/.test(serialised)) fail(`${path}: empty value leaked into JSON-LD`);

  const types = [...new Set(graphs.flatMap((g) => (g['@graph'] || []).map((n) => n['@type'])).flat())];
  notes.push(`${path.padEnd(26)} ${String(title).slice(0, 42).padEnd(44)} ${types.join(', ')}`);
}

/* ── private pages must be noindexed ── */
for (const path of PRIVATE_PAGES) {
  const { res, body } = await get(path);
  if (res.status !== 200) { fail(`${path}: HTTP ${res.status}`); continue; }
  const header = res.headers.get('x-robots-tag') || '';
  if (!/noindex/i.test(body) && !header.includes('noindex')) {
    fail(`${path}: PRIVATE page is indexable`);
  }
}

/* ── server-rendered content, which proves the client/server split worked ── */
{
  const { body } = await get('/portfolio');
  const count = (body.match(/supabase\.co\/storage/g) || []).length;
  notes.push(
    count === 0
      ? '/portfolio: no gallery images in HTML (database empty or unreachable)'
      : `/portfolio: ${count} image URLs server-rendered`
  );
}

/* ── robots.txt ── */
{
  const { res, body } = await get('/robots.txt');
  if (res.status !== 200) fail(`/robots.txt: HTTP ${res.status}`);
  else {
    if (!body.includes('Sitemap:')) fail('/robots.txt: no Sitemap directive');
    for (const p of ['/admin', '/my-bookings', '/login']) {
      if (!body.includes(`Disallow: ${p}`)) fail(`/robots.txt: ${p} not disallowed`);
    }
    if (!body.includes('GPTBot')) fail('/robots.txt: AI crawlers not explicitly allowed');
  }
}

/* ── sitemap: no disallowed URLs, and every entry resolves ── */
{
  const { res, body } = await get('/sitemap.xml');
  if (res.status !== 200) fail(`/sitemap.xml: HTTP ${res.status}`);
  else {
    const urls = [...body.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
    notes.push(`/sitemap.xml: ${urls.length} URLs`);
    for (const url of urls) {
      const path = new URL(url).pathname;
      if (PRIVATE_PAGES.some((p) => path === p || path.startsWith(`${p}/`))) {
        fail(`/sitemap.xml: contains disallowed URL ${path}`);
      }
    }
    const statuses = await Promise.all(
      urls.map(async (url) => {
        const path = new URL(url).pathname;
        const r = await fetch(`${BASE}${path}`, { redirect: 'manual' });
        return { path, status: r.status };
      })
    );
    for (const { path, status } of statuses) {
      if (status !== 200) fail(`/sitemap.xml: ${path} returns ${status}`);
    }
  }
}

/* ── generated icons, OG images and the web manifest ── */
for (const path of ['/manifest.webmanifest', '/icon', '/apple-icon', '/opengraph-image', '/twitter-image']) {
  const res = await fetch(`${BASE}${path}`);
  if (res.status !== 200) fail(`${path}: HTTP ${res.status}`);
}

/* ── the ?type= migration ── */
for (const [from, to] of [
  ['/aftercare?type=tattoo', '/aftercare/tattoo'],
  ['/aftercare?type=piercing', '/aftercare/piercing'],
]) {
  const res = await fetch(`${BASE}${from}`, { redirect: 'manual' });
  if (res.status !== 308 && res.status !== 301) {
    fail(`${from}: expected a permanent redirect, got ${res.status}`);
  }
  const location = res.headers.get('location') || '';
  if (!location.includes(to)) fail(`${from}: redirects to ${location}, expected ${to}`);
}
{
  const res = await fetch(`${BASE}/aftercare`, { redirect: 'manual' });
  if (res.status !== 200) fail(`/aftercare: hub should be 200, got ${res.status}`);
}

/* ── report ── */
console.log(notes.join('\n'));
console.log('');
if (errors.length) {
  for (const e of errors) console.error(`  FAIL  ${e}`);
  console.error(`\ncheck-seo: ${errors.length} error(s) across ${PUBLIC_PAGES.length} public pages.`);
  process.exit(1);
}
console.log(
  `check-seo: OK — ${PUBLIC_PAGES.length} public pages, ${PRIVATE_PAGES.length} private pages verified.`
);
