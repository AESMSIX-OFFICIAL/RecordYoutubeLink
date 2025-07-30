# 📺 YouTube Logger V6.4

**YouTube Logger V6.4** is a Firefox extension designed to **automatically log YouTube video URLs and titles** from selected browser tabs. It provides a simple interface to track what you're watching, edit your history, and download your video log locally — all without sending any data to external servers.

---

## 🔧 Features

- ✅ **Select Active YouTube Tabs**
  - Automatically lists all open YouTube video tabs.
  - Use checkboxes to choose which ones to log.

- 🟢 **Online/Offline Mode**
  - Toggle button to enable or disable logging.
  - When offline, logging is paused even if a video changes.

- 🔗 **Original vs Clean URL Format**
  - Toggle to log full original URLs or simplified `?v=VIDEO_ID` versions.

- 💾 **Local Storage**
  - All logs are stored locally using `chrome.storage.local`.

- ✍️ **Built-in Log Editor**
  - Integrated editor to view, search, edit, and clear your YouTube video log.

- 📥 **Download Log as File**
  - Easily export your log to a `.txt` file.

- 🌙 **Dark Mode Support**
  - Switch between light and dark theme in the editor.

---

## 🖼️ UI Overview

Popup Interface:
- **Online/Offline** toggle button.
- Clean URL switch.
- **Download Log** and **Edit Log** buttons.
- Scrollable list of currently open YouTube video tabs with checkboxes.

Editor Page:
- Search box to filter video entries.
- Textarea to edit full log content.
- Buttons to Save, Clear, or Close.
- Toggle for Dark/Light mode.

---

## 🏗️ File Overview

| File             | Purpose                                                                 |
|------------------|--------------------------------------------------------------------------|
| `popup.html`     | Main UI for the extension popup                                          |
| `popup.css`      | Styling for the popup                                                    |
| `scanner.js`     | Handles YouTube tab scanning, UI interaction, and messaging             |
| `starter.js`     | Background script: logging logic, message handling, and storage          |
| `wait.js`        | Content script: detects video changes on YouTube pages                   |
| `edit.html`      | Standalone editor interface for reviewing/editing the log                |
| `edit.css`       | Styles for the log editor page                                           |
| `edit.js`        | Handles editor logic: search, save, clear, and theme toggle             |
| `config.js`      | Stores shared constants (e.g., log key name)                             |
| `manifest.json`  | Chrome extension configuration and permissions                           |

---

## 📦 Manual Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle in top right).
4. Click **Load unpacked**.
5. Select the folder where this extension’s files are located.

---

## 🧠 How It Works

- The extension detects YouTube tabs using `chrome.tabs.query`.
- You can manually check/uncheck tabs to control which are logged.
- When a video URL or title changes, it sends a message to the background script.
- The background script checks for duplicates and appends unique entries to the log.
- The log is saved in the browser’s local storage and can be viewed or downloaded anytime.

---

## 🔒 Privacy

This extension does **not** collect or transmit any personal data or browsing history. All information is stored **locally** in your browser only.

---

## 📜 Changelog

### Version 6.4
- Added support for "Clean URL" logging.
- Enhanced UI with better layout and theming.
- Improved log editor with dark mode and live search.
- Bug fixes and optimizations.

---

## 🤝 Contributing

Feel free to open an issue or submit a pull request for improvements, bug fixes, or new features. All contributions are welcome!

---

## 📄 License

MIT License © 2025 — Developed for private YouTube tracking purposes.
