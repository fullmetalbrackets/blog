import { readFileSync, writeFileSync } from 'fs';

const path = './dist/server/wrangler.json';
const config = JSON.parse(readFileSync(path, 'utf-8'));

delete config.triggers;

if (config.kv_namespaces) {
	config.kv_namespaces = config.kv_namespaces.filter(
		(kv) => kv.binding !== 'SESSION'
	);
	if (config.kv_namespaces.length === 0) delete config.kv_namespaces;
}

if (config.assets?.binding === 'ASSETS') {
	config.assets.binding = 'STATIC_ASSETS';
}

writeFileSync(path, JSON.stringify(config, null, 2));
