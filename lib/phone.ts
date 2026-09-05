/**
 * Phone number normalisation, shared by the booking form and the booking API.
 *
 * The form previously hard-coded a Philippines +63 prefix with 10-digit
 * validation, which made it impossible for a client in Bermuda — where the
 * studio actually is — to enter their own number.
 *
 * The rule now: a bare local number is interpreted as the studio's own country,
 * and anything typed with an explicit `+` country code is respected as written.
 * Bermuda is a tourist destination, so visitors with foreign mobiles are real
 * clients and must be able to book.
 *
 * Numbers are stored raw while the user types and normalised to E.164 exactly
 * once, at submit. Keeping one representation in state avoids the previous
 * bug class, where three separate places encoded the prefix as a
 * length-sensitive string literal and had to agree with each other.
 */

export interface PhoneCountry {
  /** ISO 3166-1 alpha-2. */
  code: string;
  /** E.164 country calling code, without the plus. */
  dialCode: string;
  /**
   * Fixed area/routing prefix, for countries that have exactly one.
   * Bermuda is always +1 441. Leave empty where a country has many.
   */
  areaCode: string;
  /** Digits in a local subscriber number, excluding dial and area codes. */
  localDigits: number;
  flag: string;
  /** Placeholder shown in the input. */
  example: string;
}

/**
 * The studio's country. Keep in sync with `contact.phoneE164` in
 * `lib/seo/site.config.ts` — for a different business, this is the one value
 * that needs changing.
 */
export const DEFAULT_COUNTRY: PhoneCountry = {
  code: 'BM',
  dialCode: '1',
  areaCode: '441',
  localDigits: 7,
  flag: '🇧🇲',
  example: '261 8532',
};

/** E.164 allows 15 digits at most; 7 is the shortest realistic subscriber number. */
const MIN_DIGITS = 7;
const MAX_DIGITS = 15;

function digitsOf(value: string): string {
  return (value || '').replace(/\D/g, '');
}

/**
 * True when the input could be a phone number in any country.
 *
 * Deliberately permissive: this rejects obvious typos without pretending to
 * know every national numbering plan. Validating per-country would need a
 * library, and getting it subtly wrong would silently turn away real clients.
 */
export function isValidPhone(input: string): boolean {
  const digits = digitsOf(input);
  return digits.length >= MIN_DIGITS && digits.length <= MAX_DIGITS;
}

/**
 * Converts user input to E.164 (`+` followed by digits), or null if it cannot
 * plausibly be a phone number.
 *
 * With the Bermuda defaults:
 *   '261 8532'        -> '+14412618532'   (local, area code assumed)
 *   '441 261 8532'    -> '+14412618532'   (area code typed)
 *   '1 441 261 8532'  -> '+14412618532'   (full national number)
 *   '+44 7700 900123' -> '+447700900123'  (explicit country code, respected)
 */
export function normalisePhone(
  input: string,
  country: PhoneCountry = DEFAULT_COUNTRY
): string | null {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;

  const digits = digitsOf(trimmed);
  if (digits.length < MIN_DIGITS || digits.length > MAX_DIGITS) return null;

  // An explicit country code is authoritative — never second-guess it.
  if (trimmed.startsWith('+')) return `+${digits}`;

  const { dialCode, areaCode, localDigits } = country;
  const national = `${areaCode}${'#'.repeat(localDigits)}`.length;

  // Local subscriber number: assume the studio's own area code.
  if (digits.length === localDigits) return `+${dialCode}${areaCode}${digits}`;

  // National number with the area code but no country code.
  if (areaCode && digits.length === national && digits.startsWith(areaCode)) {
    return `+${dialCode}${digits}`;
  }

  // Full number including the country code, just missing its plus.
  if (digits.startsWith(dialCode) && digits.length === dialCode.length + national) {
    return `+${digits}`;
  }

  // Anything else of plausible length is treated as international.
  return `+${digits}`;
}

/** Human-readable hint for the input's placeholder and helper text. */
export function phoneExample(country: PhoneCountry = DEFAULT_COUNTRY): string {
  return country.example;
}
