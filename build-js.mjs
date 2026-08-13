/**
 * build-js.mjs
 *
 * Concat semua file JS dari public/js lalu minify dengan esbuild.
 * Tidak pakai module bundling agar semua global function tetap
 * tersedia di window scope.
 *
 * Output: public/build/assets/app-js-[hash].js
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { transform } from 'esbuild';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

const JS_FILES = [
    'toast.js',
    'settings.js',
    'favorites.js',
    'bookmarks.js',
    'last-read.js',
    'audio.js',
    'tajweed.js',
    'modals.js',
    'navigation.js',
    'script.js',
    'usage.js',
    'backup.js',
    'janji-allah.js',
    'hadist.js',
    'prayer-time.js',
    'pwa.js',
];

const jsDir       = resolve(__dirname, 'public/js');
const buildDir    = resolve(__dirname, 'public/build/assets');
const manifestPath = resolve(__dirname, 'public/build/manifest.json');

// 1. Concat semua file
const combined = JS_FILES
    .map(f => readFileSync(resolve(jsDir, f), 'utf8'))
    .join('\n\n');

// 2. Minify — jangan rename identifiers agar global function names tetap sama
const result = await transform(combined, {
    loader: 'js',
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: false,
    target: 'es2017',
});

// 3. Extract semua nama function top-level dan assign ke window
//    Diperlukan agar fungsi bisa dipanggil dari script inline di Blade
const fnNames = [];
const fnRegex = /^function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*[\({]/gm;
let match;
while ((match = fnRegex.exec(combined)) !== null) {
    fnNames.push(match[1]);
}
const windowAssign = fnNames
    .filter((v, i, arr) => arr.indexOf(v) === i) // deduplicate
    .map(n => `window.${n}=${n}`)
    .join(';') + ';';

const finalCode = result.code + '\n' + windowAssign;

// 4. Generate hash dan tulis file
const hash = createHash('sha256').update(finalCode).digest('hex').slice(0, 8);
const outFileName = `app-js-${hash}.js`;
const outPath = resolve(buildDir, outFileName);

mkdirSync(buildDir, { recursive: true });
writeFileSync(outPath, finalCode, 'utf8');

// 5. Update manifest.json
let manifest = {};
try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (e) { /* manifest belum ada */ }

manifest['resources/js/app.js'] = {
    file: `assets/${outFileName}`,
    src: 'resources/js/app.js',
    isEntry: true,
};

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

// 6. Log
const originalSize = Buffer.byteLength(combined, 'utf8');
const finalSize    = Buffer.byteLength(finalCode, 'utf8');
const saved        = (((originalSize - finalSize) / originalSize) * 100).toFixed(1);

console.log(`\u2713 JS bundled: ${outFileName}`);
console.log(`  Original : ${(originalSize / 1024).toFixed(1)} KB (${JS_FILES.length} files)`);
console.log(`  Output   : ${(finalSize / 1024).toFixed(1)} KB`);
console.log(`  Saved    : ${saved}%`);
