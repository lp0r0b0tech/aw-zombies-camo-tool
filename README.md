# 🧟 Advanced Warfare Exo Zombies Camo Reordering Tool

A customizable web-based tool for reordering Call of Duty: Advanced Warfare Exo Zombies weapon camos with drag-and-drop functionality.

## Features

✅ **View All Camos** - See the complete list of AW Zombies upgrade station camos  
✅ **Drag-and-Drop Reordering** - Intuitively reorder camos by dragging from the original list  
✅ **Save/Export** - Export your custom order as a JSON file  
✅ **Import** - Import previously saved custom orders  
✅ **Compare** - See detailed comparison between original and custom orders  
✅ **LocalStorage** - Your custom order is automatically saved to your browser  
✅ **Remove Camos** - Easily remove camos from your custom order  
✅ **Reset** - Return to the original order at any time  

## Original Camo Progression

The tool includes the authentic AW Zombies upgrade station camo progression:

1. **Default (No Camo)** - Upgrades 1-4
2. **Multicam** - Upgrade 5
3. **Urban** - Upgrade 7
4. **Strand** - Upgrade 10
5. **Concrete** - Upgrade 13
6. **Nanotech** - Upgrade 16
7. **Creature** - Upgrade 19
8. **Vortex** - Upgrade 22

## How to Use

### Online Version
Simply open `index.html` in your web browser. No installation required!

### Basic Usage

1. **View Camos** - The left side shows the original camo order
2. **Drag to Reorder** - Click and drag any camo from the left to the right panel
3. **Remove** - Click the "Remove" button on any camo in the custom list
4. **Reset** - Click "Reset to Original" to start over
5. **Save** - Your order is automatically saved to your browser's localStorage
6. **Export** - Click "Export Custom Order" to download as JSON
7. **Import** - Click "Import Custom Order" to load a previously saved JSON file

### Comparison Feature

The tool automatically displays:
- Number of original vs. custom camos
- Position changes for each moved camo
- Visual indicators (↑ moved up, ↓ moved down)

## File Structure

```
aw-zombies-camo-tool/
├── index.html      # Main HTML structure
├── style.css       # Styling and layout
├── script.js       # Application logic
└── README.md       # This file
```

## Technical Details

- **No External Dependencies** - Pure HTML, CSS, and vanilla JavaScript
- **Responsive Design** - Works on desktop, tablet, and mobile
- **LocalStorage** - Saves custom order automatically
- **JSON Export/Import** - Compatible data format for sharing
- **Drag & Drop API** - HTML5 native drag-and-drop functionality

## Export Format

When you export your custom order, you get a JSON file with:
- Timestamp of export
- Original camo count
- Your custom order
- Detailed list of changes

Example:
```json
{
  "timestamp": "2026-09-14T10:30:00.000Z",
  "originalCount": 8,
  "customOrder": [
    {
      "id": 5,
      "name": "Concrete",
      "upgrade": "13"
    },
    ...
  ],
  "changes": [
    {
      "name": "Concrete",
      "originalPos": 5,
      "newPos": 1,
      "direction": "up"
    }
  ]
}
```

## Browser Support

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Tips & Tricks

💡 **Clear Browser Data** - If you want to reset everything, clear your browser's localStorage  
💡 **Share Orders** - Export and share JSON files with friends to compare orders  
💡 **Backup** - Export your custom order regularly to keep a backup  
💡 **Try Different Orders** - You can always reset, so experiment!  

## Troubleshooting

**Dragging not working?**
- Make sure you're dragging FROM the left panel (original list)
- Try using a different browser
- Clear your browser cache

**Custom order not saving?**
- Check if your browser allows localStorage
- Try exporting and importing instead

**Import not working?**
- Make sure the file is a valid JSON export from this tool
- Check file extension is `.json`

## Contributing

Feel free to suggest features or improvements!

## License

MIT License - Feel free to use and modify

## Version

v1.0.0 - September 2026

---

**Enjoy customizing your AW Zombies camo progression! 🧟**
