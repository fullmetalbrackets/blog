import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const now = new Date();
const datePart = now.toISOString().split('T')[0];
const pubDate = `${datePart} 12:00:00`;

const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const slug = `${year}-${month}`;

const file = path.join('src/content/now', `${slug}.md`);

const content = `---
pubDate: ${pubDate}
---

`;

fs.mkdirSync('src/content/now', { recursive: true });

if (fs.existsSync(file)) {
  console.error(`❌ Already exists for this month: ${file}`);
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log(`✅ Created ${file}`);
execSync(`code ${file}`);