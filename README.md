# Close Tabs by Domain

A Chrome extension to manage and close browser tabs by domain with one click.

## Features

- ✅ Add domains with optional custom titles
- ✅ Close all tabs for a specific domain in the current window
- ✅ Domain validation and sanitization
- ✅ Clean, modern UI with smooth animations
- ✅ Remove domains from your list
- ✅ Supports localhost and custom ports

## Project Structure

```
close-gitlab-tabs/
├── js/
│   ├── utils.js      # Utility functions (validation, sanitization)
│   ├── storage.js    # Chrome storage operations
│   ├── ui.js         # UI components and manipulation
│   └── popup.js      # Main coordination and event handlers
├── background.js     # Background service worker
├── popup.html        # Extension popup UI
├── style.css         # Styles
├── manifest.json     # Extension configuration
└── README.md         # This file
```

## File Descriptions

### `js/utils.js`
Pure utility functions with no dependencies:
- `generateId()` - Creates unique IDs for domains
- `sanitizeDomain()` - Removes protocols and trailing slashes
- `isValidDomain()` - Validates domain format using URL API

### `js/storage.js`
Handles all Chrome storage operations:
- `migrateDomains()` - Migrates old data format to new
- `loadDomains()` - Loads domains from storage
- `saveDomains()` - Saves domains to storage
- `addDomain()` - Adds a new domain with validation
- `removeDomain()` - Removes a domain by ID

### `js/ui.js`
Manages all UI interactions and DOM manipulation:
- `UI.init()` - Initializes UI element references
- `UI.showError()` / `UI.hideError()` - Error message display
- `UI.showAddForm()` / `UI.hideAddForm()` - Form visibility
- `UI.createDomainItem()` - Creates domain list item elements
- `UI.addDomainToUI()` - Adds domain to the visible list

### `js/popup.js`
Main entry point that coordinates everything:
- Initializes the extension
- Sets up event listeners
- Handles user interactions
- Coordinates between storage and UI

## Data Model

Domains are stored as objects with the following structure:

```javascript
{
  id: "unique-id-123",        // Unique identifier
  domain: "gitlab.com",        // The actual domain
  title: "Work Projects",      // Optional custom display name
  createdAt: 1234567890        // Timestamp
}
```

## Usage

1. Click the extension icon
2. Click "+ Add Domain"
3. Enter a domain (e.g., `gitlab.com` or `https://github.com`)
4. Optionally add a custom title
5. Click "Add"
6. Click "Close" next to any domain to close all tabs for that domain
7. Click the ⋮ menu to remove a domain from the list

## Development

The extension follows a clean, modular architecture:
- **Separation of Concerns**: Each file has a single responsibility
- **No Dependencies**: Pure JavaScript, no frameworks
- **Clear Flow**: utils → storage → ui → popup
- **Easy to Maintain**: Well-commented, organized code

## Browser Permissions

- `tabs` - To query and close browser tabs
- `storage` - To save domain list

