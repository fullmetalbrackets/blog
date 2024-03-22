---
title: "Install and use Sudo in Debian"
description: "Most of my experience with Linux is via the Ubuntu distribution, which includes sudo as a default. Debian does not have sudo or superuser accounts, here's how to add it and set it up."
pubDate: 2022-10-06
tags:
  - Debian
---

<div>
  <div class="info">
    <span>
      <img src="/assets/info.svg" class="info-icon" alt="Information" loading="eager" decoding="async" />
      <b>Information</b>
    </span>
    <p>
      <a href="https://wiki.debian.org/sudo" target="_blank">Debian wiki, sudo page</a>
    </p>
  </div>
</div>
<br>

Install sudo:

```bash
apt install sudo -y
```

Once installed, add a user to the sudo group:

```bash
usermod -a -G bob sudo
```

Now logout of root and login to the user that was just added to the sudo group, and verify the user is authorized:

```bash
sudo -v
```
