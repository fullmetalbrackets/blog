#!/bin/bash

set -e

echo "Zsh, Oh-My-Zsh and Powerlevel10k setup script"
echo "https://fullmetalbrackets.com/zsh-omz-p10k.sh"

if command -v zsh &> /dev/null; then
    echo "✓ Zsh already installed, skipping..."
else
    echo "Installing Zsh..."
    sudo apt update
    sudo apt install zsh -y
fi

if [ -d "$HOME/.oh-my-zsh" ]; then
    echo "✓ Oh-My-Zsh already installed, skipping..."
else
    echo "Installing Oh-My-Zsh..."
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" "" --unattended
fi

echo "Setting ZSH_CUSTOM if not already set..."
export ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"

echo "Installing plugins..."
[ -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ] && echo "✓ zsh-autosuggestions already installed" || git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
[ -d "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" ] && echo "✓ zsh-syntax-highlighting already installed" || git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
[ -d "$ZSH_CUSTOM/plugins/zsh-completions" ] && echo "✓ zsh-completions already installed" || git clone https://github.com/zsh-users/zsh-completions.git $ZSH_CUSTOM/plugins/zsh-completions

echo "Enabling plugins..."
sed -i 's/plugins=(git)/plugins=(git z dirhistory colorize colored-man-pages sudo zsh-syntax-highlighting zsh-autosuggestions zsh-completions)/' ~/.zshrc

echo "Installing MesloLGS NF fonts..."
mkdir -p ~/.local/share/fonts
[ -f ~/.local/share/fonts/MesloLGSNFRegular.ttf ] && echo "✓ MesloLGS NF Regular already installed" || wget -O ~/.local/share/fonts/MesloLGSNFRegular.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf
[ -f ~/.local/share/fonts/MesloLGSNFBold.ttf ] && echo "✓ MesloLGS NF Bold already installed" || wget -O ~/.local/share/fonts/MesloLGSNFBold.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf
[ -f ~/.local/share/fonts/MesloLGSNFItalic.ttf ] && echo "✓ MesloLGS NF Italic already installed" || wget -O ~/.local/share/fonts/MesloLGSNFItalic.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf
[ -f ~/.local/share/fonts/MesloLGSNFBoldItalic.ttf ] && echo "✓ MesloLGS NF Bold Italic already installed" || wget -O ~/.local/share/fonts/MesloLGSNFBoldItalic.ttf https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf
fc-cache -f -v

if [ -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k" ]; then
    echo "✓ Powerlevel10k already installed, skipping..."
else
    echo "Installing Powerlevel10k theme..."
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
fi

sed -i 's/ZSH_THEME=".*"/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc

echo "Attempting to set MesloLGS NF font in terminal emulator..."

# GNOME Terminal
if command -v gsettings &> /dev/null; then
    PROFILE=$(gsettings get org.gnome.Terminal.ProfilesList default | tr -d "'")
    if [ -n "$PROFILE" ]; then
        gsettings set org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/:$PROFILE/ font 'MesloLGS NF 11'
        gsettings set org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/:$PROFILE/ use-system-font false
        echo "✓ GNOME Terminal font set"
    fi
fi

# XFCE Terminal
if [ -f ~/.config/xfce4/terminal/terminalrc ]; then
    if grep -q "^FontName=" ~/.config/xfce4/terminal/terminalrc; then
        sed -i 's/^FontName=.*/FontName=MesloLGS NF 11/' ~/.config/xfce4/terminal/terminalrc
    else
        echo "FontName=MesloLGS NF 11" >> ~/.config/xfce4/terminal/terminalrc
    fi
    echo "✓ XFCE Terminal font set"
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
    echo "✓ Konsole font set"
fi

# Alacritty
if [ -f ~/.config/alacritty/alacritty.yml ] || [ -f ~/.config/alacritty/alacritty.toml ]; then
    mkdir -p ~/.config/alacritty
    if [ -f ~/.config/alacritty/alacritty.toml ]; then
        if grep -q "^\[font\]" ~/.config/alacritty/alacritty.toml; then
            sed -i '/^\[font\]/,/^\[/ s/^family = .*/family = "MesloLGS NF"/' ~/.config/alacritty/alacritty.toml
        else
            echo -e "\n[font]\nfamily = \"MesloLGS NF\"" >> ~/.config/alacritty/alacritty.toml
        fi
        echo "✓ Alacritty font set"
    fi
fi

# Kitty
if [ -f ~/.config/kitty/kitty.conf ]; then
    if grep -q "^font_family" ~/.config/kitty/kitty.conf; then
        sed -i 's/^font_family.*/font_family MesloLGS NF/' ~/.config/kitty/kitty.conf
    else
        echo "font_family MesloLGS NF" >> ~/.config/kitty/kitty.conf
    fi
    echo "✓ Kitty font set"
fi

echo "Setup complete!"
echo ""
echo "Font configuration attempted for detected terminal emulators."
echo "If your terminal font didn't change, you may need to set it manually to 'MesloLGS NF'."
echo "Launching Zsh now... Powerlevel10k configuration wizard will run."
echo ""

exec zsh