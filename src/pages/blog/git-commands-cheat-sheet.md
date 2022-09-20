---
layout: "../../layouts/BlogPost.astro"
title: "Git commands cheat sheet"
description: "When I was learning Git, in order to avoid giant articles and get right to the commands I needed reminding of, I made myself a cheat sheet that plainly and succinctly explained each Git command. Here is that quick and dirty guide of Git commands that you will likely use often as a web developer."
pubDate: "September 08, 2021"
tags:
  - git
  - terminal
---

When I was learning Git, in order to avoid giant articles and get right to the commands I needed reminding of, I made myself a cheat sheet that plainly and succinctly explained each Git command. Here is that quick and dirty guide of Git commands that you will likely use often as a web developer.

## Setting up git locally

Clone an existing remote repo to work on locally.

```shell
git clone https://github.com/username/repo.git
```

If not cloning and starting from scratch, initialize git within the current working directory.

```shell
git init
```

Configure your username & email in git. (Only need to do once per machine.)

```shell
git config --global user.name "username"
git config --global user.email "email@example.com"
```

Change master branch to main. (From here on out this guide will presume you use **_main_**.)

```shell
git branch -M main
```

Set a remote repository (e.g. on Github, Bitbucket, etc.) as the **_origin_**, basically you are telling git that this remote repo is the default you will be pushing to and pulling from.

```shell
git remote add origin https://github.com/username/repo.git
```

## Staging and committing files

Stage files modified since the last commit.

```shell
git add . // Stage all modified files
git add --all // Same as the above
git add file1.html file2.html file3.js // Stage a specific file, separate multiple files by a space
git add src/file.html src/styles/file.css src/scripts/file.js // Stage files in other directories
git add folder/* // Stage all files in a specific directory
git add *.html // Stage only specific types of files
```

Editing staged files.

```shell
git reset // Unstage ALL staged files. Changes to the file will be saved
git restore --staged file1.html js/file2.js // Unstage specific files, changes to files will be kept
```

Commit staged files, using the -m flag to add a message without quotation marks.

```shell
git commit -m "changed colors, added fireworks"
```

Edit the message of last commit.

```shell
git commit --amend
git commit -a // short-hand
```

Undo the last commit, BEFORE pushing to remote. Changes to files and directories will be kept.

```shell
git reset HEAD
```

Totally undo all changes since the last commit, and restore deleted files. Be careful using this!

```shell
git reset HEAD --hard
```

Using above command does not remove any newly created files since last commit. AFTER using it to undo changes and restore deleted files, delete NEW files and directories like this. (`-f` specifies files, `-d` specifies directories)

```shell
git clean -fd
```

Check what stage of the git workflow all tracked (modified) files are in.

```shell
git status
```

## Pushing to and pulling from remote repos

Push to main branch on your default remote.

```shell
git push
```

The first time you push a commit, you will need to designate an upstream branch (the branch of the remote repo that you will track) or git will bother you about it. If this is your own project, your upstream will probably be the production branch -- i.e. main or master.

```shell
git push --set-upstream origin main
```

To pull and apply changes from remote repos.

```shell
git pull // This will pull from origin's main branch if it is set as upstream, like above
git pull bitbucket-repo // If you added more remote repos, this pulls the specified remote instead of origin
```

## Dealing with branches

Switch to a branch, use **_-c_** to create if it doesn't already exist.

```shell
git switch -c new-branch
```

Push a branch to remote repo.

```shell
git push origin new-branch // Push branch to origin
git push new-branch // Or if origin is set you can omit it
git push other-repo new-branch // Push to another remote that you already set up
```

Merge committed changes in a branch (let's say it's called **_new-feature_**) with the main branch.

```shell
git switch main // Make sure to switch from the other branch to main first
git merge feature-branch // This applies the actual merge locally
```

If the merge has conflicts, you can undo it.

```shell
git merge --abort
```

Sometimes git will not undo a merge with **_--abort_**, usually because there were changes made after the merge. To force undoing the merge at this point use the **_--continue_** flag.

```shell
git merge --continue
```

Delete a LOCAL branch. This does NOT affect remote branches!

```shell
git branch -d branch-name
```

Sometimes git will refuse to delete a branch, like if it has commits that the main branch does not. Force deletion with **_-D_**

```shell
git branch -D branch-name // capital D instead of lowercase d
```

Delete a REMOTE branch. Here we don't use **_git branch_** but instead **_git push_** with added options.

```shell
git push origin --delete branch-name
```

## Multiple remote repos

Above I explained how to add a remote repo as **_origin_**, making it the default. But what if you want to push your project to multiple remotes, even on different git hosts? For example, say your origin is on Github, but you also want copies of your project on Bitbucket and Gitlab. (Let's assume you name these **_bitbucket-repo_** & **_gitlab-repo_** locally.)

```shell
git remote add gitlab-repo https://username@bitbucket.org/username/repo.git
git remote add bitbucket-repo https://username@bitbucket.org/username/repo.git
```

Now you can push to those additional remotes by specifying the name and branch.

```shell
git push bitbucket-repo main
git push gitlab-repo main
```

To "track" a branch when adding a remote, making that branch the default for the remote.

```shell
git remote add -t main gitlab-repo https://username@bitbucket.org/username/repo.git
```

By tracking the main branch on the remote "gitlab-repo" and can do the following.

```shell
git push gitlab-repo // No need to specify main branch once tracked
```

## Dealing with forks

Let's say you've forked an existing repo on Github, your version of that repo under your account is **_origin_**. The pre-existing repo you forked is **_upstream_**. If you wanted to pull updates from the upstream repo, you do the following.

```shell
git switch main // Make sure you are on the main local branch
git remote add -t main upstream https://github.com/username/repo.git // Add a remote as upstream and track the main branch
git fetch upstream // This fetches metadata of the changes between the upstream and your local repo, but nothing changes locally yet
git merge origin/upstream // Merge fetched changes from the upstream into your local repo
```

## Advanced use cases

There's way too many advanced commands, and options for these commands, that I haven't even learned yet! So here's a few additional random commands I've picked up along the way, though this is in no way a complete list.

To "detach HEAD" and explore a prior commit, you'll need the commit's hash ID from Github.

```shell
git checkout 6e751bc32
```

If you want to create a new branch from this old commit, and switch to it.

```shell
git switch -c new-branch
```

Or if you want to go back. (Reattach HEAD to most recent commit.)

```shell
git switch -
```

Revert the remote ORIGIN to this old commit. (Be careful doing this!)

```shell
git revert 6e751bc32
```

There's more advanced commands I'm not going to talk about until I use them myself -- things like `git rebase`, and I'm also not showing all the different ways to use `git checkout` because I don't know even half of them. I'll make a future blog post as I learn more of these.

## References

- [Git Documentation](https://git-scm.com/docs/git)
- [GitHub Cheat Sheet](https://training.github.com/downloads/github-git-cheat-sheet)
- Many questions and answers on [Stack Overflow](https://stackoverflow.com)...
