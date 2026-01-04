---
layout: ../../../layouts/Page.astro
title: Blog posts by year
description: See a list of blog posts by the year they were written.
showTop: false
---

Pick a year below to see only blog posts written that year.

<style>
ul {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    list-style-type: none;
    margin: 2em auto;
    padding: 0;
    gap: 1em;
  }
  /* li {
    margin: 0.25em;
  } */
  .label a {
    color: #000
  }
  .count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25em;
    height: 1rem;
    padding: 1px 0 0 0;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 9999px;
    font-family: var(--main-font);
    font-size: 0.675em;
  }
  button {
    display: flex;
    place-items: center;
    gap: 0.25em;
  }
</style>

<ul>
    <li>
        <button>
            <span class="label">
                <a href="/blog/years/2025/" rel="prefetch-intent" data-umami-events="blog-2025">2025</a>
            </span>
            <span class="count">
                8
            </span>
        </button>
    </li>
    <li>
        <button>
            <span class="label">
                <a href="/blog/years/2024/" rel="prefetch-intent" data-umami-events="blog-2024">2024</a>
            </span>
            <span class="count">
                12
            </span>
        </button>
    </li>
    <li>
        <button>
            <span class="label">
                <a href="/blog/years/2023/" rel="prefetch-intent" data-umami-events="blog-2023">2023</a>
            </span>
            <span class="count">
                9
            </span>
        </button>
    </li>
    <li>
        <button>
            <span class="label">
                <a href="/blog/years/2022/" rel="prefetch-intent" data-umami-events="blog-2022">2022</a>
            </span>
            <span class="count">
                27
            </span>
        </button>
    </li>
    <li>
        <button>
            <span class="label">
                <a href="/blog/years/2021/" rel="prefetch-intent" data-umami-events="blog-2021">2021</a>
            </span>
            <span class="count">
                16
            </span>
        </button>
    </li>
</ul>
<p class="space-between mb2">
    <a href="/blog/" rel="prefetch-intent">↩ All posts</a>
    <a href="/categories/" rel="prefetch-intent">Categories ↪</a>
</p>