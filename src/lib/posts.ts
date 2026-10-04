import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPosts(): Promise<Post[]> {
  return (await getCollection('posts', ({ data }) =>
    !data.draft && data.pubDate.getTime() <= Date.now()
  )).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export const postUrl = (post: Post) => `/${post.id}/`;
export const tagUrl = (tag: string) => `/tag/${encodeURIComponent(tag)}/`;
const tagLabels: Record<string, string> = {
  data: 'Data science',
  data_eng: 'Data engineering',
  misc: 'Notes',
  perso: 'Personal',
  talk: 'Talks',
  iot: 'IoT',
  chatgpt: 'AI',
  shopify: 'Shopify',
  ericsson: 'Ericsson',
};
export const tagName = (tag: string) => tagLabels[tag] ?? tag;

export function readingTime(post: Post): number {
  const text = (post.body ?? '').replace(/<[^>]*>/g, '').replace(/!?\[([^\]]*)\]\([^)]+\)/g, '$1');
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 220));
}

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(date);
