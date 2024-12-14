# Pointer Tracker

This GNOME extension can highlight the mouse pointer to improve visibility on screencasts.

## Installation

### Recommended: GNOME extensions website

Visit the [GNOME extensions website](https://extensions.gnome.org/extension/7645/pointer-tracker/).

### From source

```
git clone https://github.com/garzj/gjs-pointer-tracker
cd gjs-pointer-tracker
yarn
yarn enable
gnome-session-quit --logout # restart GNOME
```

## Development

Run `yarn test` to build and start a nested wayland instance with the new version.
