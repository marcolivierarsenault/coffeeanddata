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
- `public/`: logo, favicon, `robots.txt`, and `og-image.png` (the 1200×630 share picture used by LinkedIn, X, Slack, etc.).
- `scripts/`: generated-site tests, plus fixtures recording the original articles (`content-manifest.json`) and the original image URLs (`legacy-image-urls.json`).

## URLs kept from the Jekyll site

- **Articles:** original article URLs are unchanged.
- **Feeds:** RSS is at `/feed.xml`. The sitemap is at `/sitemap-index.xml`, and the old `/sitemap.xml` points to the same file.
- **Images:** every article image the old site served at `/assets/images/posts/...` (67 files) is still served there with the original bytes. The build copies them from `src/assets/images/posts/`, and a test checks each one against its original git checksum. Pages use the optimized `/_astro/` versions.
- **Redirects:** `/writing/`, `/contact/`, `/thank-you/`, `/page2/`–`/page5/`, and the paginated topic pages (`/tag/data/page2/`, …) redirect with HTML refresh pages. GitHub Pages can't send HTTP 301s.
- **Dropped:** the old theme files (`/assets/css/`, `/assets/js/`, background images, the old logo and favicon) and the 21 per-post cover images. Every page now uses the logo card `public/og-image.png` as its share picture.

## Email

Mailchimp is unchanged. Signup lives on `/subscribe/` (linked in the navigation) and at the end of each article; the homepage has no form. The form is a plain HTML POST to the existing audience, with native validation and Mailchimp's bot-trap field. No API key, embed script or server is involved. Campaigns are managed in Mailchimp.

## CI and deployment

GitHub Actions (`.github/workflows/`):

- **`check.yml`** (pull requests):
  - `npm ci` and `npm run verify`
  - then an external link check with lychee
  - plus SonarQube
  - The built site is saved as the `coffeeanddata-preview` artifact and uploaded to staging (see below).
- **`merge.yml`** (push to `main`):
  - the same verify and external-link jobs
  - then deploys `dist/` with the official `actions/upload-pages-artifact` and `actions/deploy-pages`. Deployment runs only if both checks pass.
  - SonarQube runs alongside.

### Staging (PR previews)

Every PR from this repository is also uploaded to **https://staging.coffeeanddata.ca/**, the password-protected nginx container on the home server. The PR shows a *View deployment* button. There's one staging site, so the most recently pushed PR wins. Fork and Dependabot PRs are skipped.

How it works: the `staging` job joins the owner's Tailscale tailnet for the length of the job, as tag `tag:blog-ci`, using GitHub's OIDC token. Tailscale *workload identity federation* means no Tailscale secret is stored in GitHub. The job then pipes the built site with `tar` over Tailscale SSH into the `blog-staging` container. That container is the stock `tailscale/tailscale` image, and the only host folder it can see is the staging web root. Nothing is exposed to the internet, and the tailnet policy lets `tag:blog-ci` reach only that container, on SSH.

What lives where:

- **GitHub repository variables:** `TS_OAUTH_CLIENT_ID` and `TS_AUDIENCE`, from the Tailscale trust credential. They aren't secrets. The job is skipped until `TS_OAUTH_CLIENT_ID` is set.
- **Tailscale trust credential:** OpenID Connect, issuer GitHub Actions, subject `repo:marcolivierarsenault/coffeeanddata:environment:staging`, claim `repository_id=225268035`, scope Auth Keys (write), tag `tag:blog-ci`.
- **Tailnet policy:** grant `tag:blog-ci → tag:blog-staging tcp:22`, an SSH `accept` rule for user `root`, and tests that keep it that narrow.
- **Server (`~/docker-config/red/docker-compose.yml`):**
  ```yaml
  blog-staging:
    image: tailscale/tailscale:stable
    container_name: blog-staging
    restart: unless-stopped
    env_file: [../local_config/blog-staging/tailscale.env]   # one-time TS_AUTHKEY; empty after first start
    environment:
      TS_HOSTNAME: blog-staging
      TS_STATE_DIR: /var/lib/tailscale
      TS_AUTH_ONCE: "true"
      TS_USERSPACE: "true"
      TS_EXTRA_ARGS: --ssh --advertise-tags=tag:blog-staging
    volumes:
      - ../local_config/blog-staging/state:/var/lib/tailscale
      - ../local_config/ftp/data:/site
  ```

Manual upload without CI, from the LAN: `npm run build && rsync -avz --delete dist/ marco@192.168.2.100:~/docker-config/local_config/ftp/data/`

External links follow the old HTMLProofer rules: 403/429/500/999 responses are tolerated. Twitter/X, Google and the Vimeo player block automated checks, so they are skipped (`lychee.toml`). When a third-party page dies, fix the article rather than ignoring the URL.

One-time repository setup for Actions-based Pages deployment:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions** (it currently publishes from the `gh-pages` branch). The custom domain `coffeeanddata.ca` and HTTPS setting stay as they are; Actions deployments don't use a `CNAME` file.
2. **Settings → Environments → github-pages → Deployment branches**: add `main`. It currently allows only `gh-pages`, `master` and `release`, so a deploy from `main` would be rejected.
3. Optional: protect `main` and require the *Verify site*, *External links* and *SonarQube* checks.

Once Actions deployment works, the `gh-pages` branch is no longer used.
