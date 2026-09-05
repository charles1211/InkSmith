# InkSmith Studios

## Project Overview
Next.js 15 site and booking system for a custom tattoo and body piercing studio
at 39 King St, Hamilton, Bermuda. Public marketing and booking pages plus an
authenticated admin panel for artists, bookings and gallery imagery. Supabase
provides auth, database and storage.

## Tech Stack
- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 — custom colours (`ink-950`, `ink-900`, `ink-800`,
  `ink-accent`) and fonts are declared in the `@theme` block in
  `app/globals.css`. There is no `tailwind.config` file.
- **Fonts**: `next/font` (Cinzel, Inter) wired to the `@theme` CSS variables
- **Backend**: Supabase (auth, postgres, storage)
- **Email**: Nodemailer over Gmail
- **Spam protection**: reCAPTCHA v3
- **Icons**: lucide-react

## Dev Commands
```bash
npm run dev             # Start dev server
npm run build           # Production build
npm run lint            # Lint
npm run typecheck       # tsc --noEmit
npm run check:content   # Validate content/ data and anti-thin-content floors
npm run check:seo       # Runtime SEO assertions (needs `npm run start` running)
npm run optimize:images # Re-encode public/images to WebP
```

## Project Structure
```
app/
  page.tsx              # Server page: fetches, emits JSON-LD, renders HomeClient
  HomeClient.tsx        # Home page UI (client component)
  about/ faq/           # Static content pages
  services/[service]/   # Generated from content/services.ts
  locations/[area]/     # Generated from content/service-areas.ts
  aftercare/{tattoo,piercing}/  # Generated from content/aftercare.ts
  artists/              # Roster (server) + [slug] profiles
  portfolio/            # page.tsx (server) + PortfolioClient.tsx
  book/                 # page.tsx (server) + BookClient.tsx + ArtistParam.tsx
  admin/                # layout.tsx (server, noindex) + AdminShell.tsx (client)
  api/                  # Booking, contact and auth route handlers
  robots.ts sitemap.ts manifest.ts icon.tsx opengraph-image.tsx
components/
  seo/                  # JsonLd, Breadcrumbs, AnswerBlock, KeyFacts, FaqSection
  aftercare/            # Data-driven guide renderer
  admin/                # Admin panel sections
  Navbar.tsx Footer.tsx ProtectedRoute.tsx ScrollToTop.tsx
content/                # Business copy as typed data. No JSX, no app/ imports.
lib/
  seo/                  # site.config.ts, metadata.ts, schema/ builders
  data/public-content.ts # Fail-soft server reads for public pages
  supabase/             # client.ts (browser), server.ts (cookies), public.ts
  phone.ts recaptcha.ts
scripts/                # check-content, check-seo, optimize-images
types.ts middleware.ts
```

## Supabase Setup (run once in SQL Editor)
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

Also in use: tables `bookings`, `portfolio_images`, `studio_images`,
`piercing_images`, `users`; buckets `portfolio-images`, `studio-images`,
`piercing-images`, `booking-references`.

## Key Patterns

### Rendering
- Public pages are thin Server Components that fetch data and pass it into a
  client component as props (`page.tsx` → `HomeClient.tsx`). Never move a
  public page's data fetch into a `useEffect` — the content then exists only
  after hydration and is invisible to crawlers.
- `lib/supabase/server.ts` awaits `cookies()`, which forces dynamic rendering.
  Public pages therefore read through `lib/supabase/public.ts` instead, which is
  cookie-free and allows static generation with ISR.
- All reads in `lib/data/public-content.ts` are fail-soft: they return
  `{ data, failed }`, never throw, and time out at 6s, so a paused free-tier
  database cannot break a build. Client components keep their original fetch as
  a fallback, enabled only when `failed` is true.

### SEO
- Business facts live in `lib/seo/site.config.ts` and `content/` only. Swapping
  those two repoints the whole site at a different business.
- Every page builds metadata with `buildMetadata()`; canonicals derive from the
  `path` argument alone. Noindexed pages get no canonical.
- JSON-LD goes through `compact()`, which strips unset fields, so an unverified
  fact is never emitted. **Never invent ratings, prices or coordinates** —
  `check:seo` fails the build if they appear.
- Location pages must carry genuinely distinct content; `check:content`
  enforces length and uniqueness floors.

### Data
- DB columns are snake_case (`image_url`, `instagram_handle`); mapped to
  camelCase (`imageUrl`, `instagramHandle`) in TypeScript.
- Artist images upload to the `artist-images` bucket; the public URL is stored
  in `image_url`.
- Phone numbers are stored raw while typing and normalised to E.164 once, at
  submit, by `lib/phone.ts`. Both the form and the API validate through it.
