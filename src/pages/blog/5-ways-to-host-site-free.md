---
layout: "../../layouts/BlogPost.astro"
title: "5 ways to easily host your web site for free"
description: "So you're learning web development, building things locally and only ever seeing your site or app when you run it on your computer. But how do you get this thing online so you can make sure it works on the interwebs? How do you learn headers, content-security-policy and CORS without having a site hosted online to work with? And how to do it FOR FREE?"
pubDate: "September 06, 2021"
tags:
  - Web Hosting
  - Cloudflare
  - Netlify
  - Vercel
---

So you're learning web development, building things locally and only ever seeing your site or app when you use "npm run dev" (or "yarn dev") on your computer. But how do you get this thing online so you can make sure it works on the interwebs? How do you learn headers, content-security-policy and CORS without having a site hosted online to work with? And how to do it FOR FREE?

If you'd like to quickly jump to a specific host instead of reading about all of them, click on it below.

## Table of Contents

1. [Netlify](#netlify)
2. [Vercel](#vercel)
3. [GitHub Pages](#github)
4. [Cloudflare Pages](#cloudflare)
5. [Surge.sh](#surge)
6. [References](#ref)

<div id='netlify'/>

## Netlify

A super simple and user-friendly host that automagically builds and deploys your site when you push a commit to a remote Git repository where your site or app lives. The free tier is very generous (300 build minutes and 100GB of bandwidth per month) and the only requirement is for your project to be hosted at either GitHub, GitLab or Bitbucket. The only downside to Netlify is that it doesn't host a back-end for you, it's mainly geared towards static sites and JAMstack apps made with static site generators like Gatsby, Nuxt, Eleventy, etc. However, you can very easily use serverless functions, which are executed on AWS Lambda, although Netlify handles the whole things behind the scenes. Also, Netlify has some really cool plugins and features that solve problems for you, such as built-in form validation and Netlify CMS. A cool feature Netlify has that other choices do not is that you can use a **netlify.toml** file located in your project's root to tweak configurations, plugins, content security policies and more at build time, without needing to go into Netlify's UI before deploying. Optional, but handy.

How to deploy to Netlify:

1. Create an account or login at <a href="https://netlify.com" target="_blank">Netlify</a>.
2. In the team overview, click on "**New site from git**"
3. Under "**continuous deployment**", choose a Git provider.
4. You'll be prompted to login to your Git provider to authorize Netlify. Do so.
5. Next a list of your repositories should appear, choose one.
6. On the next page, you'll configure the branch to deploy and the build settings, so for example if your project uses yarn instead of npm, change the build command to "yarn build." Once you're done click "**Deploy site.**"
7. Netlify will begin the process of building your site, if there's no issues with the build then your site will deploy in a minute or two.
8. Be aware: ANY push to the Git repo will force a build & deploy of the site on Netlify, though you can turn off auto-deploys and only deploy manually if you really want to.

<div id='vercel'/>

## Vercel

Very similar to Netlify, but it has a major feature that Netlify does not -- server-side rendering! This means you can host your Node.js apps and stuff built with Next.js, for example. Another advantage Vercel has over Netlify is that it's free tier is very generous, with seemingly no limit on build minutes or bandwidth (at least not that I've noticed), however you cannot have collaborators on the free tier unlike Netlify. Like Netlify, Vercel auto-deploys from git repos, lets you use serverless functions, and has "branch deploys" for previewing changes before merges or pull requests. Honestly, Vercel is awesome, but I haven't used it much as of yet, though that is already changing as I've been using it for my new projects.

How to deploy to Vercel:

1. Create an account or login at <a href="https://vercel.com" target="_blank">Vercel</a>.
2. On your dashboard, click "**New Project**"
3. Under "**import from git repository**" choose a Git provider.
4. You'll be prompted to login to your Git provider and authorize Vercel. Do so, and click "**Import**" on the repository of your project.
5. On the next screen, press "**Skip**" to ignore the team setup (that's for pro accounts).
6. You'll be able to configure project settings, including framework if one is being used for the project (should be auto-detected), build and install commands (the defaults should be fine if the framework is detected correctly), output directory, and environmental variables. When you're done, scroll down and click "**Deploy**."
7. Vercel will begin the process of building your site, if there's no issues with the build then your site will deploy in a minute or two.

<div id='github'/>

## GitHub Pages

You can skip the third-party providers and host your site right on GitHub, though like Netlify will only host static sites, nothing with a back-end like Node.js or PHP. The only limits you really have are that both your site AND it's source repo may be no larger than 1GB, there is a soft bandwidth limit of 100GB per month, and a soft limit of 10 builds per hour. What does soft limit mean? Well, apparently your site won't automatically go offline or fail to deploy on new commits past the limits, BUT your builds may be delayed and GitHub will email you with suggestions on how to avoid hitting these limits again. The process for hosting a site is a little weird compared to others, but not difficult at all to grasp.

How to deploy to GitHub Pages:

1. Create a <a href="https://github.com" target="_blank">GitHub</a> account or login, and create a new repository.
2. Name the new repository **username.github.io** where "**username**" is your GitHub username, and click "**Create Repository**."
3. You'll have an empty repo now, but GitHub Pages is already set up for it automatically.
4. Now either import another repository or push a commit from a local repo.
5. If all goes well (and your site is compatible with GitHub Pages by default, no settings to configure/customize here, except the branch to deploy from) then your site will show up shortly at **https://username.github.io**

<div id='cloudflare'/>

## Cloudflare Pages

This is the free hosting option I've used the least, but in my tests it seems like one of the simpler hosts. Like Netlify and Vercel, Cloudflare Pages deploys from a git repo, automatically rebuilding and updating your site/app when you push a commit, and can do "preview deployments" that work the same way as Branch Deploys on the other two. It supports a huge amount of frameworks out of the box and has many more features I haven't even scratched the surface on. However, at the moment Cloudflare Pages only supports deploys from GitHub, and no other git provider.

How to deploy to Cloudflare Pages:

1. Create an account at <a href="https://page.cloudflare.com" target="_blank">Cloudflare</a>.
2. Click on the button that says "**Create a project**".
3. Cloudflare will request you to login to your GitHub account, do so.
4. Choose a repository to associate with your Page, then click "**Begin Setup**".
5. Set up your project name (this will become your sub-domain), production branch, build settings, environmental variables, etc. then click "**Save and Deploy**".
6. After a few minutes, your site will be available at **project-name.dev.pages**

<div id='surge'/>

## Surge.sh

Possibly the simplest hosting solution to ever exist. Literally one command in the terminal, answer a few prompts, and your site is up in seconds. The free tier includes unlimited publishing -- that means infinite sites, build minutes, and custom domains under your account. Here's how brain-dead simple using surge.sh is, although you do need to have access to (and be comfortable with) the command line.

1. `npm install -g surge` - This will install surge.sh globally so you can use it from any directory without first installing/adding it locally.
2. `npx surge` - If using Surge.sh for the first time (or from a new machine), it will prompt you for an email and password right in the command line, and log you in or create a new account if one does not exist matching the email address you entered. When logged in you'll be prompted to specify the full path to the directory to upload (it usually defaults to your present working directory), then a provides a randomly generated sub-domain of your choice (though you can specify your own sub-domain), then hit **⏎Enter** and your project gets uploaded. That's it! If you go to the URL you should see your site, it will literally take only seconds to be online.
3. NOTE: If your site is made with a static site generator like Nuxt or Gastby, make sure to first **build** and **generate** commands, then add the `/dist` directory as the one to serve.
4. TIP: `npx surge --domain https://example.surge.sh` - Pass the **--domain** option plus the URL to skip the sub-domain prompt. Also, if you specifically include **https://** in your URL it will force HTTPS for the site, so that going to `http://example.surge.sh` will auto-redirect to `https://example.surge.sh`.

## Other options

There's many free web hosts I haven't listed here, mostly because I haven't used them. One I intend to test out very soon is <a href="https://heroku.com" target="_blank">Heroku</a>, I'll eventually write a blog post about it, but as of 2022 it no longer has a free tier. Also, it is possible to host almost anything from simple sites, to complex apps and APIs on the <a href="https://aws.amazon.com" target="_blank">Amazon Web Services</a>, <a href="https://cloud.google.com" target="_blank">Google Cloud</a> and <a href="https://azure.microsoft.com" target="_blank">Microsoft Azure</a>, but they are more complicated to set up than the options listed here. I will write a separate blog post about those in the future as well. Thanks for reading.

<div id='ref'/>

## References

- <a href="https://netlify.com" target="_blank">Netlify</a> / <a href="https://docs.netlify.com" target="_blank">Documentation</a>
- <a href="https://vercel.com" target="_blank">Vercel</a> / <a href="https://vercel.com/docs" target="_blank">Documentation</a>
- <a href="https://pages.github.com" target="_blank">GitHub Pages</a> / <a href="https://docs.github.com/en/pages" target="_blank">Documentation</a>
- <a href="https://pages.cloudflare.com" target="_blank">Cloudflare Pages / <a href="https://developers.cloudflare.com/pages" target="_blank">Documentation</a>
- <a href="https://surge.sh" target="_blank">Surge.sh</a> / <a href="https://surge.sh/help" target="_blank">Documentation</a>
