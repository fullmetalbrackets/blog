import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

const now = new Date();
const datePart = now.toISOString().split('T')[0];
const pubDate = `${datePart} 12:00:00`;

const titlify = (str) =>
  str
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\bi\b/g, 'I');

const raw = process.argv.slice(2).join(' ');

if (!raw) {
  console.error('Usage: node post.mjs some post title');
  process.exit(1);
}

const title = titlify(raw);
const slug = slugify(raw);
const file = path.join('src/content/blog', `${slug}.md`);

const content = `---
title: ${title}
pubDate: ${pubDate}
description: 
tags: []
related: []
---

`;

fs.mkdirSync('src/content/blog', { recursive: true });

if (fs.existsSync(file)) {
  console.error(`❌ Already exists: ${file}`);
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log(`✅ Created ${file}`);
execSync(`code ${file}`);
