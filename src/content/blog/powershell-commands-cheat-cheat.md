---
title: 'PowerShell commands cheat sheet'
description: "I'm much more comfortable using Bash over PowerShell, but there are definitely times that you need to use command line on Windows. So I keep a small, but growing list of my most commonly used cmdlets, their Linux-like aliases, and other must-know commands."
pubDate: 2022-10-09
tags: ['powershell', 'command line']
related1: customizing-windows-terminal-with-ohmyposh
related2: basic-linux-commands
---

## Cmdlets & Linux Equivalents

PowerShell cmdlets have aliases identical to their equivalent Linux commands, here's the most common:

| Command                        | Alias   | Effect                              |
| ------------------------------ | ------- | ----------------------------------- |
| `Get-Location`                 | `pwd`   | Show current directory              |
| `Set-Location`                 | `cd`    | Change to another directory         |
| `Get-Content`                  | `cat`   | Output contents of a file           |
| `New-item`                     | `touch` | Create a new file                   |
| `Copy-Item`                    | `cp`    | Copy a file                         |
| `Move-Item`                    | `mv`    | Move a file to new location         |
| `Remove-Item`                  | `rm`    | Delete a file                       |
| `Get-ChildItem`                | `ls`    | Output a list of directory contents |
| `New-Item -ItemType Directory` | `mkdir` | Create new directory                |

## Advanced Commands

| Command                   | Effect                                                         |
| ------------------------- | -------------------------------------------------------------- |
| `shutdown /r /fw /f /t 0` | Reboot into BIOS immediately                                   |
| `ipconfig /flushdns`      | Flush DNS resolver cache (do this when having DNS issues)      |
| `ipconfig`                | Display TCP/IP basic information (append `/all` for full info) |
| `getmac /v`               | List MAC addresses of all network adapters                     |
| `powercfg /energy`        | Power efficiency diagnostics report                            |
| `powercfg /batteryreport` | Battery life diagnostics report                                |
| `sfc /scannow`            | Scan system and repair any integrity violations                |
| `tasklist`                | List all running processes and their process IDs               |
| `taskkill /f /pid 12345`  | Kill a running task (specify process ID)                       |

## References

- <a href="https://learn.microsoft.com/en-us/powershell/?view=powershell-7.2" target="_blank">PowerShell Documentation</a>
