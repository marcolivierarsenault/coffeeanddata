import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/posts';
import { site } from '../lib/site';

export const GET: APIRoute = async (context) => rss({
  title: site.name,
  description: site.description,
  site: context.site!,
  items: (await getPosts()).map(post => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    link: postUrl(post),
    categories: post.data.tags,
  })),
  customData: '<language>en</language>',
});
