---
title: "Bootstrapping a fresh Linux install with Ansible"
description: "Ansible is an IT tool that enables Infrastructure as Code, letting you automate provisioning, configuration, management and deployment of services and applications. I like using it at a fraction of it's full power to bootstrap fresh installs of Linux for my homelab."
pubDate: 2022-09-03
tags:
  - command line
---

## Sections

1. [Install Ansible](#install)
2. [The playbook](#playbook)
3. [The inventory and config files](#config)
4. [Running the playbook](#run)
5. [References](#ref)

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> This is not a comprehensive tutorial for Ansible, but simple a terse quick guide of my personal use case for Ansible in my home lab. For a deeper dive, I strongly suggest <a href="https://www.learnlinux.tv/getting-started-with-ansible/" target="_blank">Learn Linux TV series of Ansible tutorials</a> which is how I first learned to use it myself.

<div id='install'/>

## Install Ansible

First install <em>Ansible</em>, which requires adding the repository to download the package via APT.

```bash
sudo apt-add-repository ppa:ansible/ansible
sudo apt install ansible -y
```

<div id='playbook'/>

## The playbook

Contents of the playbook, which I named `bootstrap.yml`:

```yaml
- name: Bootstrap Linux Server
  hosts: hostname-or-IP-address
  become: true
  vars:
    user: admin

  tasks:
    - name: Update all installed packages
      apt:
        update_cache: yes
        name: "*"
        state: latest

    - name: Install various apt packages
      apt:
        update_cache: yes
        name:
          - zsh
          - git
          - sudo
          - vim
          - htop
          - inxi
          - net-tools
          - speedtest-cli
          - samba
          - cifs-utils
          - docker
          - docker-compose
          - smartmontools
          - neofetch
        state: present
        install_recommends: yes
      when: ansible_distribution == 'Debian' or ansible_distribution == 'Kali' or ansible_distribution == 'Linuxmint' or ansible_distribution == 'Ubuntu'

    - name: Clean cache & remove unnecessary dependencies
      apt:
        autoclean: yes
        autoremove: yes
      when: ansible_distribution == 'Debian' or ansible_distribution == 'Kali' or ansible_distribution == 'Linuxmint' or ansible_distribution == 'Ubuntu'

    # Samba
    - name: Copy the Samba config file
      copy:
        src: files/smb
        dest: /etc/samba/smb.conf

    - name: Start the Samba daemon
      service:
        name: smbd
        state: started

    - name: Start the NetBIOs daemon
      service:
        name: nmbd
        state: started

    - name: Enable the Samba daemon
      ansible.builtin.systemd:
        name: smbd
        enabled: yes

    - name: Enable the NetBIOS daemon
      ansible.builtin.systemd:
        name: nmbd
        enabled: yes

    - name: Copy the zsh config file
      copy:
        src: files/zshrc
        dest: /home/user/zshrc # rename file to .zshrc after setting up oh-my-zsh
        owner: user
        group: group
        mode: 0644

    - name: Copy the aliases file
      copy:
        src: files/aliases
        dest: /home/user/.aliases
        owner: user
        group: group
        mode: 0644

    - name: Copy the Git config file
      copy:
        src: files/gitconfig
        dest: /home/user/.gitconfig
        owner: user
        group: group
        mode: 0644

    - name: Copy the Nano config file
      copy:
        src: files/nanorc
        dest: /etc/nanorc
        owner: user
        group: group
        mode: 0644

    # Final steps
    - name: Set the default shell
      user:
        name: "user"
        shell: "zsh"

    - name: Check if reboot is required
      stat:
        path: /var/run/reboot-required
      register: reboot_required_file

    - name: Reboot if required
      reboot:
        msg: Rebooting due to a kernel update
      when: reboot_required_file.stat.exists
```

This playbook will installs a selection of packages I commonly use, changes the default shell, and copies over dotfiles and other configs.

<div id='config'/>

## The inventory and config files

Next we need the inventory file, which I named `hosts` (no file extension) and I'm using the INI file format (you can also use YAML if you prefer):

```ini
[server]
192.168.1.200
192.168.1.210

[test]
192.168.1.220

[all:vars]
ansible_user=username
ansible_sudo_pass=password
```

This inventory is very simple, it gives Ansible two groups of hosts as targets `[server]` and `[test]`, and provides a superuser and their sudo password as variables for all targets. This works for me because I use the same username and password for all the linux machines on my network, but you can make different sets of variables, for example:

```clike
[targets]
192.168.1.200   ansible_user=user1   ansible_password=password2
192.168.1.210   ansible_user=user2   ansible_password=password1
192.168.1.220   ansible_user=user3   ansible_password=password3
```

Next is the configuration file, `ansible.cfg`:

```ini
[defaults]
inventory = hosts
private_key_file = ~/.ssh/id_ed25519
retry_files_enabled = False
ansible_python_interpreter=/usr/bin/python3
timeout=30

[ssh_connections]
pipelining = true
```

This tells Ansible the name of the inventory file (`hosts`), the location of the SSH private key to use, and `pipelining = true` vastly improves the speed at which Ansible executes tasks.

<div id='run'/>

## Running the playbook

All that's left now is to run the playbook and bootstrap the server, but first it's highly recommended to do a <em>dry-run</em> that runs the playbook in check mode, to verify it works without making any changes. Make sure you're in the same directory as `bootstrap.yml` (the playbook), `ansible.cfg` (the config) and `hosts` (inventory file). Then, use the following command:

```bash
ansible-playbook bootstrap.yml --check
```

You'll see some output as the playbook carries out its tasks. Below as an example:

```bash
PLAY [Bootstrap home server] *********************************************************************
TASK [Gathering Facts] ***************************************************************************
ok: [apollo]

TASK [Update all installed packages] *************************************************************
ok: [apollo]

TASK [Install various apt packages] **************************************************************
ok: [apollo]

TASK [Clean cache & remove unnecessary dependencies] *********************************************
ok: [apollo]

TASK [Start the Samba daemon] ********************************************************************
ok: [apollo]

TASK [Start the NetBIOs daemon] ******************************************************************
ok: [apollo]

TASK [Enable the Samba daemon] *******************************************************************
ok: [apollo]

TASK [Enable the NetBIOS daemon] *****************************************************************
ok: [apollo]

TASK [Copy the zsh config file] ******************************************************************
changed: [apollo]

TASK [Copy the aliases file] *********************************************************************
changed: [apollo]

TASK [Copy the Git config file] ******************************************************************
ok: [apollo]

TASK [Copy the Nano config file] *****************************************************************
ok: [apollo]

TASK [Set the default shell] *********************************************************************
changed: [apollo]


TASK [Check if reboot is required] ***************************************************************
ok: [apollo]

TASK [Reboot if required] ************************************************************************
skipping: [apollo]

PLAY RECAP ***************************************************************************************
apollo     : ok=15   changed=3    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
```

If all looks good and there's no errors, you can run the playbook for real:

```bash
ansible-playbook bootstrap.yml
```

<div id='ref'/>

## References

- <a href="https://docs.ansible.com" target="_blank">Ansible Documentation</a>
- <a href="https://www.learnlinux.tv/getting-started-with-ansible/" target="_blank" rel="noopener noreferrer">Learn Linux TV series of Ansible tutorials</a>

## Related Articles

> [Using MergerFS to combine multiple hard drives into one unified media storage](/blog/two-drives-mergerfs/)

> [Mounting (either internal or external) hard drives in Linux](/blog/mounting-hard-drives-in-linux/)