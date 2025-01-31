---
title: "Ansible playbook and files for bootstrapping a Linux install"
description: "Contents of Ansible playbook and other files for use in bootstrapping a Linux install with base apps, services, etc."
pubDate: 2024-02-04
tags:
  - config
---

<img src="/ansible.svg" alt="Ansible" loading="eager" encoding="async" />

# Ansible files

```yaml
# hosts.yaml

---
all:
  vars:
    ansible_connection: ssh
    ansible_user:
    ansible_sudo_pass:
  children:
    workstations:
      hosts:
        apollo:
          ansible_host: 192.168.0.100
    servers:
      hosts:
        athena:
          ansible_host: 192.168.0.120
        casaos:
          ansible_host: 192.168.0.125
        korben:
          ansible_host: 192.168.0.225
    mini:
      hosts:
        potato:
          ansible_host: 192.168.0.200
        spud:
          ansible_host: 192.168.0.205
```

```ini
# ansible.cfg

[defaults]
inventory = hosts.yaml
retry_files_enabled = False
private_key_file = ~/.ssh/id_rsa
ansible_python_interpreter=/usr/bin/python3
timeout=30

[ssh_connections]
pipelining = true
```

# The playbook

```yaml
# run.yaml

---
- name: Bootstrap Linux
  hosts: all
  become: true

  tasks:
# Packages
    - name: Update all installed packages
      apt:
        update_cache: yes
        upgrade: yes
        cache_valid_time: 86400

    - name: Install essential apt packages
      apt:
        name:
          - zsh
          - git
          - rsync
          - wget
          - curl
          - neofetch
          - cockpit
          - cockpit-pcp
        state: present
        install_recommends: yes

    - name: Install workstation packages
      apt:
        deb: https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
      when: inventory_hostname in groups["workstations"]

    - name: Install server packages
      apt:
        name:
          - samba
          - cifs-utils
          - smartmontools
          - nfs-kernel-server
        state: present
        install_recommends: yes
      when: inventory_hostname in groups["servers"]

# Final steps
    - name: Check if reboot is required
      stat:
        path: /var/run/reboot-required
      register: reboot_required_file

    - name: Reboot if required
      reboot:
        msg: Rebooting due to a kernel update
      when: reboot_required_file.stat.exists
```

# Instructions

1. Install Ansible with `sudo apt install ansible -y`
2. Run the playbook on all hosts `ansible-playbook run.yml` or targeted at a specific host - `ansible-playbook run.yml -l <host>`
