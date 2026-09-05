import type { PrepItem, StudioPolicy } from './types';

/**
 * The studio's real policies, extracted verbatim from the booking page's
 * "Studio Policies" modal so the same ten facts drive the modal, the service
 * pages, the FAQ page and the JSON-LD. Markup has been removed — these strings
 * are used inside structured data, which must be plain text.
 */
export const studioPolicies: StudioPolicy[] = [
  {
    id: 'consent-form',
    text: 'All clients must read and sign our Client Information and Consent Form and present a valid ID showing date of birth.',
  },
  {
    id: 'under-18',
    text: 'Clients under 18 must be accompanied by a parent or legal guardian who also presents valid ID.',
  },
  {
    id: 'right-to-refuse',
    text: 'The studio reserves the right to refuse clients who are under the influence of alcohol or drugs, or whose condition makes them unfit for a session.',
  },
  {
    id: 'consultation-deposit',
    text: 'Consultations are free. A deposit is required to secure an appointment slot, and quoted prices are estimates that may change.',
  },
  {
    id: 'no-electronic-designs',
    text: 'The studio does not send electronic copies of custom designs. Designs are viewed in the studio only.',
  },
  {
    id: 'cover-ups',
    text: 'For cover-up projects the artist may suggest changes to the design so that it properly conceals the existing tattoo.',
  },
  {
    id: 'touch-ups',
    text: 'A touch-up may be done free of charge within two weeks of the session if needed. Outside that window regular pricing applies.',
  },
  {
    id: 'out-of-hours',
    text: 'Special appointments outside studio hours require a deposit to secure the slot.',
  },
  {
    id: 'deposit-terms',
    text: 'The deposit is non-refundable and non-transferable. It is forfeited for major design changes, no-shows, failing to cancel at least 48 hours ahead, rescheduling more than twice, or failing to rebook within 90 days.',
  },
  {
    id: 'lateness',
    text: 'If you arrive 15 or more minutes late, the studio may take other clients in your place.',
  },
];

/** Preparation checklist from the booking page's "Read Before You Book" modal. */
export const preparationChecklist: PrepItem[] = [
  {
    title: 'Get enough sleep',
    body: 'Being well-rested keeps you alert and in tune with your body during the session.',
  },
  {
    title: 'Stay hydrated',
    body: 'Hydrated skin takes ink better. Bring a water bottle if you need one.',
  },
  {
    title: 'Wear the right clothes',
    body: 'Choose loose, comfortable clothing. Tight clothes near the tattoo area may affect blood flow.',
  },
  {
    title: 'Be punctual',
    body: 'The studio may take other clients if you are 15 or more minutes late for your appointment.',
  },
];

/** Things to avoid before an appointment, from the same modal. */
export const thingsToAvoid: PrepItem[] = [
  {
    title: 'Alcohol and drugs',
    body: 'We will not proceed if you arrive under the influence. Alcohol thins the blood and creates complications during a session.',
  },
  {
    title: 'Intensive exercise',
    body: 'Avoid heavy workouts before your session. Sore muscles make tattooing more painful.',
  },
  {
    title: 'Damaged or problematic skin',
    body: 'Conditions such as eczema, keloids or rashes need to be discussed with your doctor first.',
  },
  {
    title: 'Shaving the area yourself',
    body: 'Your artist will shave the area at the start of the session using the correct technique.',
  },
];
