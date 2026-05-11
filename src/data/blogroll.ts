export interface Blog {
  name: string;
  url: string;
  id: string;
  feed: string;
}

export const blogs: Blog[] = [
  {
    name: 'Anthony Fu',
    url: 'https://antfu.me/',
    id: 'antfu',
    feed: 'https://antfu.me/feed.xml',
  },
  {
    name: 'Aaron Parecki',
    url: 'https://aaronparecki.com/',
    id: 'aaronparecki',
    feed: 'https://aaronparecki.com/feed.xml',
  },
  {
    name: 'Brentter',
    url: 'https://brentter.com/',
    id: 'brentter',
    feed: 'https://brentter.com/index.xml',
  },
  {
    name: 'BurgeonLab',
    url: 'https://burgeonlab.com/',
    id: 'burgeonlab',
    feed: 'https://burgeonlab.com/subscribe/',
  },
  {
    name: 'BusyBee',
    url: 'https://beesbuzz.biz/',
    id: 'busybee',
    feed: 'https://beesbuzz.biz/feed',
  },
  {
    name: 'Chris Coyier',
    url: 'https://chriscoyier.net/',
    id: 'chriscoyier',
    feed: 'https://chriscoyier.net/feed/',
  },
  { name: 'Chris Lu', url: 'https://chris.lu/', id: 'chrislu', feed: '#' },
  {
    name: 'Chris Smith',
    url: 'https://chameth.com/',
    id: 'chameth',
    feed: 'https://chameth.com/index.xml',
  },
  {
    name: 'David Warrington',
    url: 'https://ellodave.dev/',
    id: 'davidwarrington',
    feed: '#',
  },
  {
    name: "Ekul's Internet Space",
    url: 'https://ekul.me/',
    id: 'ekul',
    feed: 'https://ekul.me/rss.xml',
  },
  {
    name: 'Fasterthanlime',
    url: 'https://fasterthanli.me/',
    id: 'fasterthanlime',
    feed: 'https://fasterthanli.me/index.xml',
  },
  {
    name: 'Fyr.io',
    url: 'https://fyr.io/',
    id: 'fyr',
    feed: 'https://fyr.io/feeds',
  },
  {
    name: 'Grep Jason',
    url: 'https://grepjason.sh/',
    id: 'grepjason',
    feed: 'https://feed.grepjason.sh/rss.xml',
  },
  {
    name: 'Henrique Dias',
    url: 'https://hacdias.com/',
    id: 'hacdias',
    feed: 'https://hacdias.com/writings/feed.xml',
  },
  {
    name: 'Henry From Online',
    url: 'https://henry.codes/',
    id: 'henrycodes',
    feed: 'https://henry.codes/rss/',
  },
  {
    name: 'HeydonWorks',
    url: 'https://heydonworks.com/',
    id: 'heydonworks',
    feed: 'https://heydonworks.com/feed.xml',
  },
  {
    name: "HiPhish's Workshop",
    url: 'https://hiphish.github.io/',
    id: 'hiphish',
    feed: 'https://hiphish.github.io/',
  },
  {
    name: 'Josh Collinsworth',
    url: 'https://joshcollinsworth.com/',
    id: 'collinsworth',
    feed: 'https://joshcollinsworth.com/api/rss.xml',
  },
  {
    name: 'Josh W. Comeau',
    url: 'https://joshwcomeau.com/',
    id: 'jwcomeau',
    feed: 'https://joshwcomeau.com/feed.xml',
  },
  {
    name: 'Kevin Kipp',
    url: 'https://kevinkipp.com/',
    id: 'kkipp',
    feed: 'https://kevinkipp.com/blog/feed.xml',
  },
  {
    name: 'Kiko.io',
    url: 'https://kiko.io/',
    id: 'kikoio',
    feed: 'https://kiko.io/rss',
  },
  {
    name: 'Localghost',
    url: 'https://localghost.dev/',
    id: 'localghost',
    feed: 'https://localghost.dev/rss-feeds/',
  },
  {
    name: 'Max Glenister',
    url: 'https://blog.omgmog.net/',
    id: 'omgmog',
    feed: 'https://blog.omgmog.net/feed.xml',
  },
  {
    name: 'Matthew Phillips',
    url: 'https://matthewphillips.info/',
    id: 'matthewphilips',
    feed: '#',
  },
  {
    name: 'Oh Hello Ana',
    url: 'https://ohhelloana.blog/',
    id: 'anarodrigues',
    feed: 'https://ohhelloana.blog/feed.xml',
  },
  {
    name: 'Piccalilli',
    url: 'https://piccalil.li/',
    id: 'picacalilli',
    feed: 'https://piccalil.li/rss/',
  },
  {
    name: 'Robb Knight',
    url: 'https://rknight.me/',
    id: 'rknight',
    feed: 'https://rknight.me/subscribe/',
  },
  {
    name: 'Sara Joy',
    url: 'https://sarajoy.dev/',
    id: 'sarajoy',
    feed: 'https://sarajoy.dev/rss.xml',
  },
  {
    name: 'Scott Willsey',
    url: 'https://scottwillsey.com/',
    id: 'scottwillsey',
    feed: 'https://scottwillsey.com/rss.xml',
  },
  {
    name: 'Shellsharks',
    url: 'https://shellsharks.com/',
    id: 'shellsharks',
    feed: 'https://shellsharks.com/feeds',
  },
  {
    name: 'TechnoTim',
    url: 'https://technotim.live/',
    id: 'technotim',
    feed: 'https://technotim.live/feed.xml',
  },
  {
    name: 'Tempertemper',
    url: 'https://tempertemper.net/',
    id: 'tempertemper',
    feed: 'https://tempertemper.net/feeds/main.xml',
  },
  {
    name: 'Troy V',
    url: 'https://troyv.dev/',
    id: 'troyv',
    feed: 'https://troyv.dev/feed.xml',
  },
  {
    name: 'Whitep4nth3r',
    url: 'https://whitep4nth3r.com/',
    id: 'whitep4nth3r',
    feed: 'https://whitep4nth3r.com/feed.xml',
  },
];
