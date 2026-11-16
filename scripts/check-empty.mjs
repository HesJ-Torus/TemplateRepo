// npm run check-empty
//
// Pages CMS deletes any field that is left empty when a client saves. If a
// component expects that field to exist, the build crashes on Cloudflare.
//
// This script copies the site to a temporary folder, empties every content
// field (as if the client had cleared everything), and builds that copy.
// Your real files are never touched.

import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const skip = new Set(['node_modules', '.git', 'dist', '.astro', '.claude', '.agents']);

// Fields Pages CMS marks as required, so a client can never empty them.
const keep = { 'business.json': ['name'], 'home.json': [] };

const temp = await mkdtemp(join(tmpdir(), 'studio-empty-check-'));
let ok = false;
try {
  await cp(root, temp, {
    recursive: true,
    filter: (src) => !skip.has(relative(root, src).split(sep)[0]),
  });
  // Share the real node_modules instead of copying it ('junction' works on Windows without admin).
  await symlink(join(root, 'node_modules'), join(temp, 'node_modules'), 'junction');

  for (const [file, required] of Object.entries(keep)) {
    const path = join(temp, 'src', 'content', file);
    const data = JSON.parse(await readFile(path, 'utf8'));
    const emptied = Object.fromEntries(required.filter((k) => k in data).map((k) => [k, data[k]]));
    await writeFile(path, JSON.stringify(emptied, null, 2));
  }

  console.log('Building the site with every optional content field removed...\n');
  const result = spawnSync(process.execPath, [join(root, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build'], {
    cwd: temp,
    stdio: 'inherit',
  });
  ok = result.status === 0;
} finally {
  await rm(temp, { recursive: true, force: true });
}

if (ok) {
  console.log('\nPassed: the site still builds when a client empties every field.');
} else {
  console.error('\nFailed: a component crashes when content is missing. See the error above.');
  console.error('Fix it with fallbacks such as  (list ?? []).map(...)  or  text ?? ""');
  process.exit(1);
}
