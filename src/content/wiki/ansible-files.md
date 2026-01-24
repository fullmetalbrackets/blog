---
title: 'Ansible playbook and files for bootstrapping a Linux install'
description: 'Contents of Ansible playbook and other files for use in bootstrapping a Linux install with base apps, services, etc.'
pubDate: 2024-02-04
tag: documentation
---

![Ansible Branding](../../img/wiki/ansible.svg)

# Ansible files

```yaml
# hosts.yaml
---
all:
 vars:
  ansible_connection: ssh
  ansible_user: ad
 children:
  workstations:
   hosts:
    apollo:
     ansible_host: 192.168.0.100
    loki:
     ansible_host: 192.168.0.110
  servers:
   hosts:
    athena:
     ansible_host: 192.168.0.120
    zima:
     ansible_host: 192.168.0.125
    korben:
     ansible_host: 192.168.0.225
  mini:
   hosts:
    potato:
     ansible_host: 192.168.0.200
    spud:
     ansible_host: 192.168.0.205
  remote:
   hosts:
    outpost:
     ansible_host: ...
    bastion:
     ansible_host: ...
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
   # Add apt cache server
   - name: Copy the apt-cacher-ng client config
     copy:
      src: files/01proxy
      dest: /etc/apt/apt.conf.d/01proxy
      mode: '0644'

   # Download packages
   - name: Update all installed packages
     apt:
      update_cache: yes
      upgrade: safe
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
       - smartmontools
      state: present
      install_recommends: yes

   - name: Install PC packages
     apt:
      deb: https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
      install_recommends: yes
     when: inventory_hostname in groups["pc"]

   - name: Install server-only packages
     apt:
      name:
       - samba
       - cifs-utils
       - nfs-kernel-server
       - cockpit
       - cockpit-pcp
      state: present
      install_recommends: yes
     when: inventory_hostname in groups["servers"]

   # Samba
   - name: Copy custom SMB conf & backup default conf
     copy:
      src: files/smb.conf
      dest: /etc/samba/smb.conf
      mode: '0644'
      backup: yes
     when: inventory_hostname in groups["servers"]

   - name: Start the SMB daemon
     service:
      name: smbd
      state: started
     when: inventory_hostname in groups["servers"]

   - name: Start the NetBIOs daemon
     service:
      name: nmbd
      state: started
     when: inventory_hostname in groups["servers"]

   - name: Enable the SMB daemon
     systemd:
      name: smbd
      enabled: yes
     when: inventory_hostname in groups["servers"]

   - name: Enable the NetBIOS daemon
     systemd:
      name: nmbd
      enabled: yes
     when: inventory_hostname in groups["servers"]

   # Copy dotfiles
   - name: Copy the Git config file
     copy:
      src: files/.gitconfig
      dest: /home/{{ ansible_user }}/.gitconfig

   - name: Copy custom Nano config & backup default config
     copy:
      src: files/nanorc
      dest: /etc/nanorc
      mode: '0644'
      backup: yes

   - name: Create the Neofetch config directory
     file:
      path: /home/{{ ansible_user }}/.config/neofetch
      state: directory

   - name: Copy the custom Neofetch config
     copy:
      src: files/neofetch.conf
      dest: /home/{{ ansible_user }}/.config/neofetch/config.conf

   # Oh-My-Zsh
   - name: Download Oh My Zsh installation script
     get_url:
      url: https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh
      dest: /tmp/install_ohmyzsh.sh

   - name: Run Oh My Zsh installation script
     command: sh /tmp/install_ohmyzsh.sh --unattended
     register: ohmyzsh_result
     failed_when: "'FAILED' in ohmyzsh_result.stderr"
     args:
      chdir: '/home/{{ ansible_user }}'
     environment:
      HOME: '/home/{{ ansible_user }}'
      RUNZSH: 'no'

   - name: Make sure oh-my-zsh plugins directory exists
     file:
      path: '/home/{{ ansible_user }}/.oh-my-zsh/custom/plugins'
      state: directory
      owner: '{{ ansible_user }}'
      group: '{{ ansible_user }}'

   - name: Clone zsh-syntax-highlighting plugin
     git:
      repo: https://github.com/zsh-users/zsh-syntax-highlighting.git
      dest: '/home/{{ ansible_user }}/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting'
      update: yes

   - name: Clone zsh-autosuggestions plugin
     git:
      repo: https://github.com/zsh-users/zsh-autosuggestions.git
      dest: '/home/{{ ansible_user }}/.oh-my-zsh/custom/plugins/zsh-autosuggestions'
      update: yes

   - name: Clone zsh-completions plugin
     git:
      repo: https://github.com/zsh-users/zsh-completions.git
      dest: '/home/{{ ansible_user }}/.oh-my-zsh/custom/plugins/zsh-completions'
      update: yes

   - name: Clone zsh-history-substring-search plugin
     git:
      repo: https://github.com/zsh-users/zsh-history-substring-search.git
      dest: '/home/{{ ansible_user }}/.oh-my-zsh/custom/plugins/zsh-history-substring-search'
      update: yes

   - name: Clone you-should-use plugin
     git:
      repo: https://github.com/MichaelAquilina/zsh-you-should-use.git
      dest: '/home/{{ ansible_user }}/.oh-my-zsh/custom/plugins/you-should-use'
      update: yes

   - name: Make sure oh-my-zsh themes directory exists
     file:
      path: '/home/{{ ansible_user }}/.oh-my-zsh/custom/themes'
      state: directory
      owner: '{{ ansible_user }}'
      group: '{{ ansible_user }}'

   - name: Clone powerlevel10k repo
     git:
      repo: https://github.com/romkatv/powerlevel10k.git
      dest: /home/{{ ansible_user }}/.oh-my-zsh/custom/themes/powerlevel10k
      update: yes

   - name: Copy aliases file
     copy:
      src: files/.aliases
      dest: /home/{{ ansible_user }}/.aliases

   - name: Copy zsh config & backup existing file
     copy:
      src: files/.zshrc
      dest: /home/{{ ansible_user }}/.zshrc
      backup: yes

   - name: Change default shell to Zsh
     user:
      name: '{{ ansible_user }}'
      shell: /bin/zsh

   # Final steps
   - name: Add IPs of local machines to /etc/hosts
     lineinfile:
      dest: /etc/hosts
      regexp: '.*{{ item }}$'
      line: '{{ hostvars[item].ansible_host }} {{item}}'
      state: present
     when: "hostvars[item].ansible_host is defined and 'remote' not in group_names"
     with_items: '{{ groups.all }}'

   - name: Clean cache & remove unnecessary dependencies
     apt:
      autoclean: yes
      autoremove: yes

   - name: Check if reboot is required
     stat:
      path: /var/run/reboot-required
     register: reboot_required_file

   - name: Reboot if required
     reboot:
      msg: Rebooting due to a kernel update
     when: reboot_required_file.stat.exists
```
