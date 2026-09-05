import React from 'react';

export interface KeyFact {
  label: string;
  value: React.ReactNode;
}

interface KeyFactsProps {
  facts: KeyFact[];
  title?: string;
  className?: string;
}

/**
 * A definition list of extractable facts (address, hours, policies, pricing
 * factors).
 *
 * `<dl>` is deliberate: label/value pairs are parsed far more reliably by both
 * rich-result extractors and language models than the same information written
 * as prose or laid out with divs.
 */
export function KeyFacts({ facts, title, className = '' }: KeyFactsProps) {
  const populated = facts.filter((fact) => fact.value !== undefined && fact.value !== '');
  if (populated.length === 0) return null;

  return (
    <div className={className}>
      {title && (
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-ink-accent mb-5">
          {title}
        </p>
      )}
      <dl className="divide-y divide-white/5 border-y border-white/5">
        {populated.map((fact) => (
          <div
            key={fact.label}
            className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-6 py-4"
          >
            <dt className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
              {fact.label}
            </dt>
            <dd className="sm:col-span-2 text-gray-300 text-sm leading-relaxed">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default KeyFacts;
