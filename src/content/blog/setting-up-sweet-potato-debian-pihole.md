---
title: "Setting up a Libre Computer Sweet Potato SBC with Debian and Pi-Hole"
description: "I've been wanting to get a Raspberry Pi for ages, but they were out of stock for the longest time, so I never ended up with one. Recently I learned about the Le Potato from Libre Computer as a Pi-alternative, and after some research paid the $30 early access price for their new Sweet Potato SBC. Here's how I set it up."
pubDate: 2023-11-02
tags:
  - self-hosting
---

![Libre Computer Sweet Potato SBC.](../../img/blog/sweet-potato.jpg)

## Sections

1. [WTF is Libre Computer and Sweet Potato?](#what)
2. [Booting up Debian 12 Bookworm off a USB stick](#boot)
3. [Updating, configuring, and installing packages](#config)
4. [Installing and Configuring Pi-Hole](#pihole)
5. [References](#ref)

<div id='what' />

## WTF is Libre Computer and Sweet Potato?

Libre Computer Project is a crowdfunded designer of single-board computers which effectively are alternatives to Raspberry Pi. Amongst their products is the <a href="https://libre.computer/products/aml-s905x-cc/" target="_blank">Le Potato</a> which is equivalent in features to a low-end Raspberry Pi 3B, which some slight differences.

Recently as of early September 2023, they've come out with a new revision known as the "Sweet Potato" with a few minor upgrades. (<a href="https://www.loverpi.com/products/libre-computer-board-aml-s905x-cc-v2" target="_blank">See here</a> for a product page with the differences.) I took the plunge and ordered it from <a href="https://www.loverpi.com" target="_blank">LoveRPi</a>, and it arrived a week later.

<div id='boot' />

## Booting up Debian 12 Bookworm off a USB stick

Libre's <a href="https://hub.libre.computer/t/2023-09-01-libre-computer-aml-s905x-cc-v2-sweet-potato-now-available/2831" target="_blank">Sweet Potato</a> is so new, I couldn't find much in the way of documentation or instructions for it. However it's so similar to the Le Potato that those instructions appear to work just fine. One exception seemed to be about booting from a USB drive -- <a href="https://hub.libre.computer/t/booting-from-external-usb-device-or-bootrom-unsupported-device/51" target="_blank">it says here</a> that the _AML-S905X-CC_ (Le Potato) cannot boot from USB without additional configuration, and the newer _AML-S905X-CC-V2_ (the Sweet Potato I have) is not mentioned. I took a shot in the dark hoping that it would just boot from a USB stick anyway, and turns out it did!

First I found the <a href="https://distro.libre.computer/ci/debian/12/" target="_blank">latest release of Debian 12 base image</a> and downloaded the `arm64` package. This comes as a `.img.xz` file but there's no need to extract it, using <a href="https://rufus.ie/en" target="_blank">Rufus</a> I just created a bootable USB drive right from the archive file.

I plugged it into the top-left USB port on the Sweet Potato (pretty sure any of the four USB ports will do), then plugged in the USB-C power supply, which does not come in the box, but I used a 5V 3A charger from an old Samsung phone and it works perfect. Sweet Potato turned on and automatically ran Debian from the USB, it was up and running in a few minutes, denoted by the blue light on the Sweet Potato blinking steadily.

<div id='config' />

## Updating, configuring, and installing packages

For the next section I consulted <a href="https://hub.libre.computer/t/debian-11-bullseye-and-12-bookworm-for-libre-computer-boards/230" target="_blank">Libre's post on Debian 11 and 12</a>. SSH is disabled by default, so I had to plug in a monitor to continue setting up the Sweet Potato. (This is specifically the Debian base image -- all Ubuntu releases come with SSH enabled from the start for a totally headless setup). The default username and password are `root`, though you are prompted to change the root password immediately. I also went ahead and set up my main user with `adduser ariel` and then added it to the sudo group with `adduser ariel sudo`.

First things first, of course, is updating everything with `apt update && apt full-upgrade -y`, then I installed SSH so I can go headless with `sudo apt install ssh -y`. One last thing, I changed the hostname (by default it is `aml-s905x-cc`) by using `sudo hostnamectl set-hostname potato` to set the new hostname to **potato**.

<div id='pihole' />

## Installing and configuring Pi-Hole

For now I just wanted to test this out as a secondary Pi-Hole, in case I reboot or shut off my home server which runs the main Pi-Hole instance as a Docker container. For the Sweet Potato, I decided to go bare metal and basically followed <a href="set-up-pihole-on-linux" target="_blank">my own guide on setting up Pi-Hole</a>, using the auto-install script with `curl -sSL https://install.pi-hole.net | bash`. I also made sure to change the random generated password with `pihole -a -p newpassword`.

Since I already had an instance of Pi-Hole running on another host, I used <a href="https://github.com/vmstan/gravity-sync" target="_blank">Gravity Sync</a> to push the configuration from there onto the new Pi-Hole instance in the Sweet Potato -- first by installing and setting it up on both hosts with `curl -sSL https://raw.githubusercontent.com/vmstan/gs-install/main/gs-install.sh | bash`, then on pushing the config from the original Pi-Hole to the Sweet Potato with command `gravity-sync push`. Finally I set it to regularly auto-sync the Pi-Holes with `gravity-sync auto`.

Now that all my ad lists, DNS records and other settings are on the Sweet Potato's Pi-Hole instance, I wanted to set up **DNS over TLS with Unbound**. My main instance of Pi-Hole uses `cloudflared` for **DNS over HTTPS**, so I figured why not change it up here. (Someday I may keep this as the only Pi-Hole and remove the container instance from my home server, since it doesn't really need to be on 24/7 otherwise.)

I followed the <a href="https://docs.pi-hole.net/guides/dns/unbound/" target="_blank">official Pi-Hole docs instructions for using Unbound as a recursive DNS server</a> to the letter, and had everything up and running within 5 minutes. In short:

1. Install Unbound via the Debian package manager:

```bash
sudo apt install unbound -y
```

2. Create a new file at `/etc/unbound/unbound.conf.d/pi-hole.conf` and copy/paste the below into it:

```bash
server:
    # If no logfile is specified, syslog is used
    # logfile: "/var/log/unbound/unbound.log"
    verbosity: 0

    interface: 127.0.0.1
    port: 5335
    do-ip4: yes
    do-udp: yes
    do-tcp: yes

    # May be set to yes if you have IPv6 connectivity
    do-ip6: no

    # You want to leave this to no unless you have *native* IPv6. With 6to4 and
    # Terredo tunnels your web browser should favor IPv4 for the same reasons
    prefer-ip6: no

    # Use this only when you downloaded the list of primary root servers!
    # If you use the default dns-root-data package, unbound will find it automatically
    #root-hints: "/var/lib/unbound/root.hints"

    # Trust glue only if it is within the server's authority
    harden-glue: yes

    # Require DNSSEC data for trust-anchored zones, if such data is absent, the zone becomes BOGUS
    harden-dnssec-stripped: yes

    # Don't use Capitalization randomization as it known to cause DNSSEC issues sometimes
    # see https://discourse.pi-hole.net/t/unbound-stubby-or-dnscrypt-proxy/9378 for further details
    use-caps-for-id: no

    # Reduce EDNS reassembly buffer size.
    # IP fragmentation is unreliable on the Internet today, and can cause
    # transmission failures when large DNS messages are sent via UDP. Even
    # when fragmentation does work, it may not be secure; it is theoretically
    # possible to spoof parts of a fragmented DNS message, without easy
    # detection at the receiving end. Recently, there was an excellent study
    # >>> Defragmenting DNS - Determining the optimal maximum UDP response size for DNS <<<
    # by Axel Koolhaas, and Tjeerd Slokker (https://indico.dns-oarc.net/event/36/contributions/776/)
    # in collaboration with NLnet Labs explored DNS using real world data from the
    # the RIPE Atlas probes and the researchers suggested different values for
    # IPv4 and IPv6 and in different scenarios. They advise that servers should
    # be configured to limit DNS messages sent over UDP to a size that will not
    # trigger fragmentation on typical network links. DNS servers can switch
    # from UDP to TCP when a DNS response is too big to fit in this limited
    # buffer size. This value has also been suggested in DNS Flag Day 2020.
    edns-buffer-size: 1232

    # Perform prefetching of close to expired message cache entries
    # This only applies to domains that have been frequently queried
    prefetch: yes

    # One thread should be sufficient, can be increased on beefy machines. In reality for most users running on small networks or on a single machine, it should be unnecessary to seek performance enhancement by increasing num-threads above 1.
    num-threads: 1

    # Ensure kernel buffer is large enough to not lose messages in traffic spikes
    so-rcvbuf: 1m

    # Ensure privacy of local IP ranges
    private-address: 192.168.0.0/16
    private-address: 169.254.0.0/16
    private-address: 172.16.0.0/12
    private-address: 10.0.0.0/8
    private-address: fd00::/8
    private-address: fe80::/10
```

3. Create a config file at `/etc/dnsmasq.d/99-edns.conf` and copy/paste in the below:

```bash
edns-packet-max=1232
```

4. Start the recursive server and test it:

```bash
sudo service unbound restart
dig pi-hole.net @127.0.0.1 -p 5335
```

5. Optional: If using DNSSEC, test validation:

```bash
dig fail01.dnssec.works @127.0.0.1 -p 5335
dig dnssec.works @127.0.0.1 -p 5335
```

The first command should give a status report of `SERVFAIL` and no IP address. The second should give `NOERROR` plus an IP address.

Finally, go on the Pi-Hole web admin UI go to _Settings_ -> _DNS_ and under _Upstream DNS servers_ uncheck everything and check _Custom DNS (IPv4)_, type in `127.0.0.1#5335` and click the _Save_ button.

The docs continue with instructions for disabling `resolvconf.conf` but I didn't find it necessary, the service was not present on this install of Debian 12 Bookwork on the Sweet Potato. After this Pi-Hole is good to go, so I added it as secondary DNS in my router's DHCP settings. It's been about a month and a half, and everything continues to work as intended, the Sweet Potato hasn't had a single hiccup that I have noticed.

If you'd like a low wattage Raspberry Pi alternative, then in my opinion Libre's Sweet Potato SBC is a worthy choice for <a href="https://www.amazon.com/Libre-Computer-AML-S905X-CC-V2-Potato-Alternative/dp/B0CHHJX44N" target="_blank" rel=”noreferrer”>$30 on Amazon</a>.

## Related Articles

> [Set up Home Assistant Supervised on a Libre Computer Sweet Potato SBC](/blog/setup-home-assistant-sweet-potato-debian)

> [Complete guide to self-hosting a website through Cloudflare Tunnel](/blog/self-host-website-cloudflare-tunnel)

<div id='ref' />

## Reference

- <a href="https://libre.computer" target="_blank">Libre Computer</a>
- <a href="https://hub.libre.computer/t/booting-from-external-usb-device-or-bootrom-unsupported-device/51" target="_blank">Booting from External USB Device</a>
- <a href="https://hub.libre.computer/t/libre-computer-aml-s905x-cc-emmc-flashing-steps-from-linux/33" target="_blank">Flashing Linux to eMMC (alternative to USB boot)</a>
