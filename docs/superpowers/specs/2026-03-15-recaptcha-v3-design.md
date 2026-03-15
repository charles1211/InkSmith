# reCAPTCHA v3 Integration Design

**Date:** 2026-03-15
**Status:** Approved

---

## Overview

Add Google reCAPTCHA v3 to all four public-facing forms in InkSmith Studios to block automated spam submissions. reCAPTCHA v3 is invisible — real users are never interrupted. Submissions scoring below 0.5 are hard-blocked at the API layer.

---

## Scope

Forms protected:
1. **Booking form** (`/book`) — multi-step, submits to `/api/book`
2. **Contact form** (`/contact`) — submits to `/api/contact`
3. **Login form** (`/login`) — currently calls `supabase.auth.signInWithPassword` via `AuthContext`
4. **Signup form** (`/signup`) — currently calls `supabase.auth.signUp` via `AuthContext`

---

## Architecture

```
Client (form submit)
  └─ useRecaptcha hook → grecaptcha.execute(siteKey, {action}) → token
        ├─ Booking/Contact: token appended to POST body of existing API route
        │     └─ API route: verifyRecaptcha(token, expectedAction) → score ≥ 0.5 → process
        │                                                           → score < 0.5 → 403
        └─ Login/Signup: token + credentials sent to NEW server-side API routes
              └─ /api/auth/login  — verifyRecaptcha → supabase admin signIn  → return session
              └─ /api/auth/signup — verifyRecaptcha → supabase admin signUp  → return user
```

### Why login/signup use server-side wrappers (not client-side Supabase calls)

If reCAPTCHA is only verified in a preflight request and the Supabase auth call is made separately from the browser, a bot can skip the preflight entirely and POST credentials directly to Supabase (whose URL and anon key are public by design). To close this gap, the login and signup flows are converted to thin server-side wrappers that verify the token and perform the Supabase auth call in the same request, so the captcha check cannot be bypassed.

---

## New Files

### `hooks/useRecaptcha.ts`

- Dynamically injects the reCAPTCHA v3 script (`https://www.google.com/recaptcha/api.js?render=SITE_KEY`) into `<head>` on first call. Skips injection if the script tag is already present.
- Script loading race condition: the hook stores a module-level `Promise<void>` that resolves on the script's `onload` event. If the script is already loaded, the promise resolves immediately. `executeRecaptcha` awaits this promise before calling `grecaptcha.ready()`.
- Returns a single function: `executeRecaptcha(action: string): Promise<string>` that resolves to a one-time token.
- Uses `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` from env.

### `lib/recaptcha.ts`

- Server-only utility. Must include `import 'server-only'` at the top to prevent accidental client bundle inclusion and exposure of `RECAPTCHA_SECRET_KEY`.
- Exports `verifyRecaptcha(token: string, expectedAction: string): Promise<{ success: boolean; score: number }>`.
- POSTs to `https://www.google.com/recaptcha/api/siteverify` with `RECAPTCHA_SECRET_KEY` and the token.
- Validates that Google's `action` field in the response matches `expectedAction`. Mismatches are treated as failures.
- Returns `{ success: false, score: 0 }` on network error, Google failure, or action mismatch — fail-safe (block on any error).
- Does not throw; callers receive a plain result object.

### `app/api/auth/login/route.ts`

- `POST { email, password, recaptchaToken }` — server-side login wrapper.
- Calls `verifyRecaptcha(recaptchaToken, 'login')` first.
- On pass: uses the Supabase server client (`createClient` from `lib/supabase/server.ts`) to call `supabase.auth.signInWithPassword({ email, password })`.
- Returns `200 { user, session }` on success, `403` on captcha failure, `401` on auth failure.

### `app/api/auth/signup/route.ts`

- `POST { name, email, password, recaptchaToken }` — server-side signup wrapper.
- Calls `verifyRecaptcha(recaptchaToken, 'signup')` first.
- On pass: uses the Supabase server client to call `supabase.auth.signUp({ email, password, options: { data: { name } } })`.
- Returns `200 { user }` on success, `403` on captcha failure, `400` on signup failure.

---

## Modified Files

### `app/api/book/route.ts`

- Expects `recaptchaToken` in the multipart/JSON body (added by the client).
- Calls `verifyRecaptcha(recaptchaToken, 'booking')` at the top of the handler, before any DB writes or email sends.
- Returns `403 { error: "Security check failed. Please refresh and try again." }` if score < 0.5, action mismatch, or token missing.

### `app/api/contact/route.ts`

- Same pattern as `/api/book`. Expects `recaptchaToken` in the JSON body.
- Calls `verifyRecaptcha(recaptchaToken, 'contact')` before sending email.

### `app/book/page.tsx`

- Calls `useRecaptcha()` hook.
- On the final step submit (just before the `fetch('/api/book', ...)` call), executes `executeRecaptcha('booking')` and appends the token to the FormData body.
- On `403` from the API, displays the error message in the existing error state.

### `app/contact/page.tsx`

- Calls `useRecaptcha()` hook.
- Executes `executeRecaptcha('contact')` in `handleSubmit` before the fetch.
- Passes token in the JSON body. Handles `403` in the existing `error` state.

### `app/login/page.tsx`

- Calls `useRecaptcha()` hook.
- In `handleSubmit`, executes `executeRecaptcha('login')`, then POSTs `{ email, password, recaptchaToken }` to `/api/auth/login` instead of calling `login()` from AuthContext.
- On `200`, calls `AuthContext`'s `setUser` (or triggers a session refresh) so the rest of the app reflects the logged-in state.
- On `403`, sets `error` state to the captcha failure message.
- On `401`, sets `error` state to the existing invalid credentials message.

### `app/signup/page.tsx`

- Same pattern. POSTs `{ name, email, password, recaptchaToken }` to `/api/auth/signup`.
- On `200`, calls `login()` from AuthContext (using existing email/password) to establish the client session, which also triggers the existing `useEffect` redirect.

### `context/AuthContext.tsx`

- No structural changes required.
- The `login()` method remains available and is called by the signup page after a successful `/api/auth/signup` response to establish the client-side Supabase session.

### `app/globals.css`

- Add badge-hiding rule:
  ```css
  .grecaptcha-badge { visibility: hidden; }
  ```
  This is the correct selector for the reCAPTCHA v3 floating badge. `visibility: hidden` is specified per Google's own documentation (not `display: none`).

### `.env.local`

Two new variables (placeholders — user must fill in real keys from Google reCAPTCHA Admin Console):

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

Both must also be added to Vercel environment variables (all environments).

---

## Score Threshold & Error Handling

| Score / condition | Action |
|-------------------|--------|
| ≥ 0.5 + action match | Proceed normally |
| < 0.5 | Return 403, show inline error |
| Action mismatch | Return 403, show inline error |
| Token missing | Return 403, show inline error |
| Google API unreachable | Return 403 (fail-safe) |

Error message shown to user: *"Security check failed. Please refresh and try again."*

---

## reCAPTCHA Badge & Legal

The floating reCAPTCHA badge is hidden in `app/globals.css` with:

```css
.grecaptcha-badge { visibility: hidden; }
```

Google permits hiding the badge as long as the following disclaimer appears near each form's submit button:

> *This site is protected by reCAPTCHA and the Google [Privacy Policy](https://policies.google.com/privacy) and [Terms of Service](https://policies.google.com/terms) apply.*

This disclaimer is added as a small line of text (`text-xs text-gray-600`) below the submit button in all four forms.

---

## Environment Variables

| Variable | Scope | Where used |
|----------|-------|-----------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Public (client + server) | `hooks/useRecaptcha.ts` |
| `RECAPTCHA_SECRET_KEY` | Server only | `lib/recaptcha.ts` |

---

## Out of Scope

- **Google Sign-In (`signInWithGoogle`)** — OAuth flows are handled entirely by Google; reCAPTCHA is not applicable.
- **Admin pages** — protected by auth middleware, not public-facing.
- **Rate limiting** — separate concern, not included in this spec.
