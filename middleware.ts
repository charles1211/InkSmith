import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth session — wrapped in try/catch so a network failure
  // (e.g. Supabase project paused, missing env vars, transient error)
  // never crashes the middleware and blocks every page request.
  try {
    await supabase.auth.getUser();
  } catch {
    // Supabase unreachable — allow the request through without a session.
  }

  return supabaseResponse;
}

/**
 * A positive matcher, listing only the routes that actually need a session.
 *
 * This middleware refreshes the Supabase session cookie; it does not guard
 * anything, since every auth check in this app happens client-side. Running it
 * on public pages therefore bought nothing and cost a Supabase round trip on
 * every request — including robots.txt, sitemap.xml, the web manifest and the
 * generated icon and OG images. The browser client refreshes tokens on its own
 * while a tab is open, so restricting it here is safe.
 *
 * If a server-side auth check is ever added to a public route, this matcher
 * must be revisited.
 */
export const config = {
  matcher: [
    '/admin/:path*',
    '/my-bookings',
    '/login',
    '/signup',
    '/reset-password',
    '/auth/:path*',
  ],
};
