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

export function generateTagData(tags) {
  let tagData = [];
  tags.forEach((tag) => {
    tagData.push ({
      name: tag,
      slug: `${generateSlug(tag)}`
    });
  });
  return tagData;
}