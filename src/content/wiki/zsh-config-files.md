---
title: 'Zsh and Oh-My-Zsh configuration files'
description: 'Working copies of Zsh config files used on my Linux desktop and servers.'
pubDate: 2024-02-04
updatedDate: 2026-03-15
tag: technical notes
related: ['guide-to-zsh-ohmyzsh-plugins-and-theme']
---

![Oh My Zsh](../../img/blog/oh-my-zsh.png)

## Zsh configuration file

```bash
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

export ZSH="/home/ad/.oh-my-zsh"

ZSH_THEME="powerlevel10k/powerlevel10k"

ENABLE_CORRECTION="true"
COMPLETION_WAITING_DOTS="true"
HIST_STAMPS="mm/dd/yyyy"

# CASE_SENSITIVE="true"
# HYPHEN_INSENSITIVE="true"
# DISABLE_AUTO_UPDATE="true"
# DISABLE_UPDATE_PROMPT="true"
# export UPDATE_ZSH_DAYS=13
# DISABLE_MAGIC_FUNCTIONS="true"
# DISABLE_LS_COLORS="true"
# DISABLE_AUTO_TITLE="true"
# DISABLE_UNTRACKED_FILES_DIRTY="true"
# ZSH_CUSTOM=/path/to/new-custom-folder

# CUSTOM STUFF
bindkey -e
bindkey '^p' history-search-backward
bindkey '^n' history-search-forward
HISTSIZE=5000
SAVEHIST=$HISTSIZE
HISTDUP=erase
setopt appendhistory
setopt sharehistory
setopt hist_ignore_space
setopt hist_ignore_all_dups
setopt hist_save_no_dups
setopt hist_ignore_dups
setopt hist_find_no_dups
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
zstyle ':completion:*' menu no

plugins=(aliases git z zsh-autosuggestions zsh-syntax-highlighting zsh-completions colored-man-pages sudo colorize dirhistory)

source $ZSH/oh-my-zsh.sh
source $HOME/.aliases

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
if [[ -n $SSH_CONNECTION ]]; then
  export EDITOR='nano'
else
  export EDITOR='code'
fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# cd ~

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

## Aliases file

```bash
alias l='ls -laF --color'
alias ls='ls -aF --color'
alias sup='sudo apt update'
alias yup='sudo apt upgrade -y'
alias up='sudo apt update && sudo apt full-upgrade -y'
alias si='sudo apt install -y'
alias clean='sudo apt autoremove -y && sudo apt clean'
alias sn='sudo nano'
alias rb='sudo reboot'
alias sc='sudo cp'
alias scr='sudo cp -rf'
alias sm='sudo mv'
alias sd='sudo shutdown'
alias sr='sudo rm'
alias srr='sudo rm -rf'
alias s='sudo'
alias n='nano'
alias c='code'
alias v='vim'
alias x='clear'
alias q='exit'
alias hs='history'
alias ap='ansible-playbook'
alias dc='sudo docker-compose up -d'
alias myip='curl https://icanhazip.com'
alias tun='sudo docker exec -it qbittorrent sh -c "curl https://icanhazip.com"'
alias dnsleak='bash /home/ad/dnsleaktest.sh'
# yarn
alias y='yarn'
alias yb='yarn build'
alias ybp='yarn build && yarn preview --host'
alias yd='yarn dev --host'
alias ydf='yarn dev --host --force'
alias yp='yarn preview --host'
# astro
alias yas='yarn astro sync'
alias check='yarn astro check'
# pnpm
alias p='pnpm'
alias pd='pnpm dev --host'
alias pdf='pnpm dev --host --force'

function acp() {
  git add .
  git commit -m "$1"
  git push
}

# Git short-cuts.
function gc() {
  args=$@
  git commit -m "$args"
}
function gca() {
  args=$@
  git commit --amend -m "$args"
}

function gcp() {
  title="$@"
  git commit -am $title && git push -u origin
}

alias g='git'
alias ga='git add'
alias gb='git branch'
alias gbd='git branch -D'
alias gcl='git clone'
alias gch='git checkout'
alias gd='git diff'
alias gdis='git discard'
alias gf='git fetch'
alias gi='git init'
alias gl='git pull'
alias gp='git push'
alias gr='git rm'
alias gs='git status --short'

# Show a directory listing when using 'cd'
function cd() {
    new_directory="$*";
    if [ $# -eq 0 ]; then
        new_directory=${HOME};
    fi;
    builtin cd "${new_directory}" && /bin/ls -aF --color --ignore=lost+found
}
```
