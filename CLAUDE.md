# InkSmith Studios

## Project Overview
Next.js 15 tattoo studio management app with admin panel, public artist roster, booking, and gallery. Uses Supabase for auth, database, and storage.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (auth, postgres, storage)
- **Icons**: lucide-react
- **AI**: @google/genai

## Dev Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Lint
```

## Project Structure
```
app/
  admin/page.tsx      # Admin panel (artists, bookings, gallery, settings)
  artists/page.tsx    # Public artist roster (Server Component, fetches from Supabase)
  book/               # Booking flow
  page.tsx            # Home page
components/
  Navbar.tsx
  ProtectedRoute.tsx
context/
  AuthContext.tsx
lib/
  supabase/
    client.ts         # Browser Supabase client (createBrowserClient)
    server.ts         # Server Supabase client (createServerClient)
types.ts              # Artist, TattooStyle, BookingFormData interfaces
middleware.ts         # Auth middleware
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

## Key Patterns
- Artist images upload to Supabase Storage bucket `artist-images`; public URL stored in `image_url` column
- Admin page is a `'use client'` component; artists page is an async Server Component
- DB column names are snake_case (`image_url`, `instagram_handle`); mapped to camelCase (`imageUrl`, `instagramHandle`) in TypeScript
- Tailwind uses `ink-950`, `ink-900`, `ink-accent` custom colors defined in config
