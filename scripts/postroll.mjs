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

const title = process.argv[2];

if (!title) {
	console.error('Usage: yarn postroll some-article-title');
	process.exit(1);
}

const slug = slugify(title);
const file = path.join('src/content/postroll', `${slug}.yml`);

const content = `title: ${slug}
pubDate: ${pubDate}
image: ./_images/${slug}.png
url: 
author: 
`;

fs.mkdirSync('src/content/postroll', { recursive: true });

if (fs.existsSync(file)) {
	console.error(`❌ Already exists: ${file}`);
	process.exit(1);
}

fs.writeFileSync(file, content);
console.log(`✅ Created ${file}`);
execSync(`code ${file}`);
