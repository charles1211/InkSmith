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
3. **Login form** (`/login`) — calls `supabase.auth.signInWithPassword` via `AuthContext`
4. **Signup form** (`/signup`) — calls `supabase.auth.signUp` via `AuthContext`

---

## Architecture

```
Client (form submit)
  └─ useRecaptcha hook → grecaptcha.execute(siteKey, {action}) → token
        ├─ Booking/Contact: token appended to existing POST body
        │     └─ API route: verifyRecaptcha(token) → Google siteverify → score ≥ 0.5 → process
        │                                                                → score < 0.5 → 403
        └─ Login/Signup: POST token to /api/auth/verify-captcha
              └─ score passes → proceed with supabase.auth call in AuthContext
              └─ score fails → show inline error, abort auth call
```

---

## New Files

### `hooks/useRecaptcha.ts`

- Dynamically injects the reCAPTCHA v3 script (`https://www.google.com/recaptcha/api.js?render=SITE_KEY`) into `<head>` on first use. Skips injection if already present.
- Returns a single function: `executeRecaptcha(action: string): Promise<string>` that resolves to a one-time token.
- Handles the case where `grecaptcha` is not yet ready by waiting for `grecaptcha.ready()`.
- Uses `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` from env.

### `lib/recaptcha.ts`

- Server-only utility. Exports `verifyRecaptcha(token: string): Promise<{ success: boolean; score: number }>`.
- POSTs to `https://www.google.com/recaptcha/api/siteverify` with `RECAPTCHA_SECRET_KEY` and the token.
- Returns `{ success: false, score: 0 }` on network error or Google failure — fail safe (block on error).
- Does not throw; callers receive a plain result object.

### `app/api/auth/verify-captcha/route.ts`

- `POST { token: string }` — verifies the token via `verifyRecaptcha`.
- Returns `200 { success: true }` or `403 { error: "Security check failed. Please refresh and try again." }`.
- Used only by login and signup pages before the Supabase auth call.

---

## Modified Files

### `app/api/book/route.ts`

- Expects `recaptchaToken` in the multipart/JSON body (added by the client).
- Calls `verifyRecaptcha(recaptchaToken)` at the top of the handler, before any DB writes or email sends.
- Returns `403 { error: "Security check failed. Please refresh and try again." }` if score < 0.5 or token missing.

### `app/api/contact/route.ts`

- Same pattern as `/api/book`. Expects `recaptchaToken` in the JSON body.
- Verifies before sending email.

### `app/book/page.tsx`

- Calls `useRecaptcha()` hook.
- On the final step submit (just before the `fetch('/api/book', ...)` call), executes `executeRecaptcha('booking')` and appends the token to the FormData/body.
- On `403` from the API, displays the error message in the existing error state.

### `app/contact/page.tsx`

- Calls `useRecaptcha()` hook.
- Executes `executeRecaptcha('contact')` in `handleSubmit` before the fetch.
- Passes token in the JSON body. Handles `403` in the existing `error` state.

### `app/login/page.tsx`

- Calls `useRecaptcha()` hook.
- In `handleSubmit`, executes `executeRecaptcha('login')`, POSTs token to `/api/auth/verify-captcha`.
- On pass, proceeds with `await login(email, password)` as before.
- On fail (non-200), sets `error` state to the message from the API.

### `app/signup/page.tsx`

- Same pattern as login. Action string: `'signup'`.
- On pass, proceeds with `await signup(name, email, password)` then `await login(email, password)` as before.

### `.env.local`

Two new variables added (with placeholder values — user must fill in real keys from Google reCAPTCHA console):

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

---

## Score Threshold & Error Handling

| Score | Action |
|-------|--------|
| ≥ 0.5 | Proceed normally |
| < 0.5 | Return 403, show inline error |
| Token missing | Return 403, show inline error |
| Google API unreachable | Return 403 (fail-safe) |

Error message shown to user: *"Security check failed. Please refresh and try again."*

---

## reCAPTCHA Badge & Legal

The default floating reCAPTCHA badge is hidden via global CSS (`#rc-anchor-container { display: none }`). Google permits this as long as the following disclaimer appears near each form's submit button:

> *This site is protected by reCAPTCHA and the Google [Privacy Policy](https://policies.google.com/privacy) and [Terms of Service](https://policies.google.com/terms) apply.*

This disclaimer is added as a small line of text (`text-xs text-gray-600`) below the submit button in all four forms.

---

## Environment Variables Required

| Variable | Where used |
|----------|-----------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client — `useRecaptcha` hook |
| `RECAPTCHA_SECRET_KEY` | Server — `lib/recaptcha.ts` |

Both must also be added to Vercel's environment variables (all environments).

---

## Out of Scope

- Google Sign-In (`signInWithGoogle`) — OAuth flows are handled by Google directly and do not need reCAPTCHA.
- Admin pages — protected by auth middleware, not public-facing.
- Rate limiting — separate concern, not included in this spec.
