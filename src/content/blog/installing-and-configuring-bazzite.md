---
title: Installing and configuring Bazzite on a Dell XPS 8920
description: I'm testing out daily driving Bazzite on my old Windows PC, but coming from Debian and Ubuntu there's some quirks and weirdness I'm not used to, so I made this as a reference for myself and any others who encounter similar issues.
pubDate: 2026-04-06 12:00:00
tags: ['linux', 'bazzite']
howto: true
---

This will be fairly terse as I'll just be detailing the steps I took to install Bazzite and troubleshoot any issues I encountered along the way. It's possible this will be updated over time as I run into and solve new problems while using Bazzite.

## Flashing Bazzite ISO onto USB drive

First things first, [go to Bazzite's website to download the ISO](https://bazzite.gg/), making sure to choose the correct hardware and GPU of the machine you'll be installing Bazzite on.

After downloading the ISO, flash it onto a bootable USB drive with your software of choice. (As long as it's not Ventoy, for some reason Bazzite does not recommend nor support using Ventoy.) You may want to check [this section of Bazzite's documentation](https://docs.bazzite.gg/General/Installation_Guide/Installing_Bazzite_for_Desktop_or_Laptop_Hardware/) to make sure the machine you're looking to install Bazzite on meets all requirements. It most likely will, unless the thing is literally decades old.

If using [Rufus](https://rufus.ie/) to create a bootable USB drive, choose **DD Mode** when prompted, otherwise the Bazzite ISO will not be appear as a boot option. Alternately use [Balena Etcher](https://etcher.balena.io/) and it will just work without having to specify anything, that's what I tend to do now when installing Linux on a new system. (Bazzite's recommended option is [Fedora MediaWriter](https://github.com/FedoraQt/MediaWriter), but I've never used it myself.)

## Configure BIOS before installing Bazzite

You'll need to go into your computer's BIOS to make sure some things are properly confi. For most PCs this is done by rebooting and hitting the <kbd>F2</kbd> key (on an HP machine it may be <kbd>F10</kbd> instead) as soon as your manufacturer's logo appears. Mashing the requisite key non-stop from the moment you boot up until you get into the BIOS is also a time-honored tradition.

Once in the BIOS use your keyboard arrow keys to navigate to **ADVANCED** and press <kbd>Enter</kbd>, then navigate down to _SATA Operation_, press <kbd>Enter</kbd> and change `RAID` to `AHCI`, then press <kbd>Enter</kbd> again.

Navigate down to the _Secure Boot_ option and use <kbd>Enter</kbd> to switch it to **DISABLE**. (You can leave it this way permanently, or re-enable it later.)

> If you'd rather NOT disable Secure Boot at all, leave it on and _pay attention_ after the Bazzite installer finished and you reboot. You will be given the option to **enroll MOK**, choose this and when prompted for a password use `universalblue`.
>
> [See the Bazzite documentatio for more details about using Secure Boot.](https://docs.bazzite.gg/General/Installation_Guide/secure_boot/)

When finished changing the settings, use the <kbd>ESC</kbd> key to save and exit the BIOS.

## Install Bazzite

After exiting the BIOS and while the PC is booting up again, press the <kbd>F12</kbd> key to bring up the boot menu. Navigate to choose your USB drive on the list and hit <kbd>Enter</kbd>. (If you're not seeing it, you may have to re-create the bootable USB. Remember to use _DD mode_ in Rufus or try using an alternative.)

You'll be brought to the Bazzite live desktop, click on the _Install_ icon on the desktop. Choose the drive to install onto from the list.

> [warning] Important!
>
> If you're installing Bazzite on an M.2 NVMe drive, make sure you changed the _SATA operation_ in BIOS from `RAID` to `AHCI`. In my experience this is required for M.2 NVMe drives to appear as an option when installing **any** Linux distribution.

Follow the prompts to install Bazzite and after the install is done, reboot when prompted. (Make sure to remove the USB drive so you don't boot back into the live ISO.)

## Enabling Secure Boot (optional)

If you disabled Secure Boot and installed Bazzite, but decide to re-enable Secure Boot after the fact, then this is for you. (It is not necessary, you can just keep using Bazzite without Secure Boot just fine.)

First, use the below commands to enroll Bazzite's key into Secure Boot:

```bash
ujust enroll-secure-boot-key
```

Now reboot, enter BIOS setup by pressing <kbd>F2</kbd> or <kbd>F10</kbd>, and navigate to **ADVANCED** and re-enable _Secure Boot_, then save and exit the BIOS, and boot back into Bazzite.

## Installing Zsh

I'm one of those people that needs all my different Linux environments to be as identical as possible, and that means use Zsh shell and Oh-My-Zsh with my preferred theme and plugins.

First, to install Zsh, I'll be using Brew. (Alternately you can use layering with `rpm-ostree` but I won't be getting into that, because I just used Brew.)

```bash
brew install zsh
```

Now to configure the terminal, in my case I'm using [Ptyxis](https://gitlab.gnome.org/chergert/ptyxis) which came with Bazzite. First, need to make sure the path that `zsh` installed to, the output below shows where it was installed for me.

```bash
which zsh
/home/linuxbrew/.linuxbrew/bin/zsh
````

Open the terminal, click the _three lines icon_ at the top-right, and choose **Preferences** from the dropdown menu.

1. Click on the **Profiles** tab, then click on your profile. (Feel free to give it a name.)

2. Scroll down to _Custom command_ and toggle it to **ON**.

3. Under that, click on the _custom command_ field and enter the `zsh` path, e.g. `/home/linuxbrew/.linuxbrew/bin/zsh`.

4. When done, close the settings window by clicking the **X** on the top-right. Leave the rest of the options alone unless you know what you're doing and want to customize the terminal further.

Close out the terminal and then re-open it, you should be in Zsh (should be a plain command prompt with just `~`) and can proceed with installing Oh-My-Zsh.

## Installing Oh-My-Zsh

It's always easiest to just use their install script and pipe it to curl in the terminal:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Then I installed some plugins:

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-completions.git $ZSH_CUSTOM/plugins/zsh-completions
```

Then, my favorite theme, Powerlevel10k:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

And also I downloaded the necessary Nerd Fonts for Powerlevel10k, I just used [a script I setup for myself](https://gist.githubusercontent.com/fullmetalbrackets/5a094e7daef47dd63074259143466442/raw/86f1cb332dda8976fddd371d3cf2530e48e031c9/meslo-fonts.sh) to download and install them.

```bash
sudo sh -c "$(curl -fsSL https://gist.githubusercontent.com/fullmetalbrackets/5a094e7daef47dd63074259143466442/raw/86f1cb332dda8976fddd371d3cf2530e48e031c9/meslo-fonts.sh)"
```

I also downloaded copies of [my dotfiles](https://github.com/fullmetalbrackets/dotfiles) so I don't have to configure anything except Powerlevel10k.

Finally, restart the shell, it should default to `zsh` and prompt to configure Powerlevel10k.

```bash
exec $SHELL
```

## Setting up Samba shares

> [This is taken from this reddit thread](https://www.reddit.com/r/Bazzite/comments/1nxh465/how_to_set_up_samba_file_sharing_on_bazzite_share/), after I encountered the issue described.

I encountered the issue where you right-click a folder → Properties → Share, but Dolphin complains that you’re not in a usershare group. It offers a button to join and asks you to restart, but this never works. After the reboot, the exact same message appears.

Create the usershares group:

```bash
grep -E '^usershares:' /usr/lib/group | sudo tee -a /etc/group
```

Add current user to usershares group:

```bash
sudo usermod -aG usershares $USER
```

Enable the Samba server service:

```bash
sudo systemctl enable --now smb.service
```

Required SELinux tweak (_nothing works without this_): 

```bash
sudo setsebool -P samba_export_all_rw=1
```

## Installing VSCode and Node/NPM

_VSCode_ I installed via Flatpak, but I'm not sure I'm keeping it this way... I have yet to figure out how to use the default Ptyxis terminal within VSCode, but I haven't played with it much yet.

I installed _Node_ (and with it NPM) via Brew:

```bash
brew install node
```

Then I installed Yarn via NPM, since I use it for this website. (Safe to assume using `corepack` would have been fine, but I kind of forgot about it when doing this. Oh well.)

```bash
npm i -g yarn
```

This post was the first one written on and pushed from the Bazzite PC, so if you're seeing this it worked!

## Weird things and what to do about them

This will be about any post-install issues I run into and how I fixed them. I will update as I encounter any other things worth writing down.

### Sometimes shutting down via GUI does not work

Seems to be a weird bug with KDE Plasma, where trying to shutdown from the GUI just doesn't do anything. Use the terminal instead:

```bash
shutdown -h now
```

## References
- [Bazzite Documentation](https://docs.bazzite.gg/)
- [Samba Setup Guide from Reddit](https://www.reddit.com/r/Bazzite/comments/1nxh465/how_to_set_up_samba_file_sharing_on_bazzite_share/)
