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
