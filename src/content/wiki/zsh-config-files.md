---
title: 'Zsh and Oh-My-Zsh configuration files'
description: 'Working copies of Zsh config files used on my Linux desktop and servers.'
pubDate: 2024-02-04
updatedDate: 2025-12-12
tag: documentation
---

![Oh My Zsh](../../img/blog/oh-my-zsh.png)

# Zsh configuration file

```bash
# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="/home/ad/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="powerlevel10k/powerlevel10k"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# Caution: this setting can cause issues with multiline prompts (zsh 5.7.1 and newer seem to work)
# See https://github.com/ohmyzsh/ohmyzsh/issues/5765
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
HIST_STAMPS="mm/dd/yyyy"

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
# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
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

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# cd ~

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

# Aliases file

```bash
# If using bash, place this file in ~/
# If using zsh & oh-my-zsh, rename this file to aliases.zsh
# and place in directory ~/.oh-my-zsh/custom

alias ls='ls --color'
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
alias play='ansible-playbook -i ~/ansible/hosts ~/ansible/playbooks/updates.yml'
alias dc='sudo docker-compose up -d'
alias myip='curl https://icanhazip.com'
alias tun='sudo docker exec -it qbittorrent sh -c "curl https://icanhazip.com"'
alias dnsleak='bash /home/ad/dnsleaktest.sh'

function acp() {
  git add .
  git commit -m "$1"
  git push
}

function tech-build {
  ssh -t ad@spud -- "cd techservatory && git pull && sudo yarn build"
}

function tech-pull {
  ssh ad@spud -- "cd techservatory && git pull"
}

# Git short-cuts.
alias g='git'
alias gi='git init'
alias ga='git add'
alias gr='git rm'
alias fetch='git fetch'
alias pull='git pull'
alias gs='git status --short'
alias gd='git diff'
alias gdis='git discard'

function gc() {
  args=$@
  git commit -m "$args"
}
function gca() {
  args=$@
  git commit --amend -m "$args"
}

alias gp='git push'

function gcp() {
  title="$@"
  git commit -am $title && git push -u origin
}
alias gcl='git clone'
alias gch='git checkout'
alias gbr='git branch'
alias gbrcl='git checkout --orphan'
alias gbrd='git branch -D'
```
