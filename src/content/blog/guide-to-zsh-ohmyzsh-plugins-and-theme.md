---
title: "Quick guide to set up Zsh and Oh-My-Zsh with essential plugins and a theme"
description: "I've been getting more and more comfortable working on the command line in Linux, and looked into ways to pretty it up and make it more user friendly. Enter Zsh, an alternative to Bash shell, and the Oh-My-Zsh framework used to customize the terminal experience to your heart's content. Here's my basic set up."
pubDate: 2021-12-04
updatedDate: 2025-02-03
tags: ["zsh", "command line", "linux"]
---

![Oh-My-Zsh](../../img/blog/oh-my-zsh.png 'Oh-My-Zsh')

> This was one of my earliest blog posts, but even in 2025 this guide still works as written. Even now I still refer back to it all the time when setting up Oh-My-Zsh on anything!

## Install the Zsh shell

First, a caveat; this guide is for Linux only, since that's the only place I've used Zsh & Oh-My-Zsh. It's also usable on Mac (via <a href="https://iterm2.com" target="_blank">iTerm2</a>, among other options) but I will only be covering Linux here. Easiest way to do install Zsh is just use your distribution's package manager.

On Ubuntu/Debian:

```bash
sudo apt install zsh
```

On Arch/Manjaro:

```bash
sudo pacman -S zsh
```

On Fedora/Red Hat:

```bash
sudo dnf install zsh
```

<div id='ohmyzsh'/>

## Download and install Oh-My-Zsh

Easiest (and recommended) way is to use the following command to install via a script:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

After it's done downloading, use the command `zsh` to configure it.

## Using some essential plugins

In my humble opinion, there's two must-have plugins when using Oh-My-Zsh; **zsh-autosuggestions** (for handy auto-completion of commands) and **zsh-syntax-highlighting** (detects and color codes different syntax on the command line and in the text editor). Let's download those:

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
```

This will automatically place both plugins in their correct sub-directories, but to "activate" them you need to add them to the Zsh configuration. Open `~/.zshrc` in a text editor and look for the line `plugins=` (it probably already has **git** included, and you should leave it) -- add the plugins separated by spaces, like so:

```bash
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

Save the file, exit the editor, and restart the shell for the changes to take effect. I also suggest adding _aliases_ as a plugin and adding aliases of your most used commands to your `.zshrc` file, or create a separate file just for aliases.

## Using a theme

Specifically, we're going to be using the great <a href="https://github.com/romkatv/powerlevel10k" target="_blank">Powerlevel10k theme</a>. It's as simple as typing two commands:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

This will download the theme and place all files in their appropriate sub-directories. Like plugins, you have to add it to your `.zshrc` file -- search for `ZSH_THEME=` and change it to the following (make sure to use the quotes!):

```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
```

Last thing is configuration, which the theme actually has it's own script for! Use this command:

```bash
p10k configure
```

If the command isn't recognized, restart the shell first. Follow the prompts to customize the look of your terminal. And you're done!

But wait, there's more! To make your terminal even prettier through the magic of glyphs, let's go a little deeper.

## Prettify powerlevel10k with glpyhs

By using powerlevel10k's [recommended fonts](https://github.com/romkatv/powerlevel10k#fonts) the theme's configuration script will have more options to make the command line prompt look even better, including icons! For some reason these fonts aren't included with powerlevel10k's install instructions or script, so you have to do it manually. We'll use `wget` to download the fonts individually directly into the fonts directory.

```bash
wget -O /usr/share/fonts/MesloLGS%20NF%20Regular.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf
wget -O /usr/share/fonts/MesloLGS%20NF%20Bold.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf
wget -O /usr/share/fonts/MesloLGS%20NF%20Italic.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf
wget -O /usr/share/fonts/MesloLGS%20NF%20Bold%20Italic.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf
```

Alternately you can just use a simple script I made for myself to automate this, because why not just automate it?? (Seriously, why isn't this just included in powerlevel10k's own great install script?)

Just use curl like so: (You will need to use `sudo` since the script will be copying files into the `/usr` directory.)

```bash
sudo sh -c "$(curl -fsSL https://gist.githubusercontent.com/fullmetalbrackets/5a094e7daef47dd63074259143466442/raw/86f1cb332dda8976fddd371d3cf2530e48e031c9/meslo-fonts.sh)"
```

Now when you use `p10k configure` you'll get additional options, since you'll be able to display the glyph correctly. (If using a desktop environment, make sure to go into Terminal preferences and change the font to "Meslo LGS.")

## References

- <a href="https://zsh.org" target="_blank">Zsh shell website</a>
- <a href="https://ohmyz.sh" target="_blank">Oh-My-Zsh website</a>
- <a href="https://github.com/ohmyzsh/ohmyzsh#using-oh-my-zsh" target="_blank">Section on Plugins in the Docs</a>
- <a href="https://github.com/romkatv/powerlevel10k" target="_blank">Powerlevel10k Theme</a>

### Related Articles

- <a href="/blog/basic-linux-commands/" data-umami-event="zsh-ohmyzsh-related-linux-commands">Linux Commands & Keyboard Shortcuts Cheat Sheet</a>
- <a href="/blog/customizing-windows-terminal-with-ohmyposh/" data-umami-event="zsh-ohmyzsh-related-ohmyposh">Customizing the Windows Terminal command prompt with Oh-My-Posh</a>
