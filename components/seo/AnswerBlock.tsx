import React from 'react';

interface AnswerBlockProps {
  children: React.ReactNode;
  /** Optional lead-in label, e.g. "In short". */
  label?: string;
  className?: string;
}

/**
 * The answer-first content primitive.
 *
 * Directly beneath the h1, this holds one to three sentences that completely
 * answer the page's core question with no outside context — no pronouns whose
 * referent is elsewhere, no "as mentioned above". This is the block a
 * generative engine is most likely to lift verbatim, so it must stand alone.
 *
 * The `data-answer` attribute is the selector referenced by the page's
 * `speakable` schema.
 */
export function AnswerBlock({ children, label, className = '' }: AnswerBlockProps) {
  return (
    <div
      data-answer
      className={`relative border-l-2 border-ink-accent bg-white/[0.02] px-6 py-5 sm:px-8 sm:py-6 ${className}`}
    >
      {label && (
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-ink-accent mb-3">
          {label}
        </p>
      )}
      <p className="text-gray-200 text-base sm:text-lg font-light leading-relaxed">
        {children}
      </p>
    </div>
  );
}

export default AnswerBlock;
