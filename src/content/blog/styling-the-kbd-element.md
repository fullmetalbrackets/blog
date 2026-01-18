---
title: "Styling the kbd element"
description: "I wanted to style my <kbd> element to look like a keyboard, and a google search took me to someone else's blog post that had a nice bit of code and invited others to steal it. So I did."
pubDate: 2022-09-09
updatedDate: 2026-01-17
tags: ["web development"]
related1: turn-static-website-into-pwa
---

> I want to start this off by saying <i>this is not my code</i>, but was taken from <a href="http://dylanatsmith.com/wrote/styling-the-kbd-element" target="_blank">Dylan Smith</a> from his own blog post on the subject, and I simply made a few modifications for my site. I encourage you to go read his post since mine is terse for my own purposes.

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

## The code

This is my version, obviously change the colors and other things as you see fit.

```css
kbd {
  background-color: #ccc;
  color: #222;
  border-radius: 0.2em;
  border: 1px solid #000;
  box-shadow: 0 2px 0 1px #888;
  cursor: default;
  font-family: sans-serif;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1.2;
  min-width: 0.75rem;
  display: inline-block;
  text-align: center;
  padding: 3px 5px 2px;
  position: relative;
  transition: all .1s linear;
  top: -1px;
}
```

Optionally, you can add a "pushed" effect on hover with the below code.

```css
kbd:hover {
  box-shadow: 0 1px 0 0.5px #888;
  transition: all .1s linear;
  top: 1px;
}
```

## Reference

Once again, thanks to <a href="http://dylanatsmith.com" target="_blank">Dylan Smith</a> for this!
