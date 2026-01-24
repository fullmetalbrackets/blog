---
layout: ../layouts/Page.astro
title: Style Guide
description: Markdown style guide for fullmetalbrackets.com
---

Markdown style guide for this website.

## Fonts

- <span class="main-font">[Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/)</span> (Body text and blog post headings)
- <span class="code-font">[Atkinson Hyperlegible Mono](https://github.com/googlefonts/atkinson-hyperlegible-next-mono)</span> (Inline code and Prism code blocks)
- <span class="sub-font">[MPlus Rounded 1c](https://fonts.google.com/specimen/M+PLUS+Rounded+1c)</span> (Buttons and main page headings)

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

## Paragraphs

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

Here is a simple image using Markdown. (Images embedded using markdown syntax and stored in `/src/img` will be processed and optimized by Astro Image.)

```markdown
![Alt text goes here](../img/assets/social.jpg 'This text appears as tooltip when hovering cursor over image')
```

![Alt text goes here](../img/assets/social.jpg 'This text appears as tooltip when hovering cursor over image')

To use an image in a `figure` element with a `figcaption`, [RemarkDirective](https://github.com/remarkjs/remark-directive) and [RemarkDirectiveSugar](https://github.com/lin-stephanie/remark-directive-sugar) allows using custom markdown syntax.

```markdown
:::image-figure[This is a descriptive caption.]
![Alt text goes here](../img/assets/social.jpg)
:::
```

That markdown is rendered like this:

:::image-figure[This is a descriptive caption.]
![Alt text goes here](../img/assets/social.jpg)
:::

## Blockquotes

I use the default `<blockquote>` element as an "information" block almost exclusively.

```markdown
> This is a default "informational" blockquote.
>
> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

> This is default "informational" blockquote.
>
> Lorem ipsum dolor sit amet, consectetur adipiscing elit.

I also have differently styled data types for other kinds of blockquotes, which I use less often. This is the `[quote]` data type for actual quotes and attribution.

```markdown
> [quote]
>
> This is a direct quote from a person or article.
> --Author, Book, pg. 69, etc.
```

> [quote]
> This is a direct quote from a person or article.
>
> --Author, Book, pg. 69, etc.

<br>
And this is the `[warning]` data type for things more important or urgent information.

```markdown
> [warning] Warning! (the first paragraph is auto bolded)
>
> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

> [warning] Warning! (the first paragraph is auto bolded)
>
> Lorem ipsum dolor sit amet, consectetur adipiscing elit.

<br>

## Tables

Sometimes I use tables to display information. Below are the code and result:

```markdown
| Emphasis     | Strong     | Strikethrough       |
| ------------ | ---------- | ------------------- |
| `_emphasis_` | `*strong*` | `~~strikethrough~~` |
| _emphasis_   | **strong** | ~~strikethrough~~   |
```

| Emphasis     | Strong     | Strikethrough       |
| ------------ | ---------- | ------------------- |
| `_emphasis_` | `*strong*` | `~~strikethrough~~` |
| _emphasis_   | **strong** | ~~strikethrough~~   |

<br>

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

```markdown
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

```markdown
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
