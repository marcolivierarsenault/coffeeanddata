import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// The Jekyll site served post images at /assets/images/posts/... Search engines,
// feed readers and old social cards still use those URLs, so the build copies the
// originals there unchanged. Pages themselves use Astro's optimized /_astro/ files.
const legacyPostImages = {
  name: 'legacy-post-image-urls',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      await cp(fileURLToPath(new URL('./src/assets/images/posts/', import.meta.url)),
        fileURLToPath(new URL('assets/images/posts/', dir)), { recursive: true });
    },
  },
};

export default defineConfig({
  site: 'https://coffeeanddata.ca',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [
    legacyPostImages,
    sitemap({
      filter: (page) => !/^\/(?:404(?:\.html)?|writing|contact|thank-you|(?:tag\/[^/]+\/)?page\d+)\/?$/.test(new URL(page).pathname),
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: false },
  },
});
