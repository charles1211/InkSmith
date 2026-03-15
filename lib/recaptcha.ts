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

    // Temporary debug log — remove before final deploy
    console.log('[reCAPTCHA verify]', JSON.stringify(data));

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
