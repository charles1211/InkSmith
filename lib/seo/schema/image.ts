import { node } from './core';

export interface ImageObjectOptions {
  url: string;
  caption?: string;
  name?: string;
  width?: number;
  height?: number;
  creator?: string;
}

export function imageObjectSchema(options: ImageObjectOptions) {
  if (!options.url) return undefined;

  return node('ImageObject', {
    url: options.url,
    contentUrl: options.url,
    name: options.name,
    caption: options.caption,
    width: options.width,
    height: options.height,
    creator: options.creator
      ? node('Person', { name: options.creator })
      : undefined,
  });
}

export interface ItemListOptions {
  id?: string;
  name?: string;
  items: (Record<string, unknown> | undefined)[];
}

/** Generic ItemList wrapper, used by collection pages. */
export function itemListSchema(options: ItemListOptions) {
  const members = options.items.filter(Boolean) as Record<string, unknown>[];
  if (members.length === 0) return undefined;

  return node('ItemList', {
    '@id': options.id,
    name: options.name,
    numberOfItems: members.length,
    itemListElement: members.map((item, index) =>
      node('ListItem', { position: index + 1, item })
    ),
  });
}
