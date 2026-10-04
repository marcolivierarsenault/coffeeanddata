import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
const site = 'https://coffeeanddata.ca';
const retained = JSON.parse(await readFile(new URL('./content-manifest.json', import.meta.url), 'utf8'));
const legacyImages = JSON.parse(await readFile(new URL('./legacy-image-urls.json', import.meta.url), 'utf8')).urls;
const gitBlobSha = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return groups.flat();
}

const htmlFiles = (await filesIn(dist)).filter(path => path.endsWith('.html'));
const pages = new Map(await Promise.all(htmlFiles.map(async path => {
  const text = await readFile(path, 'utf8');
  return [path, { $: load(text), text }];
})));
const routeFor = path => '/' + relative(dist, path).split('\\').join('/').replace(/index\.html$/, '');
const isRedirect = $ => $('meta[http-equiv="refresh"]').length > 0;
const isArticle = text => text.includes('"@type":"BlogPosting"');
const articlePages = [...pages.values()].filter(page => isArticle(page.text));

async function targetFor(url) {
  const path = resolve(dist, '.' + decodeURIComponent(url.pathname));
  assert.ok(path === dist || path.startsWith(dist + '/'), 'Path outside build output');
  const candidates = [path, resolve(path, 'index.html')];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      if (candidate.endsWith('.html') || relative(dist, candidate).includes('.')) return candidate;
    } catch {}
  }
  throw new Error('Missing internal target: ' + url.pathname);
}

test('article slugs match the original case-sensitive Jekyll /:title permalinks', () => {
  for (const original of retained) {
    const jekyllTitle = original.source.replace(/^_posts\/\d{4}-\d{2}-\d{2}-/, '').replace(/\.(?:md|markdown|html)$/, '');
    assert.equal(original.slug, jekyllTitle, original.source);
  }
});

test('all 22 original article URLs remain available with Mailchimp signup', () => {
  for (const original of retained) {
    const page = pages.get(resolve(dist, original.slug, 'index.html'));
    assert.ok(page, 'Missing article: ' + original.slug);
    assert.equal(page.$('h1').text(), original.title);
    assert.equal(page.$('.post-meta time').first().attr('datetime'), new Date(original.date).toISOString());
    assert.ok(page.$('form[action*="list-manage.com/subscribe/post"][method="post"]').length);
    assert.ok(page.$('input[name="EMAIL"][type="email"][required]').length);
  }
});

test('pages have one heading, canonical metadata and unique IDs', () => {
  for (const [path, { $ }] of pages) {
    if (isRedirect($)) continue;
    assert.equal($('h1').length, 1, path);
    const canonical = $('link[rel="canonical"]').attr('href');
    assert.ok(canonical && new URL(canonical).origin === site, path);
    assert.ok($('meta[name="description"]').attr('content'), path);
    const ids = $('[id]').toArray().map(element => $(element).attr('id'));
    assert.equal(new Set(ids).size, ids.length, 'Duplicate IDs: ' + path);
  }
});

test('every local link, image, stylesheet and heading fragment resolves', async () => {
  for (const [path, { $ }] of pages) {
    if (isRedirect($)) continue;
    const base = site + routeFor(path);
    const refs = $('[href], [src]').toArray().flatMap(element =>
      [$(element).attr('href'), $(element).attr('src')].filter(Boolean));
    for (const ref of refs) {
      const url = new URL(ref, base);
      if (!['http:', 'https:'].includes(url.protocol) || url.origin !== site) continue;
      const target = await targetFor(url);
      if (url.hash && pages.has(target)) {
        const id = decodeURIComponent(url.hash.slice(1));
        const targetPage = pages.get(target).$;
        assert.ok(targetPage('[id]').toArray().some(element => targetPage(element).attr('id') === id),
          routeFor(path) + ': missing fragment ' + ref);
      }
    }
  }
});

test('404 metadata points to the emitted static error page', () => {
  const page = pages.get(resolve(dist, '404.html'));
  assert.ok(page, 'Missing 404.html');
  assert.equal(page.$('link[rel="canonical"]').attr('href'), site + '/404.html');
  assert.equal(page.$('meta[property="og:url"]').attr('content'), site + '/404.html');
  assert.equal(page.$('meta[name="robots"]').attr('content'), 'noindex');
});

test('homepage lists every published article without a signup form', () => {
  const page = pages.get(resolve(dist, 'index.html'));
  assert.equal(page.$('.home-spotlight article').length, 1);
  assert.equal(page.$('a[href="#all-writing"]').length, 1);
  assert.equal(page.$('.home-archive #all-writing').length, 1);
  const links = page.$('[data-post] h3 a').toArray().map(element => page.$(element).attr('href'));
  assert.equal(links.length, articlePages.length);
  assert.equal(new Set(links).size, links.length);
  for (const original of retained) assert.ok(links.includes('/' + original.slug + '/'), original.slug);
  assert.equal(page.$('form[action*="list-manage.com"]').length, 0);
  const subscribe = pages.get(resolve(dist, 'subscribe/index.html'));
  assert.ok(subscribe.$('form[action*="list-manage.com/subscribe/post"]').length);
});

test('Astro RSS includes all published article pages', async () => {
  const feed = load(await readFile(resolve(dist, 'feed.xml'), 'utf8'), { xmlMode: true });
  assert.equal(feed('channel > item').length, articlePages.length);
  for (const original of retained) {
    assert.ok(feed('item > link').toArray().some(element =>
      feed(element).text() === site + '/' + original.slug + '/'), original.slug);
  }
});

test('Astro sitemap lists public pages and excludes retired routes', async () => {
  const index = load(await readFile(resolve(dist, 'sitemap-index.xml'), 'utf8'), { xmlMode: true });
  const maps = index('sitemap > loc').toArray().map(element => index(element).text());
  assert.ok(maps.length > 0);
  const entries = [];
  for (const url of maps) {
    const text = await readFile(resolve(dist, '.' + new URL(url).pathname), 'utf8');
    const map = load(text, { xmlMode: true });
    entries.push(...map('url > loc').toArray().map(element => map(element).text()));
  }
  for (const route of ['/', '/about/', '/subscribe/', ...retained.map(post => '/' + post.slug + '/')]) {
    assert.ok(entries.includes(site + route), route);
  }
  assert.ok(entries.every(url => !/^\/(?:404(?:\.html)?|writing|contact|thank-you|(?:tag\/[^/]+\/)?page\d+)\/?$/.test(new URL(url).pathname)));
});

test('retired archive, contact and pagination routes use Astro redirects', () => {
  for (const route of ['writing', 'contact', 'thank-you', 'page2', 'page3', 'page4', 'page5', 'tag/data/page2', 'tag/data/page3', 'tag/shopify/page2']) {
    const page = pages.get(resolve(dist, route, 'index.html'));
    assert.ok(page && isRedirect(page.$), route);
  }
});

test('legacy /sitemap.xml points to the same sitemaps as the Astro sitemap index', async () => {
  const locs = async file => {
    const $ = load(await readFile(resolve(dist, file), 'utf8'), { xmlMode: true });
    return $('sitemap > loc').toArray().map(element => $(element).text()).sort();
  };
  const legacy = await locs('sitemap.xml');
  assert.ok(legacy.length > 0);
  assert.deepEqual(legacy, await locs('sitemap-index.xml'));
});

test('technical posts render native code blocks and optimized local images', () => {
  const sql = pages.get(resolve(dist, 'PR-reviews-for-SQL-code', 'index.html')).$;
  assert.ok(sql('pre.astro-code').length >= 6);
  const spark = pages.get(resolve(dist, 'spark-join-using-regex', 'index.html')).$;
  assert.ok(spark('table thead th').length >= 3);
  let images = 0;
  for (const page of articlePages) {
    page.$('.prose img').each((_, element) => {
      const image = page.$(element);
      if (/^https?:\/\//.test(image.attr('src') ?? '')) return;
      assert.ok(image.attr('src')?.startsWith('/_astro/'), 'Article image bypasses Astro assets');
      assert.ok(Number(image.attr('width')) > 0 && Number(image.attr('height')) > 0, 'Image dimensions missing');
      images++;
    });
  }
  assert.ok(images >= 67);
});

test('every image URL the Jekyll site published still serves the original bytes', async () => {
  assert.equal(legacyImages.length, 67);
  for (const { url, sha } of legacyImages) {
    const bytes = await readFile(resolve(dist, '.' + url)).catch(() => assert.fail('Missing legacy image: ' + url));
    assert.equal(gitBlobSha(bytes), sha, 'Changed legacy image: ' + url);
  }
});

