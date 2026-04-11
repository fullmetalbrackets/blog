import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

export const remarkReadingTime: Plugin<[], Root> = function () {
	return function (tree: Root, file): void {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);

		if (file.data.astro?.frontmatter) {
			file.data.astro.frontmatter.readingTime = readingTime.text;
		}
	};
};
