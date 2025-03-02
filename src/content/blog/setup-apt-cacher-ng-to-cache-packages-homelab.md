---
title: "Setup Apt-Cacher NG as a caching proxy server in your homelab and configure your other Linux hosts to use it"
description: "If your homelab has more than a few servers or VMs running Debian-based distributions, it makes sense to set up a package caching proxy on one of your servers. This guide will show how to set that up, configure your other Linux hosts, and optionally how to use Ansible to automate configuring those other hosts."
pubDate: 2025-03-03
tags:
  - self-hosting
---

## About Apt-Cacher NG

Apt-Cacher NG is a caching proxy that lets a Debian-based server cache any upgrades downloaded from the official repositories when using the `apt upgrade` command. Your other Linux servers can then download those upgrades from that cache, greatly speeding up their own upgrade process. It's quick and easy both to setup the cache server and to configure a client use it.

## Installing and configuring the cache proxy server

To install Apt-Cacher NG just use the package manager:

```bash
sudo apt update && sudo apt install apt-cacher-ng -y
```

```bash
sudo systemctl start apt-cacher-ng && sudo systemctl enable apt-cacher-ng
```

If you're accessing the official repositories via HTTPS (which is probably the case), then you should also make Apt-Cacher-NG use HTTPS. Just be aware it will use HTTPS to download from the repositories, but HTTPS is **NOT** possible between Linux hosts. (Not that it's necessary within your own homelab anyway.)

Open the file at `/etc/apt-cacher-ng/acng.conf` with a text editor, find and uncomment this line:

```bash
PassThroughPattern: .*
```

Save and close the file, then restart Apt-Cacher NG:

```bash
sudo systemctl restart apt-cacher-ng
```

Now that the cache server is set up, let's tell other Linux hosts to use it.

## Configure a Linux host to use the cache server

On another Linux host, create this file:

```bash
touch /etc/apt/apt.conf.d/01proxy
```

Now copy & paste the below into it, using your own cache server's IP address:

```bash
Acquire::http::Proxy "http://192.168.0.250:3142";
```

That's it. Now when you update, it should pull from the cache server. You can verify this by using this command on the cache server:

```bash
cat /var/log/apt-cacher-ng/apt-cacher.log
```

The output should show the other host downloading from the cache server:

```bash
1740793422|I|714|192.168.0.100|secdeb/dists/bookworm-security/InRelease
1740793422|O|48232|192.168.0.100|secdeb/dists/bookworm-security/InRelease
1740793437|I|15812|192.168.0.100|debrep/dists/bookworm/InRelease
1740793437|O|102|192.168.0.100|debrep/dists/bookworm/InRelease
1740793437|I|675|192.168.0.100|debrep/dists/bookworm-updates/InRelease
1740793437|O|55714|192.168.0.100|debrep/dists/bookworm-updates/InRelease
1740793440|I|394558|192.168.0.100|secdeb/pool/updates/main/o/openh264/libopenh264-7_2.3.1+dfsg-3+deb12u1_amd64.deb
1740793440|O|393430|192.168.0.100|secdeb/pool/updates/main/o/openh264/libopenh264-7_2.3.1+dfsg-3+deb12u1_amd64.deb
1740793440|I|2384518|192.168.0.100|secdeb/pool/updates/main/x/xorg-server/xserver-common_21.1.7-3+deb12u9_all.deb
1740793440|O|2383385|192.168.0.100|secdeb/pool/updates/main/x/xorg-server/xserver-common_21.1.7-3+deb12u9_all.deb
1740793440|I|2389946|192.168.0.100|secdeb/pool/updates/main/x/xorg-server/xserver-xorg-legacy_21.1.7-3+deb12u9_amd64.deb
1740793440|O|2388824|192.168.0.100|secdeb/pool/updates/main/x/xorg-server/xserver-xorg-legacy_21.1.7-3+deb12u9_amd64.deb
1740793451|I|3721758|192.168.0.100|secdeb/pool/updates/main/x/xorg-server/xserver-xorg-core_21.1.7-3+deb12u9_amd64.deb
1740793451|O|3720630|192.168.0.100|secdeb/pool/updates/main/x/xorg-server/xserver-xorg-core_21.1.7-3+deb12u9_amd64.deb
```

## Using Ansible to automate configuration of multiple hosts

If you only have a few Linux hosts, you can easily add the `01proxy` conf file using SCP a few times.

```bash
sudo scp /etc/apt/apt.conf.d/01proxy user@other-host:/etc/apt/apt.conf.d/01proxy
```

This can be tedious with more than a few hosts, though. If you're the kind of madlad that runs a dozen or more Linux servers or VMs, it might be more desirable to use Ansible to automate the configuration change everywhere. However, you have to use Ansible from a host that already has SSH access to every other host it will push configuration changes to, and if you don't it's probably more trouble than it's worth. In my case, I was already using Ansible in my network, so it made sense to leverage it for this. (If you use infrastructure-as-code solution like Chef, Puppet or Saltstack, you should use them instead.)

First, if you don't yet have Ansible, add it's repository and install it. (We'll be installing `ansible-core` which is a smaller, minimal package. If you want you can install the full `ansible` package instead, but this playbook does not require it.)

```bash
sudo apt-add-repository ppa:ansible/ansible
sudo apt install ansible-core -y
```

Create a new directory to house the Ansible playbook and related files. Copy the `01proxy` file into the directory then go into it.

```bash
mkdir apt-proxy
sudo cp /etc/apt/apt.conf.d/01proxy apt-proxy/01proxy
cd apt-proxy
```

Here we'll create three more files. First, the Ansible configuration file, `ansible.cfg`.

```ini
[defaults]
inventory = hosts.yaml
ansible_python_interpreter=/usr/bin/python3
timeout=30

[ssh_connections]
pipelining = true
```

Now the inventory file, `hosts.yaml`. Make sure to add all your other Linux hosts (besides the cache server) here, and the right IPs and users for each host.

```yaml
---
all:
  hosts:
    server1:
      ansible_user: chandler
      ansible_host: 192.168.0.100
    server2:
      ansible_user: monica
      ansible_host: 192.168.0.105
    vm1:
      ansible_user: debian
      ansible_host: 192.168.1.20
    vm2:
      ansible_user: debian
      ansible_host: 192.168.1.25
    vm3:
      ansible_user: ubuntu
      ansible_host: 192.168.1.30
```

Finally, the playbook itself, name it whatever you want. I'll call it `run.yaml`.

```yaml
---
- name: Add apt-proxy to hosts
  hosts: all
  become: true

  tasks:

    - name: Copy the apt-cacher-ng client config
      copy:
        src: files/01proxy
        dest: /etc/apt/apt.conf.d/01proxy
        mode: "0644"

    - name: Update all installed packages
      apt:
        update_cache: yes
        upgrade: safe
        name: "*"
        state: latest

    - name: Clean cache & remove unnecessary dependencies
      apt:
        autoclean: yes
        autoremove: yes
        purge: yes
```

The above playbook is dead simple, all it does it copy the `01proxy` file into the `/etc/apt/apt.conf.d` directory, then check for updates. It will do this on all hosts you list in the inventory file.

When you're ready to run the playbook, use this command:

```bash
ansible-playbook run.yaml
```

You’ll see some output as the playbook carries out its tasks, and if there’s any errors it will clearly say so and cancel. Once it finishes up, check `apt-cacher.log` again on the caching server and you should see all the hosts pulling from it, assuming they had upgrades to download and install.

## References

- <a href="https://unix-ag.uni-kl.de/~bloch/acng/" target="_blank" data-umami-event="apt-cacher-ng-ref-site">Apt-Cacher NG</a>
- <a href="https://ansible.com" target="_blank" data-umami-event="apt-cacher-ng-ref-ansible-docs">Ansible</a>

### Related Articles

> <a href="/blog/setup-unattended-upgrades" data-umami-event="apt-cacher-ng-related-unattended-upgrades">Setup auto-updates in Debian and Ubuntu with Unattended-Upgrades and NeedRestart</a>

> <a href="/blog/bootstrapping-fresh-linux-install-with-ansible" data-umami-event="apt-cacher-ng-related-bootstrap-ansible">Bootstrapping a fresh Linux install with Ansible</a>