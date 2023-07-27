---
layout: "@layouts/Note.astro"
title: "URLs for DNS over HTTPS with public resolvers"
description: "List of URLs for setting up DNS over HTTPS with the public DNS resolvers available in Pi-Hole."
pubDate: "July 12, 2023"
tags:
  - Pi-Hole
---

<a href="https://pi-hole.net" target="_blank">Pi-Hole's</a> DNS settings have the public DNS resolvers built-in, but when using a forwarding resolver like `unbound` or `cloudflared` for DNS over HTTPS, you need hit the upstream's DoH backend for it to work. Below are the URLs to use for each of those public DNS resolvers.

- <a href="https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests" target="_blank">Cloudflare</a>: `https://cloudflare-dns.com/dns-query`
- <a href="https://developers.google.com/speed/public-dns/docs/doh" target="_blank">Google</a>: `https://dns.google/dns-query`
- <a href="https://support.opendns.com/hc/en-us/articles/360038086532-Using-DNS-over-HTTPS-DoH-with-OpenDNS" target="_blank">OpenDNS</a>: `https://doh.opendns.com/dns-query`
- <a href="https://dns.watch/#:~:text=DNS%2Dover%2DHTTPS%20(DoH)%20URI" target="_blank">DNS.WATCH</a>: `https://doh.opendns.com/dns-query`

<a href="https://www.quad9.net/news/blog/doh-with-quad9-dns-servers" target="_blank">Quad9</a> offers 3 flavors.

- Unsecured: `https://dns.quad10.net/dns-query` (But why would you use this one?)
- Secured with DNSSEC: `https://dns.quad9.net/dns-query` or `https://dns9.quad9.net/dns-query`
- DNSSEC with ECS support: `https://dns11.quad9.net/dns-query` (Best option.)

_Level3_ (I could not find a website for them) and <a href="comodo.come/secure-dns" target="_blank">Comodo</a> do not offer DNS over HTTPS, as far as I can tell. Comodo is for Enterprises and Managed Services Providers and it's free tier has a 300,000 limit on DNS requests per month, where as none of the others have any such limits that I know of.

## Additional public DNS resolvers not in Pi-Hole UI

- <a href="https://mullvad.net/en/help/dns-over-https-and-dns-over-tls/&cd=10&hl=en&ct=clnk&gl=us" target="_blank">Mullvad</a>: `https://adblock.doh.mullvad.net/dns-query` (with ad blocking) and `https://doh.mullvad.net/dns-query` (without ad blocking)
