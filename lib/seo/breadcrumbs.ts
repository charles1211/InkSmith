import type { BreadcrumbItem } from './schema/breadcrumb';
import { getRouteLabel } from './routes';

/**
 * Derives a breadcrumb trail from a path.
 *
 * Labels come from the static route registry where possible; a caller passes
 * `overrides` for dynamic segments whose label lives in the content data or the
 * database (a service name, an area name, an artist's name).
 */
export function crumbsFor(
  path: string,
  overrides: Record<string, string> = {}
): BreadcrumbItem[] {
  const clean = path.split('?')[0].split('#')[0];
  const segments = clean.split('/').filter(Boolean);

  const crumbs: BreadcrumbItem[] = [{ name: 'Home', href: '/' }];

  let href = '';
  for (const segment of segments) {
    href += `/${segment}`;
    crumbs.push({
      name: overrides[href] ?? getRouteLabel(href, titleCase(segment)),
      href,
    });
  }

  return crumbs;
}

function titleCase(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
