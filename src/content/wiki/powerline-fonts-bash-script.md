---
title: "Bash script to install powerline fonts for Oh-My-Zsh"
description: "A simple bash script to download Powerlevel10k's recommended fonts from their own repo and directly into the Linux fonts directory."
pubDate: 2024-02-04
updatedDate: 2025-
tag:  documentation
---

```bash
#!/bin/sh

wget -O /usr/share/fonts/MesloLGS%20NF%20Regular.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf
wget -O /usr/share/fonts/MesloLGS%20NF%20Bold.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf
wget -O /usr/share/fonts/MesloLGS%20NF%20Italic.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf
wget -O /usr/share/fonts/MesloLGS%20NF%20Bold%20Italic.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf

echo "All done!"
```

Execute remotely in one command:

```bash
sudo sh -c "$(curl -fsSL https://gist.githubusercontent.com/fullmetalbrackets/5a094e7daef47dd63074259143466442/raw/86f1cb332dda8976fddd371d3cf2530e48e031c9/meslo-fonts.sh)"
```
