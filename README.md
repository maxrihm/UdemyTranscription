## Udemy Transcription Chrome Extension

The Udemy Transcription Chrome Extension is designed to enhance the learning experience on Udemy by offering two main functionalities:

1. **Text Accumulation and Clipboard Copying**: This feature accumulates text from specific elements on Udemy course pages, particularly from the transcript sections. Users can easily copy the accumulated text to their clipboard with a simple button click.

2. **Screenshot Taking**: Users can take screenshots of the video content on Udemy courses, allowing them to capture important visual information. This feature is activated using the keyboard shortcut "Alt+S".

### Key Features:
- **Permissions**: The extension requires permissions for active tabs, clipboard writing, scripting, and tab management.
- **Host Permissions**: Specifically designed to work on Udemy course pages (`https://www.udemy.com/course*`).
- **Background Script**: Utilizes a background service worker (`background.js`) to handle screenshot commands.
- **Content Script**: The content script (`content.js`) manages the UI interactions, including adding buttons for copying text and taking screenshots.

### Usage:
- **Copy Text**: Click the 'Copy Text' button added to the course header to accumulate and copy transcript text to the clipboard.
- **Take Screenshot**: Press "Alt+S" to capture a screenshot of the current video content, which is then downloaded automatically.

This extension is ideal for students who want to efficiently gather course notes and important visual content during their learning sessions on Udemy.
