Demo 
https://drive.google.com/file/d/1zcruq6xuBWaXQX-Wpvpceqja6u7h0VO1/view?usp=sharing
---------------
# AI Text Summarizer Chrome Extension

A Chrome extension that uses Google AI (Gemini) to summarize selected text on any webpage.

## Features

- 🎯 **Easy Text Selection**: Select any text on a webpage and a "Summary" button appears
- 🤖 **AI-Powered**: Uses Google's Gemini AI for intelligent summarization
- 🎨 **User-Friendly UI**: Beautiful, modern popup interface with smooth animations
- 📋 **Copy to Clipboard**: One-click copy functionality for the summary

## Installation

### Step 1: Install Dependencies

1. Make sure you have Node.js installed (v16 or higher)
2. Open terminal in the project folder
3. Run: `npm install`

### Step 2: Configure API Key

1. Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```
   (Or manually create `config.js` based on `config.example.js`)

2. Open `config.js` and replace `YOUR_API_KEY_HERE` with your actual Google AI API key
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Important**: `config.js` is gitignored and will never be committed to version control

3. Save the file

### Step 3: Build the Extension

1. Run the build command: `npm run build`
2. This will create a `dist` folder with the bundled extension files

### Step 4: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the folder containing this extension (the root folder, not the dist folder)
5. The extension should now appear in your extensions list

## How to Use

1. **Select Text**: Highlight any text on any webpage
2. **Click Summary**: A "Summary" button will appear near your selection
3. **View Summary**: Click the button to see the AI-generated summary in a popup
4. **Copy or Close**: Use the "Copy" button to copy the summary, or "Close" to dismiss

## Keyboard Shortcuts

- **Escape**: Close the summary popup or hide the summary button

## Project Structure

```
ai-summary/
├── manifest.json       # Extension configuration
├── config.js           # API key configuration (add your key here)
├── package.json        # npm dependencies and scripts
├── build.js            # Build script using esbuild
├── content.js          # Detects text selection and shows button
├── content.css         # Styles for button and popup
├── background.js       # Handles API calls using @google/generative-ai SDK
├── dist/               # Built files (generated after npm run build)
│   └── background.js   # Bundled background script
└── README.md           # This file
```

## API Requirements

This extension uses the Google Gemini API. Make sure you have:
- A valid Google AI API key
- Internet connection for API calls
- API quota available (free tier has limits)

## Permissions

- **activeTab**: To access the current webpage and selected text
- **host_permissions**: To make API calls to Google's servers

## Troubleshooting

### "API key not configured" error
- Make sure you've created `config.js` from `config.example.js`
- Make sure you've added your API key in `config.js` file
- Replace `YOUR_API_KEY_HERE` with your actual API key
- Run `npm run build` after updating `config.js`

### "API error" messages
- Verify your API key is correct
- Check if you have API quota remaining
- Ensure you have an internet connection

### Summary button doesn't appear
- Make sure you've selected text (not just clicked)
- Try refreshing the page
- Check if the extension is enabled in `chrome://extensions/`

## Development

To modify the extension:

1. Make your changes to the files
2. Run `npm run build` to rebuild (or `npm run watch` for auto-rebuild)
3. Go to `chrome://extensions/`
4. Click the refresh icon on the extension card
5. Test your changes

### Using Watch Mode

For development, you can use watch mode to automatically rebuild on changes:
```bash
npm run watch
```

## Security Notes

- **API Key Storage**: Your API key is stored in `config.js` (gitignored - never committed)
- **Build Process**: The API key is injected during build time into `dist/background.js`
- **Source Code**: `background.js` contains only a placeholder, not your actual key
- **Production**: The built `dist/background.js` contains your API key - this is normal for Chrome extensions
- **Best Practice**: Restrict your API key in Google Cloud Console and set quota limits
- See `SECURITY.md` for detailed security best practices

## Notes

- The extension works on all websites (`<all_urls>`)
- API calls are made from the background service worker
- Users cannot see or modify the API key through the extension UI
- The extension uses Manifest V3 (latest Chrome extension standard)

## License

This project is open source and available for personal and commercial use.

