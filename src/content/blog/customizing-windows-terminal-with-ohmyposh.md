---
title: "Customizing the Windows Terminal command prompt with Oh-My-Posh"
description: "While I use Zsh with Oh-My-Zsh for making my Linux terminal pretty, it's not available for Windows. Luckily it's brother from another mother Oh-My-Posh basically does the same thing for Windows Terminal and PowerShell."
pubDate: 2022-10-01
updatedDate: 2023-07-11
tags:
  - Oh-My-Posh
  - Windows
  - PowerShell
---

## Sections

1. [Pre-Requisites](#pre)
2. [Installing WinGet and using it to install Oh-My-Posh](#install)
3. [Changing the theme](#theme)
4. [Install a Nerd Font for themes that require it](#font)
5. [Additional non-bundled custom themes](#custom)
6. [References](#ref)

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

Next we'll make Oh-My-Posh the default shell, which requires editing your PowerShell profile, located in `C:\Users\<your-username>\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`. Open it _as an Administrator_ with the text editor of your choice. Add the following to the top:

```shell
oh-my-posh init pwsh | Invoke-Expression
```

Restart your terminal or reload the profile with the command `. $PROFILE` for changes to take effect.

<div id='theme'/>

## Changing the theme

Once you have installed Oh-My-Posh, the <a href="https://github.com/JanDeDobbeleer/oh-my-posh/blob/main/themes/default.omp.json" target="_blank">default theme</a> will be used. Use the following command to list all the themes and get a preview of how they'll look in the terminal. (Give it a minute, there's a lot of them.)

```shell
Get Posh-Themes
```

The themes are all located in `C:\Users\<your-username>\AppData\Local\Programs\oh-my-posh\themes\`. Let's assume you decided to use the `unicorn` theme (one of my favorites), you'll have to edit your `Microsoft.PowerShell_profile.ps1` and replace the init script with this:

```shell
oh-my-posh init pwsh --config 'C:\Users\<your-username>\AppData\Local\Programs\oh-my-posh\themes\unicorn.omp.json' | Invoke-Expression
```

Reload the terminal again with `. $PROFILE` for the change to take effect.

<div id='fonts'/>

## Install a Nerd Font for themes that require it

You may notice that some themes cause weird missing icons in your prompt. This is because many of them require <a href="https://nerdfonts.com" target="_blank">Nerd Fonts</a>. Oh-My-Posh has a built-in CLI and pick out and install a Nerd Font. Any of them will work, but the official recommended font to use is <a href="https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/Meslo.zip" target="_blank">MesloLGM</a>.

Use the following command and pick out a font of your choice:

```shell
oh-my-posh font install
```

Next you'll need to open Windows Terminal, go to _Settings_, and under Profiles click on _Windows PowerShell_, scroll down to _Additional Settings_ and click _Appearance_, then change _Font face_ to the Nerd Font you downloaded. Make sure to _Save_ your changes.

To ensure the glyphs are correctly rendered, you'll also want to go into Windows Terminal _Settings_, click on _Rendering_ and switch on _Use the new text renderer ("AtlasEngine")_. If you're noticing the symbols in some themes are not spaced properly and are right on top of text, be sure you do this step.

## Custom themes not bundled with Oh-My-Posh

Oh-My-Posh comes with many themes that are regularly maintained, but [anyone can create a custom theme](https://ohmyposh.dev/docs/configuration/overview). Here's a few I've found on GitHub that I like.

- [whoisryosuke's custom theme](https://gist.github.com/whoisryosuke/3b34892672a2a28e14f54dda80348b86) (Requires `JetBrainsMono` Nerd Font)
- [Kudostoy0u's pwsh10k theme](https://github.com/Kudostoy0u/pwsh10k) (Requires `MesloLGS` Nerd Font)
- [adynetro's custom theme](https://github.com/adynetro/posh) (Requires `MesloLGM` Nerd Font)
- [Dofoerix's custom themes](https://github.com/Dofoerix/Dfrx-Prompt-Theme) (In several different colors and designs!)
- [rainbowflesh's cyborgone theme](https://github.com/rainbowflesh/cyberposh-theme)
- [delacerate's custom theme](https://github.com/delacerate/theme-prompt/blob/main/delacerate.omp.json)
- [ryanewtaylor's pride theme](https://github.com/ryanewtaylor/oh-my-posh-themes)
- [Darkensses's cybershell theme](https://github.com/Darkensses/cybershell)
- [drewyh999's custom theme](https://github.com/drewyh999/oh-my-drewyh999)
- [sclerp's orangine theme](https://github.com/seclerp/orangine-theme)
- [SubsTheTechnomancer's not-zork theme](https://github.com/SubsTheTechnomancer/Omp-themes) (I had to laugh at this one)
- [leopoldo109's custom theme](https://github.com/leopoldo109/leopoldo-powershell)

<div id='ref'/>

## References

- <a href="https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powerShell-7.2#msi" target="_blank">Install PowerShell</a>
- <a href="https://aka.ms/terminal" target="_blank">Install Windows Terminal</a>
- <a href="https://learn.microsoft.com/en-us/windows/package-manager/winget" target="_blank">Install WinGet Package Manager</a>
- <a href="https://ohmyposh.dev" target="_blank">Oh-My-Posh</a>
- <a href="https://nerdfonts.com" target="_blank">Nerd Fonts</a>
