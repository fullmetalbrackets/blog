---
layout: "../../layouts/BlogPost.astro"
title: "Styling the kbd element"
description: "The kbd element less commonly used HTML5, but I wanted to style it to look like a key on a keyboard, like how Stack Overflow does it. A google search took me to someone else's blog post that had a nice bit of code and invited others to steal it. So I did."
pubDate: "September 19, 2022"
tags:
  - CSS
  - Web Dev
---

## Sections

1. [How the kbd element looks on this site](#kbd)
2. [The code!](#code)
3. [Reference](#ref)

<div class="note">
  <b>Attribution:</b>
  I want to start this off by saying <i>this is not my code</i>, but was taken from <a href="http://dylanatsmith.com/wrote/styling-the-kbd-element" target="_blank">Dylan Smith</a> from his own blog post on the subject, and I simply made a few modifications for my site. I encourage you to go read his post since mine is terse for my own purposes.
</div>

<div id='kbd'/>

## How the `kbd` element looks on this site

- <kbd>ESC</kbd><br><br>
- <kbd>ENTER</kbd><br><br>
- <kbd>SHIFT</kbd><br><br>
- <kbd>CTRL</kbd><br><br>
- <kbd>ALT</kbd><br><br>
- <kbd>DEL</kbd><br><br>
- <kbd>A</kbd><br><br>
- <kbd>1</kbd><br><br>
- <kbd>.</kbd>

<div id='code'/>

## The code

```css
kbd {
  background-color: #ccc;
  color: #222;
  border-radius: 0.25rem;
  border: 1px solid #000;
  box-shadow: 0 2px 0 1px #aaa;
  cursor: default;
  font-family: sans-serif;
  font-size: 0.75em;
  font-weight: 600;
  line-height: 1.2;
  min-width: 0.75rem;
  display: inline-block;
  text-align: center;
  padding: 2px 5px;
  position: relative;
  top: -1px;
}
```

Optionally, you can add a "pushed" effect on hover with the below code. (I don't use it for this site.)

```css
kbd:hover {
  box-shadow: 0 1px 0 0.5px #ccc;
  top: 1px;
}
```

Once again, thanks to <a href="http://dylanatsmith.com" target="_blank">Dylan Smith</a> for this!

<div id='ref'/>

## Reference

- <a href="http://dylanatsmith.com/wrote/styling-the-kbd-element" target="_blank">Writing by Dylan Smith</a>
