---
title: "Using a forwarding resolver in Pi-Hole for DNS over TLS"
description: "Configs necessary for Pi-Hole to use either Cloudflared or Unbound as forwarding resolver to Quad9 using DNS over TLS."
pubDate: 2023-07-27
tags:
  - pi-hole
---

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> The below forwarding addresses for <em>Quad9</em> provide malware blocking, DNSSEC, and are ECS-enabled. Check out <a href="https://www.quad9.net/service/service-addresses-and-features" target="_blank">all of Quad9's options</a>. Alternately you may consider using Cloudflare's `1.1.1.2` / `security.cloudflare-dns.com` which also supports DNSSEC and blocks malware.

## Unbound as forwarding resolver

Create file, copy & paste the below into it: `sudo nano /etc/unbound/unbound.conf.d/pi-hole.conf`

```bash
tls-cert-bundle: /etc/SSL/certs/ca-certificates.crt

forward-zone:
 name: "."
 forward-tls-upstream: yes
 # Quad 9
 forward-addr: 9.9.9.11@853#dns11.quad9.net
 forward-addr: 149.112.112.11@853#dns11.quad9.net
```

## Cloudflared as forwarding resolver

Copy & paste the below into a `compose.yaml` then use `docker compose up -d` to create a fully-configured _cloudflared_ container.

```yaml
version: "3.6"

services:
  cloudflared:
    container_name: cloudflared
    image: cloudflare/cloudflared
    command: proxy-dns
    environment:
      - "TUNNEL_DNS_UPSTREAM=tls://9.9.9.9@853#dns.quad9.net,tls://149.112.112.112@853#dns.quad9.net"
      - "TUNNEL_DNS_PORT=853"
      - "TUNNEL_DNS_ADDRESS=0.0.0.0"
    restart: unless-stopped
```

### Related Articles

> [Set up Pi-Hole for network-wide ad blocking and Unbound for recursive DNS](/blog/set-up-pihole-on-linux/)

> [Using DNS over HTTPS with Pi-Hole and Cloudflared](/blog/using-dns-over-https-with-pihole/)