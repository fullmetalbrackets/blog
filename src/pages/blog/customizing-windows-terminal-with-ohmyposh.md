---
layout: "@layouts/BlogPost.astro"
title: "Customizing the Windows Terminal command prompt with Oh-My-Posh"
description: "While I use Zsh with Oh-My-Zsh for making my Linux terminal pretty, it's not available for Windows. Luckily it's brother from another mother Oh-My-Posh basically does the same thing for Windows Terminal and PowerShell."
pubDate: "October 1, 2022"
updatedDate: "July 11, 2023"
tags:
  - Oh-My-Posh
  - Windows
  - PowerShell
  - Command Line
---

## Sections

1. [Pre-Requisites](#pre)
2. [Installing WinGet and using it to install Oh-My-Posh](#install)
3. [Changing the theme](#theme)
4. [Nerd fonts for themes that require them](#font)
5. [References](#ref)

<div id='pre'/>

### Pre-Requisites

You need to have _PowerShell_ installed on Windows, and ideally you'll want to use _Windows Terminal_ as well. Follow the <a href="https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powerShell-7.2#msi" target="_blank">official Microsoft instructions to install PowerShell</a>. For Windows Terminal, you'll have to <a href="https://aka.ms/terminal" target="_blank">install it from the Windows Store</a>.

The rest of this guide will assume you are using <em>Windows Terminal</em>.

<div id='install'/>

## Installing WinGet and using it to install Oh-My-Posh

If you have Windows 11 or Windows 10 Pro, you should already have the <a href="https://learn.microsoft.com/en-us/windows/package-manager/winget" target="_blank">WinGet</a> package manager installed, if not you'll have to install <a href="https://www.microsoft.com/p/app-installer" target="_blank">App Installer</a> which comes with WinGet.

We'll be using WinGet in Windows Terminal to install Oh-My-Posh, as this is the <a href="https://ohmyposh.dev/docs/installation/windows" target="_blank">official preferred method</a>. Do so with this command:

```shell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

Next we'll make Oh-My-Posh the default shell, which requires editing your PowerShell profile. This should be located in `C:\Users\<YourUser>\Documents\WindowsPowerShell`, look for `Microsoft.PowerShell_profile.ps1` and open it with the text editor of your choice. (You'll need to do it as Administrator.) Add the following to the top:

```shell
oh-my-posh init pwsh | Invoke-Expression
```

Restart your terminal or reload the profile with the command `. $PROFILE` for changes to take effect.

<div id='theme'/>

## Changing the theme

Once you have installed Oh-My-Posh, the <a href="https://github.com/JanDeDobbeleer/oh-my-posh/blob/main/themes/default.omp.json" target="_blank">default theme</a> will be used. Check all the official themes <a href="https://ohmyposh.dev/docs/themes" target="_blank">here</a>.

To load a theme, it's easiest to use a remote config file. Personally, I use the <a href="https://ohmyposh.dev/docs/themes#cert" target="_blank">Cert</a> theme.

Click the link of the theme you want to use, you'll be taken to it on Oh-My-Posh's GitHub page. At the top-right corner of the code block, right-click _Raw_ and copy the link, we'll need it to use the theme.

You'll need to edit your PowerShell profile again. Open it in a text editor and change the line we added above, `oh-my-posh init pwsh | Invoke-Expression`, to the below instead. (Alternate the URL with whichever theme you prefer.)

```shell
oh-my-posh init pwsh --config 'https://github.com/JanDeDobbeleer/oh-my-posh/raw/main/themes/cert.omp.json' | Invoke-Expression
```

Remember to restart the terminal or reload the profile with `. $PROFILE` for the changes to take effect:

Alternatively, if you'd rather not use a URL, you can download the Raw file from the GitHub page, save it locally, and reference it in the PowerShell profile. For example, save it your user directory at `C:\Users\<YourUser>\` and add this to your PowerShell profile:

```shell
oh-my-posh init pwsh --config 'C:\Users\<YourUser>\cert.omp.json' | Invoke-Expression
```

You can also reference it with `~\Oh-My-Posh\cert.omp.json` if you prefer, I just like using the full path. Now the theme should automatically load every time you open PowerShell or Windows Terminal. Please note the load time of your terminal prompt with Oh-My-Posh and a theme may be well over 1000ms, but this seems unavoidable if you want to make your terminal pretty.

<div id='fonts'/>

## Nerd Fonts for themes that require them

You may notice that some themes cause weird missing icons in your prompt. This is because many of them require <a href="https://nerdfonts.com" target="_blank">Nerd Fonts</a>. See the <a href="https://ohmyposh.dev/docs/installation/fonts" target="_blank">Fonts page in the Oh-My-Posh docs</a> for more details. Any of the Nerd Fonts will work, but the official recommended font to use is <a href="https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/Meslo.zip" target="_blank">Meslo LGM NF</a>.

Download the font of your choice and place it in your `C:\Windows\Fonts` directory, then in Windows Terminal go to _Settings_, and under Profiles click on _Windows PowerShell_, scroll down to _Additional Settings_ and open _Appearance_, then change _Font face_ to the Nerd Font you're using. Make sure to _Save_ your changes.

Alternately, Oh-My-Posh has a built-in CLI to select and install a Nerd Font. Open Windows Terminal as _Administrator_, and use the command `oh-my-posh font install`, and choose your font.

To ensure the glyphs are correctly rendered, you'll also want to go into Windows Terminal _Settings_, click on _Rendering_ and switch on \*Use the new text renderer ("AtlasEngine"). If you're noticing the symbols in some themes are not spaced properly and are right on top of text, be sure you do this step.

<div id='ref'/>

## References

- <a href="https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powerShell-7.2#msi" target="_blank">Install PowerShell</a>
- <a href="https://aka.ms/terminal" target="_blank">Install Windows Terminal</a>
- <a href="https://learn.microsoft.com/en-us/windows/package-manager/winget" target="_blank">Install WinGet Package Manager</a>
- <a href="https://ohmyposh.dev" target="_blank">Oh-My-Posh</a>
- <a href="https://nerdfonts.com" target="_blank">Nerd Fonts</a>
