---
title: Fix for Nintendo Switch OLED not finding 5 GHz Wi-Fi networks
pubDate: 2026-04-23 12:00:00
description: In case you encounter this on your Nintendo Switch OLED, especially if it is a Japanese or Asian model, you need to use specific Wi-Fi channels on your router that the console can detect.
tags: ['gaming', 'networking']
---

## The issue

My wife had to replace her Nintendo Switch OLED and the replacement happened to be a Japanese model. It works mostly the same by just switching the langauge to U.S. English, but oddly enough it could not detect our 5 GHz wireless network.

## The fix

[This reddit post from 2017, the same year that the original Nintendo Switch came out, showed the solution.](https://reddit.com/r/NintendoSwitch/comments/5ycksg/psa_if_your_switch_can_find_your_5ghz_wifi_ssid/) Turns out the Japanese models can only detect Wi-Fi channels under _149_, but my router had it set to _157_.

On a browser navigate to your router's web UI, most likely at IP address `http://192.168.0.1` or `http://192.168.1.1`, and go to Wi-Fi settings. (Or possible wireless settings or internet settings.) Assuming your router has the option, you should find a _Wi-Fi channel_ or _wireless channel_ setting that you can change.

Apparently any channel _less than 149_ will do, I changed mine to **channel 36** based on comments and the Nintendo Switch OLED immediately saw the 5 GHz Wi-Fi as an available network.

> If you have ISP-provided hardware that you can't really interact with or change the options, you should try calling your ISP and asking them what channel your Wi-Fi is currently set to use, and ask them to change it to _channel 36_ or another _channel below 149_.

## References

- [This reddit post from 2017.](https://reddit.com/r/NintendoSwitch/comments/5ycksg/psa_if_your_switch_can_find_your_5ghz_wi-fi_ssid/)