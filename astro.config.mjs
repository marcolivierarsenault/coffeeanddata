import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://coffeeanddata.ca',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !/^\/(?:404(?:\.html)?|writing|contact|thank-you|page\d+)\/?$/.test(new URL(page).pathname),
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: false },
  },
});
