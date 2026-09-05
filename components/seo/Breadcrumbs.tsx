import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { breadcrumbListSchema, type BreadcrumbItem } from '../../lib/seo/schema';
import JsonLd from './JsonLd';

export type { BreadcrumbItem };

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Visible breadcrumb trail plus its BreadcrumbList JSON-LD.
 *
 * Both are built from the same `items` array so the markup can never drift from
 * what the user sees — Google requires them to match. The final crumb is not a
 * link and carries `aria-current="page"`.
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length < 2) return null;

  const currentPath = items[items.length - 1].href;

  return (
    <>
      <JsonLd data={breadcrumbListSchema(currentPath, items)} />
      <nav
        aria-label="Breadcrumb"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-2 ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-ink-accent">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-700" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumbs;
