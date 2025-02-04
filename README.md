# Attribute Highlighter Chrome Extension

A Chrome extension that helps developers visualize and interact with elements containing any attribute on web pages.

## Features

- 🔍 Highlights all elements with any attribute on the page
- 📋 One-key copying of attribute values (press 'CMD+C' or 'CTRL+C' while hovering)
- 🔄 Automatic detection of dynamically added elements
- 👁️ Toggle button visibility option
- 📋 Java Smart Copy option
- 💫 Smooth visual transitions and hover effects
- 🔍 Highlight elements by attribute name

## How to Use

1. Click the "Show Elements with Attribute" button in the bottom-right corner of your page
2. Enter the attribute name you want to highlight
3. Click the "Set" button
4. Click the "Enable Java Smart Copy" button to format the attribute for java smart copy (this format is for selenium java)
5. Elements with attribute will be highlighted with a red border
6. Hover over any highlighted element to see its attribute value
7. Press 'CMD+C' or 'CTRL+C' while hovering to copy the attribute to your clipboard
8. Click the button again to disable highlighting

## Technical Details

The highlighter includes:

- Real-time DOM observation for dynamic content
- Non-intrusive styling that preserves original element styles
- Efficient event handling and memory management
- Chrome storage sync for persistent button visibility preferences
- Tooltip system for easy attribute visualization
- Java Smart Copy option for java selenium
- Attribute name can be set to any attribute name

## Styling

The extension uses:

- Modern shadow effects for the toggle button
- Semi-transparent tooltips for better readability
- Responsive positioning for both button and tooltips
- High z-index values to ensure visibility

## Browser Support

- Designed for Chrome and Chromium-based browsers
- Utilizes modern JavaScript features and DOM APIs
