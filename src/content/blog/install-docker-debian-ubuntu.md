---
title: "Install Docker in Debian or Ubuntu"
description: "The docker install instructions are different in 2023 than in previous years, so I wrote up a quick step-by-step guide straight from the offcial docs."
pubDate: 2023-08-23
tags:
  - Docker
  - Linux
---

<div>
  <div class="info">
    <span>
      <img src="/img/assets/info.svg" class="info-icon" loading="eager" decoding="async" alt="Information" />
      <b>Information</b>
    </span>
    <p>
      See the <a href="https://docs.docker.com/engine/install" target="_blank">Docker docs install overview</a> for installation instructions on other platforms.
    </p>
  </div>
</div>
<br><br>
First, uninstall all conflicting packages:

```bash
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt remove $pkg; done
```

Install necessary packages to allow `apt` to use a repository over HTTPS:

```bash
sudo apt update
sudo apt install ca-certificates curl gnupg
```

Add Docker's official GPG key:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

Set up the repository:

```bash
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Now install Docker:

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo service docker start && sudo service docker enable
```

Configure docker to start on boot:

```bash
sudo systemctl enable docker.service && sudo systemctl enable containerd.service
```

(Optional) Configure docker to use it without sudo:

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

Confirm by using `docker ps`, if you get no error message, you're done.
