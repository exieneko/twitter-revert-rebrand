# Twitter Revert Rebrand

A Browser extension for Chromium and Firefox to revert the Twitter UI to the pre-Musk era

## Installation

### Chromium

1. Download the zip file for Chromium from the [latest release](https://github.com/exieneko/twitter-revert-rebrand/releases/latest)
2. Unzip the file's contents into its own folder
3. Go to `chrome://extensions` (or similar)
4. Enable developer mode
5. Click "load unpacked" and select the folder containing the `manifest.json` file

### Firefox

> [!IMPORTANT]
> Loading add-ons permanently requires [Firefox Developer Edition, Firefox Nightly](https://www.mozilla.org/firefox/channel/desktop) or other Firefox-based browsers\
> Temporary add-ons can be loaded on regular Firefox, but they get removed every time the browser restarts

1. Download the zip file for Firefox from the [latest release](https://github.com/exieneko/twitter-revert-rebrand/releases/latest)
2. Go to `about:config`
3. Search for `xpinstall.signatures.enabled` and set it to `false` if its not already
4. Go to `about:addons`
5. Drag and drop the zip file into the window

### Firefox (temporary)

1. Download the Firefox version from the [latest release](https://github.com/exieneko/twitter-revert-rebrand/releases/latest)
2. Unzip the file's contents into its own folder
3. Go to `about:debugging#/runtime/this-firefox`
4. Click "load temporary add-on" and select the folder containing the `manifest.json` file
