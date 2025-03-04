---
title: "Setup self-hosted Jellyfin Media Server in Docker"
description: "Though Plex is a very popular media server for self-hosting, some open source enthusiasts prefer to use an alternative since Plex Media Server is not open source. A nice, simpler and admittedly less pretty alternative is Jellyfin. This guide will show you how to run it in Docker container."
pubDate: 2022-10-18
updatedDate: 2025-02-03
tags:
  - docker
---

## Installing Jellyfin as a Docker container

If you haven't already, install Docker and all it's dependencies quickly their official install script:

```bash
curl -fsSL https://get.docker.com | sh
```

Though Jellyfin has an <a href="https://hub.docker.com/r/jellyfin/jellyfin" target="_blank" data-umami-event="setup-jellyfin-official-image">official Docker image</a>, if this is your first time running Jellyfin I strongly suggest you instead use the <a href="https://hub.docker.com/r/linuxserver/jellyfin" target="_blank" data-umami-event="setup-jellyfin-linuxserver-image">Linuxserver image</a>, which is built and maintained by the <a href="https://www.linuxserver.io" target="_blank" data-umami-event="setup-jellyfin-linuxserver">Linuxserver community</a>. I have run the Linuxserver image of Jellyfin without issue, and it seems that is also the case with most self-hosters.

Create a `compose.yaml` file, copy and paste the following:

```yaml
---
services:
  jellyfin:
    image: lscr.io/linuxserver/jellyfin:latest
    container_name: jellyfin
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - JELLYFIN_PublishedServerUrl=192.168.0.100
    volumes:
      - /opt/docker/jellyfin:/config
      - /mnt/media/tvshows:/data/tvshows
      - /mnt/media/movies:/data/movies
    ports:
      - 8096:8096
      - 8920:8920
      - 7359:7359/udp
    restart: unless-stopped
```

Let's break down what each of these parameters do:

| Parameter                      | Function  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `image`                        | Here we're using the latest version of the <a href="https://docs.linuxserver.io/images/docker-jellyfin" target="_blank" data-umami-event="setup-jellyfin-">Linuxserver-maintained image</a>. |
| `container_name`               | Optional, but you should give your containers a name for clarity. |
| `PUID=1000`<br>`PGID=1000`     | These env variable sets a UID and GID for Jellyfin and should match the owner of the volumes you are adding; check your UID and GID with the command `id`. |
| `JELLYFIN_PublishedServerUrl=` | This will allow the server to be discoverable on your home network. Add this with your server's IP to easily connect your devices to Jellyfin. Make sure to map UDP port `7359` for this to work. (See below.) |
| `ports`                        | This will map ports on your machine (left of the colon) to ports inside the container (right of the colon) -- optional in Linux but required in Windows and WSL.<br><br>Port `8096` is for HTTP access, `8920` for HTTPS (optional) and `7359:7359/udp` lets the server be discoverable on your local network when using the `JELLYFIN_PublishedServerUrl` parameter. (See above.) |
| `volumes`                      | Here we're mapping local directories (left of the colon) to directories inside the container (right of the colon), change this to your own local paths. |
| `restart`                      | This tells Docker under what circumstances to restart the container when it is stopped -- the options are `no`, `always`, `on-failure` and `unless-stopped`. |

If you'd like to use hardware acceleration, <a href="https://jellyfin.org/docs/general/administration/hardware-acceleration" target="_blank" data-umami-event="setup-jellyfin-docs-hw-accel">see this part of the Jellyfin documentation</a>. If the machine you're hosting Jellyfin on has an Intel CPU, there's a good chance is supports Quick Sync and you should let Jellyfin use it. To do so, add the following option to your docker compose:

```yaml
devices:
  - /dev/dri/renderD128:/dev/dri/renderD128
  - /dev/dri/card0:/dev/dri/card0
```

Once your compose file is ready, save it and exit the editor. Now from within the same directory as the `compose.yaml` is located, use the following command to install and start the container in the background as a daemon:

```bash
docker compose up -d
```

## Configuring Jellyfin

Wait a minute while the container is downloaded and install. After completion, use the command `docker ps` to verify the container is up and running. You should see output similar to the below:

```bash
CONTAINER ID   IMAGE                                 COMMAND   CREATED         STATUS         PORTS                                                                   NAMES
7383028393f4   lscr.io/linuxserver/jellyfin:latest   "/init"   9 seconds ago   Up 7 seconds   0.0.0.0:8096->8096/tcp, 0.0.0.0:8920->8920/tcp, 0.0.0.0:359->7359/udp   jellyfin
```

Good to go. Now to configure Jellyfin you'll need to access it's web UI, which by default is at (for example) `http://192.168.0.100:8096`. On the first page you'll be asked to choose a language and can also use the Quick Start if desired, for purposes of this guide we'll choose _English_ and click _Next_. On the following page you can create a user and password (or you can use no password if preferred), create your login and click _Next_.

![Creating a user in Jellyfin.](../../img/blog/jellyfin1.png 'Creating a user in Jellyfin')

You'll be taken to setup your media libraries, click on _Add Media Library_.

![Setting up media library in Jellyfin.](../../img/blog/jellyfin2.png 'Setting up media library in Jellyfin')

In the Content Type drop down menu, choose like kind of media you're adding. For this guide we'll choose _Movies_, then click _Ok_.

![Creating a movie library in Jellyfin.](../../img/blog/jellyfin3.png 'Creating a movie library in Jellyfin')

A series of options will appear, read through them and make your choices, or just leave the defaults if you don't want to change anything. To add a folder to the library, click the _Plus (+) button_ and you'll get a pop-up where you can choose a folder. Choose from the list, or type out the path, and click _Ok_ (You can also add a network share as the folder.)

![Adding a folder to Jellyfin movie library.](../../img/blog/jellyfin4.png 'Adding a folder to Jellyfin movie library')

On the following page you can set up remote access to Jellyfin, meaning whether other devices will be able to access Jellyfin. Check the box _Allow remote connections to this server_, but leave unchecked _Enable automatic port mapping_ unless you want to access Jellyfin from outside your network. (You'll additionally need to forward port 8096 on your router to the server running Jellyfin. I don't suggest it.) Then click _Next_.

![Remote access in Jellyfin.](../../img/blog/jellyfin5.png 'Remote access in Jellyfin')

Your movies should now appear within the _Movies_ section of the Jellyfin UI. Repeat the process to add other directories for your _TV_, _Music_, _Books_, _Photos_ and other libraries if desired. And you're done! You can now watch jellyfin right in the web UI.

## Theming the web UI with custom CSS

If you'd like to change the web GUI's colors and vibe, you'll need the <a href="https://github.com/danieladov/jellyfin-plugin-skin-manager" target="_blank" data-umami-event="setup-jellyfin-">Skin Manager</a> community plugin. (These affect the web UI accessed via the browser only.) As per the directions on their GitHub:

1. In jellyfin, go to _Dashboard_ -> _Plugins_ -> _Repositories_ -> add and paste this link `https://raw.githubusercontent.com/danieladov/JellyfinPluginManifest/master/manifest.json`
2. Go to Catalog and search for Skin Manager
3. Click on it and install
4. Restart Jellyfin

Use `docker restart jellyfin` and once the Jellyfin container has restarted, go back into the GUI, go to _Dashboard_ -> _Plugins_ and click on _Skin Manager_. Use the dropdown menu to pick a skin (my favorite is <a href="https://github.com/prayag17/JellySkin" target="_blank" data-umami-event="setup-jellyfin-jellyskin">JellySkin</a>), tweak any options if it has them, and click _Set Skin_. If it doesn't switch to the new time right away, try a hard refresh with <kbd>Ctrl</kbd> + <kbd>F5</kbd>. Also, sometimes <a href="https://github.com/danieladov/jellyfin-plugin-skin-manager#using-with-reverse-proxy" target="_blank" data-umami-event="setup-jellyfin-jellyskins-proxy">Nginx Proxy Manager</a> the skins won't work due to CSP issues. (I haven't encountered this problem, but [I have my reverse proxy set up without HTTPS](reverse-proxy-nginx-pihole.md) and that may be why.)

## References

- <a href="https://linuxserver.io" target="_blank" data-umami-event="setup-jellyfin-linuxserver">Linuxserver</a>
- <a href="https://jellyfin.org" target="_blank" data-umami-event="setup-jellyfin-jfsite">Jellyfin</a>
- <a href="https://docker.com" target="_blank" data-umami-event="setup-jellyfin-docker">Docker</a>

### Related Articles

- <a href="/blog/setting-up-plex-in-docker/" data-umami-event="setup-jellyfin-related-setup-plex">Setup self-hosted Plex Media Server in Docker</a>
- <a href="/blog/how-to-run-filebrowser-in-docker/" data-umami-event="setup-jellyfin-related-filebrowser">How to run self-hosted FileBrowser in Docker</a>