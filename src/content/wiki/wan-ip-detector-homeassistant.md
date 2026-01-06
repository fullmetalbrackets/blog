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

I used this to show my public IP on my dashboard, when I had a 
dynamic IP that changed every now and then.  I also used the 
below automation to notify my phone (via the Home Assistant 
companion app) when the IP changes.

```
alias: Notify when Public IP changes
description: ""
triggers:
  - trigger: state
    entity_id:
      - sensor.wan_address
    not_from:
      - unknown
      - unavailable
    not_to:
      - unknown
      - unavailable
conditions: []
actions:
  - action: notify.mobile_app_ariel_phone
    metadata: {}
    data:
      message: Public IP has changed to {{ states('sensor.wan_address') }}
  - action: notify.persistent_notification
    metadata: {}
    data:
      message: Public IP has changed to {{ states('sensor.wan_address') }}
mode: single
```