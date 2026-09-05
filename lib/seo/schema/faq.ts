import { ID, node } from './core';

export interface FaqInput {
  question: string;
  answer: string;
}

/**
 * FAQPage markup.
 *
 * Note: Google restricted FAQ *rich results* to government and health sites in
 * 2023. This markup is retained deliberately — it is still consumed by Bing and
 * is one of the highest-value structures for generative engines, which lift
 * question/answer pairs directly. Do not remove it because "FAQ rich results
 * are gone".
 *
 * Emit at most one FAQPage node per page, containing every question.
 */
export function faqPageSchema(path: string, faqs: FaqInput[]) {
  if (!faqs || faqs.length === 0) return undefined;

  return node('FAQPage', {
    '@id': ID.faq(path),
    mainEntity: faqs.map((faq) =>
      node('Question', {
        name: faq.question,
        acceptedAnswer: node('Answer', { text: faq.answer }),
      })
    ),
  });
}
