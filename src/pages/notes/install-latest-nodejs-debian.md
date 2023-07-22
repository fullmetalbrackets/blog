---
layout: "@layouts/Note.astro"
title: "Install latest version of NodeJS on Debian"
description: "Quick primer on installing the latest version of NodeJS on Debian, plus updating NPM and installing Yarn."
pubDate: "July 22, 2023"
---

<div>
  <div class="info">
    <span>
      <img src="/img/assets/info.svg" class="info-icon">
      <b>Information</b>
    </span>
    <p>
      <a href="https://github.com/nodesource/distributions#debinstall" target="_blank">Official instructions here</a>
    </p>
  </div>
</div>

Go to the above link to copy & paste the terminal commands for the latest version of NodeJS.

For latest version as of this note, _Node.js v20.x_:

### Ubuntu

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

### Debian

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &&\
apt-get install -y nodejs
```

### Update NPM to latest version

```bash
npm i -g npm
```

### Install Yarn

```bash
npm i -g yarn
```
