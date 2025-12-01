---
title: "How to expose Plex to share your library with others from behind CGNAT using Tailscale and a free Oracle Cloud instance"
description: "I wrote before about sharing my Plex library via Cloudflare Tunnel, but that is technically against their TOS and liable to get your account in trouble. So I switched to using a free-tier Oracle VM, securely connecting it to my home network via Tailscale, and exposing Plex via reverse proxy on the VM. It works like a charm!"
pubDate: 2024-09-03
updatedDate: 2025-08-15
tags: ["plex", "tailscale"]
related1: comprehensive-guide-tailscale-securely-access-home-network
related2: expose-plex-with-cloudflare
---

> Please note that effective April 29, 2025 an active Plex Pass subscription is required to remotely access Plex -- the below still works as is to get through CGNAT _with Plex Pass_, however if you are trying to share your library _without_ Plex Pass (or without the user you're sharing with have a Remote Watch Pass) then additional configuration is required. I have added a section at the end to setup the Plex server as a subnet router and exit node, which seems to be a workaround to get this to work. Please <a href="mailto:contact@fullmetalbrackets.com">let me know</a> if this no longer works, since I cannot test it myself as a lifetime Plex Pass owner!

## What and Why

Plex is a self-hosted media server that lets you stream your owned (or downloaded, or otherwise acquired) media from other devices on the same network, through a web-based GUI (access via browser) or dedicated app. (Say, on a smart TV or Roku device.) Plex has a built-in feature to share your media library externally, but that requires opening a port on your router and forwarding it to the Plex server. Setting aside that port forwarding can be dangerous if you don't know what you're doing, it won't work anyway if your home network is behind Carrier-Grade Network Address Translation, or CGNAT. Many ISPs use this, and so many self-hosters may find themselves unable to expose their services.

Although I previously wrote about <a href="/blog/expose-plex-with-cloudflare" target="_blank" umami-data-event="expose-plex-tailscale-to-expose-plex-cf">how to expose Plex through CGNAT with Cloudflare Tunnel</a>, it's against their terms of service, so I don't use that method anymore and suggest you don't either. The method I explain in _this_ post has a few extra steps, but it does not run afoul of any service provider's rules.

> Note: The following is ONLY for exposing Plex to _other users you've shared libraries with_, and is not required if you're trying to access your own Plex server. For that, a VPS is not required, just install Tailscale on the Plex server and on whatever external device you want to access Plex from. An external VPS (free or otherwise) is only necessary to expose Plex to other users without them needing to run Tailscale themselves!

What we'll be setting up is this:

- We will install Tailscale on the same server as Plex or, alternately, on another machine in the home network that will act as subnet router. (See <a href="https://tailscale.com/kb/1019/subnets" target="_blank" umami-data-event="expose-plex-tailscale-docs-subnets">this section Tailscale docs</a> -- for this guide, we'll install Tailscale on the same server running Plex, so subnet routing isn't necessary.)

- We will create a free tier compute instance on Oracle Cloud Insfrastructure and install Tailscale on it, so it's on the same tailnet as the Plex server. We'll expose ports 80 and 443 to the internet on the VM, but only allowing access from specific IPs, and run a reverse proxy to route the traffic from allowed IPs to Plex. Note that if you're willing and able to pay for another cloud service provider, everything besides the Oracle-specific instructions should work there too! If you don't want to pay, though, just know that I have used a free Oracle instance to share Plex with 3 family members for over a year and so far it's worked great.

## Pre-Requisites

First of all, you should be comfortable using the terminal, because we'll be doing quite a bit through command line. (Ubuntu specifically, since that's the distribution I used for OCI from the options available.)

The method I explain here requires you to own a domain -- it may be possible to instead use something like DuckDNS or NoIP, but I have not tried it. I'll also be using Cloudflare for DNS, but that's just my personal preference -- feel free to use another DNS provider.

Finally, you'll need a Plex server already set up. (And I'll assume it's running in Linux or as a Docker container.) I won't go into how to do that here, <a href="/blog/setting-up-plex-in-docker/" target="_blank" umami-data-event="expose-plex-tailscale-to-setup-plex">see this post</a> for instructions on running Plex as a Docker container.

## Create OCI account

We'll be using a free-tier VM from Oracle Cloud Infrastructure (OCI) -- specifically, an E2 Micro instance which runs on a single-core AMD OCPU, has 1 GB of memory and a 0.48 Gbps connection, more than enough for streaming even 4K content through Plex. You can run *TWO* of these VMs **totally free**.

> In addition to two AMD E2 Micro instances, the OCI free tier includes one Ampere A1 Flex instance with up to 4 Arm OCPUs, up to 24 GB of memory, and a connection of 1 Gbps per OCPU. (These are the total limits, you can also split it with two A1 Flex instances with 2 OCPUs and 12 GB of memory, or 4 OCPUs with 6 GB of memory each, etc.)
>
> It may be preferable to use the A1 Flex instance for this instead of the E2 Micro if you want faster connection for more concurrent remote streams, if sharing your library with more than 1 or 2 users. However, you will most likely encounter an "out of capacity" error when trying to provision an A1 Flex instance of any shape and configuration, but if you upgrade your free tier account to Pay As You Go, the errors will disappear. I have confirmed this myself by upgrading my account. Just be sure to stay within the free limits noted above if you do this!

First, go to <a href="https://www.oracle.com/cloud/free/" target="_blank" umami-data-event="expose-plex-tailscale-oci-free">Oracle Cloud's website</a> and click **Start for free** to create your account. You will need a credit card, but only for verification purposes! As long as you stick to *free tier* and don't upgrade, you won't be charged.

Once your account is set up you'll receive an email with the **Cloud Account Name** (which is your "tenant") and **Username**. (The email you used to sign up.) You'll need the Count Account Name to <a href="https://www.oracle.com/cloud/sign-in.html" target="_blank" umami-data-event="expose-plex-tailscale-oci-signin">sign-in to OCI</a>, after which you'll be asked for the email address and password.

> You'll be asked if you want to **Enable Secure Verification (MFA)** which I strongly suggest you do. You'll need a USB security key or to download and use the Oracle Authenticator app. It's annoying to have to use another Authenticator app, but it's worth the peace of mind.

## Create a compute instance

Once you're signed in to OCI, you'll be at the Get Started page. Click on **Instances** under the Service Links.

On the next page, look for **Compartment** on the sidebar, and choose your Cloud Account Name from the dropdown menu.

Click the **Create instance** button and do the following:

1. Name your instance to whatever you want. (Or leave the default generated name if you prefer.)

2. Under the _Placement_ section, just leave it default. Note that Ampere A1 instances can use any availability domain, while AMD E2 instances can only be created on the AD 3 availability domain. It should automatically default to the right one depending on your Shape choice, so you can ignore this.

3. Scroll down to _Image and shape_. The default image is _Oracle Linux 9_ and the default shape is _VM.Standard.A1 Flex_ -- as explained above, this shape is nearly impossible to get and is almost always "out of capacity." You can upgrade your Oracle account to Pay As You Go to make it accessible, but we'll just go with _E2.1.Micro_ instead which is also free-tier and is always available.

4. First, if you don't want to use Oracle Linux, click on **Change image** and choose a different one. I suggest _Ubuntu_, click on it and then choose the image name **Canonical Ubuntu 24.04 Minimal**, this is the latest version of Ubuntu and minimal means no extra bloat. (If using the Ampere A1 Flex shape, make sure you choose an image that says aarch64, since Ampere instances uses Arm CPUs -- for E2.1.Micro which uses an AMD CPU, you need to choose an image that doesn't say that.)

![Choosing an Image while creating a compute instance in OCI.](../../img/blog/oci0.png 'Choosing an Image while creating a compute instance in OCI')

5. By choosing the Ubuntu 24.04 Minimal image, it should have automatically changed the shape to _VM.Standard.E2.1.Micro_ -- if it did not, click on **Change shape** and choose it. Also, make sure _Instance type_ is **Virtual machine** and NOT bare metal. Click on the **Select shape** button to confirm your choice.

![Choosing a Shape while creating a compute instance in OCI.](../../img/blog/oci00.png 'Choosing a Shape while creating a compute instance in OCI')

> If provisioning an Ampere A1 instance, click on the arrow to the left of the Shape name to change the number of OCPUs and amount of memory -- remember, the Ampere A1 free-tier includes 4 OCPUs and 24 GB of memory -- when you increase the OCPU, it will also increase the memory automatically. Make sure you don't go over these free limits!

6. Leave the rest of the options as-is and click on the **Next** button at the bottom-right.

7. Under the _Security_ section, read what it says and make your choice. Personally I always leave the toggle for Shielded instance at OFF. The toggle for Confidential computing will always be grayed out because free-tier shapes don't support it. Click on the **Next** button at the bottom-right.

8. Under the _Networking_ section, you can customize your VNIC name, subnet, IP addresses, etc. Or just leave it all to be automatically assigned as is the default, I usually do.

9. Scroll down to _Add SSH keys_. You can upload your own public key, or you can let it generate a key pair for you, which is the default. If you choose the default option, **make sure you download the public and private keys**, you'll need them to SSH into the VM! When done, click on the **Next** button.

![SSH key settings when creating a compute instance in OCI.](../../img/blog/oci-ssh.png 'SSH key settings when creating a compute instance in OCI')

10. Under the _Storage_ section, I just leave everything as default. A 46.6 GB boot volume is automatically included with the instance, but if you want it to be a larger size, turn on the toggle and choose a larger size. Note that the free-tier limit is 200 GB, which is shared between ALL instances, so be sure not to go over this! I usually just leave this as default. (I also never mess with the Boot Volume Performance and suggest you don't either, unless you know what you're doing.)

11. If you've made a _Block volume_ separately (this also falls under the combined 200 GB of space for all instances) you can attach it here. I don't use block volumes, and it's not necessary for our purposes here, so just leave it alone. Click on **Next**.

12. Under the _Review_ section, you'll see all the details of your choices made thus far. If everything looks good, click on the **Create** button at the bottom-right.

Once the instance is fully provisioned and shows **Running**, you're good to go. Click on it and look for **Public IPv4 address**, take note of this!

## SSH into instance

We'll assume you generated a key pair and downloaded the private key to your Downloads folder. In your Linux terminal, or if using Windows in Powershell or Windows Terminal, use the following command: (Obviously, use the correct filename of your SSH key, it'll have the date you created it on in the name. You can rename this key file if you want.)

```bash
ssh -i ~/Downloads/ssh-key-2024-01-30.key ubuntu@<Instance Public IP>
```

For the future, you should create or edit the `~/.ssh/config` file, and add in something like the following:

```bash
Host oracle
    HostName <Instance Public IP>
    IdentityFile ~/Downloads/ssh-key-2024-01-30.key
    User ubuntu
```

Once you're in, let's make sure everything is up-to-date.

```bash
sudo apt update && sudo apt upgrade -y
```

We're done in the Oracle instance for now, but we'll be back soon.

## Set up Tailscale

Go to the <a href="https://tailscale.com" target="_blank" umami-data-event="expose-plex-tailscale-site">Tailscale website</a> and create an account. This will create your <a href="https://tailscale.com/kb/1136/tailnet" target="_blank" umami-data-event="expose-plex-tailscale-docs-tailnet">Tailnet</a> (private mesh network for all your Tailscale-connected devices) with your newly created account as the Owner and which you'll manage through the web-based <a href="https://login.tailscale.com/admin" target="_blank" umami-data-event="expose-plex-tailscale-admin-console">admin console</a>.

Once you've got the account ready, use the following command in **both** the server where you're running Plex and the Oracle instance:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

Once it's finished installing, use the command `sudo tailscale up` on both your server and the Oracle instance, go to the provided URLs and login to add both machines to your tailnet. Now go to the Tailscale admin console and you should see them both there.

Note that each machine running Tailscale has a unique Tailscale IP and hostname. We'll need these later.

## Configure DNS in Tailscale

On the _admin console_ go to the **DNS** tab.

First, notice the _Tailnet name_ is something auto-generated like `tailfe8c.ts.net`. You can keep this if you want, but instead we'll change it to a "fun name" that is more human-readable and easier to remember. You can't just type one in, you choose from ones generated by Tailscale.

Click the **Rename tailnet...** button and follow the prompts. You can keep reloading until you find a fun name you like. For future examples, we'll assume your tailnet name is `cyber-sloth`.

Scroll down to the end of the page and click the **Enable HTTPS** button. Now we can provision TLS certificates for machines in your tailnet, so that you can reach them at `https://<name>.cyber-sloth.ts.net`.

In the terminals for each machine -- the Plex server and the Oracle instance -- use this command to generate the certificates:

```bash
sudo tailscale cert <name>.cyber-sloth.ts.net
```

From here on out we'll assume the Plex sever is `plex.cyber-sloth.ts.net` and the Oracle instance is `oracle.cyber-sloth.ts.net`.

## Add and configure domain in Cloudflare

Create your <a href="https://dash.cloudflare.com/sign-up" target="_blank" umami-data-event="expose-plex-tailscale-cf-signup">free Cloudflare account</a> if you haven't already. **If you bought a domain on Cloudflare, you can skip to the next section since it is auto-configured already.** If your domain is from another registrar, we'll need to add it to Cloudflare:

1. On the Cloudflare dashboard _Account Home_, click the **+ Add a domain** button.

2. Enter your domain, leave _Quick scan for DNS records_ selected, and click **Continue**.

![Adding a domain to Cloudflare.](../../img/blog/cloudflare-domain.png 'Adding a domain to Cloudflare')

3. Click on the **Free plan** at the bottom and click **Continue**.

![Cloudflare free plan.](../../img/blog/cloudflare-free.png 'Cloudflare free plan')

4. You'll see your DNS records, if there are any. Don't worry about this right now and click on the **Continue to activation** button.

![DNS management page.](../../img/blog/cloudflare-dns-records1.png 'DNS management page')

5. You'll see a pop-up window saying you should set your DNS records now, click on **Confirm**.

![Add DNS records pop-up.](../../img/blog/cloudflare-dns-records2.png 'Add DNS records pop-up')

6. Now you'll be provided some instructions to update the nameservers on your domain's registrar, _open a new tab and follow those instructions_. Once you've added the Cloudflare nameservers at your registrar, go back to Cloudflare and click on **Continue**.

7. Now you'll have to wait a few minutes for the changes to propagate, then click on **Check nameservers** and reload the page. If it's still shows _Pending_ next to the domain at the top, just keep waiting and reload again after a few more minutes.

<div id="skip" />

Once the domain is _active_ in Cloudflare, we just need to add a DNS record:

1. On the sidebar go **DNS** and click on **Records** from the dropdown.

2. Click on **Add record**.

3. For _Type_ choose **A** from the dropdown menu.

4. For _Name_ type in `your-domain.com`.

5. For _IPv4 address_ type in **the Oracle instance public IP**.

6. Under _Proxy status_ toggle it off to **DNS only**.

![Cloudflare proxy status set to DNS only.](../../img/blog/expose-plex-tailscale-vps1.png 'Cloudflare proxy status set to DNS only')

> Make sure **NOT** to leave it proxied. If you do, all traffic will go through Cloudflare's CDN which we do not want. We're only using Cloudflare to resolve our domain to the IP of the Oracle instance, nothing more!

7. Leave _TTL_ at Auto and click **Save**.

Next, we need to create an _API token_ to edit the DNS config from third-party apps, which is necessary to get a TLS certificate in the reverse proxy later.

1. On the Cloudflare dashboard _Account Home_, choose your domain.

2. In your _domain overview_, in the column on the right side of the page, scroll down to _API_ and click on **Get your API token**.

3. Click the **Create Token** button. The first template should be _Edit zone DNS_, click the **Use template** button next to it.

![Choosing the Edit Zone DNS template.](../../img/blog/cloudflare-api-token1.png 'Choosing the Edit Zone DNS template')

4. Under _Permissions_, leave the first entry as is, click on **+ Add more**.

5. For the new Permission, choose in order from the dropdown menus **Zone**, **Zone** and **Read**.

![Adding the Zone, Zone, Read permissions to API token.](../../img/blog/cloudflare-api-token2.png 'Adding the Zone, Zone, Read permissions to API token')

6. Under _Zone Resources_, leave the first two dropdown menus as is, and in the final dropdown all the way to the right, **select your domain**. Scroll past everything else,without changing anything else, click on **Continue to summary**, and finally on the **Create Token** button.

![Selecting the Zone Resources for API token.](../../img/blog/cloudflare-api-token3.png 'Selecting the Zone Resources for API token')

17. On the next page you'll see your **API token**, make sure to _save it somewhere because it will not be shown again_. We will need this **API token** to provision the TLS certificates in Nginx Proxy Manager.

## Install reverse proxy on Oracle instance

Back in the Oracle compute instance, we'll be setting up Docker to run **Nginx Proxy Manager**. If you know what you're doing, feel free to use whatever reverse proxy you like, and run it however you like.

SSH into the instance and install Docker with the following command:

```bash
curl -fsSL https://get.docker.com | sh
```

We'll use `docker compose` to run the reverse proxy container.

1. Create the data directory for the reverse proxy and change into it with `mkdir ~/nginxproxy && cd ~/nginxproxy` (This assumes you're using the default `ubuntu` user.)

2. Create the compose file with `nano compose.yaml` and copy the below into it:

```yaml
services:
  nginxproxy:
    image: docker.io/jc21/nginx-proxy-manager:latest
    container_name: nginxproxy
    volumes:
      - /home/ubuntu/nginxproxy:/data
      - /home/ubuntu/nginxproxy/letsencrypt:/etc/letsencrypt
    ports:
      - 80:80
      - 81:81
      - 443:443
    restart: always
```

3. Save and close the file, then install and run the container with `docker compose up -d`

Once it's up and running, we need to access the Nginx Proxy Manager GUI, but for that we'll need to open some ports on the instance to be accessible from your IP address.

> Alternately, you can install Tailscale on your PC or tablet, then while it's connected to Tailscale go to `https://oracle.cyber-sloth.ts.net:81`. This way you can just use Tailscale to access the web UI of Nginx Proxy Manager and any other apps you decide to run, without having to add ingress rules for those ports.

## Add ingress rules on OCI

Connecting to the Oracle instance from the internet in any way requires adding _ingress rules_ in the OCI dashboard. (Port 22 is the only default ingress rule so that you can access the instance via SSH.) You have two options here:

- Allow access from the entire internet and setup authentication to block anyone that shouldn't have access. (I won't be covering this, though.)

- Allow access only from specific IPs, including yours, and block everyone else. (If they go to your domain they will get a 403 error.) **I strongly suggest this.**

Under _Instances_, click on your instance, and under _Instance details_ click on the link for Virtual Cloud Network, it should be something like `vcn-20221216-2035`.

![Instance details in OCI.](../../img/blog/oci1.png 'Instance details in OCI')

In _Subnets_ click on the only choice, something like `subnet-20221216-2035`. Finally, click on the **Default Security List**.

![Default Security List in OCI.](../../img/blog/oci2.png 'Default Security List in OCI')

We'll add ingress rules to allow your IP to access ports `81` (so you can reach the Nginx Proxy Manager web UI), `80` and `443`.

1. Click **Add Ingress Rules**

![Adding an Ingress Rule to an OCI instance.](../../img/blog/oci3.png 'Adding an Ingress Rule to an OCI instance')

2. Leave the source type as CIDR.

3. Under _Source CIDR_ type in your IP address in this format: `123.45.678.90/32`.

> If you need to find out your public IP address, just go to <a href="https://icanhazip.com" target="_blank">icanhazip.com</a>.

4. Leave the _IP Protocol_ as **TCP**.

5. Leave the _Source Port Range_ as **All**.

6. Set the _Destination Port Range_ to `81`.

7. Click on **+ Another Ingress Rule**, do the same as above, but use `80` as _Destination Port Range_.

8. Click on **+ Another Ingress Rule** and repeat one more time for `443` as _Destination Port Range_.

Repeat the above steps for to open ports `80` and `443` for **each** IP address you want to allow remote access to Plex. You want to have ingress rules that allow each of your remote users to access both ports, for both HTTP and HTTPS connections.

Now we can access the Nginx Proxy Manager web UI and create our proxy host.

## Add proxy host in Nginx Proxy Manager

You should now be able to reach the Nginx Proxy Manager web UI by going to `http://your-domain.com:81`. Login with the default `admin@example.com` and `changeme` as the password. You'll want to change that before anything else.

![Nginx proxy manager login page.](../../img/blog/nginxproxy1.png 'Nginx proxy manager login page')

Click on **Users** on the top nav bar, then to the right of the Administrator entry click the **three dots**. Choose **Edit Details** to change the email and **Change password** to change password. Log out and back in with the new credentials.

![Nginx proxy manager navigation.](../../img/blog/nginxproxy2.png 'Nginx proxy manager navigation')

Now to create a proxy host and provision the TLS certificate:

1. On the Dashboard, click **Proxy hosts** and then **Add proxy host**.

![Adding a proxy host in Nginx proxy manager.](../../img/blog/nginxproxy3.png 'Adding a proxy host in Nginx proxy manager')

2. Type in `your-domain.com` under Domain Name.

3. Leave the Scheme as **http**.

4. Type in `plex.cyber-sloth.ts.net` under **Forward Hostname/IP**.

5. Type in `32400` under **Forward Port**.

6. Toggle on **Websockets Support** and **Block Common Exploits**, but leave caching off.

![Configuring SSL in Nginx proxy manager.](../../img/blog/nginxproxy4.png 'Configuring SSL in Nginx proxy manager')

7. Go to the **SSL** tab and choose **Request a new SSL Certificate** from the dropdown menu.

8. Enable only the toggles for **HTTP/2 Support** and **Use a DNS Challenge**.

9. Choose **Cloudflare** as DNS Provider from the dropdown menu.

10. In the credentials file content, delete the numbers after `dns_cloudflare_api_token=` and add in your **API token** instead.

11. Type in your email address and enable the toggle to agree to the Let's Encrypt TOS, and click **Save**.

Give it a minute or two for Let's Encrypt to provision the TLS certificate, and the proxy host will then be created. If you added ingress rules for your IP to access ports 80 and 443, you should now be able to reach the Plex web UI at `https://your-domain.com`. Almost done!

## Configure the Plex server

Already anyone you share your library with can access it by going to `https://your-domain.com`, but this way they can only play media on a browser. Let's also let them play your shared media from Plex apps on their phones, smart TVs, and other devices.

1. On the Plex web UI, go to **Settings** by clicking on the _wrench icon_ at the top-right.

2. On the sidebar, scroll down to **Settings** and click **Network**.

3. Next to _Secure connections_, choose **Preferred** from the downdown menu.

![Secure connections setting in Plex.](../../img/blog/expose-plex1.png 'Secure connections setting in Plex')

4. (Optional) Scroll down and **enable** the checkbox for _Treat WAN IP as LAN Bandwitdh_.

5. Make sure to **leave disabled** the checkbox for _Enable Relay_.

![Relay and Custom access URL settings in Plex.](../../img/blog/expose-plex2.png 'Relay and Custom access URL settings in Plex')

6. Under _Custom server access URLs_ type in `https://your-domain.com`. (Make sure to include the HTTPS!) As a backup, you may also want to add your Tailscale IP as `http://100.200.300.400:32400`. (I leave it as HTTP in case sometimes a secure HTTPS connection is not possible, since I trust the IPs and devices connecting.)

7. At the bottom of the page, click the **Save changes** button. Now that apps can connect, let's finally share the library with someone!

8. Go back to _Settings_ and click on **Manage Library Access**.

![Managing library access in Plex.](../../img/blog/plex-library-access1.png 'Managing library access in Plex')

9. Click on **Grant Library Access** and type in your friend's email address, and click on it under _Search Result_. (If they already have a Plex account, there will be a green checkmark.) Then click **Continue**.

10. Now click on the checkmarks for the libraries you want to share, or click on the checkmark next to your server name to share all libraries. Then click **Continue**

![Choosing libraries to share in Plex.](../../img/blog/plex-library-access2.png 'Choosing libraries to share in Plex')

11. On this final page, click **Send**. If you have Plex Pass, you'll get additional options to add the user to your Plex Home (not necessary in our case), allow downloads, and also setup more fine-grained restrictions. You can ignore these options if you want.

![Plex Pass options when sharing libraries.](../../img/blog/plex-library-access3.png 'Plex Pass options when sharing libraries')

Now your friend will get an email invitation and once accepted they'll be able to access your Plex library both from their apps and by going straight to your domain on a browser to reach the web UI.

Once your friend starts streaming, they'll show up on your Plex dashboard under the Tailscale IP of the Oracle VM, and it will be considered a local IP. See the screenshot below and notice the `100.x.x.x` IP.

![Plex dashboard showing Tailscale IP as local client.](../../img/blog/plex-dashboard-streams.png 'Plex dashboard showing Tailscale IP as local client')

> If you have an active Plex Pass subscription, or the users you're sharing library with have an active Remote Watch Pass subscription, then you're done. The user you've shared library to should be able to access your Plex library. _However, without Plex Pass additional configuration is required, as detailed below._

## Using the Plex server as subnet router and exit node

As explained above, the following is required in order for this to work _without a Plex Pass or Remote Watch Pass subscription_. If you do have Plex Pass, or the users you're sharing with have Remote Watch Pass, then this isn't necessary.

First, in order to use either subnet routing or exit node, you need to enable IP forwarding on the server. (This is straight from the <a href="https://tailscale.com/kb/1019/subnets" target="_blank" data-umami-event="tailscale-post-docs-subnet">Tailscale docs</a>.)

If your machine has an `/etc/sysctl.d` directory (which most likely it does) then use these commands:

```sh
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
```

If your machine does NOT have the directory (`ls /etc/sysctl.d` returns `No such file or directory`) then instead use these commands:

```sh
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p /etc/sysctl.conf
```

Also, if you are running `firewalld` on your server, you should allow masquerading with the following command:

```sh
sudo firewall-cmd --permanent --add-masquerade
```

Now we'll advertise both the subnet routes and the exit node with this command: (This assumes your local IP addresses are `192.168.0.x`, make sure to use the appropriate subnet for your LAN!)

```sh
sudo tailscale up --advertise-routes=192.168.0.0/24 --advertise-exit-node
```

Now go to the admin console, on the **Machines** tab, and do the following:

1. Click the three dots to the right of the machine want you want to use as subnet router. (Notice the `subnets` tag.)

2. Choose **Edit route settings...** from the dropdown menu.

3. Click both checkboxes for **Subnet routes** and **Use as exit node**, then click the **Save** button to finish.

![Enabling subnets in Tailscale admin console.](../../img/blog/tailscale-subnets.png 'Enabling subnets in Tailscale admin console')

![Enabling exit node in Tailscale admin console.](../../img/blog/tailscale-exit-node.png 'Enabling exit node in Tailscale admin console')

Now, we have to set the Oracle VM to use your Plex server as exit node. SSH into it and use the following command in the terminal:

```sh
sudo tailscale up --exit-node=<ip or machine name>
```

## References

- <a href="https://tailscale.com/kb" target="_blank" umami-data-event="expose-plex-tailscale-docs">Tailscale Docs</a>
- <a href="https://developers.cloudflare.com/dns" target="_blank" umami-data-event="expose-plex-tailscale-cf-docs-dns">Cloudflare Docs - DNS</a>
- <a href="https://docs.oracle.com/en-us/iaas/Content/Compute/home.htm" target="_blank" umami-data-event="expose-plex-tailscale-oci-docs-compute">OCI Docs - Compute</a>