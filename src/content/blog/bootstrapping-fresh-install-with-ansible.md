---
title: "Bootstrapping a fresh Linux install with Ansible"
description: "Ansible is an IT tool that enables Infrastructure as Code, letting you automate provisioning, configuration, management and deployment of services and applications. I like using it at a fraction of it's full power to bootstrap fresh installs of Linux for my homelab."
pubDate: 2022-09-03
updatedDate: 2025-03-03
tags:
  - command line
---

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> This is not a comprehensive tutorial for Ansible, but simply a terse quick guide of my personal use case for Ansible in my home lab. For a deeper dive on Ansible, I strongly suggest <a href="https://www.learnlinux.tv/getting-started-with-ansible/" target="_blank">Learn Linux TV series of Ansible tutorials</a> which is how I first learned to use it myself.

## Install Ansible

First install **Ansible** via package manager. Note that there's actually two packages to choose from: `ansible-core` is very minimal and only comes with a small set of modules and plugins, while `ansible` is a larger "batteries included" package with that comes with many Ansible Collections. The playbook I use and which I'll discuss below only uses built-in modules included in `ansible-core`, but if you plan to make more {{ ansible_user }}vanced playbooks, you should probably just install `ansible` from the start.

Ansible is available in some, but not all package managers. If it's not available via your distribution's package manager, see the <a href="https://docs.ansible.com/ansible/latest/installation_guide/installation_distros.html#installing-distros" target="_blank" data-umami-event="ansible-installing-distros">Ansible documentation</a> for other ways.

The below will assume you're using Debian or Ubuntu, which first requires adding the Ansible <a href="https://launchpad.net/ubuntu/+ppas" target="_blank" data-umami-event="ansible-ppas">PPA</a>:

```sh
sudo add-apt-repository ppa:ansible/ansible
sudo apt install ansible -y
```

## The configuration file

For configuration, Ansible uses a `ansible.cfg` file, which uses INI syntax. A base config exists at `/etc/ansible/ansible.cfg`, but you can create a project-specific config file and any changes you make there will supercedes the base config. It's not required, but without it you have to pass a bunch of options when executing the playbook, like `--private_key_file` to specify an SSH key to use. Here is mine:

```ini
# ansible.cfg

[defaults]

inventory = hosts.yaml
private_key_file = ~/.ssh/id_ed25519
retry_files_enabled = False
ansible_python_interpreter = /usr/bin/python3
timeout = 30

[privilege_escalation]

become = True
become_method = sudo
become_user = root
become_ask_pass = False

[ssh_connections]

pipelining = True
scp_if_ssh = True
```

Some of these should be fairly self-explanatory. `scp_if_ssh` speeds up file copying a little and `pipelining = true` vastly improves the speed at which Ansible executes tasks.

## The inventory file

Next we need the inventory file, which can be in either YAML or INI synxtax, but I'm much more comfortable working with YAML, so that's what I use.

```yaml
# hosts.yaml

---
all:
  vars:
    ansible_user: # user
    ansible_connection: ssh

  children:
    servers:
      hosts:
        athena:
          ansible_host: # ip address
        korben:
          ansible_host: # ip address
        zima:
          ansible_host: # ip address

    mini:
      hosts:
        potato:
          ansible_host: # ip address
        spud:
          ansible_host: # ip address

    pc:
      hosts:
        apollo:
          ansible_host: # ip address
        loki:
          ansible_host: # ip address

    remote:
      hosts:
        outpost:
          ansible_host: # ip address
        bastion:
          ansible_host: # ip address
```

This inventory is divided into different groups of hosts, and the playbook can target specific ones -- for example only `server` hosts get Cockpit installed and only `pc` hosts (a desktop and a laptop) get Google Chrome. I use the same username on all my machines, so I pass it via the `{{ ansible_user }}` variable.

## The playbook

The below playbook is what I use to bootstrap my Linux machines. It's pretty basic, compared with all that Ansible can do, but set up my machines up with essential packages and some of my custom configurations. Copies of dotfiles and configs for SMB, Git and more are kept in a `files` subdirectory within the Ansible repo. The playbook backs up the existing files on the target machine and copy over my custom ones.

```yaml
# bootstrap.yaml

- name: Bootstrap Linux Server
  vars:
    user: # user

  tasks:
    - name: Safe upgrade of all installed packages
      apt:
        update_cache: yes
        upgrade: safe
        cache_valid_time: 86400

    - name: Install various apt packages
      apt:
        update_cache: yes
        name: # list packages to install
          - zsh
          - git
          - sudo
          - curl
          - wget
          - rsync
          - net-tools
          - smartmontools
          - samba
          - cifs-utils
          - nfs-kernel-server
        state: present
        install_recommends: yes

    - name: Clean cache & remove unnecessary dependencies
      apt:
        autoclean: yes
        autoremove: yes

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

    - name: Backup default SMB config & copy over custom SMB config
      copy:
        src: files/samba/smb.conf
        dest: /etc/samba/smb.conf

    - name: Copy the Git config file
      copy:
        src: files/git/.gitconfig
        dest: "/home/{{ ansible_user }}/.gitconfig"

    - name: Backup default Nano config & copy custom Nano config
      copy:
        src: files/nano/nanorc
        dest: /etc/nanorc
        mode: "0644"
        backup: yes

    - name: Copy .zshrc file
      copy:
        src: files/zshrc
        dest: "/home/{{ ansible_user }}/.zshrc"
        owner: user
        group: group
        mode: 0644

    - name: Copy .aliases file
      copy:
        src: files/aliases
        dest: "/home/{{ ansible_user }}/.aliases"
        owner: user
        group: group
        mode: 0644

    - name: Set the default shell
      user:
        name: "{{ ansible_user }}"
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

This playbook installs a selection of packages I commonly use, changes the default shell from bash to zsh, copies over dotfiles and other configs, and start/enables Samba.

## Running the playbook

All that's left now is to run the playbook, but first it's highly recommended to do a **dry-run** that runs the playbook in check mode, to verify it works without making any changes. From within the same directory as all the Ansible files, use the following command:

```sh
ansible-playbook bootstrap.yaml --check
```

You'll see some output as the playbook carries out its tasks, and if there's any errors it will clearly say so and cancel.

If all looks good and there's no errors, you can run the playbook for real:

```sh
ansible-playbook bootstrap.yaml
```

## References

- <a href="https://docs.ansible.com" target="_blank" data-umami-event="ansible-post-ansible-site">Ansible Documentation</a>
- <a href="https://www.learnlinux.tv/getting-started-with-ansible/" target="_blank" data-umami-event="ansible-learn-linux-tv">Learn Linux TV series of Ansible tutorials</a>

### Related Articles

> <a href="/blog/bootstrapping-fresh-linux-install-with-ansible" data-umami-event="unattended-upgrades-related-bootstrap-ansible">Bootstrapping a fresh Linux install with Ansible</a>

> <a href="/blog/setup-apt-cacher-ng-to-cache-packages-homelab" data-umami-event="unattended-upgrades-related-apt-cacher-ng">Setup auto-updates in Debian and Ubuntu with Unattended-Upgrades and NeedRestart</a>