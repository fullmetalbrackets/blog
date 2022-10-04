---
layout: "../../layouts/BlogPost.astro"
title: "How to use Netlify Forms in a Nuxt site and make sure it gets detected"
description: "Netlify has many awesome built-in features, and one of them is Netlify Forms, which essentially handles the back-end of your forms in most cases. But when hosting your Nuxt site on Netlify, it may not detect it even after you follow the instructions in their documentation, usually because there's one key trick missing that just makes it work. So let's discuss that trick and make sure Netlify Forms does what it's supposed to."
pubDate: "October 11, 2021"
tags:
  - Netlify
  - Nuxt
---

Netlify has many awesome built-in features, and one of them is Netlify Forms, which essentially handles the "back-end" of your forms in most cases. But when hosting your Nuxt site on Netlify, it may not detect it even after you follow the instructions in their documentation, usually because there's one key "trick" missing that just makes it work. So let's discuss that trick and make sure Netlify Forms does what it's supposed to.

I was breaking my head against this one for a while until I found <a href="https://medium.com/@kimbjrkman/adding-netlify-forms-on-your-nuxt-website-20ffba3e5ba8" target="_blank">this post on Medium</a> that finally gave me the answer, although they are over-engineering a bit, in my opinion. The issue is that Netlify's crawler will only detect HTML forms, and even though you're using HTML to create the form Nuxt will spit it out as JavaScript after build time. Netlify won't detect it. But as that post explains, there is a way, you just have to "fool" Netlify's bots a little bit. Here is a quick guide on how.

First, let's say your form is in your site's `contact.vue` page and it looks something like this:

```html
<!-- pages/contact.vue -->

<form name="contact" method="POST" netlify>
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
</form>
```

<a href="https://docs.netlify.com/forms/setup/" target="_blank">Netlify's documentation</a> says you only need either `netlify` (as above) or alternately `data-netlify="true"` on your form element for it to work. We're going to copy and paste this code exactly into a "dummy form" that will be detected by Netlify, even though the data will be coming from the real form above. In your Nuxt project's `/static` folder, create an HTML file. The name doesn't matter, I used `form.html`. Copy and paste the code exactly, using the same form name, same input name and types, and make sure to include the `netlify` attribute within the form element:

```html
<!-- static/form.html -->

<form name="contact" method="POST" netlify hidden>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message"></textarea>
</form>
```

That's it, you need nothing else besides that. Even if you navigate to this page on your site (you should just <a href="https://docs.netlify.com/routing/redirects/" target="_blank">redirect away from it</a> though) it will be blank, since we're including the `hidden` attribute in the form element. Because the code is identical Netlify Forms will handle the data from your actual contact page, after it crawled this fake form page. I have found literally no other way for Netlify Forms to work with a Nuxt site except by doing this. Hope it helps someone like it helped me!

## References

- <a href="https://medium.com/@kimbjrkman/adding-netlify-forms-on-your-nuxt-website-20ffba3e5ba8" target="_blank" rel="noopener noreferrer">Medium article that taught me this trick</a>
- <a href="https://docs.netlify.com/forms/setup/" target="_blank">Netlify Forms documentation</a>
