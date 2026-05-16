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

const raw = process.argv.slice(2).join(' ');

if (!raw) {
  console.error('Usage: node links.mjs some link title');
  process.exit(1);
}

const title = titlify(raw);
const slug = slugify(raw);
const file = path.join('src/content/links', `${slug}.yml`);

const content = `title: ${title}
pubDate: ${pubDate}
description: 
url: 
tag: 
`;

fs.mkdirSync('src/content/links', { recursive: true });

if (fs.existsSync(file)) {
  console.error(`❌ Already exists: ${file}`);
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log(`✅ Created ${file}`);
execSync(`code ${file}`);