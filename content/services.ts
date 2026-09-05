import type { Service } from './types';

/**
 * The three services the studio actually books, sourced from the booking
 * form's service options and style/placement lists.
 *
 * `options.groups` drives both the visible content and the OfferCatalog in
 * JSON-LD, so the two can never disagree. No prices appear anywhere here —
 * the studio publishes none, and inventing them would be a policy violation.
 */
export const services: Service[] = [
  {
    slug: 'tattoo',
    name: 'Custom Tattoos',
    navLabel: 'Tattoos',
    tagline: 'Custom ink by our artists',
    answer:
      'InkSmith Studios designs and applies custom tattoos at 39 King St in Hamilton, Bermuda, in black and grey, full colour and UV ink. Every piece starts with a free consultation, a deposit secures the appointment, and a touch-up within the first two weeks is included at no charge.',
    metaTitle: 'Custom Tattoos in Hamilton, Bermuda',
    metaDescription:
      'Custom tattoos in Hamilton, Bermuda. Black and grey, colour and UV work across realism, traditional, Japanese and fine line. Free consultation, walk-ins welcome.',
    body: [
      'Every tattoo at InkSmith Studios is drawn for the person wearing it. Our artists work from your reference material and your idea, then develop a design that fits the placement, the proportions of your body and the way the piece needs to age.',
      'Sessions run in a sterile studio using single-use needles and autoclave-certified equipment. You will see and approve the final design in person before any work starts.',
    ],
    sections: [
      {
        heading: 'How a tattoo appointment works',
        intro:
          'The process from first contact to finished piece runs in four stages.',
        items: [
          {
            title: 'Free consultation',
            text: 'You talk through the concept, placement and size with an artist. Bring reference images and a photo of the area. There is no charge for this and no obligation to book.',
          },
          {
            title: 'Design and deposit',
            text: 'The artist develops your custom design. A deposit secures your appointment slot. Designs are viewed in the studio only and are not sent electronically.',
          },
          {
            title: 'The session',
            text: 'You present valid ID with date of birth and sign the Client Information and Consent Form. The artist shaves and prepares the area, applies the stencil for your approval, then tattoos.',
          },
          {
            title: 'Healing and touch-up',
            text: 'You leave with aftercare instructions. If the piece needs a touch-up, it is free within two weeks of the session.',
          },
        ],
      },
      {
        heading: 'What tattoos cost and how deposits work',
        body: [
          'The studio does not publish fixed prices. What a tattoo costs depends on size, placement, level of detail, whether it is colour or black and grey, and how long it takes to complete. Any figure quoted before work begins is an estimate and may change as the design develops.',
          'A deposit is required to secure your appointment slot, and it is non-refundable and non-transferable. It is forfeited for major design changes, no-shows, cancelling with less than 48 hours notice, rescheduling more than twice, or failing to rebook within 90 days. Consultations remain free regardless.',
        ],
      },
      {
        heading: 'Cover-ups and rework',
        body: [
          'The studio takes cover-up projects. Concealing existing work constrains what is possible: a cover-up usually needs darker tones, larger dimensions or a different composition than a piece on bare skin. Your artist will tell you honestly what will and will not work over the existing tattoo, and may suggest changes to your idea so the result holds up.',
          'Bring a clear, well-lit photo of the existing tattoo to your consultation, and expect the conversation to start with what the old piece allows.',
        ],
      },
    ],
    options: {
      heading: 'Tattoo styles and ink options',
      intro:
        'Choose an ink approach when you book, then discuss the style with your artist at the consultation.',
      groups: [
        { label: 'Ink', values: ['Black and Grey', 'Colour', 'UV Tattoo'] },
        {
          label: 'Styles our artists work in',
          values: [
            'Realism',
            'Traditional',
            'Japanese',
            'Blackwork',
            'Fine Line',
            'Colour',
            'Watercolour',
          ],
        },
      ],
    },
    keyFacts: [
      { label: 'Studio', value: '39 King St, 2nd Floor, Ratteray Bldg., Hamilton HM 19' },
      { label: 'Hours', value: 'Mon–Sat 12:00 PM – 8:00 PM, Sun 11:00 AM – 7:00 PM' },
      { label: 'Walk-ins', value: 'Welcome during studio hours, subject to artist availability' },
      { label: 'Consultation', value: 'Free' },
      { label: 'Deposit', value: 'Required to secure a slot. Non-refundable and non-transferable' },
      { label: 'Touch-up', value: 'Free within two weeks of the session' },
      { label: 'Age requirement', value: '18+, or accompanied by a parent or legal guardian with valid ID' },
    ],
    faqIds: [
      'tattoo-styles',
      'how-much-cost',
      'deposit-required',
      'deposit-refundable',
      'touch-ups',
      'cover-ups',
      'see-design-first',
      'how-to-prepare',
      'tattoo-pain',
      'uv-tattoos',
      'need-id',
      'under-18',
    ],
    relatedServiceSlugs: ['piercing', 'consultation'],
    aftercareSlug: 'tattoo',
    bookingServiceId: 'Tattoo',
  },
  {
    slug: 'piercing',
    name: 'Body Piercing',
    navLabel: 'Piercings',
    tagline: 'Professional body piercing',
    answer:
      'InkSmith Studios performs ear, facial, oral and body piercings at 39 King St in Hamilton, Bermuda, using single-use needles and implant-grade titanium and gold jewellery. Walk-ins are welcome during studio hours, and the studio also handles jewellery changes and removals.',
    metaTitle: 'Body Piercing in Hamilton, Bermuda',
    metaDescription:
      'Body piercing in Hamilton, Bermuda. Ear, facial, oral and body placements with implant-grade titanium jewellery and single-use needles. Walk-ins welcome.',
    body: [
      'Our piercing studio maintains the highest standards of sterilisation and hygiene. Every modification should be safe, comfortable and a positive experience, and the process is explained to you before anything happens.',
      'From classic ear curation to complex surface piercings, our specialists use implant-grade titanium and gold jewellery. Implant-grade metals are the reason a piercing heals predictably rather than reacting.',
    ],
    sections: [
      {
        heading: 'How a piercing appointment works',
        items: [
          {
            title: 'Choose your placement',
            text: 'Select the placement when you book, or come in and discuss it. Anatomy varies, and not every placement suits every ear or face — your piercer will tell you before, not after.',
          },
          {
            title: 'Jewellery selection',
            text: 'Initial jewellery is implant-grade titanium or gold, chosen for how it heals rather than how it looks on day one. You can change to something else once the piercing has fully healed.',
          },
          {
            title: 'The piercing',
            text: 'You present valid ID with date of birth and sign the consent form. The piercer marks the placement for your approval, then uses a single-use needle. The whole thing takes minutes.',
          },
          {
            title: 'Healing',
            text: 'You leave with aftercare instructions: clean twice daily, do not touch it otherwise, and leave the jewellery in until it is fully healed.',
          },
        ],
      },
      {
        heading: 'How long piercings take to heal',
        body: [
          'Healing time is set by the jewellery more than the placement. Titanium generally heals in around two months and stainless steel in around six months. Keep to the twice-daily cleaning routine for the whole period, not just until it stops hurting.',
          'Healing is not linear. A piercing can look settled and then regress, and some bleeding, bruising, swelling, tenderness and a whitish-yellow crust are all normal early on. Spreading redness, excessive swelling or green discharge are not — contact the studio or a physician if you see them.',
        ],
      },
    ],
    options: {
      heading: 'Piercings we offer',
      intro: 'Select a placement when booking, or choose Others and describe what you want.',
      groups: [
        {
          label: 'Ear',
          values: ['Earlobe', 'Flat', 'Helix', 'Tragus', 'Industrial'],
        },
        { label: 'Facial', values: ['Eyebrow', 'Nostril', 'Septum'] },
        { label: 'Oral', values: ['Labret', 'Tongue', 'Smiley', 'Snakebite'] },
        {
          label: 'Body',
          values: ['Navel', 'Nipple', 'Dermal', 'Christina'],
        },
        { label: 'Other services', values: ['Piercing change or removal'] },
      ],
    },
    keyFacts: [
      { label: 'Studio', value: '39 King St, 2nd Floor, Ratteray Bldg., Hamilton HM 19' },
      { label: 'Hours', value: 'Mon–Sat 12:00 PM – 8:00 PM, Sun 11:00 AM – 7:00 PM' },
      { label: 'Walk-ins', value: 'Welcome during studio hours' },
      { label: 'Jewellery', value: 'Implant-grade titanium and gold' },
      { label: 'Needles', value: 'Single-use, never reused' },
      { label: 'Healing time', value: 'Titanium around two months, stainless steel around six months' },
      { label: 'Age requirement', value: '18+, or accompanied by a parent or legal guardian with valid ID' },
    ],
    faqIds: [
      'piercings-offered',
      'piercing-jewellery',
      'piercing-healing-time',
      'piercing-change',
      'walk-ins',
      'signs-of-infection',
      'need-id',
      'under-18',
    ],
    relatedServiceSlugs: ['tattoo', 'consultation'],
    aftercareSlug: 'piercing',
    bookingServiceId: 'Piercing',
  },
  {
    slug: 'consultation',
    name: 'Free Design Consultation',
    navLabel: 'Consultation',
    tagline: 'Free design consultation',
    answer:
      'A design consultation at InkSmith Studios is free and carries no obligation. You sit down with an artist at 39 King St in Hamilton to talk through your concept, placement, sizing and style, and to get an estimate before committing. A deposit only applies once you book an actual appointment.',
    metaTitle: 'Free Tattoo Consultation in Hamilton, Bermuda',
    metaDescription:
      'Book a free tattoo or piercing consultation in Hamilton, Bermuda. Discuss your concept, placement, sizing and estimate with an InkSmith artist before you commit.',
    body: [
      'A consultation is where a vague idea becomes a workable design. It costs nothing and commits you to nothing.',
      'It is also where the honest conversations happen: whether a design will still read clearly at the size you want, whether a placement will age well, and what a cover-up can realistically hide.',
    ],
    sections: [
      {
        heading: 'What happens at a consultation',
        items: [
          {
            title: 'You describe the concept',
            text: 'Bring reference images, rough sketches, or examples of work you like. Nothing needs to be finished or polished.',
          },
          {
            title: 'The artist assesses placement and size',
            text: 'Some designs need more room than people expect, and fine detail behaves differently on different parts of the body. This is where that gets settled.',
          },
          {
            title: 'You get an estimate',
            text: 'The artist gives you an estimated price based on the design as discussed. Estimates may change if the design changes substantially.',
          },
          {
            title: 'You decide',
            text: 'If you want to go ahead, a deposit secures your slot. If you do not, you owe nothing.',
          },
        ],
      },
      {
        heading: 'What to bring',
        body: [
          'Reference images are the most useful thing you can bring — saved photos, screenshots, a sketch on paper. If you are covering an existing tattoo, bring a clear, well-lit photo of it.',
          'Bring valid photo ID showing your date of birth. If you are under 18, your parent or legal guardian needs to come with you and bring their ID too.',
        ],
      },
    ],
    keyFacts: [
      { label: 'Cost', value: 'Free, with no obligation to book' },
      { label: 'Studio', value: '39 King St, 2nd Floor, Ratteray Bldg., Hamilton HM 19' },
      { label: 'Hours', value: 'Mon–Sat 12:00 PM – 8:00 PM, Sun 11:00 AM – 7:00 PM' },
      { label: 'Bring', value: 'Reference images and valid photo ID with date of birth' },
      { label: 'Outcome', value: 'An estimate and a plan. A deposit is only needed to book a session' },
    ],
    faqIds: [
      'consultation-free',
      'how-much-cost',
      'how-to-book',
      'response-time',
      'choose-artist',
      'reference-image',
      'cover-ups',
    ],
    relatedServiceSlugs: ['tattoo', 'piercing'],
    bookingServiceId: 'Consultation',
  },
];

/* ─────────────────────────────── selectors ────────────────────────── */

const bySlug = new Map(services.map((service) => [service.slug, service]));

export function getService(slug: string): Service | undefined {
  return bySlug.get(slug);
}

export function serviceSlugs(): string[] {
  return services.map((service) => service.slug);
}

/** Flattens option groups into the shape `serviceSchema` expects for an OfferCatalog. */
export function serviceOffers(service: Service): { name: string }[] {
  if (!service.options) return [];
  return service.options.groups.flatMap((group) =>
    group.values.map((value) => ({
      name: group.label ? `${value} ${service.navLabel.toLowerCase()}` : value,
    }))
  );
}
