---
title: "How to factory restore a ZimaBoard"
description: "I've recently been playing around with ZimaBoard, a single board server running Debian and CasaOS. It's a cool little machine, but I accidentally broke something and had to factory reset. It's not a simple option in a some settings menu, the process involves flashing an image on the ZimaBoard, so I wrote down the steps I took."
pubDate: 2024-12-22
updatedDate: 2025-02-10
tags: ["zimaboard", "linux"]
---

## About the ZimaBoard

<a href="https://www.zimaspace.com/products/single-board-server" target="_blank" data-umami-event="factory-restore-zimaboard-sbc-site">ZimaBoard</a> is a "hackable" x86 single board server, by default it comes running Debian and CasaOS, and is meant to be the hub of your personal self-hosted cloud. Through a simple web GUI you can install and manage different apps and services as Docker containers. The ZimaBoard 232 specifically has a Intel Celeron dual core N3350 CPU with integrated graphics and 2 GB of DDR4 RAM. The higher end 432 and 832 models have better Celeron CPUs and more RAM. All the models have a 32 GB eMMC and two SATA ports for more storage, two USB 3.0 ports, two gigabit ethernet ports and even a PCIe 2.0 x4 port. The 12V charger sips power at around 5 to 6 watts.

## Pre-requisites

Installing any image will require a USB drive (<a href="https://www.amazon.com/SamData-Swivel-Storage-Indicator-8GB-1Pack/dp/B08CRMBD93" target="_blank" data-umami-event="factory-restore-zimaboard-usb8gb-amazon">here's an 8gb one for $5 on Amazon</a>) and a monitor to use the installation GUI. Since the ZimaBoard has no HDMI port, only a Mini-DisplayPort 2.0 port, a Mini DisplayPort to HDMI adapter cable is required. I used <a href="https://www.amazon.com/dp/B0757JWW81" target="_blank" data-umami-event="factory-restore-zimaboard-minidisplayport-amazon">this one from Amazon for $9</a>.

## Downloading image and creating bootable USB

I'm generally following the <a href="https://www.zimaspace.com/docs/faq/Restore-factory-settings" target="_blank" data-umami-event="factory-restore-zimaboard-faq">official ZimaBoard CasaOS Factory Recovery instructions</a> with only a few changes. Basically, we must download the image that comes installed on Zimaboard and flash it on the ZimaBoard using a bootable USB drive.

I have the ZimaBoard 216, so I used the <a href="https://drive.google.com/file/d/1PFw1JXoimwUvOX9kgkmOSUM0evi_GGxv/view" target="_blank" data-umami-event="factory-restore-zimaboard-216-image">ZimaBoard 216 image</a>. There is a <a href="https://drive.google.com/file/d/1b-k7d1LzPHNUtem-hOrHB5dDt0_AC6mK/view" target="_blank" data-umami-event="factory-restore-zimaboard-432-832-image">separate image for ZimaBoard 432 and 832</a> if you have one of those instead.

> For this guide I will create the bootable USB drive on a Windows machine, using <a href="https://rufus.ie" target="_blank" umami-data-event="factory-restore-zimaboard-rufus">Rufus</a>. Another alternative is <a href="https://etcher.balena.io" target="_blank" umami-data-event="factory-restore-zimaboard-balenaetcher">BalenaEtcher</a> as suggested by the official Zimaboard instructions. Rufus and BalenaEtcher are both free and open-source.
>
> If you want to create a bootable USB on Linux, check out <a href="https://ventoy.net" target="_blank" umami-data-event="factory-restore-zimaboard-ventoy">Ventoy</a>, or use command `dd if=<PATH TO ISO FILE> of=/dev/*** bs=8M status=progress` (Make sure to the USB device as it appears on your machine, for example `/dev/sdd`, or you could overwrite an HDD!)

Once you have downloaded the image, plug into your PC a USB drive with 8 GB or more capacity, run **Rufus** as Administrator, and the USB drive should appear under _Devices_, otherwise select it from the dropdown. Under _boot selection_, click the **Select** button to the right, navigate to and select the image file, and click **Open**. Leave all options at default and click the **Start** button at the bottom.

You may get a warning about the image, ignore it. You should get prompted to write the image either in ISO or DD mode -- _I had to choose DD mode for the Zimaboard to recognize the image_, in my experience Debian always needs _DD mode_ to flash the ISO. Once the image is done writing, you can close Rufus and remove the USB drive.

## Installing the image on ZimaBoard

Plug the USB drive into one of the ports on the ZimaBoard, and also plug a keyboard on the other USB port, you'll need it. Then plug in the ZimaBoard's power cord.

When it starts booting up immediately start mashing <kbd>F11</kbd> on your keyboard and you'll be presented with a menu to _please select boot device_, scroll down to the USB drive and press the <kbd>Enter</kbd> key.

After a moment you'll see the Clonezilla GUI -- choose the first option (_VGA 800x600_) and hit <kbd>Enter</kbd>.

![Clonezilla interface.](../../img/blog/zimaboard1.webp 'Clonezilla interface')

Next you'll have to choose a disk to flash the image onto, choose the first option `mmcblk0` (the onboard eMMC) and hit <kbd>Enter</kbd> twice.

![Choosing media to install image.](../../img/blog/zimaboard2.webp 'Choosing media to install image')

Next in the CLI, when prompted with warnings (your data will be lost, etc.) type `y` and hit <kbd>Enter</kbd> to confirm install. Wait a few minutes while the installation happens.

![Image installation in progress.](../../img/blog/zimaboard3.webp 'Image installation in progress')

Once the install is finished, you'll see another menu. Choose the first option _Power off_ and hit <kbd>Enter</kbd>.

![Image finished installing.](../../img/blog/zimaboard4.webp 'Image finished installing')

Once the countdown is complete, the ZimaBoard will shutdown. Confirm that the red light on the machine is off, unplug the power, USB drive and keyboard (you won't need it anymore), and connect an ethernet cable to one of the network ports if you haven't already. Then plug the power cord back in and give the ZimaBoard and CasaOS a few minutes to fully boot up essentially for the first time.

On a browser in the same local network, go to `http://casaos.local` and the CasaOS web UI should appear, prompting creation of a new user.

## References

- <a href="https://www.zimaspace.com/docs" target="_blank" umami-data-event="factory-restore-zimaboard-docs">ZimaBoard documentation</a>
- <a href="https://www.zimaspace.com/docs/faq/Restore-factory-settings" target="_blank" umami-data-event="factory-restore-zimaboard-faq">ZimaBoard CasaOS Factory Recovery instructions</a>
- <a href="https://rufus.ie" target="_blank" umami-data-event="factory-restore-zimaboard-rufus">Rufus</a>
- <a href="https://etcher.balena.io" target="_blank" umami-data-event="factory-restore-zimaboard-balenaetcher">BalenaEtcher</a>
- <a href="https://ventoy.net" target="_blank" umami-data-event="factory-restore-zimaboard-ventoy">Ventoy</a>

### Related Articles

- <a href="/blog/remove-casaos-zimaboard-upgrade-debian-12/" umami-data-event="factory-restore-zimaboard-related-remove-casaos">How to remove CasaOS from a ZimaBoard and upgrade to Debian 12 Bookworm</a>