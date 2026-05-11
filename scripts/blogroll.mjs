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

const name = process.argv[2];

if (!name) {
  console.error('Usage: yarn blogroll "My Post Title"');
  process.exit(1);
}

const slug = slugify(name);
const file = path.join('src/content/blogroll', `${slug}.yml`);

const content = `name: ${name}
url: 
feed: 
pubDate: ${pubDate}
`;

fs.mkdirSync('src/content/blogroll', { recursive: true });

if (fs.existsSync(file)) {
  console.error(`❌ Already exists: ${file}`);
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log(`✅ Created ${file}`);
execSync(`code ${file}`);
