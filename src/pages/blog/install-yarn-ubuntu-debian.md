---
layout: "@layouts/BlogPost.astro"
title: "Install Yarn in Debian and Ubuntu"
description: "Normally there is no way to install Yarn using a Linux package manager, and it's recommended to install it through NPM instead. That's all well and good, but here's a quick guide on how to install it via the APT package manager anyway."
pubDate: "December 17, 2022"
tags:
  - Web Development
  - Yarn
  - Debian
  - Ubuntu
---

# Adding the Yarn repository

Use this command to add the Yarn repository and signing key:

```bash
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

Now update the package list and install as normal:

```bash
sudo apt update && sudo apt install yarn
```

The above command will install NodeJS along with Yarn. If you only want to install Yarn without NodeJS, maybe because you already installed it separately, use this command instead:

```bash
sudo apt install --no-install-recommends yarn
```

Once done, verify installation by checking the version:

```bash
❯ yarn --version
1.22.19
```

# Reference

- <a href="https://linuxize.com/post/how-to-install-yarn-on-ubuntu-20-04" target="_blank" rel="noopener">This article on Linuxize</a>
