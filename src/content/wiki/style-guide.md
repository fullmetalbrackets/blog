---
title: "Markdown Style Guide"
description: "I decided to bring back the style guide because I don't know why."
pubDate: 2025-03-03
tag: website
---

## Fonts

- <a href="https://www.brailleinstitute.org/freefont/" target="_blank">Atkinson Hyperlegible</a> (Body text and blog post headings)
- <a href="https://github.com/googlefonts/atkinson-hyperlegible-next-mono" target="_blank">Atkinson Hyperlegible Mono</a> (Inline code and Prism code blocks)
- <a href="https://fonts.google.com/specimen/M+PLUS+Rounded+1c" target="_blank">MPlus Rounded 1c</a> (Buttons and main page headings)

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

## Paragraph

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Code Blocks

Inline code (single backticks) `look like this`.

Code blocks (three backticks) look like this:

```bash
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

Here is a simple image using Markdown. (Images embedded using markdown syntax and stored in `/src/img` will be processed by Astro Image.)

```md
![Image alt info goes here](../../img/assets/social.jpg 'This text appears as tooltip when hovering cursor over image')
```

![Image alt info goes here](../../img/assets/social.jpg 'This text appears as tooltip when hovering cursor over image')


And here is an image in a `figure` element with a `figcaption`. (Images embedded using HTML and stored in `/public` are **not** processed by Astro Image.)

```html
<figure>
  <img src="/social.jpg" alt="This is a placeholder image description" />
  <figcaption>This is a caption, a quick blurb about the above image.</figcaption>
</figure>
```

<figure>
<img src="/social.jpg" alt="This is a placeholder image description" />
<figcaption>This is a caption, a quick blurb about the above image.</figcaption>
</figure>

## Blockquotes

I use the `<blockquote>` element as an "information" block instead, styled with CSS.

```md
> This is a blockquote, which I use for detailed information rather than quoting.
```

> This is a blockquote, which I use for detailed information rather than quoting.

## Tables

Sometimes I use tables to display information. Below are the code and result:

```md
| Emphasis     | Strong     | Strikethrough       |
| ------------ | ---------- | ------------------- |
| `_emphasis_` | `*strong*` | `~~strikethrough~~` |
| _emphasis_   | **strong** | ~~strikethrough~~   |
```

| Emphasis     | Strong     | Strikethrough       |
| ------------ | ---------- | ------------------- |
| `_emphasis_` | `*strong*` | `~~strikethrough~~` |
| _emphasis_   | **strong** | ~~strikethrough~~   |

## Lists

I like lists! I use them all the time in the blog and wiki becausing organizing information using lists pleases my brain.

#### Ordered List

1. First item
2. Second item
3. Third item

#### Unordered List

- List item
- Another item
- And another item

#### Nested lists

**Code**

```md
- Gear
  1. Laptop
  2. Camera
  3. Lens
```
**Result**

- Gear
  1. Laptop
  2. Camera
  3. Lens

**Code**

```md
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
```

**Result**

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

## Other Elements — abbr, sub, sup, kbd, mark

**Appreviation**

`<abbr title="Graphics Interchange Format">GIF</abbr>` becomes <abbr title="Graphics Interchange Format">GIF</abbr>

<br>

**Subscript**

`H<sub>2</sub>O` becomes H<sub>2</sub>O

<br>

**Superscript**

`X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>` becomes X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

<br>

**Highlighting**

`<mark>Hello World</mark>` becomes <mark>Hello World</mark>

<br>

**The `<kbd>` element**

`<kbd>ENTER</kbd>` becomes <kbd>ENTER</kbd>

`<kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd>` becomes <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd>

<br>