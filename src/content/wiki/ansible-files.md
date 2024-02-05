---
title: "Ansible playbook and files for bootstrapping a Linux install"
description: "Contents of Ansible playbook and other files for use in bootstrapping a Linux install with base apps, services, etc."
pubDate: 2024-02-04
tags:
  - Homelab
  - Ansible
---

# Ansible files

```bash

# hosts

[local]
localhost

[local:vars]
ansible_connection=local
ansible_python_interpreter="/usr/bin/python3"

[server]
apollo ansible_host=192.168.0.100
potato ansible_host=192.168.0.200
korben ansible_host=192.168.0.225

[all:vars]
ansible_user=ad
ansible_connection=ssh
```

```bash
# ansible.cfg

[defaults]
inventory = hosts
private_key_file = ~/.ssh/id_rsa
retry_files_enabled = False
ansible_python_interpreter=/usr/bin/python3
timeout=30

[ssh_connections]
pipelining = true
```

# The playbook

```bash
# run.yml

---
- name: Bootstrap Linux
  hosts: all
  become: true

  tasks:
    - name: Update all installed packages
      tags: always
      apt:
        update_cache: yes
        name: "*"
        state: latest

    - name: Install essential apt packages
      tags:
       - always
      apt:
        update_cache: yes
        name:
          - zsh
          - git
          - rsync
          - wget
          - curl
          - htop
          - inxi
          - smartmontools
          - neofetch
          - samba
          - cifs-utils
        state: present
        install_recommends: yes

    - name: Clean cache & remove unnecessary dependencies
      tags:
       - always
      apt:
        autoclean: yes
        autoremove: yes

    - name: Start the Samba daemon
      tags:
        - server
        - samba
      service:
        name: smbd
        state: started

    - name: Start the NetBIOs daemon
      tags:
        - server
        - samba
      service:
        name: nmbd
        state: started

    - name: Enable the Samba daemon
      tags:
        - server
        - samba
      systemd:
        name: smbd
        enabled: yes

    - name: Enable the NetBIOS daemon
      tags:
        - server
        - samba
      systemd:
        name: nmbd
        enabled: yes

    - name: Check if reboot is required
      tags: always
      stat:
        path: /var/run/reboot-required
      register: reboot_required_file

    - name: Reboot if required
      tags: always
      reboot:
        msg: Rebooting due to a kernel update
      when: reboot_required_file.stat.exists
```

# Instructions

1. Install Ansible with `sudo apt-add-repository ppa:ansible/ansible && sudo apt install ansible -y`
2. Install Community Collection with `ansible-galaxy collection install community.general`
3. Run the playbook on all hosts `ansible-playbook run.yml` or targeted at a specific host - `ansible-playbook run.yml -l <host>`
