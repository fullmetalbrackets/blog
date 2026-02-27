import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const now = new Date();
const dateSlug = now.toISOString().split('T')[0];
const pubDate = now.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

const title = process.argv[2];

if (!title) {
  console.error('Usage: yarn note "My Note Title"');
  process.exit(1);
}

const filename = `note_${dateSlug}.yml`;
const dir = 'src/content/lifestream';
const file = path.join(dir, filename);

if (fs.existsSync(file)) {
  console.error(`❌ Already exists: ${file}`);
  process.exit(1);
}

const content = `title: "${title}"
pubDate: ${pubDate}
type: note
tag: 
note: 
url: 
`;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(file, content);
console.log(`✅ Created ${file}`);
execSync(`code ${file}`);