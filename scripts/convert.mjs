import { execSync } from 'child_process';

const file = process.argv[2];

if (!file) {
  console.error('Usage: node convert.mjs <image>');
  process.exit(1);
}

const fullPath = `src/content/lifestream/_images/${file}`;

const identify = execSync(`identify -format "%wx%h" "${fullPath}"`).toString().trim();
const [w, h] = identify.split('x').map(Number);

if (w <= 400 && h <= 600) {
  console.error(`❌ Image is already ${w}x${h} — at or below 400x600, skipping`);
  process.exit(1);
}

execSync(`convert "${fullPath}" -resize 400x600^ -gravity center -extent 400x600 -quality 85 "${fullPath}"`);
console.log(`✅ Converted ${fullPath} (was ${w}x${h}, now 400x600)`);