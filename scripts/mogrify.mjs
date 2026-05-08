#!/usr/bin/env node
// mogrify-covers.mjs
// Resizes cover images to 400x600 (center crop), skipping any already at that size.
// Usage: node scripts/mogrify-covers.mjs
// Or via package.json: "mogrify": "node scripts/mogrify-covers.mjs"

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { extname, join, resolve } from 'path';

const COVERS_DIR = resolve('./src/lifestream/_images');
const TARGET_W = 400;
const TARGET_H = 600;
const QUALITY = 85;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.avif', '.webp']);

const files = readdirSync(COVERS_DIR).filter((f) =>
  EXTENSIONS.has(extname(f).toLowerCase())
);

if (files.length === 0) {
  console.log('No image files found in', COVERS_DIR);
  process.exit(0);
}

let skipped = 0;
let resized = 0;
let errored = 0;

for (const file of files) {
  const filepath = join(COVERS_DIR, file);

  // Get current dimensions via ImageMagick identify
  let dimensions;
  try {
    const result = execSync(`identify -format "%wx%h" "${filepath}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    // identify can return multiple lines for multi-frame images (avif/webp) — take first
    dimensions = result.split('\n')[0].trim();
  } catch (e) {
    console.error(`  ✗ Could not identify: ${file}`);
    errored++;
    continue;
  }

  const [w, h] = dimensions.split('x').map(Number);

  if (w === TARGET_W && h === TARGET_H) {
    console.log(`  ↷ Skipping (already ${TARGET_W}x${TARGET_H}): ${file}`);
    skipped++;
    continue;
  }

  try {
    execSync(
      `mogrify -resize ${TARGET_W}x${TARGET_H}^ -gravity center -extent ${TARGET_W}x${TARGET_H} -quality ${QUALITY} "${filepath}"`,
      { stdio: 'inherit' }
    );
    console.log(`  ✓ Resized (${w}x${h} → ${TARGET_W}x${TARGET_H}): ${file}`);
    resized++;
  } catch (e) {
    console.error(`  ✗ Failed to resize: ${file}`);
    errored++;
  }
}

console.log(
  `\nDone. ${resized} resized, ${skipped} skipped, ${errored} errored.`
);
