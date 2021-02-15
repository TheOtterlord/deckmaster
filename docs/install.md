# Installation

You can install DeckMaster's latest version via one of the pre-built installers, or by building it from the source code.

- [Windows Installer](#windows-installer)

- [Linux Installer](#linux-installer)

- [Build From Source](#build-from-source)


## Windows Installer

Head to the [download](https://github.com/TheOtterlord/deckmaster/releases/latest) page for the most recent version of **DeckMaster**.
Download the `installer.exe` file and run it to install the app.

You might be warned by Windows not to run the app.
This is because the app is unsigned.
Code signing can cost a lot of money, and for an individual developing free software, it doesn't make much sense to sign it.

![Microsoft Defender prevents unsigned apps from running without permission](assets/win-protect1.png)

To continue using the installer, just click `More info`, then `Run anyway`. 
If the installer does not work on your architecture, you can always [build from source](#build-from-source).


## Linux & macOS Installers

Head to the [download](https://github.com/TheOtterlord/deckmaster/releases/latest) page for the most recent version of **DeckMaster**.
Download the `linux-installer` with your platform's installer extension (or `installer.dmg` on macOS) and run it to install the app. 

You can install the `rpm` build using a supported package manager like `yum`. 

You may be warned by your computer that the app is unknown.
This is because the app is not signed. 
Code signing can cost a lot of money, and for an indifivual developing free software, it doesn't make much sense to sign my code.
If the installer does not work, you can always [build from source](#build-from-source).


## Build From Source

Follow these instructions to build **DeckMaster** from source. 
If you run into any problems, please open an [issue](https://github.com/TheOtterlord/deckmaster/issues).

1. Install [NodeJS](https://nodejs.org)
2. Download the [repository](https://github.com/TheOtterlord/deckmaster/archive/master.zip), and unzip it into an empty folder
3. Run `npm install` to download dependancies
4. Run `npm run dev` to run the app
