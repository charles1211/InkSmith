import { siteConfig } from '../site.config';
import { getSiteUrl } from '../url';
import { ID, node, ref } from './core';

export function webSiteSchema() {
  const search = siteConfig.searchAction;

  return node('WebSite', {
    '@id': ID.website(),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: getSiteUrl(),
    inLanguage: siteConfig.htmlLang,
    publisher: ref(ID.organization()),
    // Only emitted when a real on-site search endpoint is configured. Declaring
    // a SearchAction that does not resolve is worse than declaring none.
    potentialAction: search
      ? node('SearchAction', {
          target: node('EntryPoint', { urlTemplate: search.urlTemplate }),
          'query-input': search.queryInput,
        })
      : undefined,
  });
}
