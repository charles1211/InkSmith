# reCAPTCHA v3 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect all four public-facing forms (booking, contact, login, signup) with Google reCAPTCHA v3, blocking bot submissions server-side with a score threshold of 0.5.

**Architecture:** A shared `useRecaptcha` hook loads the reCAPTCHA script and generates tokens client-side. Booking and contact forms send the token in their existing POST body; the server-side API routes verify it via `lib/recaptcha.ts` before processing. Login and signup are converted to thin server-side wrappers (`/api/auth/login`, `/api/auth/signup`) that verify the token and execute the Supabase auth call in the same request, preventing bypass.

**Tech Stack:** Next.js 15 App Router, TypeScript, `@supabase/ssr`, `server-only` package, Google reCAPTCHA v3 (loaded via script tag, no npm package).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/recaptcha.ts` | Server-only: calls Google siteverify, returns `{ success, score }` |
| Create | `hooks/useRecaptcha.ts` | Client: loads reCAPTCHA script, exposes `executeRecaptcha(action)` |
| Create | `app/api/auth/login/route.ts` | Verify captcha + call Supabase signInWithPassword server-side |
| Create | `app/api/auth/signup/route.ts` | Verify captcha + call Supabase signUp server-side |
| Modify | `app/api/book/route.ts` | Extract `recaptchaToken`, verify before processing |
| Modify | `app/api/contact/route.ts` | Extract `recaptchaToken`, verify before processing |
| Modify | `app/book/page.tsx` | Execute captcha in `handleFinalSubmit`, send token in body |
| Modify | `app/contact/page.tsx` | Execute captcha in `handleSubmit`, send token in body |
| Modify | `app/login/page.tsx` | Execute captcha, POST to `/api/auth/login`, call `supabase.auth.setSession` |
| Modify | `app/signup/page.tsx` | Execute captcha, POST to `/api/auth/signup`, then call `login()` |
| Modify | `app/globals.css` | Hide reCAPTCHA badge with `.grecaptcha-badge { visibility: hidden }` |
| Modify | `.env.local` | Add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` |

---

## Chunk 1: Foundation (env + server utility + hook)

### Task 1: Environment variables

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Add the two reCAPTCHA env vars**

  If `.env.local` does not exist yet, create it in the project root. Then append:
  ```
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
  RECAPTCHA_SECRET_KEY=your_secret_key_here
  ```
  Replace placeholder values with real keys from [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin). Register the site as **reCAPTCHA v3**. The site key goes in `NEXT_PUBLIC_*` (used in the browser); the secret key stays server-only.

  > ⚠️ **Do NOT commit `.env.local` to git.** The Next.js `.gitignore` already excludes it. Only commit after filling in placeholders — never after filling in real keys.

- [ ] **Step 2: Install the `server-only` package**

  ```bash
  npm install server-only
  ```
  This lets us mark `lib/recaptcha.ts` so Next.js throws a build error if it's accidentally imported into a Client Component.

- [ ] **Step 3: Commit**

  ```bash
  git add package.json package-lock.json
  git commit -m "chore: install server-only package for reCAPTCHA utility"
  ```

---

### Task 2: `lib/recaptcha.ts` — server-side verification

**Files:**
- Create: `lib/recaptcha.ts`

- [ ] **Step 1: Create the file**

  ```typescript
  import 'server-only';

  const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

  export async function verifyRecaptcha(
    // Intentionally accepts `string | undefined` so callers don't need to
    // pre-check for a missing token — the guard below handles it fail-safe.
    token: string | undefined,
    expectedAction: string
  ): Promise<{ success: boolean; score: number }> {
    if (!token) return { success: false, score: 0 };

    try {
      const params = new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: token,
      });

      const res = await fetch(VERIFY_URL, {
        method: 'POST',
        body: params,
      });

      if (!res.ok) return { success: false, score: 0 };

      const data = await res.json();

      // Validate score AND action to prevent token reuse across forms
      const actionMatch = data.action === expectedAction;
      const scorePass = typeof data.score === 'number' && data.score >= 0.5;

      return {
        success: data.success === true && actionMatch && scorePass,
        score: data.score ?? 0,
      };
    } catch {
      // Network error or JSON parse failure — fail safe
      return { success: false, score: 0 };
    }
  }
  ```

- [ ] **Step 2: Verify the build doesn't break**

  ```bash
  npm run build
  ```
  Expected: build succeeds (the new file has no consumers yet).

- [ ] **Step 3: Commit**

  ```bash
  git add lib/recaptcha.ts
  git commit -m "feat: add server-side reCAPTCHA verification utility"
  ```

---

### Task 3: `hooks/useRecaptcha.ts` — client-side hook

**Files:**
- Create: `hooks/useRecaptcha.ts`

- [ ] **Step 1: Create the file**

  ```typescript
  import { useCallback } from 'react';

  declare global {
    interface Window {
      grecaptcha: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    }
  }

  // Module-level constants — env vars are inlined at build time by Next.js.
  const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

  // Module-level promise so the script is only injected once across all hook calls.
  let scriptLoadPromise: Promise<void> | null = null;

  function loadRecaptchaScript(): Promise<void> {
    if (scriptLoadPromise) return scriptLoadPromise;

    scriptLoadPromise = new Promise((resolve, reject) => {
      // Already loaded (e.g. hot-reload / StrictMode double-invoke)
      if (typeof window !== 'undefined' && window.grecaptcha) {
        resolve();
        return;
      }

      const existing = document.querySelector(
        'script[data-recaptcha="true"]'
      );
      if (existing) {
        // Script tag already in DOM — wait for it to load
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', reject);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.dataset.recaptcha = 'true';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return scriptLoadPromise;
  }

  export function useRecaptcha() {
    const executeRecaptcha = useCallback(
      async (action: string): Promise<string> => {
        await loadRecaptchaScript();

        return new Promise((resolve, reject) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(SITE_KEY, { action })
              .then(resolve)
              .catch(reject);
          });
        });
      },
      [] // SITE_KEY is module-level constant, not a dependency
    );

    return { executeRecaptcha };
  }
  ```

- [ ] **Step 2: Verify the build still passes**

  ```bash
  npm run build
  ```
  Expected: build succeeds.

- [ ] **Step 3: Commit**

  ```bash
  git add hooks/useRecaptcha.ts
  git commit -m "feat: add useRecaptcha hook for client-side token generation"
  ```

---

## Chunk 2: Server-side auth wrappers

### Task 4: `app/api/auth/login/route.ts`

**Files:**
- Create: `app/api/auth/login/route.ts`

- [ ] **Step 1: Create the file**

  ```typescript
  import { NextRequest, NextResponse } from 'next/server';
  import { createClient } from '../../../../lib/supabase/server';
  import { verifyRecaptcha } from '../../../../lib/recaptcha';

  export async function POST(req: NextRequest) {
    const { email, password, recaptchaToken } = await req.json();

    const { success } = await verifyRecaptcha(recaptchaToken, 'login');
    if (!success) {
      return NextResponse.json(
        { error: 'Security check failed. Please refresh and try again.' },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ user: data.user, session: data.session });
  }
  ```

- [ ] **Step 2: Build**

  ```bash
  npm run build
  ```
  Expected: build succeeds.

- [ ] **Step 3: Commit**

  ```bash
  git add app/api/auth/login/route.ts
  git commit -m "feat: add server-side login route with reCAPTCHA verification"
  ```

---

### Task 5: `app/api/auth/signup/route.ts`

**Files:**
- Create: `app/api/auth/signup/route.ts`

- [ ] **Step 1: Create the file**

  ```typescript
  import { NextRequest, NextResponse } from 'next/server';
  import { createClient } from '../../../../lib/supabase/server';
  import { verifyRecaptcha } from '../../../../lib/recaptcha';

  export async function POST(req: NextRequest) {
    const { name, email, password, recaptchaToken } = await req.json();

    const { success } = await verifyRecaptcha(recaptchaToken, 'signup');
    if (!success) {
      return NextResponse.json(
        { error: 'Security check failed. Please refresh and try again.' },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user });
  }
  ```

  > Note: the `supabase.auth.signUp` call above replaces the one shown in the `const { error }` destructure — use the `data, error: signUpError` form to get the user object for the response.

- [ ] **Step 2: Build**

  ```bash
  npm run build
  ```
  Expected: build succeeds.

- [ ] **Step 3: Commit**

  ```bash
  git add app/api/auth/signup/route.ts
  git commit -m "feat: add server-side signup route with reCAPTCHA verification"
  ```

---

## Chunk 3: Protect existing API routes

### Task 6: Update `app/api/book/route.ts`

**Files:**
- Modify: `app/api/book/route.ts:158-166`

- [ ] **Step 1: Add the import for `verifyRecaptcha` at the top of the file**

  Find the existing imports block (around line 1-4). Add after the last import:
  ```typescript
  import { verifyRecaptcha } from '../../../lib/recaptcha';
  ```

- [ ] **Step 2: Destructure `recaptchaToken` from the request body and verify it**

  Find this block (around line 158-166):
  ```typescript
  export async function POST(req: NextRequest) {
    const body = await req.json();

    const {
      firstName, lastName, email, phone, ageVerification,
      services, tattooStyle, tattooStyleOther, piercingPlacement,
      piercingPlacementOther, artistId, artistName, description,
      preferredDate, referenceUrl,
    } = body;

    // ── Save to Supabase
  ```

  Replace with:
  ```typescript
  export async function POST(req: NextRequest) {
    const body = await req.json();

    const {
      firstName, lastName, email, phone, ageVerification,
      services, tattooStyle, tattooStyleOther, piercingPlacement,
      piercingPlacementOther, artistId, artistName, description,
      preferredDate, referenceUrl, recaptchaToken,
    } = body;

    const { success } = await verifyRecaptcha(recaptchaToken, 'booking');
    if (!success) {
      return NextResponse.json(
        { error: 'Security check failed. Please refresh and try again.' },
        { status: 403 }
      );
    }

    // ── Save to Supabase
  ```

- [ ] **Step 3: Build**

  ```bash
  npm run build
  ```
  Expected: build succeeds.

- [ ] **Step 4: Commit**

  ```bash
  git add app/api/book/route.ts
  git commit -m "feat: verify reCAPTCHA token in booking API route"
  ```

---

### Task 7: Update `app/api/contact/route.ts`

**Files:**
- Modify: `app/api/contact/route.ts`

- [ ] **Step 1: Add the import**

  After the existing imports at the top, add:
  ```typescript
  import { verifyRecaptcha } from '../../../lib/recaptcha';
  ```

  > Path is `../../../` (three levels up): `contact/` → `api/` → `app/` → project root → `lib/`.

- [ ] **Step 2: Destructure token and verify before sending email**

  Find:
  ```typescript
  export async function POST(req: NextRequest) {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
  ```

  Replace with:
  ```typescript
  export async function POST(req: NextRequest) {
    const { name, email, subject, message, recaptchaToken } = await req.json();

    // Verify captcha first — before any further processing
    const { success } = await verifyRecaptcha(recaptchaToken, 'contact');
    if (!success) {
      return NextResponse.json(
        { error: 'Security check failed. Please refresh and try again.' },
        { status: 403 }
      );
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
  ```

- [ ] **Step 3: Build**

  ```bash
  npm run build
  ```
  Expected: build succeeds.

- [ ] **Step 4: Commit**

  ```bash
  git add app/api/contact/route.ts
  git commit -m "feat: verify reCAPTCHA token in contact API route"
  ```

---

## Chunk 4: Update client forms

### Task 8: Update `app/book/page.tsx`

**Files:**
- Modify: `app/book/page.tsx`

- [ ] **Step 1: Import the hook**

  Find the existing imports at the top. After the last import, add:
  ```typescript
  import { useRecaptcha } from '../../hooks/useRecaptcha';
  ```

- [ ] **Step 2: Add a `submitError` state and destructure the hook**

  Find:
  ```typescript
  const Booking: React.FC = () => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [currentStep, setCurrentStep] = useState(1);
  ```

  Replace with:
  ```typescript
  const Booking: React.FC = () => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { executeRecaptcha } = useRecaptcha();

    const [currentStep, setCurrentStep] = useState(1);
    const [submitError, setSubmitError] = useState<string | null>(null);
  ```

- [ ] **Step 3: Update `handleFinalSubmit` to execute captcha and send the token**

  Find:
  ```typescript
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
  ```

  Replace with:
  ```typescript
  const handleFinalSubmit = async () => {
    setLoading(true);
    setSubmitError(null);
    try {
      const recaptchaToken = await executeRecaptcha('booking');
  ```

  Then find the fetch call inside `handleFinalSubmit`:
  ```typescript
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName, lastName: formData.lastName,
          email: formData.email, phone: formData.phone,
          ageVerification: formData.ageVerification, services: formData.services,
          tattooStyle: formData.tattooStyle, tattooStyleOther: formData.tattooStyleOther,
          piercingPlacement: formData.piercingPlacement, piercingPlacementOther: formData.piercingPlacementOther,
          artistId: formData.artistId, artistName: getArtistName(formData.artistId),
          description: formData.description, preferredDate: formData.preferredDate, referenceUrl,
        }),
      });
  ```

  Replace with:
  ```typescript
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName, lastName: formData.lastName,
          email: formData.email, phone: formData.phone,
          ageVerification: formData.ageVerification, services: formData.services,
          tattooStyle: formData.tattooStyle, tattooStyleOther: formData.tattooStyleOther,
          piercingPlacement: formData.piercingPlacement, piercingPlacementOther: formData.piercingPlacementOther,
          artistId: formData.artistId, artistName: getArtistName(formData.artistId),
          description: formData.description, preferredDate: formData.preferredDate, referenceUrl,
          recaptchaToken,
        }),
      });
  ```

  Then replace the error handling at the end of `handleFinalSubmit`:
  ```typescript
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Booking submission failed');
      }

      setShowReview(false);
      setShowConfirmation(true);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong submitting your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  ```

  Replace with:
  ```typescript
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Booking submission failed');
      }

      setShowReview(false);
      setShowConfirmation(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  ```

- [ ] **Step 4: Display `submitError` in the review modal**

  In the JSX, find where the "Confirm Booking" button is rendered in the review modal. Directly above the button, add:
  ```tsx
  {submitError && (
    <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
      <AlertCircle className="w-4 h-4 shrink-0" /> {submitError}
    </p>
  )}
  ```

- [ ] **Step 5: Build**

  ```bash
  npm run build
  ```
  Expected: build succeeds with no TypeScript errors.

- [ ] **Step 6: Commit**

  ```bash
  git add app/book/page.tsx
  git commit -m "feat: add reCAPTCHA v3 to booking form"
  ```

---

### Task 9: Update `app/contact/page.tsx`

**Files:**
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Import the hook**

  At the top of the file, the first line is `'use client';`. After the existing imports, add:
  ```typescript
  import { useRecaptcha } from '../../hooks/useRecaptcha';
  ```

- [ ] **Step 2: Destructure the hook inside the component**

  Find:
  ```typescript
  const Contact = () => {
    const [formData, setFormData] = useState({
  ```

  Replace with:
  ```typescript
  const Contact = () => {
    const { executeRecaptcha } = useRecaptcha();
    const [formData, setFormData] = useState({
  ```

- [ ] **Step 3: Execute captcha in `handleSubmit` and send token**

  Find:
  ```typescript
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  ```

  Replace with:
  ```typescript
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const recaptchaToken = await executeRecaptcha('contact');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });
  ```

- [ ] **Step 4: Build**

  ```bash
  npm run build
  ```
  Expected: build succeeds.

- [ ] **Step 5: Commit**

  ```bash
  git add app/contact/page.tsx
  git commit -m "feat: add reCAPTCHA v3 to contact form"
  ```

---

### Task 10: Update `app/login/page.tsx`

**Files:**
- Modify: `app/login/page.tsx`

- [ ] **Step 1: Add imports**

  After the existing imports at the top of the file, add:
  ```typescript
  import { useRecaptcha } from '../../hooks/useRecaptcha';
  import { createClient } from '../../lib/supabase/client';
  ```

- [ ] **Step 2: Destructure the hook inside the component**

  Find:
  ```typescript
  const Login: React.FC = () => {
    const [email, setEmail] = useState('');
  ```

  Replace with:
  ```typescript
  const Login: React.FC = () => {
    const { executeRecaptcha } = useRecaptcha();
    const [email, setEmail] = useState('');
  ```

- [ ] **Step 3: Replace `handleSubmit` to use the server-side login route**

  Find the entire `handleSubmit` function:
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Navigation handled by the useEffect above once user is set.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };
  ```

  Replace with:
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const recaptchaToken = await executeRecaptcha('login');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid email or password.');

      // Establish client-side session — triggers onAuthStateChange in AuthContext
      const supabase = createClient();
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      // Navigation handled by the useEffect above once user is set.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };
  ```

- [ ] **Step 4: Build**

  ```bash
  npm run build
  ```
  Expected: build succeeds.

- [ ] **Step 5: Commit**

  ```bash
  git add app/login/page.tsx
  git commit -m "feat: add reCAPTCHA v3 to login form via server-side wrapper"
  ```

---

### Task 11: Update `app/signup/page.tsx`

**Files:**
- Modify: `app/signup/page.tsx`

- [ ] **Step 1: Import the hook**

  After the existing imports, add:
  ```typescript
  import { useRecaptcha } from '../../hooks/useRecaptcha';
  ```

- [ ] **Step 2: Destructure the hook**

  Find:
  ```typescript
  const SignUp: React.FC = () => {
    const [name, setName] = useState('');
  ```

  Replace with:
  ```typescript
  const SignUp: React.FC = () => {
    const { executeRecaptcha } = useRecaptcha();
    const [name, setName] = useState('');
  ```

- [ ] **Step 3: Replace `handleSubmit` to use the server-side signup route**

  Find the entire `handleSubmit` function:
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };
  ```

  Replace with:
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const recaptchaToken = await executeRecaptcha('signup');
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create account.');

      // Account created — sign in via AuthContext (captcha already verified above)
      await login(email, password);
      // Navigation handled by the useEffect above once user is set.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };
  ```

- [ ] **Step 4: Build**

  ```bash
  npm run build
  ```
  Expected: build succeeds.

- [ ] **Step 5: Commit**

  ```bash
  git add app/signup/page.tsx
  git commit -m "feat: add reCAPTCHA v3 to signup form via server-side wrapper"
  ```

---

## Chunk 5: UI polish (badge + disclaimers)

### Task 12: Hide reCAPTCHA badge and add legal disclaimers

**Files:**
- Modify: `app/globals.css`
- Modify: `app/book/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/login/page.tsx`
- Modify: `app/signup/page.tsx`

- [ ] **Step 1: Hide the floating reCAPTCHA badge in `app/globals.css`**

  Append at the end of the file:
  ```css
  /* Hide reCAPTCHA v3 badge — legal text shown near each form's submit button instead */
  .grecaptcha-badge {
    visibility: hidden;
  }
  ```

- [ ] **Step 2: Add disclaimer to the booking form**

  In `app/book/page.tsx`, find the "Confirm Booking" submit button in the review modal. Directly below the button (or below the `submitError` block added in Task 8), add:
  ```tsx
  <p className="text-center text-xs text-gray-600 leading-relaxed">
    This site is protected by reCAPTCHA and the Google{' '}
    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">Privacy Policy</a>
    {' '}and{' '}
    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">Terms of Service</a>
    {' '}apply.
  </p>
  ```

- [ ] **Step 3: Add disclaimer to the contact form**

  In `app/contact/page.tsx`, find the form's submit button. Directly below it, add:
  ```tsx
  <p className="text-center text-xs text-gray-600 leading-relaxed mt-3">
    This site is protected by reCAPTCHA and the Google{' '}
    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">Privacy Policy</a>
    {' '}and{' '}
    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">Terms of Service</a>
    {' '}apply.
  </p>
  ```

- [ ] **Step 4: Add disclaimer to the login form**

  In `app/login/page.tsx`, find the submit button at the bottom of the form. Directly below it, add:
  ```tsx
  <p className="text-center text-xs text-gray-600 leading-relaxed">
    This site is protected by reCAPTCHA and the Google{' '}
    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">Privacy Policy</a>
    {' '}and{' '}
    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">Terms of Service</a>
    {' '}apply.
  </p>
  ```

- [ ] **Step 5: Add disclaimer to the signup form**

  In `app/signup/page.tsx`, find the submit button at the bottom of the form. Directly below it, add:
  ```tsx
  <p className="text-center text-xs text-gray-600 leading-relaxed">
    This site is protected by reCAPTCHA and the Google{' '}
    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">Privacy Policy</a>
    {' '}and{' '}
    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">Terms of Service</a>
    {' '}apply.
  </p>
  ```

- [ ] **Step 6: Build and lint**

  ```bash
  npm run build && npm run lint
  ```
  Expected: build succeeds, no lint errors.

- [ ] **Step 7: Commit**

  ```bash
  git add app/globals.css app/book/page.tsx app/contact/page.tsx app/login/page.tsx app/signup/page.tsx
  git commit -m "feat: hide reCAPTCHA badge and add legal disclaimers to all forms"
  ```

---

## Chunk 6: Final verification

### Task 13: Manual smoke test + Vercel env vars

- [ ] **Step 1: Add env vars to Vercel**

  In the Vercel dashboard → Project Settings → Environment Variables, add:
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` → your site key (all environments)
  - `RECAPTCHA_SECRET_KEY` → your secret key (all environments)

- [ ] **Step 2: Start the dev server and test the booking form**

  ```bash
  npm run dev
  ```
  1. Open `http://localhost:3000/book`
  2. Fill in all fields and submit
  3. Open browser DevTools → Network tab
  4. Confirm the POST to `/api/book` includes `recaptchaToken` in the request body
  5. Confirm the response is `200` (not `403`)
  6. Confirm the booking confirmation screen appears

- [ ] **Step 3: Test the contact form**

  1. Open `http://localhost:3000/contact`
  2. Fill in all fields and submit
  3. Confirm POST to `/api/contact` includes `recaptchaToken`
  4. Confirm `200` response and success state

- [ ] **Step 4: Test login**

  1. Open `http://localhost:3000/login`
  2. Enter valid credentials and submit
  3. Confirm POST to `/api/auth/login` includes `recaptchaToken`
  4. Confirm redirect after successful login

- [ ] **Step 5: Test signup**

  1. Open `http://localhost:3000/signup`
  2. Fill in details and submit
  3. Confirm POST to `/api/auth/signup` includes `recaptchaToken`
  4. Confirm redirect after successful signup

- [ ] **Step 6: Verify badge is hidden**

  On any page with a form, confirm the floating reCAPTCHA badge is not visible. Confirm the legal disclaimer text appears below each form's submit button.

- [ ] **Step 7: Final status check**

  Each prior task committed its own files individually, so there should be nothing left to stage. Verify:

  ```bash
  git status
  ```

  Expected: `nothing to commit, working tree clean`.

  If any files appear unstaged (e.g. a disclaimer was missed), stage them explicitly by name — **never use `git add .`** at this stage since `.env.local` now contains real keys. Then commit:

  ```bash
  # Example — only if git status shows specific files remaining:
  git add app/signup/page.tsx
  git commit -m "feat: reCAPTCHA v3 integration complete — all four forms protected"
  ```
