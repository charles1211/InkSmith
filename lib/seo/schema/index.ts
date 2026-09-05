export { compact, graph, node, ref, ID } from './core';
export { organizationSchema, localBusinessSchema } from './organization';
export type { LocalBusinessOptions } from './organization';
export { webSiteSchema } from './website';
export { webPageSchema } from './webpage';
export type { WebPageOptions, WebPageType } from './webpage';
export { serviceSchema } from './service';
export type { ServiceSchemaOptions } from './service';
export { personSchema } from './person';
export type { PersonSchemaOptions } from './person';
export { faqPageSchema } from './faq';
export type { FaqInput } from './faq';
export { breadcrumbListSchema } from './breadcrumb';
export type { BreadcrumbItem } from './breadcrumb';
export { howToSchema } from './howto';
export type { HowToOptions, HowToStep } from './howto';
export { imageObjectSchema, itemListSchema } from './image';
export type { ImageObjectOptions, ItemListOptions } from './image';

import { breadcrumbListSchema, type BreadcrumbItem } from './breadcrumb';
import { graph } from './core';
import { faqPageSchema, type FaqInput } from './faq';
import { organizationSchema } from './organization';
import { webPageSchema, type WebPageType } from './webpage';
import { webSiteSchema } from './website';

export interface PageGraphOptions {
  path: string;
  name: string;
  description: string;
  pageType?: WebPageType;
  /** Visible breadcrumb trail. Must match what the page renders. */
  crumbs?: BreadcrumbItem[];
  faqs?: FaqInput[];
  primaryImage?: string;
  speakableSelectors?: string[];
  /** Page-specific nodes: Service, Person, HowTo, ItemList, scoped LocalBusiness. */
  extra?: (Record<string, unknown> | undefined)[];
}

/**
 * Assembles a complete page graph so pages stay one-liners.
 *
 * Organization and WebSite are repeated on every page by design. With stable
 * @ids that is the recommended pattern, and it means any single page can be
 * ingested standalone by a crawler or an LLM without needing the home page.
 */
export function pageGraph(options: PageGraphOptions) {
  const hasBreadcrumb = Boolean(options.crumbs && options.crumbs.length > 1);

  return graph(
    organizationSchema(),
    webSiteSchema(),
    webPageSchema({
      path: options.path,
      name: options.name,
      description: options.description,
      type: options.pageType,
      primaryImage: options.primaryImage,
      hasBreadcrumb,
      speakableSelectors: options.speakableSelectors,
    }),
    hasBreadcrumb ? breadcrumbListSchema(options.path, options.crumbs!) : undefined,
    faqPageSchema(options.path, options.faqs ?? []),
    ...(options.extra ?? [])
  );
}
