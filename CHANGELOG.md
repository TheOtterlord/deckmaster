# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## 0.6.4

Deck saving bug fix

### Fixed

- Deck saving

## 0.6.3 Alpha

Quick update to add full changelog link & fix Discord invites.

### Added

- GitHub Changelog link

### Fixed

- Discord invite (make permanent)

## 0.6.2 Alpha

This update adds a viewable changelog & half a dozen bug fixes.

### Added

- Changelog that launches after updating

### Changed

- Update about info

### Fixed

- Fix a bug causing new decks to not be added to recent docs when saved
- Fix transition between deck editor & combo editor
- Fix level filter in deck editor
- Fix a bug with select/remove combo
- Fix issue with ygopro link when no path was selected

## 0.6.1 Alpha

A few bug fixes and adds links to the Discord server.

### Added

- Links to Discord server

### Fixed

- A reappearing bug causing image downloads to fail when YGOPro was not linked
- Small problem with Discord RPC

## 0.6.0 Alpha

Features upgrades to both the deck editor and the combo editor.

### Added

- Card preview to the combo editor
- Deck screenshot with auto-cropping
- Keybindings for `File > New Deck` & `File > New YCB`

## Fixed

- A bug causing hypergeometric calculations to be incorrect if a `string` was passed as the `min`/`max` variables.

## 0.5.1 Alpha

Patch update fixing bugs a few key features.

### Fixed

- A bug that caused the editor to crash when opening a deck using file association
- A bug that caused instances that did not link a YGOPro directory to not correctly download images
- A bug causing card data to be saved in incorrect locations

## 0.5.0 Alpha

Undo/Redo update

### Added

- Undo/Redo control
- Keybindings for undo & redo

### Changed

- Updated the deck sorter to use a single sorting algorithm

### Fixed

- Fixed a bug in the filter causing the card set filter to remain uncleared when filter is cleared.

## 0.4.1 Alpha

Small bug fixes

### Fixed

- A bug that caused cardset to not display to filter when updating
- Performance issues when opening settings

## 0.4.0 Alpha

Adds a nice deck/search sorter.

### Added

- Deck sorter
- Search sorter
- Filter by card set

## 0.3.0 Alpha

A big update adding big features.

### Added

- YCB Combo Module Editor
- Discord RPC
- Default keybinding for "open ycb" (Ctrl+Shift+O)

### Changed

- Removed experimental sign from filter in deck editor

## 0.2.2 Alpha

This update add some settings and fixes some bugs. 

### Added

- About tab in settings
- Keybindings tab in settings

### Changed

- Updated settings UI

### Fixed

- Fixed a bug that caused data to save to different locations
- Fixed a bug that caused YGOPRO path to display incorrectly

## 0.2.1 Alpha

This update brings a few bug fixes and UI improvements. 

### Added

- Default keybinding for "save as" (Ctrl+Shift+S)

### Changed

- Improved settings menu
- Documentation changes can now be published without building a new version
- Save and delete notifications are now in-app instead of native

### Fixed

- Save as functionallity
- Main deck cards can no longer be added to the extra deck
- Extra deck cards can no longer be added to the main deck


## 0.2.0 Alpha

The auto-updater is back! 
I've also added a settings menu that over time will be populated with more options to customise DeckMaster.

### Added

- Basic settings menu
- Ability to reset settings
- Setting to change YGOPro path
- In-app notifications API
- New auto-updater
- Default keybinding for settings (Ctrl+,)


## 0.1.2 Alpha

A few fixes and improvements

### Added

- Keybinding API
- Default keybinding for saving deck (Ctrl+S)
- Default keybinding for opening deck (Ctrl+O)
- Default keybinding for help (Ctrl+F1)

### Fixed

- Fixed the editor forcing user to open a deck
- Fixed the updater triggering when no update was available
- Fixed the menu functionallity when hovering over different tabs

## 0.1.1 Alpha

Apologies, but for now, auto-updating is disabled due to problems discovered after release. 

### Changed

- Temporarily disables auto-updating.


## 0.1.0 Alpha

The initial release of DeckMaster (Alpha)

### Added

- Basic functionallity for Deck Editor, start screen and first install screen
- YGOProDeck integration
- Automatic update capabilities
