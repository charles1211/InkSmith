# InkSmith Studios

Website and booking system for InkSmith Studios, a custom tattoo and body
piercing studio at 39 King St, Hamilton, Bermuda.

Public visitors browse the artist roster and portfolio, read aftercare guides,
and request appointments through a three-step booking form. Studio staff manage
artists, bookings and gallery imagery through an authenticated admin panel.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 — configured in `app/globals.css` via `@theme`, no `tailwind.config` file |
| Data, auth, storage | Supabase |
| Transactional email | Nodemailer over Gmail |
| Spam protection | reCAPTCHA v3 |
| Icons | lucide-react |

## Running locally

Requires Node.js 20 or newer.

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Every variable in `.env.local.example` is required except the two SEO ones,
which have working fallbacks. reCAPTCHA verification is skipped automatically
when `NODE_ENV=development`, so a local run works without valid keys — but the
Supabase, Gmail and site URL values still matter.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve a production build |
| `npm run lint` | Lint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:content` | Validates the `content/` data: FAQ cross-references, meta lengths, and the anti-thin-content floors on location pages |
| `npm run check:seo` | Runtime SEO assertions against a running server — titles, canonicals, headings, JSON-LD, robots, sitemap, redirects |
| `npm run optimize:images` | Re-encodes `public/images` to WebP and archives the originals to `assets-src/` |

`check:seo` needs a server running, so the full sequence is:

```bash
npm run build
npm run start        # then, in a second shell:
npm run check:seo
```

## Structure

```
app/
  page.tsx                 Server page; passes data into HomeClient
  HomeClient.tsx           Home page UI (client)
  about/ faq/              Static content pages
  services/[service]/      Service pages, generated from content/services.ts
  locations/[area]/        Service-area pages, from content/service-areas.ts
  aftercare/{tattoo,piercing}/   Aftercare guides, from content/aftercare.ts
  artists/ artists/[slug]/ Roster and individual artist profiles
  portfolio/ book/         Gallery and the booking flow
  admin/                   Authenticated studio management
  api/                     Route handlers: booking, contact, auth
  robots.ts sitemap.ts manifest.ts icon.tsx opengraph-image.tsx
components/
  seo/                     JsonLd, Breadcrumbs, AnswerBlock, KeyFacts, FaqSection
  aftercare/               Data-driven aftercare guide renderer
  admin/                   Admin panel sections
content/                   Business copy as typed data — services, areas, FAQs,
                           aftercare, policies. No JSX, no imports from app/.
lib/
  seo/                     site.config.ts, metadata builder, JSON-LD builders
  data/public-content.ts   Fail-soft server reads for public pages
  supabase/                Browser, server (cookie-bound) and public clients
  phone.ts                 Phone normalisation shared by form and API
scripts/                   Content and SEO validation, image optimisation
```

## Working on SEO

Business facts live in exactly two places: `lib/seo/site.config.ts` for identity,
address, hours and social profiles, and `content/` for page copy. Nothing else
hard-codes them, so pointing this site at a different business means editing
those and nothing more.

Two rules the tooling enforces:

- **Never invent facts.** Unset optional config fields are stripped from JSON-LD
  by `compact()`. `check:seo` fails the build if `aggregateRating`, `priceRange`
  or `reviewCount` ever appear, and pins `geo` to the verified coordinates.
- **Location pages must be genuinely distinct.** `check:content` enforces a
  minimum length and unique FAQs per area, because thin location pages read as
  doorway pages and hurt more than they help.

## Supabase setup

Run once in the SQL editor:

```sql
create table artists (
  id text primary key,
  name text not null,
  specialties text[] not null default '{}',
  bio text not null default '',
  image_url text not null default '',
  instagram_handle text not null default '',
  highlights text[] not null default '{}',
  created_at timestamptz default now()
);

insert into storage.buckets (id, name, public)
values ('artist-images', 'artist-images', true);

create policy "Public read" on storage.objects for select using (bucket_id = 'artist-images');
create policy "Auth upload" on storage.objects for insert with check (bucket_id = 'artist-images');
```

The app also uses the tables `bookings`, `portfolio_images`, `studio_images`,
`piercing_images` and `users`, and the storage buckets `portfolio-images`,
`studio-images`, `piercing-images` and `booking-references`.
