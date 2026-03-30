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

const templates = {
	game: (title) => `---
type: game
title: 
pubDate: ${pubDate}
platform: 
image: ./_images/${title}.
rating: liked
---
`,
	movie: (title) => `---
type: movie
title: 
pubDate: ${pubDate}
image: ./_images/${title}.
rating: liked
---
`,
	tvshow: (title) => `---
type: tvshow
title: 
pubDate: ${pubDate}
image: ./_images/${title}.
season: 
rating: liked
---
`,
	book: (title) => `---
type: book
title: 
author: 
pubDate: ${pubDate}
image: ./_images/${title}.
rating: liked
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
