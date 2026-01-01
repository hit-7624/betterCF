# betterCF

<p align="center">
  <img src="logo.png" alt="betterCF Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Enhance your Codeforces experience</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Features

### 🔗 Friends' Submissions

See what your Codeforces friends have submitted on any problem page:

- View accepted submissions from friends directly in the sidebar
- See friend ratings with color-coded handles
- Check execution time and memory usage
- Quick links to view their source code
- Sorted by rating (highest first)

### ⚡ Quick Submit

Submit solutions directly from problem pages without navigation:

- Paste code directly on the problem page
- Select your preferred programming language
- Auto-remembers your last used language
- Auto-fills and submits on the official submission page
- Supports contests, problemset, and gym problems

### 🌙 Dark Mode

Toggle between dark and light themes across all Codeforces pages:

- One-click theme toggle in the extension popup
- Persistent theme preference across browser sessions
- Real-time theme switching without page reload
- Smart image handling to preserve visual quality
- Works on all Codeforces pages

## Installation

### From Chrome Web Store

*Coming soon*

### Manual Installation (Developer Mode)

1. **Download the extension**
   ```bash
   git clone https://github.com/yourusername/betterCF.git
   ```
   Or download and extract the ZIP file.

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `betterCF` folder containing `manifest.json`

5. **Pin the extension** (optional)
   - Click the puzzle icon in Chrome toolbar
   - Pin betterCF for quick access

## Usage

### Setting Up API Credentials

To use the Friends' Submissions feature, you need to configure your Codeforces API credentials:

1. **Get your API key**
   - Visit [codeforces.com/settings/api](https://codeforces.com/settings/api)
   - Click "Add API key"
   - Copy both the **Key** and **Secret**

2. **Configure betterCF**
   - Click the betterCF icon in your browser toolbar
   - Enter your API Key
   - Enter your API Secret
   - Click "Save Settings"

> **Note:** Your API credentials are stored locally and never shared. They are only used to authenticate with the Codeforces API to fetch your friends list.

### Using Friends' Submissions

1. Navigate to any Codeforces problem page:
   - Contest problems: `codeforces.com/contest/*/problem/*`
   - Problemset: `codeforces.com/problemset/problem/*/*`
   - Gym problems: `codeforces.com/gym/*/problem/*`

2. Look for the **"→ Friends' Submissions"** widget in the sidebar

3. Click the title to expand/collapse the widget

4. View your friends' accepted submissions with:
   - Username (color-coded by rating)
   - Rating in parentheses
   - Verdict and programming language
   - Execution time and memory usage
   - Submission timestamp
   - Link to view the source code

### Using Quick Submit

1. Navigate to any Codeforces problem page

2. Scroll down below the problem statement to find the **"→ Quick Submit"** box

3. Click the title to expand the submit form

4. Select your programming language from the dropdown:
   - GNU C++23 64bit
   - GNU C++20 64bit
   - GNU C++17 64bit / 32bit
   - Python 3
   - PyPy 3-64
   - Java 21
   - Kotlin 1.9
   - Rust 2021
   - Go

5. Paste your source code in the textarea

6. Click **"Submit"**

7. A new tab opens with the official submission page where your code is automatically filled and submitted

### Using Dark Mode

1. Click the betterCF icon in your browser toolbar

2. Click the **sun/moon icon** in the top-right corner of the popup

3. The theme changes immediately on the current Codeforces page

4. Your preference is saved and applied to all Codeforces pages

## Supported Pages

| Page Type | URL Pattern | Features |
|-----------|-------------|----------|
| All Codeforces | `codeforces.com/*` | Dark Mode |
| Contest Problems | `codeforces.com/contest/*/problem/*` | Friends' Submissions, Quick Submit |
| Problemset | `codeforces.com/problemset/problem/*/*` | Friends' Submissions, Quick Submit |
| Gym Problems | `codeforces.com/gym/*/problem/*` | Friends' Submissions, Quick Submit |

## Configuration

### API Credentials

| Setting | Description |
|---------|-------------|
| API Key | Your Codeforces API key from settings |
| API Secret | Your Codeforces API secret from settings |

### Stored Data

betterCF stores the following data locally:

| Key | Storage | Description |
|-----|---------|-------------|
| `cfApiKey` | Chrome Sync | Your API key (synced across devices) |
| `cfApiSecret` | Chrome Sync | Your API secret (synced across devices) |
| `theme` | Chrome Local | Theme preference (dark/light) |
| `betterCF_lastLang` | localStorage | Last selected programming language |
| `betterCF_submitData` | localStorage | Temporary submission data (cleared after use) |

## Permissions

betterCF requires the following permissions:

| Permission | Reason |
|------------|--------|
| `activeTab` | Access to the current tab for content scripts |
| `storage` | Store API credentials and preferences |
| `host_permissions` (codeforces.com) | Inject features on Codeforces pages |

## Troubleshooting

### Friends' Submissions not showing

1. **Check API credentials**: Click the extension icon and verify your API key and secret are entered correctly
2. **Verify login status**: You must be logged in to Codeforces
3. **Check friends list**: Ensure you have friends added on Codeforces
4. **Refresh the page**: After saving credentials, refresh the problem page

### Quick Submit not working

1. **Check for existing box**: Scroll down below the problem statement
2. **Verify URL**: Must be on a valid problem page
3. **Check code**: Ensure you've pasted code before clicking submit
4. **Allow popups**: The submit page opens in a new tab

### API Rate Limiting

Codeforces API has rate limits. If you see errors:
- Wait a few seconds and refresh
- Avoid rapidly navigating between problems
- The extension batches requests to minimize API calls

## Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   git fork https://github.com/yourusername/betterCF.git
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/betterCF.git
   cd betterCF
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Setup

1. Load the extension in Developer Mode (see Installation)
2. Make your changes
3. Reload the extension after changes:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the betterCF card

### Code Style Guidelines

- Write clean, modular code
- Follow existing naming conventions
- No comments unless absolutely necessary for complex logic
- Use meaningful variable and function names
- Keep functions focused and single-purpose

### Project Structure

```
betterCF/
├── manifest.json                        # Extension configuration
├── logo.png                             # Extension logo
├── popup/
│   ├── popup.html                       # Extension popup UI
│   └── popup.js                         # Popup functionality
├── features/
│   ├── dark-mode/
│   │   └── content.js                   # Dark mode content script
│   ├── friend-submissions/
│   │   ├── background.js                # Background service worker
│   │   ├── content.js                   # Friends' submissions content script
│   │   └── styles.css                   # Friends' submissions styles
│   └── quick-submit/
│       ├── content.js                   # Quick submit content script
│       ├── autofill.js                  # Submit page autofill script
│       └── styles.css                   # Quick submit styles
└── icons/                               # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Submitting Changes

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Follow commit message conventions:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes in detail

### Pull Request Guidelines

- **Clear description**: Explain what changes you made and why
- **Single purpose**: Each PR should address one feature or fix
- **Test thoroughly**: Verify your changes work on different problem pages
- **Update documentation**: If adding features, update the README

### Feature Ideas

Looking for ideas? Here are some features we'd love to see:

- [x] Dark mode support
- [ ] Customizable rating color schemes
- [ ] Problem difficulty filters
- [ ] Submission statistics
- [ ] Code diff viewer for comparing solutions
- [ ] Keyboard shortcuts
- [ ] Export submissions to file

### Reporting Issues

Found a bug? Please open an issue with:

1. **Description**: What happened?
2. **Expected behavior**: What should have happened?
3. **Steps to reproduce**: How can we replicate the issue?
4. **Browser version**: Chrome version number
5. **Screenshots**: If applicable

## Version History

### v0.0.2
- Dark mode support with toggle in popup
- Persistent theme preference
- Real-time theme switching

### v0.0.1 (Initial Release)
- Friends' Submissions feature
- Quick Submit feature
- API configuration popup
- Support for contest, problemset, and gym pages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Codeforces](https://codeforces.com) for their API
- All contributors who help improve this extension

---

<p align="center">
  Made with ❤️ for the competitive programming community
</p>

