---
title: 'How to resolve Git error insufficient permission for adding an object to repository database'
description: 'When working on a GitHub repo from different Linux hosts, I encountered an "insufficient permission" error when using git commands. Here is the solution that worked for me from StackOverflow.'
pubDate: 2024-03-17
tags:
  - Git
  - Linux
---

## Sections

1. [The error](#error)
2. [The fix](#fix)
3. [References](#ref)

<div id='error'/>

## The error

You're working on a local version of a GitHub repo, and you use a command like `git add .` or `git pull` you are hit with this error:

```
insufficient permission for adding an object to repository database
```

Coming from only working with Git and GitHub from Windows, I first encountered this on Linux when I switched to Debian KDE desktop as my daily driver. My google searching took me to <a href="https://stackoverflow.com/questions/18324279/github-error-insufficient-permission-for-adding-an-object-to-repository-databas" target="_blank">this thread on Stack Overflow</a> where an explanation and solution for the error were provided.

<div id='fix'/>

## The fix

<div>
  <div class="success">
    <span>
      <img src="/img/assets/success.svg" class="success-icon" loading="eager" decoding="async" alt="Success" />
      <b>Attribution</b>
    </span>
    <p>
      <a href="https://stackoverflow.com/a/26137707" target="_blank">This solution</a> is credited to user <a href="https://stackoverflow.com/users/445131/eric-leschinski" target="_blank">Eric Leschinski</a> in StackOverflow.
    </p>
  </div>
</div>

This error occurs because you accidentally committed a file or folder to git using elevated permissions and now git can't modify those objects. It is safe to recursively force ownership of all files under `.git/objects/` to your current user to clear the problem.

1. Make sure you're inside the repository where you're getting the error.

2. Get your username by typing `whoami`.

3. Enter this command: `sudo chown -R your_user_name .git/*`.

4. Proceed to use your git commands.

<div id='ref'/>

## References

- <a href="https://stackoverflow.com/questions/18324279/github-error-insufficient-permission-for-adding-an-object-to-repository-databas" target="_blank">Thread on Stack Overflow</a>
- <a href="https://stackoverflow.com/a/26137707" target="_blank">The answer with the fix</a>
