#!/bin/bash

set -e

echo "MesloLGS NF Font Quick Installer"

if ! command -v wget &> /dev/null; then
    echo "Error: wget is not installed. Please install it first then re-run the script."
    echo "  Ubuntu/Debian: sudo apt install wget"
    exit 1
fi

if ! command -v fc-cache &> /dev/null; then
    echo "Warning: fc-cache not found. Font cache won't be updated."
    echo "  Ubuntu/Debian: sudo apt install fontconfig"
    SKIP_CACHE=1
fi

FONT_DIR="$HOME/.local/share/fonts"
echo "Installing fonts to: $FONT_DIR"
mkdir -p "$FONT_DIR"

BASE_URL="https://github.com/romkatv/powerlevel10k-media/raw/master"

declare -A FONTS=(
    ["MesloLGSNFRegular.ttf"]="MesloLGS%20NF%20Regular.ttf"
    ["MesloLGSNFBold.ttf"]="MesloLGS%20NF%20Bold.ttf"
    ["MesloLGSNFItalic.ttf"]="MesloLGS%20NF%20Italic.ttf"
    ["MesloLGSNFBoldItalic.ttf"]="MesloLGS%20NF%20Bold%20Italic.ttf"
)

DOWNLOADED=0
for local_name in "${!FONTS[@]}"; do
    remote_name="${FONTS[$local_name]}"
    font_path="$FONT_DIR/$local_name"
    
    if [ -f "$font_path" ]; then
        echo "✓ $local_name already installed"
    else
        echo "Downloading $local_name..."
        if wget -q -O "$font_path" "$BASE_URL/$remote_name"; then
            echo "✓ $local_name installed successfully"
            DOWNLOADED=$((DOWNLOADED + 1))
        else
            echo "✗ Failed to download $local_name"
            rm -f "$font_path"
        fi
    fi
done

if [ "$DOWNLOADED" -gt 0 ]; then
    if [ -z "$SKIP_CACHE" ]; then
        echo ""
        echo "Updating font cache..."
        fc-cache -f "$FONT_DIR"
        echo "✓ Font cache updated"
    fi
else
    echo ""
    echo "All fonts already installed, no updates needed."
fi

echo ""
echo "Installation complete!"
echo "Fonts installed to: $FONT_DIR"
echo ""

echo "Configuring terminal emulators..."
CONFIGURED=0

# GNOME Terminal
if command -v gsettings &> /dev/null; then
    PROFILE=$(gsettings get org.gnome.Terminal.ProfilesList default 2>/dev/null | tr -d "'")
    if [ -n "$PROFILE" ]; then
        gsettings set org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/:$PROFILE/ font 'MesloLGS NF 11' 2>/dev/null
        gsettings set org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/:$PROFILE/ use-system-font false 2>/dev/null
        echo "✓ GNOME Terminal configured"
        CONFIGURED=1
    fi
fi

# XFCE Terminal
if [ -f ~/.config/xfce4/terminal/terminalrc ]; then
    if grep -q "^FontName=" ~/.config/xfce4/terminal/terminalrc; then
        sed -i 's/^FontName=.*/FontName=MesloLGS NF 11/' ~/.config/xfce4/terminal/terminalrc
    else
        echo "FontName=MesloLGS NF 11" >> ~/.config/xfce4/terminal/terminalrc
    fi
    echo "✓ XFCE Terminal configured"
    CONFIGURED=1
fi

# Konsole
if [ -d ~/.local/share/konsole ]; then
    for profile in ~/.local/share/konsole/*.profile; do
        if [ -f "$profile" ]; then
            if grep -q "^Font=" "$profile"; then
                sed -i 's/^Font=.*/Font=MesloLGS NF,11,-1,5,50,0,0,0,0,0/' "$profile"
            else
                echo "Font=MesloLGS NF,11,-1,5,50,0,0,0,0,0" >> "$profile"
            fi
        fi
    done
    echo "✓ Konsole configured"
    CONFIGURED=1
fi

# Alacritty
if [ -f ~/.config/alacritty/alacritty.toml ]; then
    if grep -q "^\[font\]" ~/.config/alacritty/alacritty.toml; then
        sed -i '/^\[font\]/,/^\[/ s/^family = .*/family = "MesloLGS NF"/' ~/.config/alacritty/alacritty.toml
    else
        echo -e "\n[font]\nfamily = \"MesloLGS NF\"" >> ~/.config/alacritty/alacritty.toml
    fi
    echo "✓ Alacritty configured"
    CONFIGURED=1
elif [ -f ~/.config/alacritty/alacritty.yml ]; then
    if grep -q "^  family:" ~/.config/alacritty/alacritty.yml; then
        sed -i 's/^  family:.*/  family: "MesloLGS NF"/' ~/.config/alacritty/alacritty.yml
    else
        echo -e "\nfont:\n  normal:\n    family: \"MesloLGS NF\"" >> ~/.config/alacritty/alacritty.yml
    fi
    echo "✓ Alacritty configured"
    CONFIGURED=1
fi

# Kitty
if [ -f ~/.config/kitty/kitty.conf ]; then
    if grep -q "^font_family" ~/.config/kitty/kitty.conf; then
        sed -i 's/^font_family.*/font_family MesloLGS NF/' ~/.config/kitty/kitty.conf
    else
        echo "font_family MesloLGS NF" >> ~/.config/kitty/kitty.conf
    fi
    echo "✓ Kitty configured"
    CONFIGURED=1
fi

# Tilix
if command -v dconf &> /dev/null && dconf list /com/gexperts/Tilix/profiles/ &> /dev/null; then
    TILIX_PROFILE=$(dconf list /com/gexperts/Tilix/profiles/ | head -n 1 | tr -d '/')
    if [ -n "$TILIX_PROFILE" ]; then
        dconf write /com/gexperts/Tilix/profiles/$TILIX_PROFILE/font "'MesloLGS NF 11'"
        dconf write /com/gexperts/Tilix/profiles/$TILIX_PROFILE/use-system-font false
        echo "✓ Tilix configured"
        CONFIGURED=1
    fi
fi

if [ "$CONFIGURED" -eq 0 ]; then
    echo "No supported terminal emulators detected for auto-configuration."
    echo "You will need to manually set the font to 'MesloLGS NF' in your terminal settings."
fi

echo ""
echo "The terminal will now restart to apply the font changes."
echo "If the font doesn't appear correct, you may need to:"
echo "  1. Fully close and reopen your terminal application"
echo "  2. Manually select 'MesloLGS NF' in terminal preferences"
echo ""

if [ -n "$ZSH_VERSION" ]; then
    exec zsh
elif [ -n "$BASH_VERSION" ]; then
    exec bash
else
    exec $SHELL
fi