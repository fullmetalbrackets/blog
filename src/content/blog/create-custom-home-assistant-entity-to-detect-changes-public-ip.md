---
title: Create a custom entity in Home Assistant to detect your public IP address and any changes to it
description: "When having a dynamic IP address that can change without you noticing, it can be handy to have a sensor you can add to your Home Assistant that shows the current IP and can be automated to send you notifications when it changes."
pubDate: 2026-05-13 12:00:00
tags: ['home assistant', 'code snippet']
related: ['setup-home-assistant-sweet-potato-debian', 'comprehensive-guide-tailscale-securely-access-home-network']
---


## Creating the sensor in Home Assistant

Unfortunately this can't be done through the Home Assistant web UI (to my limited knowledge, please correct me if I'm wrong), so you have to edit [the configuration.yaml file](https://www.home-assistant.io/docs/configuration/) for your Home Assistant instance.

I'm running Home Assistant in Docker, where I mapped it's directory to `~/docker/homeassistant`, which is the location for `configuration.yaml`. Open it in your text editor of choice, the copy and paste the below into the _buttom_ of the file, after any existing config. (And don't change anything else.)

```yaml
command_line:
 - sensor:
    unique_id: wan_address
    name: WAN Address
    command: 'wget -O - -q https://icanhazip.com'
    scan_interval: 1800
    icon: mdi:ip
```

Save and close the editor. You may want to [validate your configuration](https://www.home-assistant.io/docs/configuration/#validating-the-configuration) then go to your Home Assistant web UI. Navigate to _Settings_ -> _System_ and click on the _Power icon_ on the top-right to restart Home Assistant.

## Use the sensor on your dashboard

After Home Assistant has restarted, go to _Settings_ -> _Devices & services_ -> _Entities_ tab on the top and search for `WAN Address` -- you should see your new sensor as a Command Line integration. It's now available to use on your dashboards and in your automations.

I like to set up a little badge on my main dashboard that shows the current IP address, so I can see it at a glance. To do this, go to your dashboard, click on the _Pencil icon_ on the top right to edit the dashboard, click on the **+ Add badge** button, then choose **Entity**. Search for and choose `WAN Address`, edit the icon if you'd like, and click **Save**.

## Set up a notification to your phone or tablet via to the companion app

If you have the Home Assistant companion app running on your phone or tablet, you can create automations that send notifications to that device, no need for an external push notification service. You just need to be connected to your Home Assistant instance via the companion app, either by being on the same wireless network, or via Home Assistant Cloud or a VPN for remote connections. (I use [Tailscale](https://tailscale.com/) for this.)

Using the new WAN Adress sensor we created, we can set up an automation that sends a notification to the companion app when the WAN IP Address changes.

In the Home Assistant web UI, go to _Settings_ -> _Automations & Scenes_, then click on the button **+ Create automation**. Choose **Create new automation** from the choices that pop-up, then on _New automation_ page click on the **3 vertical dots** on the top-right and choose _Edit in YAML_.

Copy and paste the below into the editor:

```yaml
alias: Notify when Public IP changes
description: ''
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
 - action: notify.mobile_app_my_phone # use your actual device name
   metadata: {}
   data:
    message: Public IP has changed to {{ states('sensor.wan_address') }}
 - action: notify.persistent_notification
   metadata: {}
   data:
    message: Public IP has changed to {{ states('sensor.wan_address') }}
mode: single
```

When done, click on the **Save** button, name your automation, give it any other options you want (I like to have a Notifications category for these kinds of automations) and click **Save**.
