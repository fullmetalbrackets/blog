---
layout: "@layouts/BaseLayout.astro"
title: "Markdown Style Guide"
description: "Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro."
---

# Style Guide

<hr>

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

![This is a placeholder image description](/social.png)

```md
![This is a placeholder image description](/social.png)
```

And here is an image in a `figure` element with a `figcaption`.

<figure>
<img src="/social.png" alt="This is a placeholder image description" />
<figcaption>This is a caption, quick blurb about the above image.</figcaption>

```html
<figure>
  <img src="/social.png" alt="This is a placeholder image description" />
  <figcaption>This is a caption, quick blurb about the above image.</figcaption>
</figure>
```

## Blockquotes

The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a `footer` or `cite` element, and optionally with in-line changes such as annotations and abbreviations.

#### Blockquote without attribution

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> _Note_ that you can use **Markdown syntax** within a `blockquote`.

#### Blockquote with attribution

> "Don't communicate by sharing memory, share memory by communicating."<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

#### Information Blocks

<div>
  <div class="alert">
    <span>
      <img src="/img/assets/alert.svg" class="alert-icon"> <b>Important!</b>
    </span>
    <p>
      This is an important thing you need to know!
    </p>
  </div>
</div>

<div>
  <div class="note">
    <span>
      <img src="/img/assets/note.svg" class="note-icon">
      <b>Note</b>
    </span>
    <p>
      This is a side-note about the current topic.
    </p>
  </div>
</div>

<div>
  <div class="success">
    <span>
      <img src="/img/assets/success.svg" class="success-icon">
      <b>Success!</b>
    </span>
    <p>
      Something has been accomplished!
    </p>
  </div>
</div>

<div>
  <div class="info">
    <span>
      <img src="/img/assets/info.svg" class="info-icon">
      <b>Information</b>
    </span>
    <p>
      This is information about something.
    </p>
  </div>
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

- Gear

  1. Laptop
  2. Camera
  3. Lens
     <br><br>

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

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>ENTER</kbd> to begin.

Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.

## References

- [Link A](#)
- [Link B](#)
- [Link C](#)
