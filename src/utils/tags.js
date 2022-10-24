// Credit to https://github.com/littlesticks/astro-101 

export function generateSlug(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function generateTagsData(tags) {
  let tagsData = [];
  tags?.forEach((tags) => {
    tagsData.push({
      name: tags,
      slug: `${generateSlug(tags)}`,
    });
  });
  return tagsData;
}