---
title: 'Git commands cheat sheet'
description: 'When I was learning Git, in order to avoid giant articles and get right to the commands I needed reminding of, I made myself a cheat sheet that plainly and succinctly explained each Git command. Here is that quick and dirty guide of Git commands that you will likely use often as a web developer.'
pubDate: 2021-09-08
tags: ['git', 'command line']
related1: how-to-generate-gpg-to-sign-git-commits
related2: git-push-error-permissions
---

## Setting up git

Clone an existing remote repo to work on locally.

```bash
git clone https://github.com/username/repo.git
```

If not cloning and starting from scratch, initialize git within the current working directory.

```bash
git init
```

Configure your username & email in git. (Only need to do once per machine.)

```bash
git config --global user.name "username"
git config --global user.email "email@example.com"
```

Change master branch to main. (From here on out this guide will presume you use **_main_**.)

```bash
git branch -M main
```

Set a remote repository (e.g. on Github, Bitbucket, etc.) as the **_origin_**, basically you are telling git that this remote repo is the default you will be pushing to and pulling from.

```bash
git remote add origin https://github.com/username/repo.git
```

## Staging and committing files

Stage files modified since the last commit.

```bash
git add . # Stage all modified files
git add --all # Same as the above
git add file1.html file2.html file3.js # Stage files
git add folder/* # Stage all files in a specific directory
git add *.html # Stage only specific types of files
```

Editing staged files.

```bash
git reset # Unstage ALL staged files, keep changes to the file
git restore --staged path/file1.html # Unstage specific files, keep changes
```

Commit staged files, using the -m flag to add a message without quotation marks.

```bash
git commit -m "changed colors, added fireworks"
```

Edit the message of last commit.

```bash
git commit --amend
git commit -a # short-hand for the above
```

Undo the last commit, BEFORE pushing to remote. Changes to files and directories will be kept.

```bash
git reset HEAD
```

Totally undo all changes since the last commit, and restore deleted files. Be careful using this!

```bash
git reset HEAD --hard
```

Using above command does not remove any newly created files since last commit. AFTER using it to undo changes and restore deleted files, delete NEW files and directories like this. (`-f` specifies files, `-d` specifies directories)

```bash
git clean -fd
```

Check what stage of the git workflow all tracked (modified) files are in.

```bash
git status
```

## Pushing to and pulling from remote repos

Push to main branch on your default remote.

```bash
git push
```

The first time you push a commit, you will need to designate an upstream branch (the branch of the remote repo that you will track) or git will bother you about it. If this is your own project, your upstream will probably be the production branch -- i.e. main or master.

```bash
git push --set-upstream origin main
```

To pull and apply changes from remote repos.

```bash
git pull # This will pull from origin's main branch if it is set as upstream, like abov
```

```bash
git pull bitbucket-repo # Pull from specific remote repo
```

## Dealing with branches

Switch to a branch, use **_-c_** to create if it doesn't already exist.

```bash
git switch -c new-branch
```

Push a branch to remote repo.

```bash
git push origin new-branch # Push branch to original
```

```bash
git push new-branch # Or if origin is set you can omit it
```

```bash
git push other-repo new-branch # Push to another remote that you already set up
```

Merge committed changes in a branch (let's say it's called **_new-feature_**) with the main branch.

```bash
git switch main # Make sure to switch from the other branch to main first
```

```bash
git merge new-feature # This applies the actual merge locally
```

If the merge has conflicts, you can undo it.

```bash
git merge --abort
```

Sometimes git will not undo a merge with **_--abort_**, usually because there were changes made after the merge. To force undoing the merge at this point use the **_--continue_** flag.

```bash
git merge --continue
```

Delete a LOCAL branch. This does NOT affect remote branches!

```bash
git branch -d branch-name
```

Sometimes git will refuse to delete a branch, like if it has commits that the main branch does not. Force deletion with **_-D_**

```bash
git branch -D branch-name # capital D instead of lowercase d
```

Delete a REMOTE branch. Here we don't use **_git branch_** but instead **_git push_** with added options.

```bash
git push origin --delete branch-name
```

## Multiple remote repos

Above I explained how to add a remote repo as **_origin_**, making it the default. But what if you want to push your project to multiple remotes, even on different git hosts? For example, say your origin is on Github, but you also want copies of your project on Bitbucket and Gitlab. (Let's assume you name these **_bitbucket-repo_** & **_gitlab-repo_** locally.)

```bash
git remote add gitlab-repo https://username@bitbucket.org/username/repo.git
```

```bash
git remote add bitbucket-repo https://username@bitbucket.org/username/repo.git
```

Now you can push to those additional remotes by specifying the name and branch.

```bash
git push bitbucket-repo main
```

```bash
git push gitlab-repo main
```

To "track" a branch when adding a remote, making that branch the default for the remote.

```bash
git remote add -t main gitlab-repo https://username@bitbucket.org/username/repo.git
```

By tracking the main branch on the remote "gitlab-repo" and can do the following.

```bash
git push gitlab-repo # No need to specify main branch once tracked
```

## Dealing with forks

Let's say you've forked an existing repo on Github, your version of that repo under your account is **_origin_**. The pre-existing repo you forked is **_upstream_**. If you wanted to pull updates from the upstream repo, you do the following.

```bash
git switch main # Make sure you are on the main local branch
```

```bash
git remote add -t main upstream https://github.com/username/repo.git # Add a remote as upstream and track the main branch
git fetch upstream # This fetches metadata of the changes between the upstream and your local repo, but nothing changes locally yet
git merge origin/upstream # Merge fetched changes from the upstream into your local rep
```

## Advanced use cases

There's way too many advanced commands, and options for these commands, that I haven't even learned yet! So here's a few additional random commands I've picked up along the way, though this is in no way a complete list.

To "detach HEAD" and explore a prior commit, you'll need the commit's hash ID from Github.

```bash
git checkout 6e751bc32
```

If you want to create a new branch from this old commit, and switch to it.

```bash
git switch -c new-branch
```

Or if you want to go back. (Reattach HEAD to most recent commit.)

```bash
git switch -
```

Revert the remote ORIGIN to this old commit. (Be careful doing this!)

```bash
git revert 6e751bc32
```

There's more advanced commands I'm not going to talk about until I use them myself -- things like `git rebase`, and I'm also not showing all the different ways to use `git checkout` because I don't know even half of them. I'll make a fugit-cheatsheet as I learn more of these.

## References

- <a href="https://git-scm.com/docs/git" target="_blank" data-umami-event="git-cheatsheet-git-docs">Git Documentation</a>
- <a href="https://training.github.com/downloads/github-git-cheat-sheet" target="_blank" data-umami-event="git-cheatsheet-gh-cheatsheet">GitHub Cheat Sheet</a>
- Many questions and answers on <a href="https://stackoverflow.com" target="_blank" data-umami-event="git-cheatsheet-stackoverflow">StackOverflow</a>
