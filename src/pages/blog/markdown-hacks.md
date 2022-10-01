---
layout: "../../layouts/BlogPost.astro"
title: "Markdown hacks"
description: "Markdown can render A LOT of characters and symbols using specific 'entities', and can do other things like render tables, so I made myself a list of common or handy, but easy-to-forget markdown hacks based off the official Markdown Guide."
pubDate: "September 20, 2022"
tags:
  - Markdown
  - Web Development
---

## Characters & Symbols

- `&copy;` - Copyright (_©_)
- `&trade;` - Trademark (_™_)
- `&reg;` - Registered trademark (_®_)
- `&uarr;` - Up arrow (_↑_)
- `&darr;` - Down arrow (_↓_)
- `&larr;` - Left arrow (_←_)
- `&rarr;` - Right arrow (_→_)
- `&lsh;` - Up left shift arrow (_↰_)
- `&rsh;` - Up right shift arrow (_↱_)
- `&ldsh;` - Down left shift arrow (_↲_)
- `&rrsh;` - Down right shift arrow (_↳_)
- `&larrhk;` - Left hook arrow (_↩_)
- `&rarrhk;` - Right hook arrow (_↪_)
- `&olarr;` - Counterclockwise circle arrow (_↺_)
- `&orarr;` - Clockwise circle arrow (_↻_)
- `&crarr;` - Carriage return arrow (_↵_)
- `&racuo;` - Right pointing guillemet (_»_)
- `&sect;` - Section (_§_)
- `&para;` - Paragraph (_¶_)
- `&#960;` - Pi (_π_)
- `&#176;` - Degree (_°_)
- `&euro;` - Euro (_€_)
- `&pound;` - Pound (_£_)
- `&yen;` - Yen (_¥_)
- `&sup1;` - Superscript One (_¹_)
- `&sup2;` - Superscript Two (_²_)
- `&sup3;` - Superscript Three (_³_)
- `&numero;` - Numero sign (_№_)
- `&frac14;` - Fraction one-quarter (_¼_)
- `&half;` - Fraction one-half (_½_)
- `&frac34;` - Fraction three-quarters (_¾_)
- `&female;` - Female symbol (_♀_)
- `&male;` - Male symbol (_♂_)
- `&starf;` - Filled star (_★_)
- `&star;` - Unfilled star (_☆_)
- `&hearts;` - Hearts (_♥_)
- `&spades;` - Spades (_♠_)
- `&clubs;` - Clubs (_♣_)
- `&diams;` - Diamonds (_♦_)
- `&check;` - Checkmark (_✓_)
- `&cross;` - Ballot X or Cross (_✗_)
- `&Delta;` - Delta capital letter (_Δ_)
- `&Lambda;` - Lambda capital letter (_Λ_)
- `&Sigma;` - Sigma capital letter (_Σ_)
- `&Phi;` - Phi capital letter (_Φ_)
- `&Psi;` - Psi capital letter (_Ψ_)
- `&Omega;` - Omega capital letter (_Ω_)
- `&alpha;` - Alpha small letter (_α_)
- `&beta;` - Beta small letter (_β_)
- `&epsi;` - Epsilon small letter (_ε_)
- `&lambda;` - Lambda small letter (_λ_)

## Creating Tables in Markdown

```md
| Title     | Description                  |
| --------- | ---------------------------- |
| Star Wars | In a galaxy far, far away... |
| Star Trek | Beam me up, Scotty!          |
```

#### A table is rendered:

| Title     | Description                  |
| --------- | ---------------------------- |
| Star Wars | In a galaxy far, far away... |
| Star Trek | Beam me up, Scotty!          |

<br><br>

It's also possible to use line breaks inside a markdown table with HTML.

```md
| Genre  | Examples               |
| ------ | ---------------------- |
| Sci-Fi | Star Wars<br>Star Trek |
```

#### Table with line breaks is rendered:

| Genre  | Examples               |
| ------ | ---------------------- |
| Sci-Fi | Star Wars<br>Star Trek |

<br><br>

You can also make lists inside a markdown table with HTML.

```md
| Genre  | Examples                                              |
| ------ | ----------------------------------------------------- |
| Sci-Fi | Titles: <ul><li>Star Wars</li><li>Star Trek</li></ul> |
```

#### Table with unordered list is rendered:

| Genre  | Examples                                              |
| ------ | ----------------------------------------------------- |
| Sci-Fi | Titles: <ul><li>Star Wars</li><li>Star Trek</li></ul> |

<br><br>

And a numbered/ordered list in markdown.

```md
| Genre  | Examples                                              |
| ------ | ----------------------------------------------------- |
| Sci-Fi | Titles: <ul><li>Star Wars</li><li>Star Trek</li></ul> |
```

#### Table with numbered/ordered list is rendered:

| Genre  | Examples                                              |
| ------ | ----------------------------------------------------- |
| Sci-Fi | Titles: <ol><li>Star Wars</li><li>Star Trek</li></ol> |

## Making a Table of Contents in Markdown

This is handy for blogs! A lot of the best markdown applications can automatically generate a table of contents. Frameworks like Nuxt (with the Content module) and Astro, among others, can make use of this.
<br><br>

```md
#### Chapter Listing

- [Chapter 1](#ch1)
- [Chapter 2](#ch2)
- [Chapter 3](#ch3)
- [Chapter 4](#ch4)
```

#### Chapter Listing

- [Chapter 1](#ch1)
- [Chapter 2](#ch2)
- [Chapter 3](#ch3)
- [Chapter 4](#ch4)

<br><br>
Then you just have to link these to a heading ID. Here it is using markdown.

```md
[Chapter 1](#ch1)
```

<br><br>
And in HTML.

```html
<a href="#ch1">Chapter 1</a>
```

## References

- <a href="https://www.markdownguide.org/hacks" target="_blank">Markdown Guide</a>
- <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#List_of_character_entity_references_in_HTML" target="_blank">Wikipedia page with full list of entities</a>
