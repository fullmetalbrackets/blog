---
layout: "../layouts/BlogPost.astro"
title: "Markdown Style Guide"
description: "Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro."
---

<style>
header { margin-bottom: 0.65em; }
.title { font-size: 36px; margin-bottom: -13px; }
hr { margin-bottom: 1em; }
h3 { margin: 20px 0 0 0; padding: 0;}
p { margin: 0; }
@media screen and (min-width: 200px) and (max-width: 1024px) { header { margin-bottom: 0.95em; } }
</style>

## Light Theme Site Colors

<style>
#other-light { color: #000; background-color: #008080; font-weight: 900; }
#primary-light { color: #000; background-color:#2596be; font-weight: 900; }
#hover-light { color: #000; background-color:#00afaf; font-weight: 900; }
#emphasis-light { color: #000; background-color:#dc2800; font-weight: 900; }
#accent-light { color: #000; background-color:#94a3b8; font-weight: 900; }
#text-light { color: #fff; background-color:#334155; font-weight: 900; border: 1px solid #fff; }
#link-light { color: #000; background-color:#008000; font-weight: 900; }
#logo-light { color: #000; background-color:#00afaf; font-weight: 900; }			

.light-colors{
unicode-bidi: bidi-override;
direction: rtl;
text-align: center;
background: #fafafa;
border-radius: 0.5em;
}
.light-colors > span {
display: inline-block;
position: relative;
border-radius: 0.25em;
width: 10rem;
height: 10rem;
margin: 1rem;
padding-top: 2.5rem;
}
.light-colors > span:hover{
cursor:pointer;
}
</style>
<div class="light-colors">
  <span id="other-light">Dates/Other<br><br> 008080 #</span>
  <span id="text-light">Text<br><br> 334155 #</span>
  <span id="logo-light">Tags/Logo<br><br> 00AFAF #</span>
  <span id="primary-light">Headings<br><br> 2596BE #</span>
  <span id="accent-light">Accent<br><br> 94A3B8 #</span>
  <span id="emphasis-light">Emphasis<br><br> DC2800 #</span>
  <span id="hover-light">Link Hover<br><br> 00AFAF #</span>
  <span id="link-light">Link<br><br> 008000 #</span>
</div>

## Dark Theme Site Colors

<style>
#other { color: #000; background-color: #ff00b3; font-weight: 900; }
#primary { color: #000; background-color:#fafafa; font-weight: 900; }
#hover { color: #000; background-color:#ffa500; font-weight: 900; }
#emphasis { color: #000; background-color:#ff4500; font-weight: 900; }
#accent { color: #fff; background-color:#334155; font-weight: 900; }
#text { color: #000; background-color:#94a3b8; font-weight: 900; }
#link { color: #000; background-color:#ffff00; font-weight: 900; }
#logo { color: #000; background-color: #ff00b3; font-weight: 900; }

.dark-colors{
unicode-bidi: bidi-override;
direction: rtl;
text-align: center;
background: #0f172a;
border-radius: 0.5em;
}
.dark-colors > span {
display: inline-block;
position: relative;
border-radius: 0.25em;
width: 10rem;
height: 10rem;
margin: 1rem;
padding-top: 2.5rem;
}
.dark-colors > span:hover{
cursor:pointer;
}
</style>
<div class="dark-colors">
  <span id="other">Dates/Other<br><br> FF00B3 #</span>
  <span id="text">Text<br><br> 94A3B8 #</span>
  <span id="logo">Tags/Logo<br><br> FF00B3 #</span>
  <span id="primary">Headings<br><br> FAFAFA #</span>
  <span id="accent">Accent<br><br> 334155 #</span>
  <span id="emphasis">Emphasis<br><br> FF4500 #</span>
  <span id="hover">Link Hover<br><br> FFA500 #</span>
  <span id="link">Link<br><br> FFFF00 #</span>
</div>

## Headings

The following HTML `<h1>`—`<h6>` elements represent six levels of section headings. `<h1>` is the highest section level while `<h6>` is the lowest. (**Note:** The `<h2>` element has extra spacing at the top margin for design reasons.)

# H1 - Page Title

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum exercitationem consequuntur quia placeat illum ex enim rerum quis aliquam. Accusamus.

## H2 - Primary Heading

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum exercitationem consequuntur quia placeat illum ex enim rerum quis aliquam. Accusamus.

### H3 - Secondary Heading

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum exercitationem consequuntur quia placeat illum ex enim rerum quis aliquam. Accusamus.

#### H4 - Small Heading

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum exercitationem consequuntur quia placeat illum ex enim rerum quis aliquam. Accusamus.

##### H5 - Smaller Heading

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum exercitationem consequuntur quia placeat illum ex enim rerum quis aliquam. Accusamus.

###### H6 - Smallest Heading

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum exercitationem consequuntur quia placeat illum ex enim rerum quis aliquam. Accusamus.

## Paragraph

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Code Blocks

Inline code (single backticks) `look like this`.

Code blocks (three backticks) look like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

## Images

Here is a simple image using Markdown:

![This is a placeholder image description](/img/assets/og-img.png)

```md
![This is a placeholder image description](/img/assets/og-img.png)
```

And here is an image in a `figure` element with a `figcaption`.

<figure>
<img src="/img/assets/og-img.png" alt="This is a placeholder image description" />
<figcaption>This is a caption, quick blurb about the above image.</figcaption>

```html
<figure>
  <img
    src="/img/assets/og-img.png"
    alt="This is a placeholder image description"
  />
  <figcaption>This is a caption, quick blurb about the above image.</figcaption>
</figure>
```

## Blockquotes

The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a `footer` or `cite` element, and optionally with in-line changes such as annotations and abbreviations.

#### Blockquote without attribution

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Note** that you can use _Markdown syntax_ within a blockquote.

#### Blockquote with attribution

> "Don't communicate by sharing memory, share memory by communicating."<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

#### "Alert/Important" Blockquotes

<div class="alert">
  <b>&#x26a0;&#xfe0f; &nbsp;Important!</b>
  This is an important thing!
</div>

#### "Note" Blockquotes

<div class="note">
  <b>ⓘ &nbsp;Note</b>
  This is a note.
</div>

## Tables

| Emphasis     | Strong     | Strikethrough       |
| ------------ | ---------- | ------------------- |
| `_emphasis_` | `*strong*` | `~~strikethrough~~` |
| _emphasis_   | **strong** | ~~strikethrough~~   |

## List Types

#### Ordered List

1. First item
2. Second item
3. Third item

#### Unordered List

- List item
- Another item
- And another item

#### Nested list

- Genres

  - Science Fiction
    - The Reality Dysfunction
    - Starship Troopers
    - Ender's Game
  - Fantasy
    - Lord of the Rings
    - Stormlight Archive
    - Broken Earth
  - Non-Fiction
    - Zen and the Art of Motorcycle Maintenance
    - Astrophysics for People in a Hurry

- Gear
  1. Laptop
  2. Camera
  3. Lens

## Other Elements — abbr, sub, sup, kbd, mark

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>ENTER</kbd> to begin.

Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
