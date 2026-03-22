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
const pubDate = now
	.toISOString()
	.replace('T', ' ')
	.replace(/\.\d{3}Z$/, '');

const templates = {
	game: (title) => `type: game
title: 
pubDate: ${pubDate}
platform: 
image: ./_images/
rating: 
---
`,
	movie: (title) => `---
type: movie
title: 
pubDate: ${pubDate}
image: ./_images/
rating: 
---
`,
	tvshow: (title) => `---
type: tvshow
title: 
pubDate: ${pubDate}
image: ./_images/
rating: 
---
`,
	book: (title) => `---
type: book
title: 
pubDate: ${pubDate}
image: ./_images/
rating: 
---
`,
};

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith('--'));
const typeFlag = args.find((a) => a.startsWith('--'));
const type = typeFlag ? typeFlag.slice(2) : null;

if (!title) {
	console.error(
		`Usage: yarn life title [${Object.keys(templates)
			.filter((t) => t !== 'default')
			.map((t) => `--${t}`)
			.join('|')}]`
	);
	process.exit(1);
}

if (type && !templates[type]) {
	console.error(
		`❌ Unknown type "${type}". Valid types: ${Object.keys(templates)
			.filter((t) => t !== 'default')
			.join(', ')}`
	);
	process.exit(1);
}

const slug = slugify(title);
const filename = type ? `${type}_${slug}.md` : `${slug}.md`;
const dir = 'src/content/lifestream';
const file = path.join(dir, filename);

if (fs.existsSync(file)) {
	console.error(`❌ Already exists: ${file}`);
	process.exit(1);
}

const template = templates[type] ?? templates.default;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(file, template(title));
console.log(`✅ Created ${file}${type ? ` [${type}]` : ''}`);
execSync(`code ${file}`);
