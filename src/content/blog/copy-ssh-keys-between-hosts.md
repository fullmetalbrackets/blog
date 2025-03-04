---
title: "Copying SSH Keys between different hosts"
description: "How to copy SSH keys between Linux hosts and from Windows to Linux."
pubDate: 2021-07-09
updatedDate: 2025-02-17
tags:
  - ssh
---

## Copy SSH key between Linux hosts

```bash
ssh-copy-id <user>@<ip-address>

# if target machine's hostname is in /etc/hosts
ssh-copy-id <user>@<hostname>
```

## Copy SSH key from Windows to Linux

```bash
cat ~/.ssh/id_rsa.pub | ssh <user>@<hostname> 'cat >> .ssh/authorized_keys && echo "Key copied"'
```

The above command will fail if the `.ssh` folder does not already exist on the Linux host. Below is a more advanced command that will create the folder and give it correct permissions.

```bash
cat ~/.ssh/id_rsa.pub | ssh <user>@<hostname> 'umask 0077; mkdir -p .ssh; cat >> .ssh/authorized_keys && echo "Key copied"'
```

Next: <a href="https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key" target="_blank" rel="noopener noreferrer">GitHub Docs instructions for adding a GPG keys.</a>

### Related Articles

- <a href="/blog/generating-an-ssh-key-pair/" data-umami-event="copy-shh-keys-related-generate-ssh-pair">Generating an SSH key pair</a>
- <a href="/blog/setup-ssh-authentication-to-push-to-github/" data-umami-event="copy-shh-keys-related-ssh-auth-github">Setup SSH authentication to push to Github</a>
