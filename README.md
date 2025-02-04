# Data Test ID Highlighter Chrome Extension

A Chrome extension that helps developers visualize and interact with elements containing data-test-id attributes on web pages.

## Features

- 🔍 Highlights all elements with `data-test-id` attributes on the page
- 📋 One-key copying of data-test-id values (press 'CMD+C' or 'CTRL+C' while hovering)
- 🔄 Automatic detection of dynamically added elements
- 👁️ Toggle button visibility option
- 📋 Java Smart Copy option
- 💫 Smooth visual transitions and hover effects

## How to Use

1. Click the "Show Elements with Data Test Id" button in the bottom-right corner of your page
2. Elements with data-test-id will be highlighted with a red border
3. Hover over any highlighted element to see its data-test-id value
4. Press 'CMD+C' or 'CTRL+C' while hovering to copy the data-test-id to your clipboard
5. Click the button again to disable highlighting
6. Click the "Enable Java Smart Copy" button to format the data-test-id for java smart copy

## Technical Details

The highlighter includes:

- Real-time DOM observation for dynamic content
- Non-intrusive styling that preserves original element styles
- Efficient event handling and memory management
- Chrome storage sync for persistent button visibility preferences
- Tooltip system for easy data-test-id visualization

## Styling

The extension uses:

- Modern shadow effects for the toggle button
- Semi-transparent tooltips for better readability
- Responsive positioning for both button and tooltips
- High z-index values to ensure visibility

## Browser Support

- Designed for Chrome and Chromium-based browsers
- Utilizes modern JavaScript features and DOM APIs
