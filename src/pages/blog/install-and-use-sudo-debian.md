---
layout: "@layouts/BlogPost.astro"
title: "Install sudo and setup a sudo account in Debian"
description: "Most of my experience with Linux is via the Ubuntu distribution, which includes sudo as a default. Debian does not have sudo or superuser accounts, here's how to add it and set it up."
pubDate: "October 6, 2022"
tags:
  - Debian
  - Linux
  - Command Line
---

Install sudo:

```bash
apt install sudo -y
```

Once installed, add a user to the sudo group:

```bash
adduser user sudo
```

Now logout of root and login to the user that was just added to the sudo group, and verify the user is authorized:

```bash
sudo -v
```

## References

- <a href="https://wiki.debian.org/sudo" target="_blank">Debian wiki, sudo page</a>
