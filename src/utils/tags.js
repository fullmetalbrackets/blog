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

// export function generateTagData(tags) {
//   let tagData = [];
//   let tags = Array.from(new Set(posts.flatMap(post => post.frontmatter.tags)))
//   tags.map((tag) => {
//     tagData.push ({
//       name: tag,
//       slug: `${generateSlug(tag)}`
//     });
//   });
//   return tagData;
// }