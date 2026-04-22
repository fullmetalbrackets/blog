---
title: 'How to migrate AdGuard Home from a GL.iNet Flint 2 router to a Libre Sweet Potato'
description: 'I love the Flint 2 router from GL.iNet, but the built-in AdGuard Home cannot handle the amount of devices, blocklists and custom filter rules I need. It crashes when I try to search the query log or add new custom filters, so I decided to take my config and migrate it to a Sweet Potato, and those issues disappeared.'
pubDate: 2026-04-09 12:00:00
updatedDate: 2026-04-22 12:00:00
tags: ['adguard', 'gl-inet', 'sbc']
---

## Sweet What?

[Sweet Potato is a single-board computer created by Libre Computer](https://libre.computer/products/aml-s905x-cc-v2/). It has similar hardware and form factor to a Raspberry Pi 3B+, with a few differences. Namely it has 2 GB of memory instead of 1, no onboard Wi-Fi, the ethernet port is only capable of 100 Mb instead of 1 gig, it uses USB Type-C instead of MicroUSB for power, and it has a 32 GB eMMC. This is all more than enough for AdGuard Home.

If you want to follow along, you can just substitute an actual Raspberry Pi or practically any other device (SBC or not) running Linux. I'm just using the Sweet Potato because I had one available and it uses very low power, which is perfect for a DNS server that has to be on 24/7.

## Install AdGuard Home on the Sweet Potato

First, we will install AdGuard Home on the Sweet Potato and do the setup wizard to generate a new configuration.

Go to the [latest release on AdGuard Home's GitHub](https://github.com/AdguardTeam/AdGuardHome/releases/latest/), scroll down to **Assets** and find the download link for `AdGuardHome_linux_arm64.tar.gz`. This is the one that works on Sweet Potato, but if you're installing AdGuard Home on a Linux machine running an Intel or AMD CPU, then be sure to use the one named `linux_amd64` instead!

Copy the link to your clipboard, then SSH into your Sweet Potato and use `wget` to download the file:

```bash
wget https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.73/AdGuardHome_linux_arm64.tar.gz
```

Next extract the archive with this command:

```bash
tar -xvzf AdGuardHome_linux_arm64.tar.gz
```

> The above command will create an `AdGuardHome` subdirectory in your present working directory and extract all files in there. This is where AdGuard Home will live once you install it, so if you want it to be in a specific directory, use this command instead:
>
> ```bash
> tar -xvzf AdGuardHome_linux_arm64.tar.gz -C /some/other/path
> ```
>
> The rest of this guide will assume you just installed it in your user directory at `~/AdGuardHome`.

Use the `cd` command to go into the directory where you extracted the files, and use the below command to run the AdGuard Home installation script. This will install the binary and run it as a `systemd` service.

```bash
./AdGuardHome -s install
```

Once it's done you can confirm that AdGuard Home is running with this command:

```bash
❯ sudo systemctl status AdGuardHome
# output below confirms it is running
● AdGuardHome.service - AdGuard Home: Network-level blocker
     Loaded: loaded (/etc/systemd/system/AdGuardHome.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-03-16 20:05:03 EDT; 1h 43min ago
   Main PID: 1568819 (AdGuardHome)
      Tasks: 9 (limit: 2034)
     Memory: 48.6M
        CPU: 32.060s
     CGroup: /system.slice/AdGuardHome.service
             └─1568819 /home/ad/AdGuardHome/AdGuardHome -s run
```

Now on your browser go to the URL provided after installation, should be `http://<IP-Address>:3000`. You'll be presented with the setup wizard, go through all the steps to configure this new instance of AdGuard Home. Once done, you'll be taken to the dashboard, which right now is pretty empty.

After completing the setup wizard, go back to the terminal and look in the `AdGuardHome` directory, there should be a new YAML configuration file located there.

```bash
❯ ls -lF
total 31572
-rwxr-xr-x 1 ad   ad   32112824 Mar 10 13:14 AdGuardHome*
-rw-r--r-- 1 ad   ad        566 Mar 10 13:14 AdGuardHome.sig
-rw------- 1 root root     3942 Mar 16 20:05 AdGuardHome.yaml
-rw-r----- 1 ad   ad     141437 Mar 10 13:14 CHANGELOG.md
drwx------ 1 root root       52 Mar 16 20:05 data/
-rw-r----- 1 ad   ad      35149 Mar 10 13:14 LICENSE.txt
-rw-r----- 1 ad   ad      22555 Mar 10 13:14 README.md
```

Note the file `AdGuardHome.yaml`, this is where your entire configuration lives. We'll come back to it soon, for now let's copy over the existing config from the Flint 2.

## Copying the AdGuard Home config from the Flint 2

SSH into your GL.iNet router. The login will be `root` as the user and the password should be the same as the one you use to login to the router's web UI.

```bash
ssh root@192.168.0.1 # or whatever is your router's IP address
```

Now we're going to find the AdGuard Home config file, which lives in this directory:

```bash
❯ ls /etc/AdGuardHome
AdGuardHome.sig  LICENSE.txt      agh-backup       data
CHANGELOG.md     README.md        config.yaml
```

What we want from here is the `config.yaml`. (No idea why it's named different on GL.iNet hardware.) Copy the file to the home directory of the device where you just installed AdGuard Home:

```bash
scp /etc/AdGuardHome/config.yaml ad@192.168.0.200:~/config.yaml
```

Normally if you were migrating AdGuardHome from a Linux server or a Docker container, you'd just copy over the config from the old host to the new one. However, the Flint 2 has a bunch of unique configuration that shouldn't be used in a normal Linux install of AdGuard Home, so *don't replace the config on the other device with this one yet*. We'll need to only copy parts of it into the new config.

## Updating the configuration on Sweet Potato

Back on the Sweet Potato terminal, first shutdown AdGuard Home and make a backup of the configuration created with the setup wizard, just in case you need to fallback to it later.

```bash
sudo systemctl stop AdGuardHome
cp ~/AdGuardHome/AdGuardHome.yaml ~/AdGuardHome/AdGuardHome.yaml.bk
```

Now open the `config.yaml` you copied from the Flint 2 in your preferred text editor. **You want to ignore the first 15 lines of the YAML file**, they'll look like this:

```yaml
http:
  pprof:
    port: 6060
    enabled: false
  address: 0.0.0.0:3000
  session_ttl: 720h
users: []
auth_attempts: 5
block_auth_min: 15
http_proxy: ''
language: ''
theme: auto
dns:
  bind_hosts:
    - 0.0.0.0
  port: 3053
```

These are the GL.iNet specific settings that will not work on other devices, plus since we already configured the other device properly by running the setup wizard, you don't want to overwrite that.

Instead what you want to copy over to the existing `AdGuardHome.yaml` is everything starting with the line **after** the above, which should look like this:

```bash
# ...first 15 lines to ignore...
 anonymize_client_ip: false
  ratelimit: 20
  ratelimit_subnet_len_ipv4: 24
  ratelimit_subnet_len_ipv6: 56
  ratelimit_whitelist: []
  refuse_any: true
  upstream_dns:
    - https://dns10.quad9.net/dns-query
  upstream_dns_file: ""
  bootstrap_dns:
    - 9.9.9.10
    - 149.112.112.10
    - 2620:fe::10
    - 2620:fe::fe:10
# ...rest of config...
```


Once you've copied and pasted the necessary bits into `AdGuardHome.yaml`, save the file and exit your editor. Now restart AdGuard Home and the new configuration options you added will take effect.

```bash
sudo systemctl start AdGuardHome
```

Once it's up and running, go to the AdGuard Home web UI on your browser, assuming you used the default setting in the setup wizard and didn't change the network port from default `80` to something else, you should reach it at `http://<IP-Address>/`. (If you set a different port for the web UI, append it to the IP, e.g. `http://192.168.0.200:3000`.)

On the AdGuard Home dashboard, go to **Filters -> DNS blocklists** on the top navigation bar, you should see all your blocklists from the Flint 2 present. Your other settings should all have transferred over as well, like DNS rewrites and custom filter rules, check them out to be sure.

## Disable AdGuard Home on the Flint 2 and configure new DNS

Now that your new instance of AdGuard Home is ready and waiting, it's time to turn off the running one on the Flint 2 router. Login to the router web UI, then go to **Applications** -> **AdGuard Home** on the sidebar. Here, toggle **OFF** the button that says *Enable AdGuard Home*, then click **Apply**.

Next, go to **Network** -> **DNS** on the sidebar. First, make sure all the switches are toggled **OFF**. Then, under **DNS Server Settings** do the following:

1. For *Mode* choose **DNS Proxy** from the dropdown menu.
2. For *Proxy Server Address* type in your new AdGuard Home instance's IP address with the DNS network port appended as shown in the example, like `192.168.0.200#53`.

> [warning] Important!
>
> If you don't use the **DNS Proxy** mode here, then all queries be from the Flint 2 router's IP address, rather than from individual client IPs. To see individual clients on the query log you *must* use DNS Proxy mode here.

## References

- [AdGuardHome - Getting Started](https://adguard-dns.io/kb/adguard-home/getting-started/)
