# 🎸 EMOS NOT DEAD - Cruise Schedule 2026 Webapp

A fully interactive GitHub Pages webapp for browsing the Emos Not Dead cruise schedule across 4 days (Jan 22-25, 2026).

## 📋 Features

### Timeline Grid View
- **Interactive 2-3 Stage Grid**: Scroll horizontally and vertically to explore all performances
- **Color-Coded Venues**: Quick visual identification by stage/location
- **Time Axis**: Continuous 11 AM–1 AM timeline across all 4 days
- **Band Cards**: Show band name, event details, start/end times, and location

### Favorite System ❤️
- **Heart Icon**: Always visible on each band card
- **One-Click Favorites**: Click heart to add/remove from itinerary
- **Persistent Storage**: Favorites saved to browser localStorage

### Hide/Show Functionality
- **Right-Click to Hide**: Hide shows you're not interested in (desktop)
- **Long-Press to Hide**: Hide shows on mobile (500ms press)
- **Toggle Visibility**: Show/hide checkbox to see all shows or only active ones
- **Persistent State**: Hidden status saved locally

### Itinerary View
- **Chronological List**: View all favorited shows organized by day and time
- **Time Gaps**: See breaks between shows for meals, sleep, exploring
- **Custom Events**: Add personal events (meals, sleep, meetups)
  - Specify day, time, duration, and color
  - Custom events appear in itinerary alongside favorites

### Responsive Design
- **Desktop**: Full 6-column grid with smooth scrolling
- **Tablet**: 4-column grid with optimized layout
- **Mobile**: Single-column cards with horizontal time axis
- **Touch-Optimized**: Long-press context menu for mobile users

## 📁 File Structure

```
ENDCruise2026Schedule/
├── index.html           # Main HTML structure
├── styles.css           # Complete styling and responsive design
├── app.js               # JavaScript logic and interactions
├── schedule.data.json   # Band schedule data (96 performances)
└── Schedule/            # Original schedule screenshots (reference)
    ├── schedule_legend.jpg
    ├── Thursday_Day.jpg
    ├── Thursday_evening.jpg
    ├── Friday_day.jpg
    ├── Friday_evening.jpg
    ├── Saturday_day.jpg
    ├── Saturday_evening.jpg
    └── Sunday_day.jpg
```

## 🎵 Schedule Data Format

Each band entry in `schedule.data.json` contains:
```json
{
  "band": "Artist Name",
  "subtitle": "Set Theme or Notes",
  "location": "Venue Name",
  "starttime": 1737526500,    // Unix epoch timestamp
  "endtime": 1737530400,      // Unix epoch timestamp
  "day": 1,                    // 1-4 for Thu-Sun
  "color": "#4ECDC4"           // Hex color for venue
}
```

## 🌐 Venues & Colors

| Venue | Color | Location |
|-------|-------|----------|
| Joy | #4ECDC4 | Deck 7, FWD |
| Manhattan | #45B7D1 | Deck 7, AFT |
| Atrium | #FFA07A | Deck 6, MID |
| Spice H20 | #98D8C8 | Deck 17, AFT |
| The Social | #F7DC6F | Deck 6, MID |
| Pool Deck | #FF6B6B | Deck 16, MID |

## 💾 LocalStorage Structure

All preferences are saved under the key `schedulePreferences`:
```javascript
{
  "favorites": ["band-id-1", "band-id-2", ...],
  "hidden": ["band-id-3", ...],
  "customEvents": [
    {
      "name": "Dinner",
      "day": 1,
      "starttime": 1737562800,
      "endtime": 1737566400,
      "color": "#888888",
      "location": "Personal Event"
    }
  ]
}
```

## 🚀 Deployment to GitHub Pages

1. **Create a GitHub repository** (e.g., `emos-cruise-schedule`)
2. **Push these files**:
   ```bash
   git add .
   git commit -m "Initial Emos Not Dead schedule webapp"
   git push origin main
   ```
3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `main` branch, save
4. **Access at**: `https://yourusername.github.io/emos-cruise-schedule`

## 🎮 Usage

### Timeline View
- **Scroll**: Navigate the grid horizontally (venues) and vertically (time)
- **Click Heart ❤️**: Favorite a show
- **Right-Click Card**: Hide show (desktop)
- **Long-Press Card**: Hide show (mobile, 500ms)
- **Toggle "Show Hidden"**: Display or hide grayed-out shows

### Itinerary View
1. Click **"My Itinerary"** tab
2. View all favorited shows grouped by day
3. **Add Custom Event**:
   - Enter event name (e.g., "Dinner", "Sleep", "Explore")
   - Select day
   - Enter time
   - Set duration (in minutes)
   - Pick color
   - Click "Add Event"
4. **Remove Event**: Click ✕ button on any itinerary item

## 🛠️ Customization

### Add More Bands
Edit `schedule.data.json` and add new entries:
```json
{
  "band": "New Band Name",
  "location": "Venue Name",
  "starttime": TIMESTAMP,
  "endtime": TIMESTAMP,
  "day": 1,
  "color": "#HEXCOLOR"
}
```

### Change Colors
Modify hex values in `schedule.data.json` or update the CSS in `styles.css`:
- `.legend-item` background colors
- Card styling in `.band-card`

### Adjust Responsive Breakpoints
Edit the `@media` queries in `styles.css`:
- `@media (max-width: 1024px)` - Tablet
- `@media (max-width: 768px)` - Small device
- `@media (max-width: 480px)` - Mobile

## 🔧 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

Requires localStorage support (all modern browsers).

## 📝 Notes

- **Timezone**: Times are in UTC (epoch timestamps). Adjust `schedule.data.json` if you need ship timezone conversion.
- **Performance**: ~96 bands across 4 days load instantly
- **Offline**: Once cached, works offline thanks to browser localStorage
- **Privacy**: All data stored locally; nothing sent to servers

## 🐛 Troubleshooting

**Favorites not saving?**
- Check if localStorage is enabled in browser
- Verify browser isn't in private/incognito mode

**Schedule not loading?**
- Ensure `schedule.data.json` is in the same folder as `index.html`
- Check browser console (F12) for errors

**Cards appearing in wrong grid position?**
- This is by design; cards are sorted by day + venue, not strictly chronological
- All time info is accurate in card details

## 📞 Support

For questions or issues, refer to the original E.N.D. Cruise website or check the schedule images in the `Schedule/` folder.

---

**Built for:** Emos Not Dead Cruise 2026 (January 22-25)  
**Made with:** HTML5, CSS3, Vanilla JavaScript  
**Ready to Deploy:** Push to GitHub Pages and share! 🎸
