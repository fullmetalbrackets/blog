---
title: "Setup self-hosted Plex Media Server in Docker"
description: "One of the most popular services to self-host in Plex Media Server, which serves your personal media library with a nice Netflix-like UI. Though you can install and run it bare-metal, the most common and easiest way is in a Docker container. Here's how."
pubDate: 2022-10-17
updatedDate: 2025-02-03
tags:
  - docker
---

## Installing Plex as a Docker container

If you haven't already, install Docker and all it's dependencies quickly their official install script:

```bash
curl -fsSL https://get.docker.com | sh
```

Though Plex has an <a href="https://hub.docker.com/r/plexinc/pms-docker" target="_blank" data-umami-event="setup-plex-official-image">official Docker image</a>, if this is your first time running Plex I strongly suggest you instead use the <a href="https://hub.docker.com/r/linuxserver/plex" target="_blank" data-umami-event="setup-plex-linuxserver-image">Linuxserver image</a>, which is built and maintained by the <a href="https://www.linuxserver.io" target="_blank" data-umami-event="setup-plex-linuxserver">Linuxserver community</a>. I run the Linuxserver image of Plex without issue, and it seems that is also the case with most self-hosters.

Create a `compose.yaml` file, copy and paste the following:

```yaml
services:
  plex:
    image: lscr.io/linuxserver/plex:latest
    container_name: plex
    network_mode: host
    environment:
      - PUID=1000
      - PGID=1000
    ports:
    volumes:
      - /opt/docker/plex:/config
      - /mnt/media/tv:/tv
      - /mnt/media/movies:/movies
      - /mnt/media/music:/music
      - /mnt/media/photos:/photos
    restart: unless-stopped
```

Let's break down what each of these parameters do:

| Paramter                   | Function                                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image`                    | Here we're using the latest version of the <a href="https://docs.linuxserver.io/images/docker-plex" target="_blank" data-umami-event="setup-plex-">Linuxserver-maintained image</a>.            |
| `container_name`           | Optional, but you should give your containers a name for clarity.                                                                                                |
| `network_mode: host`       | This is required to run Plex on Linux, but _cannot_ be used when running Plex on Windows or WSL.                                                                 |
| `PUID=1000`<br>`PGID=1000` | These environmental variable sets a UID and GID for Plex and should match the owner of the volumes you are adding; check your UID and GID with the command `id`. |
| `ports`                    | This will map ports on your machine (left of the colon) to ports inside the container (right of colon) -- optional in Linux but required in Windows and WSL.     |
| `volumes`                  | Here we're mapping local directories (left of the colon) to directories inside the container (right of the colon), change this to your own local paths.          |
| `restart`                  | This tells Docker under what circumstances to restart the container when it is stopped -- the options are `no`, `always`, `on-failure` and `unless-stopped`.     |

Once your compose file is ready, save it and exit the editor. Now from within the same directory as the `compose.yaml` is located, use the following command to install and start the container in the background as a daemon:

```bash
docker compose up -d
```

## Configuring Plex

Wait a minute while the container is downloaded and install. After completion, use the command `docker ps` to verify the container is up and running. You should see output similar to the below:

```bash
CONTAINER ID   IMAGE                              COMMAND   CREATED           STATUS
f77c895f24d5   lscr.io/linuxserver/plex:latest    "/init"   13 seconds ago    Up 9 seconds
```

Good to go. Now to configure Plex you'll need to access it's web UI, which by default is at (for example) `http://192.168.1.100:32400/web`. You'll be asked to login. (A free <a href="https://www.plex.tv" target="_blank" data-umami-event="setup-plex-account">Plex account</a> is required.)

![Plex Media Server login page.](../../img/blog/plex1.png 'Plex Media Server login page')

After signing in, after a few explanatory pages, you'll arrive at the Server Setup page. Name your server, uncheck the checkbox unless you'll be making Plex available from outside your network (not recommended unless you know what you're doing, see <a href="/blog/expose-plex-tailscale-vps/)" target="_blank" data-umami-event="setup-plex-">this blog post for a better way</a>), and click _Next_.

![Plex server initial setup.](../../img/blog/plex2.png 'Plex server initial setup')

You'll then be able to add folders with your media to the Plex library. Click the _Add Library_ button.

![Adding a library in Plex.](../../img/blog/plex3.png 'Adding a library Plex library')

On the following page, you'll be able to add media directories to each Library Type. We'll use _Movies_ as an example, select it then click the _Add_ button.

![Adding movie directory to Plex library.](../../img/blog/plex4.png 'Adding movie directory to Plex library')

Next choose the local directory from the list, in this case _movies_ (the Docker container's directory mapped to `/mnt/media/movies`), and click _Add_.

![Adding movie directory to Plex library.](../../img/blog/plex5.png 'Adding movie directory to Plex library')

Your movies should now appear within the _Movies_ section of the Plex UI. Repeat the process to add other directories for your _TV_, _Music_ and _Photos_ libraries. And you're done! You can now watch Plex right in the web UI, or (ideally) by downloading and signing into the Plex app on devices in your network.

## References

- <a href="https://linuxserver.io" target="_blank" data-umami-event="setup-plex-linuxserver">Linuxserver</a>
- <a href="https://plex.tv" target="_blank" data-umami-event="setup-plex-plexsite">Plex</a>
- <a href="https://docker.com" target="_blank" data-umami-event="setup-plex-docker">Docker</a>

### Related Articles

- <a href="/blog/expose-plex-tailscale-vps/" data-umami-event="setup-plex-related-expose-tailscale-vps">How to securely expose Plex from behind CGNAT using Tailscale and a free Oracle VM</a>
- <a href="/blog/setting-up-jellyfin-in-docker/" data-umami-event="setup-plex-setup-jellyfin">Setup self-hosted Jellyfin Media Server in Docker</a>