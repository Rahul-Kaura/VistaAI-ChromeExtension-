# AI Pitch Advisor Chrome Extension

A powerful Chrome extension that provides AI-powered pitch advice with beautiful timelapse backgrounds and stock analysis capabilities.

## Features

- 🎬 **Timelapse Background**: Beautiful MP4 video background that loops continuously
- 🤖 **AI-Powered**: General AI mode for pitch advice and stock analysis mode
- 🎤 **Voice Input**: Speech-to-text functionality for hands-free interaction
- 📷 **Image Upload**: Support for image attachments (coming soon)
- 🔥 **Motivational Audio**: David Goggins-inspired motivational quotes
- 💾 **Persistent Storage**: Remembers your preferences and name

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The extension will appear in your extensions bar

### Method 2: Package and Install

1. Go to `chrome://extensions/`
2. Click "Pack extension"
3. Select the `chrome-extension` folder
4. Click "Pack Extension"
5. Install the generated `.crx` file

## Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Choose your mode**:
   - **General**: AI pitch advice and general assistance
   - **Stock**: Stock market analysis and financial advice
3. **Ask questions** using the search bar
4. **Use voice input** by clicking the microphone button
5. **Get motivated** with the "LOCK IN" button for David Goggins quotes

## File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.js               # Popup functionality
├── background.js          # Background service worker
├── 13403997_1920_1080_24fps.mp4  # Timelapse video
├── gpt_logo.png           # Logo image
└── README.md              # This file
```

## Permissions

- **storage**: Save user preferences and data
- **geolocation**: Get user location for weather (optional)
- **activeTab**: Access current tab for enhanced functionality
- **host_permissions**: Access to external APIs (OpenAI, Unsplash, etc.)

## Development

To modify the extension:

1. Edit the files in the `chrome-extension` folder
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension
4. Test your changes

## Publishing to Chrome Web Store

1. **Prepare your extension**:
   - Ensure all files are in the `chrome-extension` folder
   - Test thoroughly in development mode
   - Create a compelling store listing

2. **Create a Chrome Web Store developer account**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Pay the one-time $5 registration fee
   - Verify your identity

3. **Package your extension**:
   - Zip the entire `chrome-extension` folder
   - Make sure `manifest.json` is in the root of the zip

4. **Upload to Chrome Web Store**:
   - Go to the developer dashboard
   - Click "Add new item"
   - Upload your zip file
   - Fill out the store listing details
   - Submit for review

## Store Listing Requirements

- **Extension name**: AI Pitch Advisor
- **Description**: Clear, compelling description of features
- **Screenshots**: 1-5 screenshots showing the extension in action
- **Icon**: 128x128px icon for the store
- **Category**: Productivity or Business
- **Privacy policy**: Required for extensions that collect data

## Troubleshooting

- **Video not playing**: Ensure the MP4 file is in the extension folder
- **Voice not working**: Check microphone permissions
- **Storage issues**: Clear extension data in Chrome settings

## Support

For issues or feature requests, please contact the development team.

---

**Ready to dominate? Install the AI Pitch Advisor extension and take your pitches to the next level!** 🚀
