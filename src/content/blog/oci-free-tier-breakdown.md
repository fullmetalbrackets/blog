---
title: Breaking down the free tier of Oracle Cloud Infrastructure
description: Oracle Cloud Infrastructure, or OCI for short, has a very generous free tier, but I see a lot of people on the oraclecloud and selfhosted subreddits being confused about exactly what's included, so here is a straightforward breakdown of every service and allotment in the free tier.
pubDate: 2026-01-06
tags:
 - oracle cloud
 - self-hosting
related1: expose-plex-tailscale-vps
---

## Free what now?

Oracle Cloud Infrastructure, or OCI for short, has a free trial that includes a $300 credit for 30 days, comparable to other cloud providers. (Though some competitors offer less credit, or don't have a 30-day time limit in which to use it. It varies by provider, I will write a post comparing them at some point.)

However, aside from the credits to use towards their paid services, OCI also includes a substantial **always-free tier** that may surprise you with how much it offers.

> This information is all taken straight from Oracle's website. You can confirm all of this yourself by [going to this page on Oracle's website](https://www.oracle.com/cloud/free/), scrolling down to the filters, and checking the box under _Tier Type_ for **Always Free** -- this will then show basically all the same information that's in this post, minus my explanation/thoughts.
>
> You can also check out the [Free Resources section of the OCI documentation](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) for additional details.

## AMD Compute Instances

_AMD based Compute VMs with 1/8 OCPU and 1 GB memory each_

_Always Free: 2 AMD based compute VMs_

The two AMD-based VMs referenced here are `VM.Standard.E2.1.Micro`, but aren't these 1 OCPU? What does 1/8 OCPU mean??

Essentially, the E2 Micro instances are _burstable virtual machines_, meaning they have a low baseline (1/8th or 12.5% of a physical core) for steady workloads that will temporarily "burst" up to 100% of a full physical core (what they call an OCPU) when necessary to handle spikes in demand for processing power, after which it will wind back down to the baseline.

## Arm Compute Instance

_Arm-based Ampere A1 cores and 24 GB of memory usable as 1 VM or up to 4 VMs_
_Always Free: 3000 OCPU hours and 18,000 GB hours per month_

This is the thing that gets everyone interested in OCI's free tier -- the `VM.Ampere.A1.Flex`, a VM with multiple cores and a good amount of memory, plus additional bandwidth to boot. Oracle's description is pretty clear -- up to 4 OCPUs and 24 GB memory, either all in one instance or spread out across up to four instances. (It's flexible.) But what about the hours thing?

What it means is that Ampere VMs have a limit of 3,000 hours of compute time and 18,000 GB-hours of memory usage _per month across all Ampere VMs_. These limits are made specifically so that it's impossible to go over them _unless you use more than 4 OCPUs/24 GB memory_. Let's check the math.

```
4 OCPUs * 24 hrs * 31 days = 2976 hours of compute per month

744 hrs per month * 24 GB memory = 17,856 GB-hours of memory usage per month
```

So in a set up where you have one Ampere instance with the maximum resource of 4 OCPUs and 24 GB memory, or where you're sharing those resources between two or four instances, you remain within the free tier limits.

> It's important to note that in most regions, attempting to provision an Ampere A1 instance is nearly impossible and almost always results in **out of capacity errors**. (Unless you're trying in a region that actually has capacity, or you're just very lucky.)
>
> The most surefire way of being able to provision Ampere VMs is to _switch to a Pay As You Go account_ with OCI. You'll need to provide a valid credit card, and there will be a temporary $100 charge to verify it is valid, but then the charge goes away.
>
> Switching to PAYG does not negate the always free resources, but the guardrails will be removed and you'll be billed if you use anything that is NOT part of the always free tier, so you will have to be extra careful.

## APEX

_Build, integrate, and innovate with the industry-favorite low-code application platform_

_Always Free: 744 hours per instance_

APEX (Application Express) is Oracle's low-code platform for building apps with with a drag-and-drop interface. Honestly I've never touched this thing and had to look it up. Pretty generous free offering for someone looking to low-code a website for their small business. 744 hours free per month means it's impossible to overuse this and be billed for it.

## Flexible Network Load Balancer

_The Network Load Balancer service provides automated traffic distribution from one entry point to multiple servers in a backend set. Network load balancers ensure that your services remain available by directing traffic only to healthy servers based on Layer 3/Layer 4 (IP protocol) data._

_Always Free: 1 instance_

Pretty self-explanatory, this will be handy if you're looking to build a scalable SaaS on OCI.

## Load Balancer

_The Load Balancer service allows you to create highly available load balancers within your VCN. All load balancers come with provisioned bandwidth._

_Always Free: 1 instance, 10 Mbps_

Different product from the above, this service provides automated traffic distribution from one entry point to multiple servers reachable from your virtual cloud network (VCN), of which you get two in the free tier as you'll see further below.

## Outbound Data Transfer

_Always Free: Up to 10 TB per month_

Up to 10 TB of data egress per month across all cloud services is very generous when compared to other cloud providers, especially when you consider ingress is totally free and unlimited.

In theory you could bring in a large dataset, build out your apps and test them on OCI, then transfer everything to another cloud provider when you're ready for production as long as you don't egress more than 10 TB in one month. Or you can just run your apps in Oracle and only pay for egress over the 10 TB monthly.

This 10 TB limit also applies to websites hosted on OCI, making it a good choice for a content-heavy website, as there's not many webhosts or VPS providers that give you 10 TB of bandwidth for free.

## Service Connector Hub

_Service Connector Hub is a cloud message bus platform that offers a single pane of glass for describing, executing, and monitoring interactions when moving data between Oracle Cloud Infrastructure services._

_Always Free: 2 service connectors_

This goes hand-in-hand with other free goodies listed below for building out multiple apps so that you can get unified logging and observability in one place.

## Site-to-Site VPN

_Provides a site-to-site IPSec connection between your on-premises network and your virtual cloud network (VCN)._

_Always Free: 50 IPSec connections_

You can use site-to-site VPN to create secure connections between your on-prem hardware and any resources on OCI's cloud, or if you're a homelabber looking to extend your footprint into the cloud.

50 free connections is really good and with OCI's 10 TB/month of free outbound data and unlimited inbound data, those 50 connections have a lot of bandwidth.

## VCN Flow Logs

_The Networking service offers VCN flow logs that show details about traffic that passes through your VCN. They help you audit traffic and troubleshoot your security lists._

_Always Free: Up to 10 GB per month shared across OCI Logging services_

I didn't even realize this was included for free until I started writing this post. If you're building an app or website that will have a lot of users, this will allow you to collect very detailed analytics on your network traffic, including which IPs were allowed to connect and which were rejected based on your security lists, with pretty graphs for visualizing trends.

## Virtual Cloud Networks (VCNs)

_Software-defined network that you set up in the Oracle Cloud Infrastructure data centers in a particular region . A subnet is a subdivision of a VCN._

_Always Free: 2 VCNs, includes IPv4 and IPv6 support_

Anything running on OCI will need to use a VCN for networking. Each VCN is essentially it's own separate network. You can have many resources on one VCN, or you can have two separate VCNs with their own resources isolated from each other.

## Application Performance Monitoring

_Application Performance Monitoring provides a comprehensive set of features to monitor applications and diagnose performance issues._

_Always Free: Up to 1000 tracing events and 10 Synthetic Monitoring runs per hour_

This is a suite of observability tools to monitoring apps built in OCI and trace any issues in complex cloud to their point of origin. I haven't used this, so I can't say much else about it.

## Email Delivery

_The Email Delivery service provides a fast and reliable managed solution for sending secured, high-volume marketing and transactional emails._

_Always Free: Up to 100 emails sent per day_

This sounds pretty good for a marketing campaign or newsletter, and any emails over the free hundred only cost $0.085 per 1,000 emails sent.

## Logging

_The Logging service provides a highly scalable and fully managed single pane of glass for all the logs in your tenancy._

_Always Free: Up to 10 GB per month_

You can store up to 10 GB of logs per month, and any amount over 10 GB is billed at $0.05 (five cents) per GB. That's a lot of logs.

## Monitoring

_Use the Monitoring service to query metrics and manage alarms. Metrics and alarms help monitor the health, capacity, and performance of your cloud resources._

_Always Free: Up to 500 million ingestion datapoints, 1 billion retrieval datapoints_

I haven't run anything on OCI worth monitoring, nor do I plan to build out some complex application, but this seems very generous to me.

## Notification

_The Notifications service lets you know when something happens with your resources in OCI. Using alarms, event rules, and service connectors, you can get human-readable messages through supported endpoints, including email and text messages (SMS)._

_Always Free: Up to 1 million sent through https per month, 1000 sent through email per month_

Another thing I didn't even realize was included in the free tier before writing this. I use Uptime Kuma on my home server to monitor uptime on my OCI instances, but I be looking into using Oracle's built-in notifications instead.

## Autonomous Database

_Oracle Autonomous Transaction Processing, Autonomous Data Warehouse, Autonomous JSON Database, or APEX Application Development._

_Always Free: Up to Two databases total_

Part of Oracle's free database offerings, essential if building any apps that need an [ACID](https://en.wikipedia.org/wiki/ACID)-compliant database.

## HeatWave

_Automated and integrated generative AI and machine learning in one cloud service for transactions and lakehouse-scale analytics._

_Always Free: One standalone HeatWave instance in OCI in your home region, along with up to 50 GB of storage and up to 50 GB of backup storage_

I don't really know what this does, but if you're going to be building an app using LLMs, this might be up your alley.

## NoSQL Database

_NoSQL is a fully managed database cloud service that offers predictable low latency, dynamic scalability, high performance, and reliable data storage for document, key-value, and fixed-schema data._

_Always Free: Up to 133 million reads per month, 133 million writes per month, 25 GB storage per table, up to 3 tables_

You get one NoSQL database, but three tables for free. Not bad.

## Console Dashboards

_The Console Dashboards service allows you to create custom dashboards in the OCI Console to monitor resources, diagnostics, and key metrics for your tenancy._

_Always Free: Up to 100 dashboards_

Yet another free thing I don't use, but it's nice to have. Who would ever need 100 dashboards?!

## Bastions

_OCI's Bastion service provides restricted and time-limited Secure Shell Protocol (SSH) access to target resources that don't have public endpoints._

_Always Free: Up to 5 OCI Bastions_

SSH Bastions are good for security if you have multiple VMs and other resources that you don't want to publically expose. Five of them seems excessive, so this is a pretty good free benefit.

## Certificates

_The Certificates service provides certificate issuance, storage, and management capabilities, including revocation and automatic renewal._

_Always Free: Up to 5 Private CA and 150 private TLS certificates_

I don't make use of this myself, I just get my TLS certificates from Cloudflare through a DNS challenge, but this might be of interest to homelabbers...

## Vault

_OCI Vault is a key management service that stores and manages master encryption keys and secrets for secure access to resources._

_Always Free: Up to 20 key versions of master encrytion keys protected by a hardware security module (HSM) and 150 Always Free Vault secrets_

Always secure your app secrets and keep your encryption keys secret, no matter what platform or circumstance. Oracle Vault is a solid choice for secrets management if your apps are on OCI.

## Archive Storage

_Unstructured storage - archive_

_Always Free: Up to 20GB total for standard, infrequent and archive_

This is long-term storage for infrequently-accessed data, Oracle's equivalent to AWS Glacier and similar offerings from other cloud providers. It's important to note that the 20 GB allotment is shared with object storage. [See here](https://docs.oracle.com/en-us/iaas/Content/Object/Concepts/understandingstoragetiers.htm) for details on OCI storage tiers.

Archival storage is subject to the 10 TB/month free egress, and like Oracle's other offering, all ingress is free and unlimited. Going over the 20 GB storage limit will incur a charge of $0.0026/GB per month, which is pretty damn cheap.

## Block Volume Storage

_Boot and block volume storage_

_Always Free: Up to 2 block volumes, 200 GB total. Plus 5 volume backups._

The free tier includes 200 GB of combined boot volume and block volume storage,
across all VMs, whether they are E2 Micro and Ampere A1. When you create a VM, the default boot volume size is 50 GB, which counts towards the 200 GB allotment.

You can spread out the allotment, so that you have two E2 Micros with with 50 GB of storage a piece, plus 100 GB of storage on an Ampere A1. Or you can put all 200 GB of storage on just the Ampere A1 if you don't need the micro VMs.

## Object Storage

_Object Storage API requests_

_Always Free: Up to 50,000 Object Storage API requests per month_

OCI has S3-compatible object storage, which is subject to the 20 GB of storage allotment that is also used for Archival Storage. (It does not count toward the 200 GB of block volume storage, however.)

50k free API requests per month is really good for object storage, in my opinion.

## Object Storage - Infrequent Access and Standard

_Unstructured storage - infrequent access_ and _Unstructured storage - standard_

_Always Free: Up to 20GB total for standard, infrequent and archive_

The 20 GB allotment is shared with object and archival storage. Infrequent access costs less to store per month, but has a per-GB retrieval fee because it's in "cold" storage that has to be spun up when you want to access it.

Compare with standard object storage, which has no retrieval fee, but a higher storage cost per-GB per month. (This is all after the 10 TB of free outbound data.)

[See here](https://docs.oracle.com/en-us/iaas/Content/Object/Concepts/understandingstoragetiers.htm) for details on OCI storage tiers.

## References

- <a href="https://www.oracle.com/cloud/free/" target="_blank" umami-data-event="oci-breakdown-free-tier">Oracle Cloud Free Tier</a>
- <a href="https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm" target="_blank" umami-data-event="oci-breakdown-docs-compute">OCI Docs - Always Free Resources</a>
- <a href="https://docs.oracle.com/en-us/iaas/Content/Compute/home.htm" target="_blank" umami-data-event="oci-breakdown-docs-compute">OCI Docs - Compute</a>
