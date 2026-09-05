import { absoluteUrl } from '../url';
import { ID, node } from './core';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

/**
 * Google requires breadcrumb markup to match what the user can see, so this is
 * always built from the same array the visible <nav> renders — see
 * `components/seo/Breadcrumbs.tsx`.
 */
export function breadcrumbListSchema(path: string, items: BreadcrumbItem[]) {
  if (!items || items.length < 2) return undefined;

  return node('BreadcrumbList', {
    '@id': ID.breadcrumb(path),
    itemListElement: items.map((item, index) =>
      node('ListItem', {
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.href),
      })
    ),
  });
}
