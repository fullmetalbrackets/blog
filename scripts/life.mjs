import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

const titlify = (str) =>
  str
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\bi\b/g, 'I');

const now = new Date();
const datePart = now.toISOString().split('T')[0];
const pubDate = `${datePart} 12:00:00`;

const templates = {
  game: (slug) => `---
type: game
title: ${title}
pubDate: ${pubDate}
platform: 
image: ./_images/${slug}.webp
rating: liked
---
`,
  movie: (slug) => `---
type: movie
title: ${title}
pubDate: ${pubDate}
image: ./_images/${slug}.webp
rating: liked
---
`,
  tvshow: (slug) => `---
type: tvshow
title: ${title}
pubDate: ${pubDate}
image: ./_images/${slug}.webp
season: 
rating: liked
---
`,
  book: (slug) => `---
type: book
title: ${title}
pubDate: ${pubDate}
image: ./_images/${slug}.jpg
rating: liked
---
`,
};

const args = process.argv.slice(2);
const raw = args.filter((a) => !a.startsWith('--')).join(' ');
const typeFlag = args.find((a) => a.startsWith('--'));
const type = typeFlag ? typeFlag.slice(2) : null;

if (!raw) {
  console.error(
    `Usage: node life.mjs some title [${Object.keys(templates)
      .map((t) => `--${t}`)
      .join('|')}]`
  );
  process.exit(1);
}

if (type && !templates[type]) {
  console.error(
    `❌ Unknown type "${type}". Valid types: ${Object.keys(templates).join(', ')}`
  );
  process.exit(1);
}

const title = titlify(raw);
const slug = slugify(raw);
const filename = type ? `${type}_${slug}.md` : `${slug}.md`;
const dir = 'src/content/lifestream';
const file = path.join(dir, filename);

if (fs.existsSync(file)) {
  console.error(`❌ Already exists: ${file}`);
  process.exit(1);
}

const template = templates[type] ?? templates.default;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(file, template(slug));
console.log(`✅ Created ${file}${type ? ` [${type}]` : ''}`);
execSync(`code ${file}`);