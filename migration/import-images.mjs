// One-time binary asset import. Article Markdown is already native Astro content.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(new URL('./images.json', import.meta.url), 'utf8'));
const gitHash = bytes => createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
let downloaded = 0;
for (const asset of manifest.assets) {
  const target = resolve(root, asset.path);
  if (!target.startsWith(resolve(root, 'src/assets/images') + '/')) {
    throw new Error(`Unsafe asset path: ${asset.path}`);
  }
  try {
    await access(target);
    continue;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const url = `https://raw.githubusercontent.com/${manifest.repository}/${manifest.ref}/${asset.source}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${asset.path}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (gitHash(bytes) !== asset.sha) throw new Error(`Checksum mismatch: ${asset.path}`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes, { flag: 'wx' });
  downloaded++;
}
console.log(`Imported ${downloaded} missing images; ${manifest.assets.length - downloaded} local images retained.`);
