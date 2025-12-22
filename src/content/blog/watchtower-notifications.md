---
title: "Setup Watchtower to auto-update Docker containers with notifications"
description: "I'm running almost 30 containers on my home server at this point, and I'm extremely lazy when it comes to updating them. Watchtower is a lightweight set-it-and-forget-it solution to auto-updating containers, and it even has built-in notifications. Here's how to set it up using either Pushover or Discord."
pubDate: 2024-05-31
updatedDate: 2025-12-22
tags: ["self-hosting", "docker"]
related1: setting-up-plex-in-docker
related2: how-to-run-filebrowser-in-docker
---

> [warning] Urgent!
>
> As of December 2025 the [original Watchtower project](https://github.com/containrrr/watchtower) has been archived and will no longer be maintained, as per [this message by the developer](https://github.com/containrrr/watchtower/discussions/2135).
>
> There are several forks and alternative projects, but I have been using [this Watchtower fork by Nick Fedor](https://github.com/nicholas-fedor/watchtower) which he has been maintaining and improving since the main project stopped receiving updates in early 2024. **It is a drop-in replacement** for the original Watchtower, just change the image to `nickfedor/watchtower` and you literally have to change nothing else. (All examples below have been updated to this.)

![Watchtower logo](../../img/blog/watchtower.png)

## About Watchtower

[Watchtower](https://github.com/nicholas-fedor/watchtower) is a container-based solution for automating Docker container base image updates. It runs with zero config and will automatically update any containers with a new image available and reload it, although you can configure it with all sorts of options. I strongly suggest [reading the documentation](http://watchtower.nickfedor.com/) to see all the available options, I will be demonstrating very specific options which I use myself and explain their use, but that won't even scratch the surface of what's capable with Watchtower.

## Setting up Watchtower with Docker Compose

First things first, if you haven't yet, you can install Docker and all dependencies quickly with the following command:

```bash
curl -fsSL https://get.docker.com | sh
```

I like to use `docker compose` for everything, or at least as much as possible, and I suggest you do the same. Create a new 'compose.yaml` file or edit an existing one and add the below:

```yaml
services:
  watchtower:
    container_name: watchtower
    image: nickfedor/watchtower:latest
    restart: always
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_INCLUDE_STOPPED=true
      - WATCHTOWER_REVIVE_STOPPED=false
```

> If you're already running other containers and want them all in the same stack (although Watchtower will monitor and update ALL containers regardless of stack, unless you specifically configure it otherwise), you can simply copy and paste the above into an existing compose file and re-run it to add Watchtower.

Here's what these environment variables do.

- `WATCHTOWER_CLEANUP=true`: This will make Watchtower delete old images once a container is updated. (You can leave this out if you prefer to use `docker prune` to manually delete old images.)
- `WATCHTOWER_INCLUDE_STOPPED=true`: This will cause Watchtower to update all containers, whether running or stopped, since by default Watchtower will only update running containers and ignore stopped ones.
- `WATCHTOWER_REVIVE_STOPPED=false`: This will cause Watchtower NOT to restart stopped containers after updating them (via the above), which by default it will.

At this point you can save the file and, in the same directory where the file is located, run the command `docker compose up -d` to install and run Watchtower. You're now set up to automatically shutdown, update and restart containers when a new image is available. However, what if we want to be notified when an update happens?

## Notifications via Pushover (or other methods)

Watchtower has the <a href="https://github.com/containrrr/shoutrrr" target="_blank" data-umami-event="watchtower-notifications-shoutrrr-gh">Shoutrrr</a> libraries built-in to send notifications through several services (Discord, Telegram, Pushover, Pushbullet, Gotify just to name a few) or email (if you have SMTP set up on your server) without needing to run another container. Each service has a specific syntax to use it, and you'll need API keys or login info for the service you'll be using, so <a href="https://containrrr.dev/shoutrrr/v0.8/services/overview" target="_blank" data-umami-event="watchtower-notifications-shoutrrr-docs-services">check the documentation here</a> for details.

In my case, I use Pushover to notification to my phone, but that's just my preference -- there's many others, again just check the documentation for a full list. In case you want to use Pushover too, here's a quick how-to on setting it up.

1. Go to <a href="https://pushover.net" target="_blank" data-umami-event="watchtower-notifications-pushover">the Pushover website</a> and create a free account.

2. Once you're logged in and on the main page, you'll see your **User Key** on the right. You'll need this to set up notifications in Watchtower.

![Pushover main page with User Key.](../../img/blog/pushover1.png 'Pushover main page with User Key')

3. Scroll down to the bottom and click on **Create an Application/API token**.

4. Name the application (in this case Watchtower, or whatever you want), give it a description if you want, and optionally upload a logo. (I just used <a href="https://github.com/nicholas-fedor/watchtower/blob/main/logo.png" target="_blank">the logo from their GitHub</a>.)

![Creating new application in Pushover.](../../img/blog/pushover2.png 'Creating new application in Pushover')

5. Check the box and click the **Create Application** button.

6. Now under **Your Applications** you should see the one you just created, click on it. You'll see your **API Token/Key** which you will also need.

![Pushover API Token for created application.](../../img/blog/pushover3.png 'Pushover API Token for created application')

7. Back on the main page, click on **Add Phone, Tablet, or Desktop** and you'll see the different clients available. Pick your poison and download it from your phone's app store. (Or if you want Desktop notifications, click on that and follow the instructions.)

8. Once you've downloaded the app on your phone/tablet, open it and login with your Pushover username and password, then enter a name for the device or use the default one. This adds the device to Pushover. (If you ever want to remove the device, just logout from the app.)

![Logging in to Pushover mobile app.](../../img/blog/pushover4.jpg 'Logging in to Pushover mobile app')
![Naming device in Pushover mobile app.](../../img/blog/pushover5.jpg 'Naming device in Pushover mobile app')

Now that Pushover is set up, we'll make Watchtower use it for notifications. Per the <a href="https://containrrr.dev/shoutrrr/v0.8/services/pushover" target="_blank" data-umami-event="watchtower-notifications-shoutrrr-docs-pushover">Shoutrrr documentation</a>, Pushover uses the syntax `pushover://:token@user`, so you want to add this to your compose file under environment:

```yaml
  - WATCHTOWER_NOTIFICATION_URL=pushover://:<application-api-token>@<user-key>
```

With that your notifications will come out to something like *"Watchtower updates on f712f789719e"* which is not very human readable. Let's add one more environmental variable to make our server's hostname show up instead:

```yaml
  - WATCHTOWER_NOTIFICATIONS_HOSTNAME=<hostname>
```

Finally, let's schedule updates for a specific time when no one will be using them. This is done as a `cron` expression, but it takes 6 fields instead of the standard 5, and times are in UTC. (I suggest using <a href="https://crontab.cronhub.io" target="_blank" data-umami-event="watchtower-notifications-cronhub">this cron expression generator by Cronhub</a>.) So, for example, the below schedule updates for _0800 UTC_ which is **3:00 AM EST**:

```yaml
  - WATCHTOWER_SCHEDULE=0 0 8 * * *
```

Your `compose.yaml` file should look like this:

```yaml
  watchtower:
    container_name: watchtower
    image: nickfedor/watchtower:latest
    restart: always
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_INCLUDE_STOPPED=true
      - WATCHTOWER_REVIVE_STOPPED=false
      - WATCHTOWER_NOTIFICATION_URL=pushover://:<application-api-token>@<user-key>
      - WATCHTOWER_NOTIFICATIONS_HOSTNAME=<hostname>
      - WATCHTOWER_SCHEDULE=0 0 8 * * *
```

Use `docker compose up -d` again to update the container. Once it's up and running, you should get a notification from Pushover that looks like this (with the hostname you set, in the example below it shows my server's hostname):

![Initial Watchtower notification confirming Pushover is working.](../../img/blog/pushover6.jpg 'Initial Watchtower notification confirming Pushover is working')

In the future, any updates will result in a notification specifying which containers were updated and restarted, for example:

![Example of Watchtower notification via Pushover.](../../img/blog/pushover7.jpg 'Example of Watchtower notification via Pushover')

All done! You should now get notifications through Pushover each time Watchtower updates any container images. If you want to use a different service for notifications, simply check <a href="https://containrrr.dev/shoutrrr/v0.8/services/overview" target="_blank" data-umami-event="watchtower-notifications-shoutrrr-docs-services">the Shoutrrr documentation for the syntax</a> and use that instead.

## Notifications via Discord

To use Discord notifications with Watchtower requires enabling webhooks, only possible in the web interface on a browser. (Not possible from any Discord app.)

Click on settings (gear icon?)

![Discord server settings.](../../img/blog/watchtower-discord1.png 'Discord server setting')

Scroll down to _Apps_ and click on **Integrations**.

![Integrations setting in Discord server.](../../img/blog/watchtower-discord2.png 'Integrations setting in Discord server')

Click on **Create a webhook**.

![Creating a webhook in Discord.](../../img/blog/watchtower-discord3.png 'Creating a webhook in Discord')

Click on **copy webhook URL**

![Configuring the Discord server bot.](../../img/blog/watchtower-discord4.png 'Configuring the Discord server bot')

If you paste it somewhere, you'll see the URL is something like `https://discord.com/api/webhooks/098349569125/n_AJKSH792n_H07a45solpjag90&-yGr1`. Based on the <a href="https://containrrr.dev/shoutrrr/v0.8/services/discord/" target="_blank">Shoutrrr documentation</a>, we're looking for the two alphanumerics at the end, `098349569125` is the **webhook-id**, while at the end `n_AJKSH792n_H07a45solpjag90&-yGr1` is the **token**.

Now for the `compose.yaml` file, it should look something should look like this:

```yaml
  watchtower:
    container_name: watchtower
    image: nickfedor/watchtower:latest
    restart: always
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    environment:
      - WATCHTOWER_NOTIFICATION_URL=discord://token@webhook-id
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_INCLUDE_STOPPED=true
      - WATCHTOWER_REVIVE_STOPPED=false
      - WATCHTOWER_NOTIFICATIONS_HOSTNAME=<hostname>
      - WATCHTOWER_SCHEDULE=0 0 8 * * *
```

Note that for Shoutrrr, we'll need to reverse the *token* and *webhook-id* on the URL environment variable. Make sure to use something like `discord://n_AJKSH792n_H07a45solpjag90&-yGr1@098349569125` using the example above. (These are not real webhooks and tokens.)

Use `docker compose up -d` to run the container. Once it's up and running, you should get a notification from the Discord that looks like this (with the hostname you set, in the example below it shows my server's hostname):

![Watchtower notification on Discord general channel.](../../img/blog/watchtower-discord5.png 'Watchtower notification on Discord general channel')

## References

- <a href="https://watchtower.nickfedor.com/" target="_blank" data-umami-event="watchtower-notifications-docs">Watchtower Documentation</a>
- <a href="https://github.com/nicholas-fedor/watchtower" target="_blank" data-umami-event="watchtower-notifications-gh">Watchtower GitHub</a>
- <a href="https://containrrr.dev/shoutrrr" target="_blank" data-umami-event="watchtower-notifications-shoutrrr-docs">Shoutrrr Documentation</a>
- <a href="https://github.com/containrrr/shoutrrr" target="_blank" data-umami-event="watchtower-notifications-shoutrrr-gh">Shoutrrr GitHub</a>