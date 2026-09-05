import { mkdirSync, readdirSync, renameSync, statSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';

/**
 * One-off re-encode of the bundled hero and background images.
 *
 * These three files were 11.7 MB combined — bg.jpg alone was 8.6 MB for a
 * decorative background. That is the single largest thing slowing the home
 * page down, and no amount of metadata work compensates for it.
 *
 * Originals are moved to assets-src/ rather than deleted, so the source files
 * survive if a larger export is ever needed. Run with `npm run optimize:images`.
 */
const TARGETS = [
  { file: 'charles.png', out: 'charles.webp', width: 1800, quality: 76 },
  { file: 'charles1.png', out: 'charles1.webp', width: 1200, quality: 80 },
  { file: 'bg.jpg', out: 'bg.webp', width: 1920, quality: 68 },
];

const SRC_DIR = 'public/images';
const ARCHIVE_DIR = 'assets-src';

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

mkdirSync(ARCHIVE_DIR, { recursive: true });

let before = 0;
let after = 0;

for (const target of TARGETS) {
  const inputPath = join(SRC_DIR, target.file);

  let inputStat;
  try {
    inputStat = statSync(inputPath);
  } catch {
    console.log(`skip   ${target.file} (already processed)`);
    continue;
  }

  const outputPath = join(SRC_DIR, target.out);
  await sharp(inputPath)
    .resize({ width: target.width, withoutEnlargement: true })
    .webp({ quality: target.quality })
    .toFile(outputPath);

  const outputStat = statSync(outputPath);
  before += inputStat.size;
  after += outputStat.size;

  renameSync(inputPath, join(ARCHIVE_DIR, target.file));
  console.log(
    `ok     ${target.file} ${kb(inputStat.size)} -> ${target.out} ${kb(outputStat.size)}`
  );
}

if (before > 0) {
  const saved = Math.round((1 - after / before) * 100);
  console.log(`\ntotal  ${kb(before)} -> ${kb(after)}  (${saved}% smaller)`);
}

console.log('\npublic/images now contains:');
for (const file of readdirSync(SRC_DIR)) {
  console.log(`  ${file}  ${kb(statSync(join(SRC_DIR, file)).size)}`);
}
