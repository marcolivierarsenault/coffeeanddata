# Selected architecture

The owner chose warm editorial and confirmed that the existing Mailchimp list works.

The new site uses Astro static output, native Markdown content collections, TypeScript and plain CSS. It follows Astro’s standard content and asset pipelines:

- Content: https://docs.astro.build/en/guides/content-collections/
- Images: https://docs.astro.build/en/guides/images/
- RSS: https://docs.astro.build/en/recipes/rss/
- Sitemap: https://docs.astro.build/en/guides/integrations-guide/sitemap/

The articles themselves are rewritten into the new format. There is no old-site renderer, Liquid parser, schema adapter or custom Markdown pipeline. The only migration helper copies missing binary images into local src/assets paths, verifying their original Git checksums. It is not imported by the website.

## Visual direction

Warm paper, dark ink and forest green. Large serif headings, a system sans-serif body font, small monospace metadata, thin rules and generous spacing. The site ships one chosen theme. Earlier alternatives remain as archived HTML prototypes outside production output.

Article prose stays narrow enough to read comfortably; tables and code scroll horizontally when needed. The table of contents uses native details/summary. Markdown images use Astro’s built-in processing. Animated source images pass through its standard image service.

## Editorial workflow

One author, 3–6 posts a year, two additional static pages. Posts are local Markdown files with title, description, pubDate and tags. Optional draft, featured and updatedDate fields are validated at build time.

The archive is complete and works without JavaScript; a small script enhances text filtering. Dates and original URLs stay stable. Old contact and pagination routes redirect, without adapting old content.

No CMS, database or application server is needed. Interactive components can be introduced for particular future articles if they help explain a technical concept.

## Newsletter and hosting

Mailchimp is retained as an ordinary HTML form that posts to the existing audience. The provider handles subscription completion. The copy says 3–6 posts per year and explains the next step. Publishing an article does not automatically send a campaign.

The site builds to static dist output and can remain on GitHub Pages. The LAN preview serves that same output with Nginx. Node is needed to build, not to serve pages.
