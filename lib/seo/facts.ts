import { siteConfig } from './site.config';

/**
 * The studio's name, address and phone rendered as label/value pairs.
 *
 * Every page that shows NAP details pulls from here, so the address printed on
 * a location page, a service page and the contact page can never disagree —
 * consistency across a site is what search engines and language models use to
 * decide a business's details are trustworthy.
 */
export function napFacts(): { label: string; value: string }[] {
  const { address } = siteConfig.contact;

  return [
    { label: 'Studio', value: siteConfig.name },
    {
      label: 'Address',
      value: `${address.streetAddress}, ${address.addressLocality} ${address.postalCode}, ${countryName(address.addressCountry)}`,
    },
    { label: 'Phone', value: siteConfig.contact.phone },
    { label: 'Email', value: siteConfig.contact.email },
    { label: 'Hours', value: siteConfig.openingHoursSummary },
    { label: 'Walk-ins', value: 'Welcome during studio hours' },
  ];
}

/** The single-line address used in prose and answer blocks. */
export function fullAddress(): string {
  const { address } = siteConfig.contact;
  return `${address.streetAddress}, ${address.addressLocality} ${address.postalCode}, ${countryName(address.addressCountry)}`;
}

/** The short form used where the full building detail would be noise. */
export function shortAddress(): string {
  const { address } = siteConfig.contact;
  return `${address.streetAddress.split(',')[0]}, ${address.addressLocality}`;
}

const COUNTRY_NAMES: Record<string, string> = {
  BM: 'Bermuda',
};

function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}
