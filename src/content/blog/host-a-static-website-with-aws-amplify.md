---
title: "Host a static website with AWS Amplify"
description: "Getting started learning Amazon Web Services can be a bit intimidating. Once you've created your free account there's so many services on the AWS console that it can be overwhelming and confusing to figure out where to get started. So let's ease our way and start by just hosting a simple static website with AWS Amplify, it only takes a few minutes!"
pubDate: 2021-09-09
updatedDate: 2025-02-03
tags:
  - web development
---

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> This was one of my early blog posts when I was trying out every way to make static websites that existed. I never kept up with AWS and honestly have no idea if this guide is still viable for creating a static site on AWS Amplify. I think it's safe to say that as of beginning of 2025, this guide is beyond outdated and I don't suggest following it!

Getting started learning Amazon Web Services can be a bit intimidating. Once you've created your free account there's so many services on the AWS console that it can be overwhelming and confusing to figure out where to get started. So let's ease our way and start by just hosting a simple static website with AWS Amplify, it only takes a few minutes!

I've written before about <a href="https://arieldiaz.codes/blog/5-ways-to-easily-host-your-web-site-for-free" target="_blank">other ways to host your website</a>, and those other options may be better for a beginner, but let's ignore that for now. This is about getting our feet wet in AWS by using their Amplify service, which more or less works just like those other options anyway! First, go [create your free AWS account](https://aws.amazon.com) if you haven't already. Once that's done, we begin:

1. Login to the <a href="https://console.aws.amazon.com" target="_blank">AWS console</a>, and in Services click on **AWS Amplify**.
2. Once in AWS Amplify, click on the button that says **Get Started**.
3. Since we're just doing a static website here, under **_Deliver_** click on the button that says **Get Started**.
4. Click on your git provider, then click on **Continue**.
5. You'll need to authenticate AWS with your git provider.
6. Choose the repository you will deploy from, the branch (most likely main), then click **Next**.
7. On this page, you will see a YAML file with build and test settings. If you want to edit the config, click on **Edit** and make your changes, then **Save**. If using a static site generator like Nuxt, make sure you add the `yarn run generate` command and specify the build output directory, for example `baseDirectory: /dist`. When done click **Next**.
8. On the following page you can review everything and go back to make changes if necessary. When ready, click on **Save and Deploy**.
9. After a few minutes, your site is deployed and you can access it at the URL provided.

That's it! AWS Amplify uses continuous deployment from git, meaning any push to your remote repo on GitHub, Bitbucket, or what have you will automatically trigger a rebuild and redeploy, similar to other hosting services like Netlify and Vercel. To use your own domain, click on _Domain management_ in the AWS Amplify console. Make sure to add custom headers and any necessary redirects through the console as well.

## References

- <a href="https://docs.aws.amazon.com/amplify/?id=docs_gateway" target="_blank">AWS Amplify Documentation</a>
