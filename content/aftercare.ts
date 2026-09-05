import type { AftercareGuide, AftercareSlug } from './types';

/**
 * Aftercare guidance, lifted from the original tabbed aftercare page so the
 * same instructions drive the page content, the FAQ answers and the HowTo
 * structured data.
 *
 * Both guides are rendered by one component that shows whichever blocks a
 * guide actually defines, so adding a third guide needs no new markup.
 */
export const aftercareGuides: AftercareGuide[] = [
  {
    slug: 'tattoo',
    title: 'Tattoo Aftercare',
    navLabel: 'Tattoo Care',
    heroSubtitle:
      'Your new tattoo is a collaborative effort. We did our part — now it is up to you to ensure it heals perfectly.',
    answer:
      'Remove the wrap once you are home, then wash the tattoo with warm water and mild antibacterial soap three times on the first day, finishing with cold water and a very thin layer of Vitamin A&D ointment. Wash and re-apply twice daily for three days, switch to unscented lotion on day four, and expect surface healing to take one to two weeks. Do not soak, sunbathe or pick at scabs while it heals.',
    metaTitle: 'Tattoo Aftercare Guide',
    metaDescription:
      'How to care for a new tattoo: the first 24 hours, the two-week healing phase, what to avoid, and when a mark needs medical attention. From InkSmith Studios, Hamilton.',
    totalTime: 'P14D',
    supply: [
      'Mild antibacterial soap',
      'Vitamin A&D ointment',
      'Unscented moisturising lotion',
      'Paper towel',
    ],
    phases: [
      {
        number: '01',
        title: 'Immediate Care',
        subtitle: 'First 24 hours',
        steps: [
          {
            title: 'Remove and rinse',
            body: 'Remove the wrap once you are home. Rinse with warm water and mild antibacterial soap, then cold water to close the pores.',
          },
          {
            title: 'Repeat three times',
            body: 'Wash three times over the first day, making sure all plasma and ink residue is completely washed away.',
          },
          {
            title: 'Dry and apply ointment',
            body: 'Air dry, or pat dry with a paper towel. Apply a very thin layer of Vitamin A&D ointment — the wound needs to breathe.',
          },
        ],
      },
      {
        number: '02',
        title: 'The Healing Phase',
        subtitle: 'Days 2 to 14 and beyond',
        steps: [
          {
            title: 'Stay consistent',
            body: 'Repeat the wash and ointment process twice daily, morning and night, for three days.',
          },
          {
            title: 'Switch to lotion',
            body: 'On day four, stop using ointment and switch to an unscented moisturising lotion.',
          },
          {
            title: 'Be patient',
            body: 'Healing takes one to two weeks or longer. Peeling and itching are completely normal.',
          },
        ],
      },
    ],
    prohibitions: [
      { title: 'No petroleum', desc: 'Vaseline, Vicks, oils and heavy creams suffocate the skin.' },
      { title: 'No soaking', desc: 'No pools, ocean, jacuzzis or baths. Showers only.' },
      { title: 'No sun exposure', desc: 'Direct sunlight destroys fresh ink. Keep it covered.' },
      { title: 'No picking', desc: 'Scabs protect the ink. Picking pulls colour out and causes scarring.' },
      { title: 'No touching', desc: 'Dirty hands and pets are the number one cause of infection.' },
      { title: 'Dietary care', desc: 'Avoid inflammatory foods such as seafood and nuts for faster healing.' },
    ],
    notices: [
      'Redness and peeling are normal during healing. Do not panic if the tattoo looks rough for a few days — this is temporary.',
      'Long term, extreme sun exposure fades tattoos over years. Always use SPF 25 or higher on fully healed tattoos.',
    ],
    faqIds: [
      'tattoo-healing-time',
      'peeling-normal',
      'swim-after-tattoo',
      'touch-ups',
      'protect-healed-tattoo',
      'signs-of-infection',
    ],
  },
  {
    slug: 'piercing',
    title: 'Piercing Aftercare',
    navLabel: 'Piercing Care',
    heroSubtitle:
      'A piercing is a commitment. Proper hygiene and patience are the keys to a healthy, beautiful modification.',
    answer:
      'Clean a new piercing twice daily: wash your hands with antibacterial soap, rinse the piercing gently with water, dry it with disposable gauze or tissue rather than a cloth towel, then apply a small amount of Betadine. Keep this up until it is fully healed — around two months for titanium jewellery and around six months for stainless steel — and do not remove or change the jewellery before then, because new piercings can shrink almost immediately.',
    metaTitle: 'Piercing Aftercare Guide',
    metaDescription:
      'How to care for a new piercing: the twice-daily cleaning routine, healing times for titanium and stainless steel, what is normal, and what to avoid. InkSmith Studios, Hamilton.',
    totalTime: 'P2M',
    supply: [
      'Antibacterial soap',
      'Disposable gauze or tissue',
      'Betadine (povidone-iodine)',
    ],
    warnings: [
      {
        title: 'Do not touch',
        body: 'The only time you touch your piercing is when cleaning it. Always wash your hands thoroughly first.',
      },
      {
        title: 'Keep the jewellery in',
        body: 'New piercings can shrink immediately. Do not remove or change jewellery until the piercing is fully healed.',
      },
    ],
    ritual: [
      {
        n: '01',
        title: 'Wash hands',
        desc: 'Wash thoroughly with antibacterial soap before touching anything.',
      },
      {
        n: '02',
        title: 'Cleanse',
        desc: 'Gently rinse with water. Dry with disposable gauze or tissue, never a cloth towel.',
      },
      {
        n: '03',
        title: 'Treat',
        desc: 'Apply a small amount of Betadine (povidone-iodine). Consult a pharmacist if it is unavailable.',
      },
      {
        n: '04',
        title: 'Repeat',
        desc: 'Continue twice daily until healed. Titanium takes around two months, stainless steel around six months.',
      },
    ],
    expectations: [
      'Bleeding, bruising and swelling initially.',
      'Tenderness, redness or itching for several days.',
      'Secretion of whitish-yellow fluid, which is not pus, that dries into a crust.',
      'Healing is not linear — a piercing may seem healed and then regress.',
      'Mild odour if it is not cleaned daily, which does not always mean infection.',
    ],
    avoid: [
      'Lotions, perfume, hair dye or cosmetics near the piercing.',
      'Alcohol-based mouthwash, for oral piercings.',
      'Over-cleaning, which causes irritation.',
      'Inflammatory foods such as nuts, avocado and seafood.',
      'Submerging in water — pools and baths. Showers are fine.',
      'Twisting, turning or picking at crusts.',
    ],
    faqIds: [
      'piercing-healing-time',
      'piercing-jewellery',
      'piercing-change',
      'signs-of-infection',
      'piercings-offered',
    ],
  },
];

/**
 * The medical warning shown on every aftercare page. Kept here so the tattoo
 * page, the piercing page and the hub cannot drift apart on it.
 */
export const medicalWarning = {
  title: 'Medical warning',
  body: 'If you notice extreme redness, spreading streaks, excessive swelling, or green or pus-like discharge after the first few days, contact us or a physician immediately. These may be signs of infection.',
};

/** Healing timelines, rendered as a comparison table on the aftercare hub. */
export const healingTimelines: { label: string; value: string }[] = [
  { label: 'Tattoo, surface healing', value: 'One to two weeks, sometimes longer' },
  { label: 'Tattoo, free touch-up window', value: 'Two weeks from the session' },
  { label: 'Piercing, titanium jewellery', value: 'Around two months' },
  { label: 'Piercing, stainless steel jewellery', value: 'Around six months' },
];

const bySlug = new Map(aftercareGuides.map((guide) => [guide.slug, guide]));

export function getAftercareGuide(slug: string): AftercareGuide | undefined {
  return bySlug.get(slug as AftercareSlug);
}

export function aftercareSlugs(): AftercareSlug[] {
  return aftercareGuides.map((guide) => guide.slug);
}

/** Flattens phases and the cleaning ritual into HowTo steps. */
export function aftercareSteps(guide: AftercareGuide): { name: string; text: string }[] {
  if (guide.phases?.length) {
    return guide.phases.flatMap((phase) =>
      phase.steps.map((step) => ({
        name: `${phase.title}: ${step.title}`,
        text: step.body,
      }))
    );
  }
  if (guide.ritual?.length) {
    return guide.ritual.map((step) => ({ name: step.title, text: step.desc }));
  }
  return [];
}
