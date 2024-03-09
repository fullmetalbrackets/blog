---
title: "VIM Quick Guide"
description: "Whenever I use Vim to edit files on Linux, I need to relearn how to use it. Years ago I found a thread on Stack Overflow with two simple and extremely useful answers that helped me make sense of Vim. So here it is."
pubDate: 2022-09-17
tags:
  - Vim
  - Linux
  - Command Line
---

## Sections

1. [Vim Commands](#cmd)
2. [Making sense of Vi (and Vim)](#vi)
3. [Reference](#ref)

<div id='cmd'/>

In my search for a tutorial or guide to help me understand how Vim works, I came upon <a href="https://stackoverflow.com/questions/11828270/how-do-i-exit-vim" target="blank">this Stack Overflow thread</a> with excellent answers. My favorite of these are below, but feel free to dive deep at the original link.

## Vim Commands

| Key    | Effect                                                                             |
| ------ | ---------------------------------------------------------------------------------- |
| `:q`   | to quit (short for `:quit`)                                                        |
| `:q!`  | to quit without saving (short for `:quit!`)                                        |
| `:wq`  | to write and quit                                                                  |
| `:wq!` | to write and quit even, force write is file has only read permission               |
| `:x`   | to write and quit (similar to `:wq`, but only write if there are changes)          |
| `:qa`  | to quit all (short for `:quitall`)                                                 |
| `:cq`  | to quit without saving and make Vim return non-zero error (i.e. - exit with error) |

<div id='vi'/>

## Making sense of Vi (and Vim)

Pictures are worth a thousand Unix commands and options:

<img src="/img/blog/vim.png" loading="lazy" decoding="async" alt="Vi Diagram" />

I draw this to my students each semester and they seem to grasp vi afterwards.

**Vi** is a <a href="https://en.wikipedia.org/wiki/Finite-state_machine" target="_blank">finite state machine</a> with only three states -- _COMMAND_, _INSERT_, _EX_.

Upon starting, vi goes into _COMMAND_ mode, where you can type short, few character commands, blindly. You know what you are doing; this isn't for amateurs.

When you want to actually edit text, you should go to _INSERT_ mode on key press:

| Key                             | Effect                                           |
| ------------------------------- | ------------------------------------------------ |
| <kbd>i</kbd>                    | go to INSERT in the place of the cursor          |
| <kbd>Shift</kbd> + <kbd>i</kbd> | go to INSERT mode at the beginning of the line   |
| <kbd>a</kbd>                    | append after the cursor                          |
| <kbd>Shift</kbd> + <kbd>a</kbd> | append at the end of line                        |
| <kbd>o</kbd>                    | open a new line below the current line           |
| <kbd>Shift</kbd> + <kbd>o</kbd> | open a new line in the place of the current line |
| <kbd>Esc</kbd>                  | go to COMMAND mode                               |

Now, exiting. You can exit vi from _EX_ mode:

| Key   | Effect                                                               |
| ----- | -------------------------------------------------------------------- |
| `:q`  | quit if you haven't made any modifications, or saved them beforehand |
| `:q!` | ignores any modifications and quit                                   |
| `:wq` | save and quit                                                        |
| `:x`  | this is equal to wq                                                  |

`w` and `x` accept a file name parameter. If you started vi with a filename, you need not give it here again. At last, the most important: how can you reach EX mode?

_EX_ mode is for long commands that you can see typing at the bottom line of the screen. From _COMMAND_ mode, you push colon, <code>:</code>, and a colon will appear at the bottom line, where you can type the above commands.

From _INSERT_ mode, you need to push <kbd>Esc</kbd>, going to _COMMAND_ mode, and then colon (`:`) to go to _EX_ mode.
If you are unsure, push <kbd>Esc</kbd> and that will bring you to command mode.

So, the robust method, which saves your file and quits, is to hit <kbd>Esc</kbd>, type `:x`, then hit <kbd>Enter</kbd>.

<div id='ref'/>

## Reference

- <a href="https://stackoverflow.com/questions/11828270/how-do-i-exit-vim" target="blank">The top two answers of this Stack Overflow thread.</a>
