---
layout: "@layouts/BlogPost.astro"
title: "Install the latest version of NodeJS in Debian and Ubuntu"
description: "By default, the APT package manager used in Debian and Ubuntu distros will install older versions of NodeJS. To install newer versions of NodeJS requires adding a specific repository first, here's a quick guide on how to do that."
pubDate: "December 16, 2022"
tags:
  - Web Development
  - NodeJS
  - Debian
  - Ubuntu
---

# Adding the NodeSource repo

NodeSource maintains repositories for every major version of NodeJS.

- v19.x _(latest stable version as of December 2022)_
- v18.x _(latest LTS version as of December 2022)_
- v17.x
- v16.x
- v14.x

NodeSource provides an installation script to automatically add the apt repository and signing key for NodeJS, as well as refresh the apt cache. Let's suppose we want to install the latest LTS version, _v18.x_, use the following command:

```bash
❯ curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
```

If you want to use a different version, replace `setup_18.x` with the one you want -- for example `setup_19.x` to use the latest stable version, instead of LTS.

Once the script is done, you can use `sudo apt install nodejs` as usual and the version of NodeJS that you added the repository for will be installed, rather than the older version from the default repos. Once installation is done, verify the versions installed.

```bash
❯ node -v
v18.12.0

❯ npm -v
v8.19.2
```

# Reference

- <a href="https://github.com/nodesource/distributions/blob/master/README.md#debinstall" target="_blank" rel="noopener">NodeSource Binary GitHub</a>
