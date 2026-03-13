import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const today = () => {
	const now = new Date();
	return now
		.toISOString()
		.replace('T', ' ')
		.replace(/\.\d{3}Z$/, '');
};

const slugify = (str) =>
	str
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]/g, '');

const templates = {
	game: (title) => `type: game
title: "${title}"
pubDate: ${today()}
developer: 
publisher: 
platform: []
genre: []
startDate: 2026-01-01 # release date of the game
completed: false # default is true
image: ./_images/
note: 
dbid: 
steamdb: 

`,
	movie: (title) => `type: movie
title: "${title}"
pubDate: ${today()}
director: 
stars: []
genre: []
startDate: 2026-01-01 # release date of the movie
note: 
image: ./_images/
dbid: # tmdb

`,
	tvshow: (title) => `type: tvshow
title: "${title}"
pubDate: ${today()}
genre: []
seasons: 
startDate: 2026-01-01 # date of series premiere
endDate: # date of series finale if applicable
note: 
image: ./_images/
dbid: # tmdb

`,
	book: (title) => `type: book
title: "${title}"
pubDate: ${today()}
author: 
genre: []
startDate: 2026-01-01 # release date of the book
image: ./_images/
isbn: 
url: 
note: 

`,
	quote: (title) => `type: quote
title: "${title}"
pubDate: ${today()}
quote: 
attribution: 

`,
	image: (title) => `type: image
title: "${title}"
pubDate: ${today()}
tag: 
image: ./_images/

`,
	youtube: (title) => `type: youtube
title: "${title}"
pubDate: ${today()}
videoId: 
note: 

`,
};

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith('--'));
const typeFlag = args.find((a) => a.startsWith('--'));
const type = typeFlag ? typeFlag.slice(2) : null;

if (!title) {
	console.error(
		`Usage: yarn life "My Title" [${Object.keys(templates)
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
const filename = type ? `${type}_${slug}.yml` : `${slug}.yml`;
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
