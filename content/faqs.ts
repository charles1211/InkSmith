import type { Faq, FaqTopic } from './types';

/**
 * The site's FAQ corpus — the highest-value asset for generative engines,
 * because question/answer pairs get lifted close to verbatim into AI answers.
 *
 * Rules for every entry:
 *   - The answer stands alone. No "as mentioned above", no pronoun whose
 *     referent lives in another paragraph.
 *   - The answer opens by directly answering the question, then adds detail.
 *   - Every fact traces to the studio's real policies, hours, contact details
 *     or aftercare guidance. Nothing here is invented — in particular there are
 *     no prices, because the studio publishes none.
 */
export const faqs: Faq[] = [
  /* ── visiting and location ── */
  {
    id: 'where-located',
    question: 'Where is InkSmith Studios located?',
    answer:
      'InkSmith Studios is at 39 King St, 2nd Floor, Ratteray Bldg., Hamilton HM 19, Bermuda. The studio sits in central Hamilton, within walking distance of the city centre, and is the only InkSmith location on the island.',
    topics: ['location', 'general'],
    link: { label: 'Get directions and studio details', href: '/locations/hamilton' },
  },
  {
    id: 'opening-hours',
    question: 'What are InkSmith Studios opening hours?',
    answer:
      'InkSmith Studios is open Monday to Saturday from 12:00 PM to 8:00 PM and Sunday from 11:00 AM to 7:00 PM, seven days a week. Appointments outside these hours can be arranged but require a deposit to secure the slot.',
    topics: ['location', 'general', 'booking'],
  },
  {
    id: 'walk-ins',
    question: 'Do you accept walk-ins?',
    answer:
      'Yes, InkSmith Studios welcomes walk-ins during studio hours, which are Monday to Saturday 12:00 PM to 8:00 PM and Sunday 11:00 AM to 7:00 PM. Availability depends on which artists are free at the time, so booking ahead is the surest way to get the artist and slot you want.',
    topics: ['booking', 'general', 'location'],
    link: { label: 'Book an appointment', href: '/book' },
  },
  {
    id: 'contact-studio',
    question: 'How do I contact InkSmith Studios?',
    answer:
      'You can call InkSmith Studios on +1 (441) 261-8532, email inksmithbda@gmail.com, or send a message through the contact form on this site. The studio also posts work and answers messages on Instagram at @inksmithtattoobda.',
    topics: ['general', 'location', 'booking'],
    link: { label: 'Contact the studio', href: '/contact' },
  },
  {
    id: 'serve-whole-island',
    question: 'Do you take clients from outside Hamilton?',
    answer:
      'Yes. InkSmith Studios operates one studio in Hamilton and welcomes clients travelling in from every parish in Bermuda, including Pembroke, Paget, Warwick, Devonshire, Smiths, Southampton, Sandys and St. Georges. The studio does not travel to clients, so all work is done at 39 King St.',
    topics: ['location', 'general'],
    link: { label: 'See travel details for your parish', href: '/locations' },
  },

  /* ── booking ── */
  {
    id: 'how-to-book',
    question: 'How does the booking process work?',
    answer:
      'Booking at InkSmith Studios takes three steps on the online form: your personal details and age verification, the service you want along with any preferred artist, then your concept, a reference image and a preferred date. After you submit, the studio reviews the request and contacts you within 24 to 48 hours to confirm the appointment and discuss pricing.',
    topics: ['booking', 'general'],
    link: { label: 'Start a booking', href: '/book' },
  },
  {
    id: 'response-time',
    question: 'How long will it take to hear back about my booking?',
    answer:
      'InkSmith Studios responds to booking requests and contact form messages within 24 to 48 hours. You receive a confirmation email as soon as your request is submitted, followed by a message from the studio to finalise the date, artist and estimate.',
    topics: ['booking'],
  },
  {
    id: 'consultation-free',
    question: 'Is the consultation free?',
    answer:
      'Yes, consultations at InkSmith Studios are free. A consultation is where you discuss your concept, placement, sizing and style with an artist before committing to anything. A deposit is only required once you book an actual appointment slot.',
    topics: ['booking', 'pricing', 'general'],
    link: { label: 'Book a free consultation', href: '/services/consultation' },
  },
  {
    id: 'choose-artist',
    question: 'Can I choose which artist tattoos me?',
    answer:
      'Yes. The booking form lets you select a preferred artist, or leave it set to any available artist if you would rather the studio match you to whoever suits your concept and schedule. Each artist lists the styles they specialise in on the artists page.',
    topics: ['booking', 'tattoo'],
    link: { label: 'Meet the artists', href: '/artists' },
  },
  {
    id: 'reference-image',
    question: 'Do I need a reference image to book?',
    answer:
      'Yes, the booking form asks for a reference image so the artist can understand your concept before you meet. Accepted formats are JPG, PNG and PDF up to 15MB. A rough sketch, a saved photo or an example of a style you like is enough, and it does not need to be a finished design.',
    topics: ['booking', 'tattoo'],
  },
  {
    id: 'late-arrival',
    question: 'What happens if I am late for my appointment?',
    answer:
      'If you arrive 15 or more minutes late, InkSmith Studios may take other clients in your place. Lateness can also count towards forfeiting your deposit, so call the studio on +1 (441) 261-8532 as early as you can if you are delayed.',
    topics: ['booking', 'policy'],
  },

  /* ── pricing and deposits ── */
  {
    id: 'how-much-cost',
    question: 'How much does a tattoo cost at InkSmith Studios?',
    answer:
      'InkSmith Studios does not publish fixed prices, because cost depends on size, placement, detail, colour and how long the piece takes. Any figure quoted before the work begins is an estimate and may change. The way to get an accurate number is a free consultation, where an artist assesses the design in person.',
    topics: ['pricing', 'booking', 'tattoo'],
    link: { label: 'Book a free consultation', href: '/services/consultation' },
  },
  {
    id: 'deposit-required',
    question: 'Do I need to pay a deposit?',
    answer:
      'Yes. A deposit is required to secure an appointment slot at InkSmith Studios, including any appointment arranged outside normal studio hours. The consultation itself is free, and the deposit applies when you reserve a session.',
    topics: ['pricing', 'booking', 'policy'],
  },
  {
    id: 'deposit-refundable',
    question: 'Is the deposit refundable?',
    answer:
      'No, the deposit at InkSmith Studios is non-refundable and non-transferable. It is forfeited if you request major design changes, do not show up, fail to cancel at least 48 hours before your appointment, reschedule more than twice, or fail to rebook within 90 days.',
    topics: ['pricing', 'policy', 'booking'],
  },
  {
    id: 'touch-ups',
    question: 'Do you offer free touch-ups?',
    answer:
      'InkSmith Studios will do a touch-up free of charge within two weeks of your session if the tattoo needs one. After that two-week window regular pricing applies. Touch-ups cover settling and healing, not changes to the design.',
    topics: ['pricing', 'policy', 'tattoo', 'aftercare'],
  },

  /* ── policies ── */
  {
    id: 'need-id',
    question: 'Do I need to bring ID?',
    answer:
      'Yes. Every client at InkSmith Studios must present a valid ID showing date of birth, and read and sign the studio Client Information and Consent Form before any work starts. There are no exceptions to the ID requirement.',
    topics: ['policy', 'booking'],
  },
  {
    id: 'under-18',
    question: 'Can I get tattooed or pierced if I am under 18?',
    answer:
      'Clients under 18 can be seen at InkSmith Studios only when accompanied by a parent or legal guardian, and both the client and the guardian must present valid ID. The guardian needs to be present for the appointment itself, not just for the booking.',
    topics: ['policy', 'booking'],
  },
  {
    id: 'refuse-service',
    question: 'Are there reasons the studio would turn me away?',
    answer:
      'Yes. InkSmith Studios reserves the right to refuse anyone who arrives under the influence of alcohol or drugs, or whose condition makes them unfit for a session. Alcohol thins the blood and causes complications during tattooing, so avoid it entirely before your appointment.',
    topics: ['policy'],
  },
  {
    id: 'see-design-first',
    question: 'Can I see my custom design before the appointment?',
    answer:
      'InkSmith Studios does not send electronic copies of custom designs. Designs are viewed in the studio only, which protects the original artwork. You see and approve the design in person before any needle touches your skin.',
    topics: ['policy', 'tattoo'],
  },
  {
    id: 'cover-ups',
    question: 'Do you do cover-up tattoos?',
    answer:
      'Yes, InkSmith Studios takes cover-up projects. For a cover-up the artist may suggest changes to your proposed design so that it properly conceals the existing tattoo, since darker tones, larger dimensions or a different composition are often needed. Bring a clear photo of the existing piece to your consultation.',
    topics: ['tattoo', 'policy'],
  },
  {
    id: 'how-to-prepare',
    question: 'How should I prepare for my appointment?',
    answer:
      'Get a full night of sleep, stay hydrated, eat beforehand and wear loose comfortable clothing that gives easy access to the area being worked on. Do not drink alcohol, do not do an intensive workout the day before, and do not shave the area yourself, because your artist will shave it using the correct technique at the start of the session.',
    topics: ['booking', 'tattoo', 'general'],
  },

  /* ── tattoos ── */
  {
    id: 'tattoo-styles',
    question: 'What tattoo styles do your artists work in?',
    answer:
      'InkSmith Studios artists work across realism, traditional, Japanese, blackwork, fine line, colour and watercolour styles. When booking you can choose black and grey, colour, UV or another approach, and each artist profile lists the specialties that artist focuses on.',
    topics: ['tattoo', 'general'],
    link: { label: 'Browse the portfolio', href: '/portfolio' },
  },
  {
    id: 'uv-tattoos',
    question: 'Do you do UV tattoos?',
    answer:
      'Yes, UV tattoos are one of the options offered at InkSmith Studios alongside black and grey and full colour work. Discuss placement and expectations at your free consultation, since UV ink behaves differently from standard ink and suits some designs better than others.',
    topics: ['tattoo'],
  },
  {
    id: 'tattoo-pain',
    question: 'Does getting tattooed hurt?',
    answer:
      'Tattooing is uncomfortable, and how much depends on placement, your own pain tolerance and the length of the session. Areas over bone or thin skin generally feel sharper than fleshy areas. Arriving well-rested, hydrated and having eaten makes a session considerably easier to sit through.',
    topics: ['tattoo', 'general'],
  },

  /* ── piercings ── */
  {
    id: 'piercings-offered',
    question: 'What piercings do you offer?',
    answer:
      'InkSmith Studios offers ear piercings including earlobe, flat, helix, tragus and industrial, facial piercings including eyebrow, nostril and septum, oral piercings including labret, tongue, smiley and snakebite, and body piercings including navel, nipple, dermal and Christina. The studio also handles jewellery changes and removals.',
    topics: ['piercing', 'general'],
    link: { label: 'See piercing services', href: '/services/piercing' },
  },
  {
    id: 'piercing-jewellery',
    question: 'What jewellery do you use for piercings?',
    answer:
      'InkSmith Studios uses implant-grade titanium and gold jewellery for piercings, paired with single-use needles. Implant-grade metals are chosen because they reduce reaction risk and heal more predictably than cheaper alternatives.',
    topics: ['piercing'],
  },
  {
    id: 'piercing-healing-time',
    question: 'How long does a piercing take to heal?',
    answer:
      'Healing time depends on the jewellery: titanium typically takes around two months and stainless steel around six months. Keep cleaning twice daily for the full period, and do not remove or change the jewellery until it has completely healed, because new piercings can shrink almost immediately.',
    topics: ['piercing', 'aftercare'],
    link: { label: 'Read the piercing aftercare guide', href: '/aftercare/piercing' },
  },
  {
    id: 'piercing-change',
    question: 'Can you change or remove my existing piercing jewellery?',
    answer:
      'Yes, piercing change and removal is one of the services you can select when booking at InkSmith Studios. Bring the replacement jewellery if you have a specific piece in mind, and tell the studio if the piercing is still healing.',
    topics: ['piercing', 'booking'],
  },

  /* ── aftercare ── */
  {
    id: 'tattoo-healing-time',
    question: 'How long does a tattoo take to heal?',
    answer:
      'A new tattoo generally heals on the surface in one to two weeks, and sometimes longer. Peeling and itching during that period are completely normal. Wash and apply ointment twice daily for the first three days, switch to unscented lotion on day four, and avoid picking at scabs.',
    topics: ['aftercare', 'tattoo'],
    link: { label: 'Read the tattoo aftercare guide', href: '/aftercare/tattoo' },
  },
  {
    id: 'swim-after-tattoo',
    question: 'Can I swim after getting a tattoo?',
    answer:
      'No. Do not swim while a tattoo is healing, because pools, the ocean, jacuzzis and baths are all off limits and showers only are recommended. Soaking a fresh tattoo risks infection and can pull ink out of the skin. Direct sun exposure should also be avoided until the tattoo is fully healed.',
    topics: ['aftercare', 'tattoo'],
  },
  {
    id: 'peeling-normal',
    question: 'Is it normal for my tattoo to peel and look rough?',
    answer:
      'Yes. Redness, peeling and itching are normal parts of tattoo healing, and a new piece often looks rough for a few days before settling. Do not pick at scabs, because they protect the ink and picking pulls colour out and can cause scarring. Contact the studio or a physician if you see spreading redness, excessive swelling or green discharge.',
    topics: ['aftercare', 'tattoo'],
  },
  {
    id: 'signs-of-infection',
    question: 'How do I know if my tattoo or piercing is infected?',
    answer:
      'Contact InkSmith Studios on +1 (441) 261-8532 or a physician immediately if you notice extreme redness, spreading streaks, excessive swelling, or green or pus-like discharge after the first few days. Some tenderness, mild redness and a whitish-yellow secretion that dries into crust are normal in early healing and are not signs of infection.',
    topics: ['aftercare', 'tattoo', 'piercing'],
  },
  {
    id: 'protect-healed-tattoo',
    question: 'How do I keep a healed tattoo looking good?',
    answer:
      'Use SPF 25 or higher on fully healed tattoos whenever they are exposed. Extreme sun exposure fades tattoos over years, and in the Bermuda climate that matters more than in most places. Keeping the skin moisturised also helps the ink stay sharp.',
    topics: ['aftercare', 'tattoo'],
  },
];

/* ─────────────────────────────── selectors ────────────────────────── */

const byId = new Map(faqs.map((faq) => [faq.id, faq]));

/** Resolves ids in order, silently skipping any that no longer exist. */
export function faqsByIds(ids: string[]): Faq[] {
  return ids.map((id) => byId.get(id)).filter(Boolean) as Faq[];
}

export function faqsByTopic(topic: FaqTopic, limit?: number): Faq[] {
  const matches = faqs.filter((faq) => faq.topics.includes(topic));
  return typeof limit === 'number' ? matches.slice(0, limit) : matches;
}

export function getFaq(id: string): Faq | undefined {
  return byId.get(id);
}

/** Shape required by faqPageSchema. Visible-only links are dropped. */
export function toSchemaFaqs(list: Faq[]): { question: string; answer: string }[] {
  return list.map((faq) => ({ question: faq.question, answer: faq.answer }));
}
