---
layout: "../../layouts/BlogPost.astro"
title: "Using Surge.sh to quickly and easily host static sites"
description: "Although I love using Netlify to host my site, for testing out sites and simple apps I have fallen in love with Surge.sh, a ridiculously simple web hosting solution that works entirely from the command line."
pubDate: "October 5, 2022"
tags:
  - Surge
  - Web Hosting
  - Command Line
---

## Sections

1. [Getting started](#start)
2. [Using a custom sub-domain and forcing HTTPS](#https)
3. [Using your own domain](#domain)
4. [Ignore specific files and directories](#ignore)
5. [Adding redirects](#redirect)
6. [References](#ref)

<div id='start'/>

## Getting started

Using _Surge_ requires NodeJS, so make sure you have the latest version of Node and NPM installed. To install Surge, use the following command:

```bash
npm install --global surge
```

Once installed, navigate on the terminal to the root directory of whatever project you want to put on the internet. Use the following command:

```bash
npx surge
```

The first time you do this command, you'll be prompted to create an account, just enter an email and password. Every time thereafter, `npx surge` will immediately publish the present working directory to the web, to a randomly-generated subdomain of Surge.sh, e.g. `wandering-unicorn.surge.sh`

> _Tip:_ If using a static site generator like Astro or Eleventy, you'll first need use `npm build` (or equivalent) to first build the static assets, then specify the directory to publish, e.g. `npx surge dist`

If you want to remove a Surge site you published, it's just another simple command:

```bash
npx surge teardown wandering-unicorn.surge.sh
```

To see a list of all your published projects on Surge, use this command:

```bash
npx surge list
```

<div id='https'/>

## Using a custom sub-domain and forcing HTTPS

To use a custom subdomain, you need to pass the `--domain` option and specify the URL you want:

```bash
npx surge --domain mysubdomain.surge.sh
```

If you want your published site to be secured with an SSL certificate, specify it on the domain:

```bash
npx surge --domain https://mysubdomain.surge.sh
```

The above will also cause an automatic browser redirect when visiting the site, e.g. going to `http://mysubdomain.surge.sh` will auto-redirect to `https://mysubdomain.surge.sh`

<div id='domain'/>

## Using your own domain

Surge lets you use your own domain instead of a surge.sh subdomain. First, you'll need to go to your domain's dashboard and add a new _CNAME record_, and set the hostnames _@_ and _www_ to the `na-west1.surge.sh`

Alternately you can instead add an _A record_ set to IP address `45.55.110.124`

> **Note:** For detailed instructions on changing your owned domain's records, see <a href="https://surge.sh/help/adding-a-custom-domain" target="_blank">Surge's documentation</a>.

If your records are set up properly, you can deploy to your custom domain like so:

```bash
npx surge /path/to/project custom-domain.com
```

You can also save your custom domain to a _CNAME file_ (no file extension) in your project's root directory, so you don't have to type it in every time. You can create the CName file with this command:

```bash
echo custom-domain.com > CNAME
```

> **Important:** Though all projects published to surge.sh sub-domains include free SSL, this is not the case with custom domains! To use SSL with your own domain, you'll need the paid <a href="https://surge.sh/plus" target="_blank">Surge Plus</a> plan, which costs $30/month. For more details, see <a href="https://surge.sh/help/securing-your-custom-domain-with-ssl" target="_blank">this section of the Surge documentation</a>.

<div id='ignore'/>

## Ignore specific files and directories

Surge ignores `.` files and directories like `.git` on deploy, but you can also add a `.surgeignore` file at your project's root. By default, surge will ignore the following:

```ini
.git
.*
*.*~
node_modules
bower_components
```

> _Note:_ If using a static site generator, place the `.surgeignore` file in the directory you are publishing, e.g. `/dist`

<div id='redirects'/>

## Adding redirects

Create a `ROUTER` file (no file extension) in the directory you will publish, and add redirects as necessary. For example, to redirect from `/contact` to `/about`, use this:

```ini
301     /contact      /about
```

The options for status codes are:

| _Status Code_ | _Redirect Type_ |
| ------------- | --------------- |
| 301           | Permanent       |
| 307           | Temporary       |

If you want to redirect slug/paginated content you can use a redirect pattern, which will catch and redirect all URLs following a certain format. For example:

```ini
301     /blog/:title     /articles/:title
```

This will redirect any posts in `/blog` to the same titled post in `/articles`, e.g. `/blog/my-awesome-post` will redirect to `/articles/my-awesome-post` automatically.

`:title` is used in the example, but you can name the pattern variables anything you’d like. Here’s how you might redirect the URLs from an old WordPress blog to your new static Jekyll site:

```ini
301   /:year/:month/:day/:slug   /blog/:slug
```

You can also redirect to another URL:

```ini
307     /blog     https://some-other-site.com/blog
```

Put all your redirects together in your `ROUTER` file, one per line:

```ini
301     /contact        /about
301     /blog/:title    /articles/:title
307     /code           https://github.com/username
```

<div id='ref'/>

## References

- <a href="https://surge.sh/help" target="_blank">Surge documentation</a>
