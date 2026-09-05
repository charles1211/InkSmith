import { siteConfig } from '../site.config';
import { absoluteUrl } from '../url';
import { ID, node, ref } from './core';

export type WebPageType =
  | 'WebPage'
  | 'CollectionPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'ProfilePage'
  | 'ItemPage'
  | 'FAQPage';

export interface WebPageOptions {
  path: string;
  name: string;
  description: string;
  type?: WebPageType;
  primaryImage?: string;
  datePublished?: string;
  dateModified?: string;
  /** Set when the page also emits a BreadcrumbList, to link the two nodes. */
  hasBreadcrumb?: boolean;
  /**
   * CSS selectors marking the answer-first content on the page. Signals to
   * voice and generative surfaces which text is the extractable answer.
   */
  speakableSelectors?: string[];
}

export function webPageSchema(options: WebPageOptions) {
  const url = absoluteUrl(options.path);

  return node(options.type ?? 'WebPage', {
    '@id': ID.webPage(options.path),
    url,
    name: options.name,
    description: options.description,
    inLanguage: siteConfig.htmlLang,
    isPartOf: ref(ID.website()),
    about: ref(ID.organization()),
    primaryImageOfPage: options.primaryImage
      ? node('ImageObject', { url: options.primaryImage })
      : undefined,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    breadcrumb: options.hasBreadcrumb ? ref(ID.breadcrumb(options.path)) : undefined,
    speakable: options.speakableSelectors?.length
      ? node('SpeakableSpecification', {
          cssSelector: options.speakableSelectors,
        })
      : undefined,
  });
}
