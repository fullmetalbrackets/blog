import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

// Get all blog posts sorted by date descending
export async function getSortedPosts() {
	return (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
}

// Get all blog posts with reading time attached
export async function getPostsWithReadingTime() {
	const posts = await getSortedPosts();
	return Promise.all(
		posts.map(async (post) => {
			const { remarkPluginFrontmatter } = await render(post);
			return {
				...post,
				readingTime: remarkPluginFrontmatter.readingTime as string,
			};
		})
	);
}

// Get posts filtered by tag
export async function getPostsByTag(tag: string) {
	const posts = await getSortedPosts();
	return posts.filter((post) => post.data.tags.includes(tag));
}

// Get posts filtered by year
export async function getPostsByYear(year: number) {
	const posts = await getSortedPosts();
	return posts.filter((post) => post.data.pubDate.getFullYear() === year);
}

// Get all tags with post counts, sorted alphabetically
export async function getSortedTags() {
	const posts = await getSortedPosts();
	const tagCounts: Record<string, number> = {};
	posts.forEach((post) => {
		post.data.tags?.forEach((tag) => {
			tagCounts[tag] = (tagCounts[tag] || 0) + 1;
		});
	});
	return Object.entries(tagCounts)
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => a.tag.localeCompare(b.tag));
}

// Get related posts by id
export async function getRelatedPosts(ids: (string | undefined)[]) {
	const posts = await getSortedPosts();
	return posts.filter((post) => ids.includes(post.id));
}

// Get a single post by id
export async function getPostById(id: string) {
	const posts = await getSortedPosts();
	return posts.find((post) => post.id === id);
}

// Get all links sorted by date descending
export async function getSortedLinks() {
	return (await getCollection('links')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
}

// Get all lifestream entries sorted by date descending
export async function getLifestream() {
	return (await getCollection('lifestream')).sort(
		(a, b) =>
			new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
	);
}

// Get all lifestream entries of type 'note'
export async function getNotes() {
	const lifestream = await getLifestream();
	return lifestream.filter(
		(
			entry
		): entry is CollectionEntry<'lifestream'> & { data: { type: 'note' } } =>
			entry.data.type === 'note'
	);
}
