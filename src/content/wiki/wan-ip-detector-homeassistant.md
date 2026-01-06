---
title: "WAN IP Detector for Home Assistant"
description: Add this to Home Assistant comfiguration.yaml to 
crrare a sensor that detects your current WAN IP address.
pubDate: 2026-01-06
tag: snippet
---

```
command_line:
  - sensor:
      unique_id: wan_address
      name: WAN Address
      command: "wget -O - -q https://icanhazip.com" 
      scan_interval: 1800
      icon: mdi:ip
```