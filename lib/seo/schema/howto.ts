import { ID, node } from './core';

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface HowToOptions {
  path: string;
  name: string;
  description: string;
  /** ISO 8601 duration, e.g. 'P14D' for fourteen days. */
  totalTime?: string;
  supply?: string[];
  tool?: string[];
  steps: HowToStep[];
}

export function howToSchema(options: HowToOptions) {
  if (!options.steps || options.steps.length === 0) return undefined;

  return node('HowTo', {
    '@id': ID.howTo(options.path),
    name: options.name,
    description: options.description,
    totalTime: options.totalTime,
    supply: options.supply?.map((item) => node('HowToSupply', { name: item })),
    tool: options.tool?.map((item) => node('HowToTool', { name: item })),
    step: options.steps.map((step, index) =>
      node('HowToStep', {
        position: index + 1,
        name: step.name,
        text: step.text,
        image: step.image,
      })
    ),
  });
}
