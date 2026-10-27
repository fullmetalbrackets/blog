---
title: 'Streamers are becoming like cable and video games prices are ridiculous, so I went back to pirating like the old days'
description: "It's easier and safer than ever to sail the sevens seas for ill-gotten content of all kinds, as long as you know what you're doing. It's not always clear what's safe or reliable, so here's my tried and true years-long self-hosted setup for downloading and consuming multimedia, and where to get the loot."
pubDate: 2026-10-27 12:00:00
tags: ['self-hosting', 'piracy', 'qbittorrent', 'plex', 'guide']
related: ['setting-up-plex-in-docker', 'plex-remote-access-tailscale', 'expose-plex-tailscale-vps', 'comprehensive-guide-tailscale-securely-access-home-network', 'how-to-setup-the-search-function-in-qbittorrent-and-add-search-plugins']
howto: true
tocDepth: 3
---

## Internet media piracy for dummies

Piracy never really died, it just evolved and became less necessary when the dominant cable companies were supplanted by a handful of services that were, even combined, much cheaper than most cable TV bills. Music piracy also died down with iTunes and especially Spotify making music available to the masses for relatively cheap and on any device.

Fast-forward to 2026 and there's hundreds of streaming apps that have all raised prices consistently every year or two, Spotify pays most musicians garbage and is pushing AI generated music, and new video game releases are now $70, even ones loaded with microtransactions. (And don't be surprised when new AAA video game releases are bumped up $80 next year, after GTA VI comes out at that price and sells millions of copies.) Video game consoles have gone up rather than down in price years into their life cycle, movie ticket prices are bonkers while theatrical movies are front-loaded with 30 minutes of not just trailers but also commercials, computer memory and hard drive prices are at all-time highs because of AI and datacenters, groceries are up, gas is up, utilities are up, literally everything is more expensive.

So no surprise that pirating multimedia entertainment is once again on the rise, and frankly things won't change unless we respond with our wallets. So I have cut down to only paying for HBO Max and Netflix, mostly because my wife insists, and otherwise download what will be watched by my household and a few family members I share with, and I'm extremely picky about what (if any) brand new game releases I am willing to pay for. (In truth, I rarely purchased brand new even before I started pirating, and mostly grew my Steam library off sales and my Epic Game Store library off free giveaways. See the list of [these and console games I own](/games).)

To have at least a mild understanding of modern day internet piracy there's a few basic things that are worth knowing. Pretty much any multimedia you can think of has most likely been made available on various torrent sites, or trackers. There are private trackers that require a membership (some by invite only) and maintaining a good ratio of downloads to uploads, but I have not personally bothered with those. There are also Usenet groups that distribute this content, but I don't really know anything about those so I won't be writing about them.

## Torrent Trackers

First, the torrenting sites (a.k.a. trackers) that I use. There are many trackers out there, but the ones below are the only public trackers I really peruse (and trust), and they have pretty much everything you could want.

> [warning] Important!
>
> **I strongly suggest you use a browser-based adblocker like UBlock Origin to peruse these public torrent websites safely and with minimal annoyance.**
> 
> Due to being free resources, these websites ALL have ads, and both *1337x* and *Ext* in particular have pop-up ads and those annoying kinds that appear over everything so that when you go to something you are taken to some external website instead.
> 
> Some of the ads are even, shall we say, very not safe for work. It's not great, but even free things have some cost. *(Among the perks of membership in private trackers is not having to deal with ads.)*

- [1337x](https://1337x.to)
- [Ext](https://ext.to)
- [UIndex](https://uindex.org) (their ads are not as egregious)

## VPNs

Whether you're using a torrent client on your PC, or self-hosting a torrent client on a server, you absolutely should use a VPN through which to download anything. In both cases, downloading torrents through a VPN connection will anonymize you so that your actual IP address is not visible to any peers. That will avoid the random letters from your ISP about your IP being used to download copyrighted content.

The VPN provider you use is your choice, but it's important for you to understand that using a "free" VPN is not safe. A trustworthy and reliable VPN is worth whatever you will pay for it, and it will be cheaper than paying for multiple streaming services, or digital purchases, or digital rentals. (By the way please don't ever pay for a digital rental, it's a rip-off. Just pay the extra $5 to buy it at that point, it's a better deal than renting if you just refuse to pirate a movie.)

As for my suggested VPN providers, I have personally used [AirVPN](https://airvpn.org/) for several years without a single issue. [ProtonVPN](https://protonvpn.com) is well-liked the by pirating/torrenting community as well. Both allow [port forwarding](https://protonvpn.com/support/port-forwarding) which ensures you can both download torrents and seed them for others without issue.

> For much more detailed information, see this [Torrenting + VPN Guide](https://rentry.org/torrentvpn).

## My self-hosted piracy setup

My setup is pretty basic and does not include automations like Radarr, Sonarr, etc. I go to a torrent tracker website, search for what I want to download, then copy & paste the magnet link into my qBittorrent client like a savage.

### Torrent client and VPN binding

For my torrenting client, I self-host [Linuxserver's qBittorrent Docker image](https://docs.linuxserver.io/images/docker-qbittorrent/) whose web UI can be accessed from a browser on any device in my home network. (Or from outside via Tailscale. [Details here](/blog/comprehensive-guide-tailscale-securely-access-home-network).)

To bind my AirVPN connection to qBittorrent (so downloads are through the VPN), I use [Gluetun](https://github.com/passteque/gluetun) as a VPN client and [connect the qBittorrent container to it](https://github.com/qdm12/gluetun-wiki/blob/main/setup/connect-a-container-to-gluetun.md). Below is my Docker Compose for these services:

```yaml
services:
  gluetun:
    image: qmcgaw/gluetun:latest
    container_name: gluetun
    network_mode: bridge
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    ports:
      - 8080:8080/tcp # qbittorrent webUI port
      - 8888:8888/tcp # HTTP proxy
    volumes:
      - /home/ad/docker/gluetun:/gluetun
    restart: unless-stopped
    environment:
      - TZ=America/New_York
      - UPDATER_PERIOD=24h
      - SERVER_COUNTRIES="United States"
      - VPN_TYPE=wireguard
# AirVPN configuration 
      - VPN_SERVICE_PROVIDER=airvpn
      - FIREWALL_VPN_INPUT_PORTS=48293
      - WIREGUARD_PRIVATE_KEY=
      - WIREGUARD_PRESHARED_KEY=
      - WIREGUARD_ADDRESSES=10.182.154.44/32

  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    container_name: qbittorrent
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - WEBUI_PORT=8080
      - DOCKER_MODS=ghcr.io/vuetorrent/vuetorrent-lsio-mod:latest
    volumes:
      - /opt/docker/qbittorrent:/config
      - /mnt/media/movies:/movies
      - /mnt/media/tvshows:/tvshows
      - /mnt/media/music:/music
      - /mnt/games:/games
    network_mode: "service:gluetun"
    restart: unless-stopped
    depends_on:
      gluetun:
        condition: service_healthy
```

Within qBittorrent, I set up [Categories in qBittorrent mapped to specific directories](https://trash-guides.info/Downloaders/qBittorrent/How-to-add-categories/), so that when adding a magnet link to download I just have to choose a category and it will save to the correct path on my server. For example, choosing the Movies category will save the download to `/mnt/media/movies` directory, which Plex watches for its movie library, so it will automatically detect new additions and process them to detect intros and credits, generate chapters and preview thumbnails, etc.

> My setup is fairly manual, I don't use much any of the [*arr apps](https://wiki.servarr.com/en/radarr), and because I use MergerFS to pool multiple hard drives for storing my media, [hardlinks and instant moves](https://trash-guides.info/File-and-Folder-Structure/Hardlinks-and-Instant-Moves/) are unavailable. This setup is just what works for me, but is not what I'd call advanced or even ideal.
>
> Check out [TRaSH Guides](https://trash-guides.info/) for details instructions on advanced qBittorrent setups.

### Media server

My media server of choice is [Plex](https://plex.tv), since I've had a lifetime membership for years and their enshittification has not yet reached critical mass for me to abandon it (though I hate their policy changes, price increases and especially their redesigned apps), but a free and open source alternative is [Jellyfin](https://jellyfin.org/). Other alternatives include [Emby](https://emby.media/) and [Kodi](https://kodi.tv/), but I have not used these myself. My understanding is that Kodi is totally free and highly customizable, while Emby is more user friendly, but has certain features like hardware transcoding locked behind a subcription. (So, it's like Plex.)

I have multiple hard drives pooled together using [MergerFS](https://trapexit.github.io/mergerfs/latest/) and all my media lives at `/mnt/media`, divided into sub-directories for `movies`, `tvshows` and `music` corresponding with those Categories in qBittorrent. Plex watches these sub-directories

> For information on setting up your own media server, see [this blog post about setting up Plex](/blog/setting-up-plex-in-docker) (it may be a bit outdated by now) or [this blog post detailing my home server](/blog/how-i-setup-home-server).
>
> I also strongly suggest the detailed guides at [Perfect Media Server](https://perfectmediaserver.com/) (I referenced this a lot when setting mine up) and [DIYMediaServer](https://diymediaserver.com/).

## Movies and TV shows

There's many uploaders of quality movies and TV shows, from 720p (or lower if it's an older source) up to 4K, and even high-bitrate remuxes. (I don't bother with those, I stick with Blu-Ray UHD quality for the most part.) The below uploaders can be found on all the torrent sites I linked above, I will include alternate names that they use on the various sites. Also note, some do both movies and TV shows, and others do only one kind of upload, so that's why there will be duplicates below.

> [warning] Important!
>
> Trustworthy uploaders tend to have some title, badge or other thing noting them as such (at least on the sites I linked) so make note of that when you are choosing an uploader's torrent.

### Movie uploaders

- Wrath (my favorite for 4K UHD Dolby Vision and 7.1 surround sound movies)
- QxR (4K with all extras and languages included)
- YTS
- RARBG
- TGx/TGxGoodies
- NeoNoir (my go to for 1080p content)
- bone111/b0ne/BONE (another good one for 1080p)
- CptCrunchzz (exclusively does remuxes)

### TV show uploaders

- QxR
- YTS
- EZTV
- bone111/b0ne/BONE

## Music uploaders

I'll be honest, when it comes to music, I don't really pirate much of it nor do I pay attention to uploaders when I do. I just look for lossless FLAC files at 44.1 KHz (FLAC is the type of file container, 44.1 KHz is the industry-standard frequency for high-quality audio), which generally means looking for torrents with `[FLAC 16-44]` or `[FLAC 24-48]` (or a combination) in the titles.

Some uploaders I tend to download music from are:

- ourmark
- vtwin88cube
- eichbaum
- Lulloz
- Rider88

## Video games

The video game pirating scene has never been more active. Various scene groups work at cracking games the moment they come out, and any game without Denuvo or other copy protection is available for free pretty much from release day. Even games with Denuvo DRM are having their protection bypassed or straight up cracked, so that even many major AAA titles can be pirated sooner or later.

A common misconception is that downloading and installing cracked video games is just begging to get your PC infected by viruses, ransomware or some other scary thing that will be bad for your precious machine. This is a mindset trapped a decade or more in the past, and is certainly not the case in 2026. The fact is video game pirating is easier and safer than ever, as long as you recognize the groups and uploaders that are reliable and trustworthy.

> It's important to understand that I will be exclusively talking about **video games available for PC**. If you're looking for video games for specific *consoles*, that's emulation and out of the scope of this post. I will be making a separate post about video game emulation in the near future.

First, let's talk about scene groups and "scene releases." Scene group is a somewhat antiquated term derived from the early era of "[warez](https://en.wikipedia.org/wiki/Warez)" (pirated software), but today you can basically think of them as the individuals or teams that make video games available (often cracking them or otherwise bypassing their protection) for others to upload as torrents.

Examples of video game scene groups you might see (movies/TV have their own groups which I didn't even get into) are *RUNE*, *TENOKE*, *voices38*, *DenuvOwO* (since disbanded, but their releases are still out there) and *C-S*. Generally speaking, these groups just do the work of making the games playable on PC (or Linux, or Mac) without regard for user friendly things like installers or even instructions. Think of it this way: they make the sauce, but don't distribute it.

Others take the content made by the scene groups and do work of letting the rest of us actually download, install and play the things in the form of "repacks." Repacks are the term for highly-compressed (and often pre-cracked) game files packaged with a custom installer, so that the downloads are of a smaller size and running the installer uncompresses the game files into their true larger size, making the game playable.

The most trusted repackers whose torrents you can (in my experience and opinion) safely download from are **Fitgirl** and **DODI**. These two make and distribute repacks of most big game releases, as they become available from scene groups, and they can be found on most trackers. Another, lesser known repacking group is [KaOSKrew](https://kaoskrew.org/), who make their repacks available via direct downloads from their forums.

Finally, when a game can't be found from any of these repackers (they tend to ignore many smaller indie releases) I've found **IGGGAMESCOM** to have a repack for pretty much every PC game ever released and pirated. However, a word of warning that *apparently* they mistakenly uploaded malware in some release years ago, so their reputation is not what it once was. (The pirating scene has a long memory and does not forgive.) Personally, I haven't had any issues with any of their stuff since I started downloading some of their games this year. You can and should take your own precautions, like scanning any IGGGAMESCOM game you download for malware, or simply not downloading their torrents.

## Further reading

I've barely scratched the surface and written only about my own limited setup and use case. If you'd like to read and learn more, I suggest the below sources.

- [TRaSH Guides](https://trash-guides.info/)
- [Servarr Wiki](https://wiki.servarr.com/en/radarr)
- [r/Piracy subreddit](https://www.reddit.com/r/Piracy/) (especially their [Wiki](https://www.reddit.com/r/Piracy/wiki/index/) and [Guides](https://www.reddit.com/r/Piracy/wiki/guides/?screen_view_count=1))
- [r/Torrents subreddit](https://www.reddit.com/r/torrents/)
- [The Megathread](https://rentry.org/megathread)
- [Torrenting + VPN Guide](https://rentry.org/torrentvpn)
- [c/Piracy on the Fediverse](https://lemmy.dbzer0.com/c/piracy)
- [r/VPN subreddit](https://www.reddit.com/r/VPN/) (and their [FAQ](https://www.reddit.com/r/VPN/wiki/faq/))
- [VPN Comparison Table](https://docs.google.com/spreadsheets/d/1ijfqfLrJWLUVBfJZ_YalVpstWsjw-JGzkvMd6u2jqEk/edit?gid=231869418#gid=231869418)