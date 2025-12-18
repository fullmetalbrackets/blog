import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { Root } from 'mdast';
import { VFile } from 'vfile';

export function remarkReadingTime() {
  interface AstroData {
    frontmatter: Record<string, unknown>;
  }

  interface FileData {
    astro: AstroData;
  }

  return function (tree: Root, file: VFile & { data: FileData }): void {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    
    file.data.astro.frontmatter.readingTime = readingTime.text;
  };
}