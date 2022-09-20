---
layout: "../../layouts/BlogPost.astro"
title: "Generating an SSH key pair"
description: "Secure Shell is a protocol for securely connecting from one computer to another. As a web developer, you will probably end up using SSH a lot, and even if you don't it's a handy skill to have. Here's a quick guide on how to generate SSH keys and copy them to other machines."
pubDate: "September 12, 2021"
tags:
  - ssh
  - terminal
---

Secure Shell is a protocol for securely connecting from one computer to another. As a web developer, you will probably end up using SSH a lot, and even if you don't it's a handy skill to have. Let's make SSH even more secure by using encrypted key pairs.

Usually when to a computer or server via SSH, you are prompted for a username and password, but you can skip this and make your SSH sessions even more secure by using key pairs. Basically you will generate two encrypted keys that are associated with each other -- a private key and a public key. These are used to verify your identity.

By default your SSH keys and configurations are located in `~/.ssh`. On Linux that is `/home/{user}/.ssh` and on Windows it's located at `C:\Users\{user}\.ssh`.

## Generate an SSH key pair

Generating SSH keys is fast and simple on Windows, Linux and Mac, just use the command `ssh-keygen` and follow the prompts. If it's your first time using SSH, just hitting Enter↵ at all the prompts to choose the default should be fine. The defaults will do the following:

- A public and private key pair will be generated using RSA encryption. (There are other, technically more secure algorithms you can use for SSH, like ECDSA, but that's beyond the scope here. RSA is fine for personal use within your home network.)
- The default name of the private key will be `id_rsa`. (Or if you chose a different encryption, it'll be for example `id_ecdsa`.) Note that lack of a file extension.
- The default name of the public key will be `id_rsa.pub`. (Or `id_ecdsa.pub` etc.) This one has the `.pub` file extension.
- Both keys are placed in the user's `.ssh` directory.

It should go without saying, the private key should NEVER be given out to anyone, for any reason. In fact, there is no reason to do so. The public key is the one to give to servers and services, like GitHub or AWS, in order to connect to them. So let's give it to them.

## Generate a more secure SSH key

The above instructions show how to generate a very basic SSH key using RSA encryption, but if you want to be using the new hotness in cryptography, then you should instead generate a key with ed25519 encryption. You can do so like this:

```bash
ssh-keygen -t ed25519
```

Now follow the prompts same as normal. If you are encrypting your key with a password, it's common practice to also add the flag `-a 100` which puts the key through 100 rounds of derivation function -- [apparently this means it is more secure](https://www.reddit.com/r/linuxquestions/comments/axu8te/how_many_a_repetitions_in_ed25519_are_insecure/ehwl3dz/), so might as well do it.

If you'd like to know more this, here's a great Medium article [comparing the different SSH encryption algorithms](https://nbeguier.medium.com/a-real-world-comparison-of-the-ssh-key-algorithms-b26b0b31bfd9) by [Nicolas Béguier](https://beguier.eu/nicolas/) that is worth a read.

## Copying SSH public key from Linux to a remote server

Copying SSH keys between Linux machines is easy with the command `ssh-copy-id` by specifying the IP or hostname of the server, and the user, like so.

```bash
ssh-copy-id user@192.168.1.100
```

Or if you prefer to use the hostname:

```bash
ssh-copy-id user@hostname
```

One important thing to note here is that if you have generated multiple SSH keys on the same machine, `ssh-copy-id` will copy **all of them** to the destination server. If you only want to copy a specific one, you'll have to specify the file with the `-i` flag.

```bash
ssh-copy-id -i id_rsa.pub user@hostname
```

That's it, now when you SSH into the server it should skip asking for a login. But Windows is special and does not have the `ssh-copy-id` command.

## Copying SSH public key from Windows to a remote server

Since Powershell does not recognize the `ssh-copy-id` command, we'll do the following to copy the SSH public key to a Linux server.

```powershell
cat ~/.ssh/id_rsa.pub | ssh bob@hostname 'cat >> .ssh/authorized_keys && echo "Key copied"'
```

## References

- [SSH Man Page](https://linux.die.net/man/1/ssh)
- [SSH-Copy-ID Man Page](https://linux.die.net/man/1/ssh-copy-id)
- [Medium article comparing the different SSH encryption algorithms](https://nbeguier.medium.com/a-real-world-comparison-of-the-ssh-key-algorithms-b26b0b31bfd9)
