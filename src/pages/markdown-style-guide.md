---
layout: "../layouts/BlogPost.astro"
title: "Markdown Style Guide"
description: "Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro."
pubDate: "July 01, 2022"
---

## Light Theme Site Colors

<style>
#other-light { color: #000; background-color: #16a6c2; font-weight: 900; }
#primary-light { color: #000; background-color:#00acac; font-weight: 900; }
#secondary-light { color: #000; background-color:#54c3bc; font-weight: 900; }
#emphasis-light { color: #000; background-color:#ff7575; font-weight: 900; }
#accent-light { color: #fff; background-color:#3d3d5e; font-weight: 900; }
#text-light { color: #fff; background-color:#000120; font-weight: 900; border: 1px solid #fff; }
#link { color: #000; background-color:#ff8000; font-weight: 900; }
#table { color: #fff; background-color:#0a1476; font-weight: 900; }			

.site-colors{
unicode-bidi: bidi-override;
direction: rtl;
text-align: center;
}
.site-colors > span {
display: inline-block;
position: relative;
border-radius: 0.25em;
width: 10rem;
height: 10rem;
margin: 1rem;
padding-top: 2.5rem;
}
.site-colors > span:hover{
cursor:pointer;
}
</style>
<div class="site-colors">
  <span id="other-light">Dates<br><br> 16A6C2 #</span>
  <span id="text-light">Text<br><br> 000120 #</span>
  <span id="secondary-light">H4 - H6<br><br> 54C3BC #</span>
  <span id="primary-light">H1 - H3<br><br> 00ACAC #</span>
  <span id="accent-light">Accent<br><br> 3D3D5E #</span>
  <span id="emphasis-light">Emphasis<br><br> FF7575 #</span>
  <span id="table">Table<br><br> 0A1476 #</span>
  <span id="link">Link<br><br> FF8000 #</span>
</div>

## Dark Theme Site Colors

<style>
#other { color: #000; background-color: #42c3de; font-weight: 900; }
#primary { color: #000; background-color:#fa28ad; font-weight: 900; }
#secondary { color: #000; background-color:#F986DE; font-weight: 900; }
#emphasis { color: #000; background-color:#ffd700; font-weight: 900; }
#accent { color: #fff; background-color:#08083A; font-weight: 900; }
#text { color: #000; background-color:#aeb5cd; font-weight: 900; }

.site-colors{
unicode-bidi: bidi-override;
direction: rtl;
text-align: center;
}
.site-colors > span {
display: inline-block;
position: relative;
border-radius: 0.25em;
width: 10rem;
height: 10rem;
margin: 1rem;
padding-top: 2.5rem;
}
.site-colors > span:hover{
cursor:pointer;
}
</style>
<div class="site-colors">
  <span id="other">Dates<br><br> 42C3DE #</span>
  <span id="text">Text<br><br> AEB5DC #</span>
  <span id="secondary">H4 - H6<br><br> F986DE #</span>
  <span id="primary">H1 - H3<br><br> FA28AD #</span>
  <span id="accent">Accent<br><br> 08083A #</span>
  <span id="emphasis">Emphasis<br><br> FFD700 #</span>
  <span id="table">Table<br><br> 0A1476 #</span>
  <span id="link">Link<br><br> FF8000 #</span>
</div>

<br><br>

Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro.

## Headings

The following HTML `<h1>`—`<h6>` elements represent six levels of section headings. `<h1>` is the highest section level while `<h6>` is the lowest. (**Note:** The `<h2>` element has extra spacing at the top margin for design reasons.)

# H1

## H2

### H3

#### H4

##### H5

###### H6

## Paragraph

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Images

Here is a simple image using Markdown:

![This is a placeholder image description](/img/placeholder-social.jpg)

```md
![This is a placeholder image description](/img/placeholder-social.jpg)
```

And here is an image in a `figure` element with a `figcaption`.

<figure>
<img src="/img/placeholder-social.jpg" alt="This is a placeholder image description" />
<figcaption>This is a caption, quick blurb about the above image.</figcaption>

```html
<figure>
  <img
    src="/img/placeholder-social.jpg"
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

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

## Tables

| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |

## Code Blocks

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

- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese

## Other Elements — abbr, sub, sup, kbd, mark

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>ENTER</kbd> to begin.

Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
