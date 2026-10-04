# Coffee and Data

Source for [coffeeanddata.ca](https://coffeeanddata.ca): an Astro static site with native Markdown posts, a complete archive on the homepage, topic pages, About, Subscribe, and the existing Mailchimp list.

## Local development

Use Node 24 (`.nvmrc`):

```sh
nvm use
npm ci
npm run dev                       # http://localhost:4321
npm run dev -- --host 0.0.0.0     # reachable from other machines on the LAN
```

Before opening a PR:

```sh
npm run verify        # astro check + astro build + generated-site tests
npm run check:links   # external links in dist/, needs lychee (brew install lychee)
npm run preview       # serve the production build from dist/
```

`npm run verify` type-checks the site, builds it, and runs `scripts/site.test.mjs` against `dist/`. The tests cover:

- original URLs, titles and dates
- internal links and heading anchors
- optimized images
- legacy image URLs
- code blocks and Mailchimp forms
- RSS, the sitemap and redirects

`npm run check:links` uses the same `lychee.toml` as CI.

## Writing

Copy [docs/post-template.md](docs/post-template.md) to `src/content/posts/your-url-slug.md`:

```yaml
---
title: "Your article title"
description: "A short summary."
pubDate: 2026-10-04
tags: [data_eng]
draft: true
---
```

Write normal Markdown below the frontmatter, and remove `draft: true` when publishing. Drafts and future-dated posts are excluded from the public site.

Filenames define article URLs exactly, including case (`PR-reviews-for-SQL-code.md` → `/PR-reviews-for-SQL-code/`). Do not rename published files.

Optional fields:

- `updatedDate`
- `featured: true`: the post leads the homepage. Without it, the newest post does.

Put illustrations under `src/assets/images/posts/<yyyymmdd>/` and reference them with Markdown:

```md
![A useful description](../../assets/images/posts/20261004/diagram.png)

*Optional caption.*
```

Astro optimizes local images and emits them under `/_astro/`. Tables and fenced code use Astro's Markdown renderer and syntax highlighting. Video embeds are plain lazy-loaded `<iframe>`s.

## Structure

- `src/content.config.ts`: content collection and frontmatter schema.
- `src/content/posts/`: articles.
- `src/assets/images/posts/`: article illustrations.
- `src/pages/`: pages, article routes, RSS, the legacy `/sitemap.xml`, and redirects.
- `src/layouts/`, `src/components/`, `src/styles/global.css`: layout and design.
- `src/lib/site.ts`: author, social links and the Mailchimp audience.
- `public/`: logo, favicon, `robots.txt`.
- `scripts/`: generated-site tests, plus fixtures recording the original articles (`content-manifest.json`) and the original image URLs (`legacy-image-urls.json`).

## URLs kept from the Jekyll site

- **Articles:** original article URLs are unchanged.
- **Feeds:** RSS is at `/feed.xml`. The sitemap is at `/sitemap-index.xml`, and the old `/sitemap.xml` points to the same file.
- **Images:** every article image the old site served at `/assets/images/posts/...` (67 files) is still served there with the original bytes. The build copies them from `src/assets/images/posts/`, and a test checks each one against its original git checksum. Pages use the optimized `/_astro/` versions.
- **Redirects:** `/writing/`, `/contact/`, `/thank-you/`, `/page2/`–`/page5/`, and the paginated topic pages (`/tag/data/page2/`, …) redirect with HTML refresh pages. GitHub Pages can't send HTTP 301s.
- **Dropped:** the old theme files (`/assets/css/`, `/assets/js/`, background images, the old logo and favicon) and the 21 per-post cover images. The covers were only used as social-share pictures, so posts no longer set `og:image`.

## Email

Mailchimp is unchanged. Signup lives on `/subscribe/` (linked in the navigation) and at the end of each article; the homepage has no form. The form is a plain HTML POST to the existing audience, with native validation and Mailchimp's bot-trap field. No API key, embed script or server is involved. Campaigns are managed in Mailchimp.

## CI and deployment

GitHub Actions (`.github/workflows/`):

- **`check.yml`** (pull requests):
  - `npm ci` and `npm run verify`
  - then an external link check with lychee
  - plus SonarQube
  - The built site is saved as the `coffeeanddata-preview` artifact.
- **`merge.yml`** (push to `main`):
  - the same verify and external-link jobs
  - then deploys `dist/` with the official `actions/upload-pages-artifact` and `actions/deploy-pages`. Deployment runs only if both checks pass.
  - SonarQube runs alongside.

External links follow the old HTMLProofer rules: 403/429/500/999 responses are tolerated. Twitter/X, Google and the Vimeo player block automated checks, so they are skipped (`lychee.toml`). When a third-party page dies, fix the article rather than ignoring the URL.

One-time repository setup for Actions-based Pages deployment:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions** (it currently publishes from the `gh-pages` branch). The custom domain `coffeeanddata.ca` and HTTPS setting stay as they are; Actions deployments don't use a `CNAME` file.
2. **Settings → Environments → github-pages → Deployment branches**: add `main`. It currently allows only `gh-pages`, `master` and `release`, so a deploy from `main` would be rejected.
3. Optional: protect `main` and require the *Verify site*, *External links* and *SonarQube* checks.

Once Actions deployment works, the `gh-pages` branch is no longer used.
