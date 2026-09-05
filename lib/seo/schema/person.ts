import { absoluteUrl } from '../url';
import { ID, node, ref } from './core';

export interface PersonSchemaOptions {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  jobTitle?: string;
  /** Specialties — the entity link between a person and the services offered. */
  knowsAbout?: string[];
  /** Verified external profiles only. */
  sameAs?: string[];
}

export function personSchema(options: PersonSchemaOptions) {
  return node('Person', {
    '@id': ID.person(options.slug),
    name: options.name,
    description: options.description,
    image: options.image,
    jobTitle: options.jobTitle,
    url: absoluteUrl(`/artists/${options.slug}`),
    knowsAbout: options.knowsAbout,
    sameAs: options.sameAs,
    worksFor: ref(ID.organization()),
  });
}
