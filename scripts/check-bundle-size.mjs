// Entry-chunk bundle budget (KAPI 3): the initial JS the browser must download
// before first paint must stay small. The heavy Three.js scene is lazy-loaded
// into its own chunk, so it is intentionally excluded from this budget.
//
// Usage: `node scripts/check-bundle-size.mjs` (run after `npm run build`).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const BUDGET_KB = 200;

const html = readFileSync(join(DIST, 'index.html'), 'utf8');
// Capture the "assets/index-<hash>.js" part regardless of any deploy base path
// (e.g. GitHub Pages serves under /fpv-drone-akademi/).
const match = html.match(/src="[^"]*\/(assets\/index-[^"]+\.js)"/);
if (!match) {
  console.error('✗ Could not find the entry chunk in dist/index.html. Did you run `npm run build`?');
  process.exit(1);
}

const entry = match[1]; // "assets/index-<hash>.js"
const bytes = readFileSync(join(DIST, entry));
const gzipKb = gzipSync(bytes).length / 1024;

const status = gzipKb <= BUDGET_KB ? '✓' : '✗';
console.log(`${status} Entry ${entry}: ${gzipKb.toFixed(1)} KB gzip (budget ${BUDGET_KB} KB)`);

if (gzipKb > BUDGET_KB) {
  console.error(`✗ Entry bundle exceeds the ${BUDGET_KB} KB gzip budget.`);
  process.exit(1);
}
