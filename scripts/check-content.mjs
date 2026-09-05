import { loadContent } from './load-content.mjs';

/**
 * Content quality gate.
 *
 * The location pages are the part of this site most likely to degrade into
 * templated doorway pages, which would hurt rankings rather than help them.
 * These assertions are the floor: they cannot detect spun prose, but they do
 * catch thin content, duplicated boilerplate and broken cross-references.
 *
 * Run with `npm run check:content`.
 */

const MIN_AREA_INTRO_CHARS = 900;
const MIN_AREA_FAQS = 2;
const MAX_META_TITLE = 60;
const META_DESCRIPTION_RANGE = [110, 165];

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}
function warn(message) {
  warnings.push(message);
}

function assertUnique(label, values) {
  const seen = new Map();
  for (const { key, owner } of values) {
    const normalised = String(key).trim().toLowerCase();
    if (!normalised) continue;
    if (seen.has(normalised)) {
      fail(`${label}: "${owner}" duplicates "${seen.get(owner) ?? seen.get(normalised)}" — ${truncate(key)}`);
    } else {
      seen.set(normalised, owner);
    }
  }
}

function truncate(value, length = 70) {
  const text = String(value);
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

const { faqs, services, areas, aftercare } = await loadContent();

const faqIds = new Set(faqs.faqs.map((faq) => faq.id));
const serviceSlugs = new Set(services.services.map((service) => service.slug));
const areaSlugs = new Set(areas.serviceAreas.map((area) => area.slug));

/* ─────────────────────────────── FAQs ─────────────────────────────── */

assertUnique(
  'Duplicate FAQ id',
  faqs.faqs.map((faq) => ({ key: faq.id, owner: faq.id }))
);
assertUnique(
  'Duplicate FAQ question',
  faqs.faqs.map((faq) => ({ key: faq.question, owner: faq.id }))
);

for (const faq of faqs.faqs) {
  if (!faq.question.trim().endsWith('?')) {
    fail(`FAQ "${faq.id}": question does not end with a question mark.`);
  }
  const words = faq.answer.trim().split(/\s+/).length;
  if (words < 25) {
    fail(`FAQ "${faq.id}": answer is only ${words} words — too thin to stand alone.`);
  }
  if (words > 120) {
    warn(`FAQ "${faq.id}": answer is ${words} words. Consider tightening it.`);
  }
  // An answer that references its surroundings breaks when lifted in isolation.
  if (/\b(as (mentioned|noted) above|see above|as stated earlier)\b/i.test(faq.answer)) {
    fail(`FAQ "${faq.id}": answer refers to other content and will not stand alone.`);
  }
  if (!faq.topics?.length) {
    fail(`FAQ "${faq.id}": has no topics, so no page will surface it.`);
  }
}

/* ───────────────────────────── services ───────────────────────────── */

for (const service of services.services) {
  const where = `Service "${service.slug}"`;
  if (service.metaTitle.length > MAX_META_TITLE) {
    warn(`${where}: metaTitle is ${service.metaTitle.length} chars (target <= ${MAX_META_TITLE}).`);
  }
  const descLength = service.metaDescription.length;
  if (descLength < META_DESCRIPTION_RANGE[0] || descLength > META_DESCRIPTION_RANGE[1]) {
    warn(`${where}: metaDescription is ${descLength} chars (target ${META_DESCRIPTION_RANGE.join('-')}).`);
  }
  if (!service.answer || service.answer.split(/\s+/).length < 20) {
    fail(`${where}: answer block is missing or too short to be extractable.`);
  }
  for (const id of service.faqIds) {
    if (!faqIds.has(id)) fail(`${where}: references unknown FAQ id "${id}".`);
  }
  for (const slug of service.relatedServiceSlugs) {
    if (!serviceSlugs.has(slug)) fail(`${where}: relatedServiceSlugs has unknown slug "${slug}".`);
    if (slug === service.slug) fail(`${where}: relatedServiceSlugs links to itself.`);
  }
  if (service.aftercareSlug && !aftercare.getAftercareGuide(service.aftercareSlug)) {
    fail(`${where}: aftercareSlug "${service.aftercareSlug}" has no guide.`);
  }
  if (!service.keyFacts?.length) fail(`${where}: has no keyFacts.`);
}

/* ──────────────────────────── service areas ───────────────────────── */

const studioAreas = areas.serviceAreas.filter((area) => area.isStudioLocation);
if (studioAreas.length !== 1) {
  fail(`Exactly one service area must be the studio location; found ${studioAreas.length}.`);
}

for (const area of areas.serviceAreas) {
  const where = `Area "${area.slug}"`;
  const introLength = area.intro.join(' ').length;
  if (introLength < MIN_AREA_INTRO_CHARS) {
    fail(`${where}: intro is ${introLength} chars, below the ${MIN_AREA_INTRO_CHARS} floor. Thin location pages read as doorway pages.`);
  }
  if (!area.localFaqs || area.localFaqs.length < MIN_AREA_FAQS) {
    fail(`${where}: has ${area.localFaqs?.length ?? 0} local FAQs, needs at least ${MIN_AREA_FAQS} unique to this area.`);
  }
  if (area.metaTitle.length > MAX_META_TITLE) {
    warn(`${where}: metaTitle is ${area.metaTitle.length} chars (target <= ${MAX_META_TITLE}).`);
  }
  const descLength = area.metaDescription.length;
  if (descLength < META_DESCRIPTION_RANGE[0] || descLength > META_DESCRIPTION_RANGE[1]) {
    warn(`${where}: metaDescription is ${descLength} chars (target ${META_DESCRIPTION_RANGE.join('-')}).`);
  }
  if (!area.travel?.summary) fail(`${where}: travel.summary is required.`);
  if (!area.isStudioLocation && !area.travel.byCar && !area.travel.byFerry && !area.travel.byBus) {
    fail(`${where}: needs at least one concrete travel route.`);
  }
  for (const slug of area.serviceSlugs) {
    if (!serviceSlugs.has(slug)) fail(`${where}: serviceSlugs has unknown slug "${slug}".`);
  }
  for (const slug of area.nearbyAreaSlugs) {
    if (!areaSlugs.has(slug)) fail(`${where}: nearbyAreaSlugs has unknown slug "${slug}".`);
    if (slug === area.slug) fail(`${where}: nearbyAreaSlugs links to itself.`);
  }
}

// The core anti-doorway assertion: no two areas may share their extractable copy.
assertUnique(
  'Duplicate area answer',
  areas.serviceAreas.map((area) => ({ key: area.answer, owner: area.slug }))
);
assertUnique(
  'Duplicate area intro opener',
  areas.serviceAreas.map((area) => ({ key: area.intro[0], owner: area.slug }))
);
assertUnique(
  'Duplicate area meta description',
  areas.serviceAreas.map((area) => ({ key: area.metaDescription, owner: area.slug }))
);
assertUnique(
  'Duplicate area travel summary',
  areas.serviceAreas.map((area) => ({ key: area.travel.summary, owner: area.slug }))
);
assertUnique(
  'Duplicate local FAQ question',
  areas.serviceAreas.flatMap((area) =>
    area.localFaqs.map((faq) => ({ key: faq.question, owner: area.slug }))
  )
);

/* ───────────────────────────── aftercare ──────────────────────────── */

for (const guide of aftercare.aftercareGuides) {
  const where = `Aftercare "${guide.slug}"`;
  for (const id of guide.faqIds) {
    if (!faqIds.has(id)) fail(`${where}: references unknown FAQ id "${id}".`);
  }
  if (aftercare.aftercareSteps(guide).length === 0) {
    fail(`${where}: produces no HowTo steps.`);
  }
  if (!guide.answer) fail(`${where}: answer block is required.`);
}

/* ────────────────────────────── report ────────────────────────────── */

for (const warning of warnings) console.warn(`  warn  ${warning}`);
for (const error of errors) console.error(`  FAIL  ${error}`);

const counts = [
  `${faqs.faqs.length} FAQs`,
  `${services.services.length} services`,
  `${areas.serviceAreas.length} service areas`,
  `${aftercare.aftercareGuides.length} aftercare guides`,
].join(', ');

if (errors.length) {
  console.error(`\ncheck-content: ${errors.length} error(s), ${warnings.length} warning(s). Checked ${counts}.`);
  process.exit(1);
}

console.log(`check-content: OK — ${counts}. ${warnings.length} warning(s).`);
