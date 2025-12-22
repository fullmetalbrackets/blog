---
title: "Build a minimal blog with Deno and host it on Deno Deploy"
description: "I'd been meaning to play around with Deno and finally got around to doing it in the quickest, easiest (and laziest) way possible -- using a minimal blog template. I also took the opportunity to learn how Deno Deploy works. The whole thing is quick and painless, here's how to do it."
pubDate: 2022-11-19
updatedDate: 2025-02-03
tags: ["deno", "web development"]
related1: 5-ways-to-host-site-free
---

> [warning] Outdated Content
> 
> I wrote this blog post years ago when I was trying out Deno Deploy just for fun. I have not kept up with it, did not maintain the blog I built in this post, and let the domain lapse. Safe to assume Deno has changed enough in the intervening years that this project probably no longer works. This blog post will remain for legacy purposes, but it's probably unwise to try doing anything it says at this point.

<div id='install' />

## Install Deno

Installing Deno is quick and easy via automated script. You can alternately use various package managers <a href="https://deno.land/manual@v1.28.1/getting_started/installation" target="_blank" rel="noopener">as per the Deno documentation</a>. For this guide I will use the script to install with one command:

### For Windows PowerShell:

```powershell
irm https://deno.land/install.ps1 | iex
```

### For Linux and Mac terminal:

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

On Linux, after Deno is installed, add the `deno` command path to the end of your `.bashrc` or `.zshrc`:

```bash
export PATH="/home/username/.deno/bin:$PATH"
```

Verify successful installation with the command `deno --version`. In the future when you want to update Deno to the latest release, you can do so with the following command:

```bash
deno upgrade
```

<div id='blog' />

## Create the blog from template and customize it

We'll be using the <a href="https://github.com/denoland/deno_blog" target="_blank">deno_blog boilerplate</a> to set up a very minimal, no frills blog. The creator of Deno, Ryan Dahl, uses a version of this template <a href="https://tinyclouds.org" target="_blank" rel="noopener">for his own blog</a>.

Open a terminal and use the following command, substituting the path at the end where your project will live locally:

```bash
$ deno run -r --allow-read --allow-write https://deno.land/x/blog/init.ts ./directory/for/blog/
```

Once the blog is set up, go into the project directory and run the development server using the command `deno task dev` and go to the URL. Notice the default layout of everything.

![A blog running on Deno Deploy.](../../img/blog/deno1.png 'A blog running on Deno Deploy')

To configure and customize the blog, edit the `main.tsx` file. It should look like the below:

```tsx
/** @jsx h */

import blog, { ga, redirects, h } from "blog";

blog({
  title: "My Blog",
  description: "This is my new blog.",
  // header: <header>Your custom header</header>,
  // section: <section>Your custom section</section>,
  // footer: <footer>Your custom footer</footer>,
  avatar: "https://deno-avatar.deno.dev/avatar/blog.svg",
  avatarClass: "rounded-full",
  author: "An author",

  // middlewares: [

  // If you want to set up Google Analytics, paste your GA key here.
  // ga("UA-XXXXXXXX-X"),

  // If you want to provide some redirections, you can specify them here,
  // pathname specified in a key will redirect to pathname in the value.
  // redirects({
  //  "/hello_world.html": "/hello_world",
  // }),

  // ]
});
```

We'll go through this bit by bit:

- The `title` will appear in large text directly under your avatar, and `description` will appear in smaller text right under that. The `avatar` parameter takes a URL for the image to be displayed, and `avatarClass` determines the avatar's shape. Finally, `author` is self-explanatory, just use your own name here.

- The `header`, `section` and `footer` are commented out by default, but can be customized to change the default appearance of your blog. That's beyond the scope of this guide. (Mainly because I haven't messed with it too much myself.) It's safe to delete this if you will not use it.

- The commented out `middleware` and `redirects` are fairly self-explanatory, you can add a Google Analytics key and specify some redirects. Feel free to delete if you're not using them.
  <br><br>

In addition, you can add the following parameters:

- `dateStyle: "long"` displays dates in long format, for example _November 15, 2022_ (the default is short format, e.g. _2022-11-15_)
- `favicon: "favicon.ico"` lets you use a custom favicon, but be warned it only accepts `.ico` files -- unfortunately it does not support SVG favicons at this time.
- `lang: "en"` specifies the blog's language, the default is _en_ (English).
- `unocss: unocss_opts` seems to be for importing <a href="https://github.com/unocss/unocss" target="_blank" rel="noopener">Uno CSS</a> but I have not used it myself.
  <br><br>

Once you've got everything set up to your liking, you'll need to push the project to a GitHub repo for the next step.

<div id='deploy' />

## Host the blog on Deno Deploy

We'll be hosting our blog on <a href="https://deno.com/deploy" target="_blank" rel="noopener">Deno Deploy</a>, which deploys from a GitHub repo and requires a GitHub account for login.

Once logged in to Deno Deploy, you'll be on the _Projects_ dashboard. Click the _+ New Project_ button:

![Creating a new project in Deno Deploy](../../img/blog/deno2.png 'Creating a new project in Deno Deploy')

Click on _Select GitHub repository_ and you'll be taken to GitHub to login and choose a repo to deploy from.

Choose the option _Only select repositories_ then choose your blog's repo from the _Select repositories_ dropdown menu. Click _Save_ to confirm and be taken back to Deno Deploy. Now again click on _Select GitHub repository_, then on your GitHub username, then on the blog repo from the list.

Next click on _Select production branch_ and your main/master branch should be the default choice -- click it then click on _Automatic_ since we don't require a build step, then it should detect that `main.tsx` is the entry point, so click it. Next type in a project name, which will be the sub-directory of your project, for example: `https://my-blog.deno.dev`. Finally, click the _Link_ button to pull your code from the GitHub repo and publish to Deno Deploy. After a few minutes your blog should be up and running!

<div id='domain' />

## Use your own custom domain

Deno Deploy lets you easily use a custom domain you own instead of `https://project.deno.dev`. From the dashboard click on your project, then click on the _Settings_ tab. Scroll down to _Domains_ and click _+ Add Domain_, type in your custom domain, then click _Save_. Next click on the _Setup_ button next to your newly added domain, copy and paste the DNS records into your domain registrar's DNS settings, then after a few minutes click the _Validate_ button.

If it says "Validation has failed" just wait a little while longer then try again. Once validation is successful, you'll be able to provision an SSL certificate.

![Deno Deploy provisioning TLS certificates](../../img/blog/deno4.png 'Deno Deploy provisioning TLS certificates')

Click on _Get automatic certificates_ to finish. (Or upload your own certificate, if you prefer and know what you're doing.) After a few moments you should see your domain now has a green checkmark on it.

![Deno Deploy domain ready to go.](../../img/blog/deno5.png 'Deno Deploy domain ready to go')

You should now be able to go to your custom domain to reach your blog. For whatever reason, in my experience it seems to load much faster on a custom top-level domain compared to Deno Deploy's `deno.dev` sub-domain. Enjoy!

## Reference

- <a href="https://deno.land" target="_blank" rel="noopener">Deno</a> / <a href="https://deno.land/manual@v1.28.1/introduction" target="_blank" rel="noopener">Documentation</a>
- <a href="https://deno.com" target="_blank" rel="noopener">Deno Deploy</a> / <a href="https://deno.com/deploy/docs" target="_blank" rel="noopener">Documentation</a>
- <a href="https://github.com/denoland/deno_blog" target="_blank" rel="noopener">Deno Blog Boilerplate</a>
- <a href="https://github.com/fullmetalbrackets/deno-blog" target="_blank" rel="noopener">GitHub Repo of my Deno blog</a>