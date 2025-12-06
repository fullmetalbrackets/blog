---
title: "Using a Google TV streaming device with Tailscale to remotely stream my Plex library while on vacation"
description: "I have a Plex Pass subscription, but unfortunately Plex's built-in remote access won't work behind CGNAT, so I use Tailscale to securely access my Plex library and entire home network when I'm not home. Aside from streaming music or video from my phone or tablet at work, I've also started taking a Google TV stick on vacation with me, and with the Tailscale and Plex apps I can stream my library of movies, TV shows and music from anywhere that has a TV and Wi-Fi."
pubDate: 2025-10-28
updatedDate: 2025-12-05
tags: ["tailscale", "plex", "android"]
related1: setting-up-plex-in-docker
related2: comprehensive-guide-tailscale-securely-access-home-network
---

## What and How

There are several Android TV, Google TV and Fire TV set-top boxes and HDMI sticks that have official Tailscale and Plex apps available for download, just like other Android-based devices. Unfortunately, there is no Tailscale app available for Roku, otherwise those would be a great option for this, so make sure you stick to Android-based streaming devices.

There are different brands and form factors with specific features to choose from, but I went with a $15 *Onn* brand Google TV HDMI stick from Wal-Mart which came with the device itself, a remote control and a power cable. This particular device is limited to 1080p, which is fine for me when I do occasionally sit down to watch TV while on a trip, but you can buy a set-top box version with full 4K streaming for $20. Plex and Tailscale can both be downloaded from the Google Play Store on Android/Google TV, and from the Amazon Appstore on Amazon Fire TV.

You probably know that Plex is a Media Server that lets you stream your own media to Plex clients available to download on most devices. (By the way this would probably work with Jellyfin as well, I just haven't done it myself.) Tailscale is a mesh VPN that facilitates creating WireGuard tunnels that securely connect devices to each other even across different networks, in many cases even through NAT, with end-to-end encryption. You will need to <a href="https://login.tailscale.com/start" target="_blank" data-umami-event="google-tv-tailscale-to-tailscale-signup">create a free Tailscale account</a> which also creates your Tailnet, a secure private network that each device you run Tailscale on will join -- any device on the Tailnet will create direct encrypted connections between each other. Tailscale's free tier is (at least for now) very generous with up to three users and 100 devices.

What we will achieve with this article is running Tailscale on a Plex server, or some other device in your home network, so the Tailscale app on the Google TV streaming device can connect to the Plex server and the Plex app can stream your library through a WireGuard tunnel. Once setup you'll just have to connect the Onn device to a Wi-Fi network, open the Tailscale app and connect to your Tailnet. Optionally, but ideally in my opinion, you should also set up an exit node in your home network and enable it on the Google TV so that all of the device's traffic is encrypted and routed through your home network -- this way you don't have to worry about using someone else's unsecured Wi-Fi at a hotel or Air B&B.

> Please note that the instructions in this article assume you have an active Plex Pass subscription. If you already have it and have the built-in Plex Remote Access working, this may not be necessary for you -- unless you want the added security of using Tailscale's encrypted WireGuard tunnel to stream Plex (and other any app for that matter) while on someone else's Wi-Fi.
>
> It's not about bypassing the Plex Pass requirement for remote access, but if you're interested in that, <a href="/blog/plex-remote-access-tailscale" target="_blank" data-umami-event="google-tv-tailscale-plex-to-plex-remote-access-tailscale">see this article</a>.

## Setting up Tailscale at home

The easiest way to get where we're going is to run Tailscale on the same machine that hosts your Plex server. Alternately, you can run Tailscale on another device in your network, and use subnet routing to access the Plex server and your entire network. You also should use the exit node feature to route all traffic from your Onn device through an encrypted tunnel to your home network, it will be much more secure when using your Onn device on a public, hotel or AirBnB Wi-Fi network. I'll explain how to set this all up.

First, go to the <a href="https://tailscale.com" target="_blank" data-umami-event="google-tv-tailscale-plex-to-website">Tailscale website</a> and create an account. This will create your <a href="https://tailscale.com/kb/1136/tailnet" target="_blank" data-umami-event="onn-android-tailscale-docs-tailnet">Tailnet</a> (private network for all your Tailscale-connected devices) with your newly created account as the Owner and which you'll manage through the web-based <a href="https://login.tailscale.com/admin" target="_blank" data-umami-event="onn-android-tailscale-admin-console">admin console</a>.

On the admin console, go to the _DNS_ tab and take note of your *tailnet name*, you'll need this later. You may want to change your Tailnet name to a "fun name," which is more human readable and easy to remember, by clicking on *Rename tailnet* and then choosing from the selections available. You can keep cycling through different ones until you find one you like.

![Choosing a tailnet fun name.](../../img/blog/tailscale-fun-name.png 'Choosing a tailnet fun name')

Next let's install Tailscale. I recommend running Tailscale on a Linux server, ideally the same one hosting Plex itself so that you don't even have to bother with subnet routing if you don't want to. You can also run it in a Docker container, on a Windows computer or even on another Google TV device in your home -- just be aware that not every platform will have the subnet routing and exit node features, and I highly recommend always connecting to an exit node for added security when using the Onn device away from home.

For purposes of this article, we'll just install this bare metal on Linux:

```sh
curl -fsSL https://tailscale.com/install.sh | sh
```

Once Tailscale is installed, you can run it with the below command:

```
sudo tailscale up
```

Now under the _Machines_ tab in the Tailscale admin console you should see your server's hostname and it should say it's online. Note that your server will stay connected to Tailscale, and will automatically reconnect on reboot, until you manually disconnect the server with command `sudo tailscale down`.

## Setting up subnet routing

If you set up Tailscale on the same machine as Plex Media Server, then this is unnecessary unless you want access to your full network through the Google TV. If you'd rather skip this and go straight to setting up an exit node, [click here](#setting-up-an-exit-node).

If you decide to run Tailscale on a separate machine from your Plex Media Server, then you'll need to use subnet routing to access the Plex server and library. This also has the side-effect of allowing you to access your entire home network through the Google TV, which can be handy if there's other apps on the Google TV that you want to use to access other things back home.

Once Tailscale is running on the machine you want to use as subnet router, you need to enable IP forwarding. (This is straight from the <a href="https://tailscale.com/kb/1019/subnets" target="_blank" data-umami-event="googletv-tailscale-plex-docs-subnet">Tailscale docs</a>.)

If your machine has an `/etc/sysctl.d` directory (which most likely it does) then use these commands:

```sh
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
```

If your machine does NOT have the directory (`ls /etc/sysctl.d` returns `No such file or directory`) then instead use these commands:

```sh
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p /etc/sysctl.conf
```

Also, if you are running `firewalld` on your server, you should allow masquerading with the following command:

```sh
sudo firewall-cmd --permanent --add-masquerade
```

Now advertise the subnet routes with this command: (This assumes your local IP addresses are `192.168.0.x`, make sure to use the right subnet range for your network.)

```sh
sudo tailscale up --advertise-routes=192.168.0.0/24
```

Now go to the admin console, on the **Machines** tab, and do the following:

1. Click the three dots to the right of the machine want you want to use as subnet router. (Notice the `subnets` tag.)

2. Choose **Edit route settings...** from the dropdown menu.

3. Click the checkbox for **Subnet routes** and click the **Save** button to finish.

![Enabling subnets in Tailscale admin console.](../../img/blog/tailscale-subnets.png 'Enabling subnets in Tailscale admin console')

## Setting up an exit node

Technically this is optional, but if you will be using your Google TV streaming device from _untrusted Wi-Fi networks_ then **I strongly suggest** only ever using it through an **exit node** that is set up in your home network. Doing so will route all of the Google TV's traffic through the machine running as exit node in your home via an encrypted WireGuard tunnel, and nothing on the Wi-Fi network your Google TV device is connected to can see that traffic. (Many hotels have a captive portal that Tailscale may have trouble with, some may even block Tailscale completely. YMMV.)

First, you have to decide what machine in your network will be the exit node, but the easiest choice is the same server running Plex Media Server and Tailscale. Assuming it's the same server, or some other Linux machine, use this command:

```sh
sudo tailscale up --advertise-exit-node
```

> If you previously set up subnet routing on the machine, you'll have to append the `--advertise-exit-node` flag to the prior command, for example:
>
> ```sh
> sudo tailscale up --advertise-routes=192.168.0.0/24 --advertise-exit-node
> ```

You'll see a warning that you have to enable IP forwarding, if you didn't do so already, so let's do that. (This is straight from the <a href="https://tailscale.com/kb/1019/subnets#enable-ip-forwarding" target="_blank">Tailscale docs</a>.)

If your machine has an `/etc/sysctl.d` directory (which most likely it does) then use these commands:

```sh
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
```

If your machine does NOT have the directory (`ls /etc/sysctl.d` returns `No such file or directory`) then instead use these commands:

```sh
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p /etc/sysctl.conf
```

You may also get a warning pointing you to the section on <a href="https://tailscale.com/kb/1320/performance-best-practices#linux-optimizations-for-subnet-routers-and-exit-nodes" target="_blank">Performance Optimizations for Linux</a> in the Tailscale documentation, which will advise to make the following changes via `ethtool`. (The below command will make it persist across reboots.)

```sh
printf '#!/bin/sh\n\nethtool -K %s rx-udp-gro-forwarding on rx-gro-list off \n' "$(ip -o route get 8.8.8.8 | cut -f 5 -d " ")" | sudo tee /etc/networkd-dispatcher/routable.d/50-tailscale
sudo chmod 755 /etc/networkd-dispatcher/routable.d/50-tailscale
```

If the above doesn't work, maybe because your Linux distro doesn't use NetworkManager, you can use `nmcli` instead. First use command `nmcli c` to list your network interfaces, then assuming your main interface is `eth0` (it may be `end0` or `enp2s0` or something else instead) you can then persist the changes to `ethtool` with the following commands:

```sh
sudo nmcli c modify "eth0" ethtool.feature-rx-udp-gro-forwarding on
sudo nmcli c modify "eth0" ethtool.feature-rx-gro-list off
```

Once that's all done go to the Tailscale admin console, on the **Machines** tab, and do the following:

1. Click the three dots to the right of the machine that will be the exit node. (It should have a little `exit node` tag next to it.)

2. Choose **Edit route settings...** from the dropdown menu.

3. Click the checkbox for **Use as exit node** and click the **Save** button to finish.

![Enabling exit node in Tailscale admin console.](../../img/blog/tailscale-exit-node.png 'Enabling exit node in Tailscale admin console')

Finally, to use the exit node on your Google TV, open the Tailscale app, connect to your Tailnet, go down to *Exit Node* and select the one you setup, then click on it to Enable. Now you can go back to the Google TV home screen and use the Plex app to stream your library securely from anywhere!

## Configuring the Plex server

I will assume your Plex server is already up and running and only explain how to make it accessible through Tailscale. Remember earlier when you saw your tailnet domain and possibly changed it to a fun name? You'll need that now, as well as the machine name of the Plex server. Let's assume the machine name is `plex` and you chose the domain `cetacean-nessie.ts.net`.

Go to the Plex web UI in a browser and navigate to **Settings** -> **Network**, then do the following:

1. Set _Secure connections_ to **Preferred**

![Secure connections setting in Plex.](../../img/blog/plex-secure-connections.png 'Secure connections setting in Plex')

2. Set _Preferred network interface_ to **Any**

3. Make sure _Enable Relays_ is **unchecked**

4. Go to _Custom server access URLs_ and type in the tailnet domain as a URL with the Plex port, e.g. `http://server.emperor-sloth.ts.net:32400`

![Relay and Server Access URL settings in Plex.](../../img/blog/googletv-tailscale-plex1.png 'Relay and Server Access URL settings in Plex')

5. Click on **Save changes**

If you're running Tailscale on the same server as Plex, then you're done! You should be able to see and play your Plex library on the Google TV device after you open the Tailscale app and connect. Next I'll explain how to set up an exit node in your home network that you can connect to from the Google TV for secure access.

## References

- <a href="https://tailscale.com/kb" target="_blank" umami-data-event="googletv-tailscale-plex-ref-tailscale-docs">Tailscale Documentation</a>
- <a href="https://tailscale.com/kb/1019/subnets" target="_blank" data-umami-event="googletv-tailscale-plex-ref-docs-subnets">Subnet Routers</a>
- <a href="https://tailscale.com/kb/1103/exit-nodes" target="_blank" data-umami-event="googletv-tailscale-plex-ref-docs-exitnodes">Exit Nodes</a>