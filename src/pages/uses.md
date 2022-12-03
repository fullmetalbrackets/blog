---
layout: "../layouts/BaseLayout.astro"
title: "Uses"
description: "The things I own and stuff I use to make this website and write a bunch of junk."
---

<h1 class="title">Uses</h1>

<hr>

The things I own and stuff I use to make this website and write a bunch of junk.

## What is a Uses page?

It's a neat concept by <a href="https://wesbos.com" target="_blank">Wes Bos</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> to have a page on your personal site "detailing developer setups, gear, software and configs." So that's what this is. The things I own and stuff I use to make this website and write a bunch of junk.
<br><br>
Check out <a href="https://uses.tech" target="_blank">Uses.Tech</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> for other <em>Uses pages</em>.

## Sections

1. [Desk Setup](#desk)
2. [Computer](#pc)
3. [Home Server](#server)
4. [Pi-Hole Server](#pihole)
5. [Developer Tools](#tools)
6. [Fuel (food & snacks)](#fuel)

<div id='desk' />

## Desk Setup

- #### Desk

  - <a href="https://www.amazon.com/gp/product/B08Q89X9R2" target="_blank">Bestier L Shaped Desk, Rustic Brown</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px">

- #### Chair

  - <a href="https://www.amazon.com/gp/product/B09YV46WG7" target="_blank">COLAMY 2199 Office Chair, Classic Brown</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px">

- #### Monitors

  - Dell 27" 1080P HD Monitor (old faithful)
  - <a href="https://www.amazon.com/gp/product/B07L9G1BFX" target="_blank">Samsung UR59-series 32" 4K UHD Curved Monitor</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> (it's overkill and that's fine)

- #### Speakers

  - <a href="https://www.amazon.com/gp/product/B00EZ9XKCM" target="_blank">Logitech Z200 Multimedia Stereo Speakers</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px">

- #### Keyboard and Mouse
  - <a href="https://www.amazon.com/gp/product/B00BP5KOPA" target="_blank">Logitech MK270 Wireless Keyboard & Mouse Combo</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px">

<br>

<div id='pc' />

## Computer

- #### Model

  Dell XPS 8920

- #### CPU

  Intel Core i7-7700 @ 3.6GHz

- #### RAM

  24 GB

- #### OS

  Windows 10 Pro

- #### GPU

  AMD Radeon RX480

- #### Storage

  - 1 x 250 GB M.2 NVMe
  - 1 x 500 GB HDD
  - 2 x 1 TB HDD
  - 1 x 1 TB SSD

- #### Comment

  This thing is from 2015, but it's still trucking and is more than enough for my needs. It even plays most of the games I care about without issue!

<div id='server' />

## Home Server

- #### Model

  Dell Optiplex 3050 SFF

- #### CPU

  Intel i5-6500 (4) @ 3.6GHz

- #### RAM

  16 GB

- #### OS

  OpenMediaVault 6

- #### Storage

  - 1 x 250 GB M.2 NVMe
  - 1 x 2 TB HDD
  - 3 x 1 TB HDD

- #### Docker Containers

  - <a href="https://hub.docker.com/r/portainer/portainer-ce" target="_blank" rel="noreferrer noopener">Portainer</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> - GUI to manage docker containers
  - <a href="https://hub.docker.com/r/linuxserver/plex" target="_blank" rel="noreferrer noopener">Plex</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> - Movie and TV show streaming server
  - <a href="https://hub.docker.com/r/linuxserver/tautulli" target="_blank" rel="noreferrer noopener">Tautulli</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> - Plex statistics and activity monitoring
  - <a href="https://hub.docker.com/r/deluan/navidrome" target="_blank" rel="noreferrer noopener">Navidrome</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> - Music streaming server
  - <a href="https://hub.docker.com/r/linuxserver/ubooquity" target="_blank" rel="noreferrer noopener">Ubooquity</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> - Ebook and comic server/viewer
  - <a href="https://hub.docker.com/r/filebrowser/filebrowser" target="_blank" rel="noreferrer noopener">File Browser</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> - GUI for browsing files
  - <a href="https://hub.docker.com/r/linuxserver/qbittorrent" target="_blank" rel="noreferrer noopener">qBittorrent</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> - Torrent downloader/manager

- #### Comment
  Bought refurbished on eBay for around $60. I added hard drives and doubled the RAM, and it's been running my entire stack of self-hosted services going on two years without so much as a hiccup. I ran it on Ubuntu Server LTS for most of that time, but recently switched over to OpenMediaVault and I'm loving the ease of doing everything though it's GUI. This machine acts as my main media server (streaming movies & TV shows via Plex, music via Navidrome, etc.) and NAS, which is shared out to my and my wife's Windows PCs and laptops via SMB. On my Android phone and tablets, I use the Solid Explorer app to access the SMB shares. (<a href="/blog/solid-explorer-samba-share">My blog post about this.</a>)

<div id='pihole' />

## Pi-Hole Server

- #### Model

  Dell Optiplex 3020 Micro

- #### CPU

  Intel Pentium G3250T (2) @ 2.8GHz

- #### RAM

  4 GB

- #### OS

  Debian 11 Bullseye

- #### Storage

  - 1x 500 GB HDD
  - 1x 750 GB HDD

- #### Comment
  A recent purchase, $45 refurbished on eBay and hasn't been expanded at all from how I got it, except for adding an external HDD. I mainly bought this to run Pi-Hole as a replacement to an old, noisy laptop I had been running Pi-Hole off of for years. It also doubles as a dev server and backup server, I use rsync to periodically backup my photos and other important stuff from my NAS to the external drive.

<div id='tools' />

## Developer Tools

- #### Code Editor

  - VS Code
  - Nano (as needed on Linux)

- #### Terminal

  - Windows Terminal with <a href="https://ohmyposh.dev" target="_blank">Oh-My-Posh</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> using <a href="https://github.com/Kudostoy0u/pwsh10k" target="_blank">pwsh10k theme</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px">
  - On Linux, zsh shell with <a href="https://github.com/ohmyzsh/ohmyzsh" target="_blank">Oh-My-Zsh</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px"> using <a href="https://github.com/romkatv/powerlevel10k" target="_blank">powershell10k theme</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px">

- #### Frameworks
  - <a href="https://astro.build" target="_blank">Astro</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px">, which I used to redesign my site to what you see now
  - <a href="https://nuxtjs.org" target="_blank">Nuxt</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px">, I previously used it with the Nuxt Content module for the first version of this site
  - <a href="https://reactjs.org" target="_blank">React</a> <img class="ext" src="/img/assets/external.svg" alt="External Link" height="18px" width="20px">, which I'm learning slooooowly

<div id='fuel' />

## Fuel (food & snacks)

- #### Coffee

  Starbucks Sumatra Dark Roast (I need this to live)

## More to come...

<br><br>
