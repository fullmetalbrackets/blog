---
layout: "../../layouts/BlogPost.astro"
title: "Customizing the Windows Terminal command prompt with Oh-My-Posh"
description: "While I use Zsh with Oh-My-Zsh for making my Linux terminal pretty, it's not available for Windows. Luckily it's brother from another mother Oh-My-Posh basically does the same thing for Windows Terminal and Powershell."
pubDate: "October 1, 2022"
tags:
  - Oh-My-Posh
  - Windows
  - Powershell
  - Command Line
---

Getting set up on Oh-My-Posh is super easy. First, we need to have Powershell installed on Windows, and ideally you'll want to use Windows Terminal as well. Follow the <a href="https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2#msi" target="_blank">official Microsoft instructions to install Powershell</a>. For Windows Terminal, you'll have to <a href="https://aka.ms/terminal" target="_blank">install it from the Windows Store</a>.

The rest of this guide will assume you are using <em>Windows Terminal</em>.

## Installing WinGet and using it to install Oh-My-Posh

If you have Windows 11 or Windows 10 Pro, you should already have the <a href="https://learn.microsoft.com/en-us/windows/package-manager/winget" target="_blank">WinGet</a> package manager installed, if not you'll have to install <a href="https://www.microsoft.com/p/app-installer" target="_blank">App Installer</a> which comes with WinGet.

We'll be using WinGet to install Oh-My-Posh. Do so with this command:

```shell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

Next we'll make Oh-My-Posh the default shell:

```shell
oh-my-posh init pwsh | Invoke-Expression
```

Finally, reload the profile for changes to take effect:

```shell
. $PROFILE
```

## Change themes

Once you have installed Oh-My-Posh, the <a href="https://github.com/JanDeDobbeleer/oh-my-posh/blob/main/themes/default.omp.json" target="_blank">default theme</a> will be used.

To load a different theme, it's easiest to use a remote config file. Personally, I use the <a href="https://github.com/Kudostoy0u/pwsh10k" target="_blank">Pwsh10k</a> theme which is just the <a href="https://github.com/romkatv/powerlevel10k" target="_blank">Powerlevel10k theme for Oh-My-Zsh</a> ported to Powershell.

First you'll need to <a href="https://github.com/romkatv/powerlevel10k#manual-font-installation" target="_blank">install Meslo Nerd Font for Powerlevel10k</a>. Once that's done, switch to the Pwsh10k theme with this command:

```shell
oh-my-posh init pwsh --config 'https://raw.githubusercontent.com/Kudostoy0u/pwsh10k/master/pwsh10k.omp.json' | Invoke-Expression
```

Remember to reload the profile for the changes to take effect:

```shell
. $PROFILE
```

## References

- <a href="https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2#msi" target="_blank">Install Powershell</a>
- <a href="https://aka.ms/terminal" target="_blank">Install Windows Terminal</a>
- <a href="https://learn.microsoft.com/en-us/windows/package-manager/winget" target="_blank">Install WinGet Package Manager</a>
- <a href="https://github.com/Kudostoy0u/pwsh10k" target="_blank">Pwsh10k Theme for Oh-My-Posh</a>
- <a href="https://github.com/romkatv/powerlevel10k#manual-font-installation" target="_blank">Meslo Nerd Font for Powerlevel10k</a>
