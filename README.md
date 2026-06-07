# TabPurge

A lightweight Chrome extension to manage a list of domains and close every matching tab in the current window with one click.

## Features

- Save a list of domains you frequently want to bulk-close (e.g. `gitlab.com`, `jira.company.com`).
- Optional custom title per entry, so the list reads like a label list rather than raw hostnames.
- One-click close for a single domain, or close everything in the list at once.
- Hostname-aware matching: `gitlab.com` matches `gitlab.com` and `*.gitlab.com`, never `notgitlab.com`.
- Supports `localhost` and custom ports (e.g. `localhost:3000`).
- All data stays local in `chrome.storage.local`. No network requests, no telemetry.

## Install

### From source (developer mode)

1. Download or clone this repository.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the repository root.
4. Pin the extension to the toolbar for quick access.

### From the Chrome Web Store

Coming soon.

## Usage

1. Click the TabPurge toolbar icon.
2. Click **+ Add Domain** and enter a domain (e.g. `gitlab.com`, `https://github.com`, or `localhost:3000`).
3. Optionally add a label.
4. Click **Close** next to any entry to close all matching tabs in the current window.
5. Click **Close All** to close tabs for every entry in the list (with a confirmation prompt).
6. Use the **⋮** menu to remove an entry.

## Matching rules

When you store `example.com`:

- `example.com` — matches
- `app.example.com` — matches
- `sub.app.example.com` — matches
- `notexample.com` — does **not** match
- `example.com.evil.com` — does **not** match

When you store `localhost:3000`, only tabs on that exact host:port match.

## Permissions

- `tabs` — required to read tab URLs and close tabs.
- `storage` — required to persist your domain list locally.

No host permissions are requested, and the extension never injects content scripts.

## Privacy

TabPurge does not collect, transmit, or share any data. Your domain list is stored only in your browser's local extension storage.

## License

MIT
