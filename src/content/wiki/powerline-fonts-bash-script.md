---
title: "Bash script to install powerline fonts for Oh-My-Zsh"
description: "A simple bash script to download Powerlevel10k's recommended fonts from their own repo and directly into the Linux fonts directory."
pubDate: 2024-02-04
tags:
  - Homelab
  - Zsh
---

```bash
#!/bin/sh

wget -O /usr/share/fonts/MesloLGS%20NF%20Regular.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf
wget -O /usr/share/fonts/MesloLGS%20NF%20Bold.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf
wget -O /usr/share/fonts/MesloLGS%20NF%20Italic.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf
wget -O /usr/share/fonts/MesloLGS%20NF%20Bold%20Italic.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf

echo "All done!"
```
