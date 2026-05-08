export interface Page {
  href: string;
  title: string;
  description: string;
  event: string;
}

export const pages: Page[] = [
  {
    href: '/blog',
    title: 'Blog',
    description: 'Long-form posts like tutorials, how-to guides and more.',
    event: 'explore-blog',
  },
  {
    href: '/blank',
    title: 'Blank',
    description: 'This page is intentionally left blank.',
    event: 'explore-blank',
  },
  {
    href: '/blogroll',
    title: 'Blogroll',
    description:
      'A list of super cool personal sites and blogs that I follow, and you should too.',
    event: 'explore-blogroll',
  },
  {
    href: '/categories',
    title: 'Categories',
    description: 'View blog posts by category.',
    event: 'explore-categories',
  },
  {
    href: '/changelog',
    title: 'Changelog',
    description: 'A log of major changes made to this site over the years.',
    event: 'explore-changelog',
  },
  {
    href: '/colophon',
    title: 'Colophon',
    description:
      'How this site is made, with what tools, supporting what technologies, etc.',
    event: 'explore-colophon',
  },
  {
    href: '/games',
    title: 'Games',
    description: 'My video game collection by platform.',
    event: 'explore-games',
  },
  {
    href: '/lifestream',
    title: 'Lifestream',
    description:
      "All the media I've played, read, and watched. And what I thought of it.",
    event: 'explore-lifestream',
  },
  {
    href: '/links',
    title: 'Links',
    description:
      'Links to websites, self-hosted apps and other cool online things that I use.',
    event: 'explore-links',
  },
  {
    href: '/notes',
    title: 'Notes',
    description:
      'Syndicated feed of my microblog where I post short-form content.',
    event: 'explore-notes',
  },
  {
    href: '/now',
    title: 'Now',
    description:
      "What I've been up to lately and what's on my mind. Updated monthly-ish.",
    event: 'explore-now',
  },
  {
    href: '/postroll',
    title: 'Postroll',
    description:
      'Articles, blog posts and other writings that I came across and thought worth sharing.',
    event: 'explore-postroll',
  },
  {
    href: '/privacy',
    title: 'Privacy',
    description: 'Read the privacy policy for this website.',
    event: 'explore-privacy',
  },
  {
    href: '/self-hosted',
    title: 'Self-hosted',
    description: 'Information about the apps and services that I self-host.',
    event: 'explore-selfhosted',
  },
  {
    href: '/style',
    title: 'Style',
    description: 'Markdown style guide for the website.',
    event: 'explore-style',
  },
  {
    href: '/uses',
    title: 'Uses',
    description:
      'Details on the computer hardware and smart home devices I use.',
    event: 'explore-uses',
  },
  {
    href: '/wiki',
    title: 'Wiki',
    description:
      'My personal wiki with homelab documentation, config files, scripts, etc.',
    event: 'explore-wiki',
  },
  {
    href: '/verify',
    title: 'Verify',
    description:
      'Verify my identity online across different services and social media.',
    event: 'explore-verify',
  },
];
