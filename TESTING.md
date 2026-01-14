# 🧪 Testing Checklist - Emos Not Dead Cruise Schedule

Before deploying to GitHub Pages, verify all features work correctly.

## ✅ Local Testing Setup

### Start Local Server
```bash
# Option 1: Python
python -m http.server 8000
# Visit: http://localhost:8000

# Option 2: Node
npx http-server
# Visit: http://localhost:8080

# Option 3: VS Code Live Server
# Right-click index.html → Open with Live Server
```

Open browser **DevTools** (F12) before testing to catch any errors.

---

## 🎮 Feature Testing

### Timeline Grid View
- [ ] Page loads without errors
- [ ] 96 bands visible in grid
- [ ] Scroll horizontally (left/right) works
- [ ] Scroll vertically (up/down) works
- [ ] Legend colors match venue colors
- [ ] All 6 venues represented with correct colors
- [ ] Band card shows: name, location, time, subtitle
- [ ] Times are formatted correctly (AM/PM)
- [ ] Grid is responsive on resize

### Favorite ❤️ System
- [ ] Click heart icon toggles ❤️ → 🤍
- [ ] Heart color changes on favorite
- [ ] Favorite text appears under "My Itinerary" tab
- [ ] Close browser tab completely
- [ ] Reopen page—favorites still there ✅
- [ ] Can favorite multiple bands
- [ ] Can unfavorite (remove ❤️)

### Hide/Show Functionality (Desktop)
- [ ] Right-click on band card
- [ ] Card becomes grayed out
- [ ] "Show Hidden" checkbox unchecked → hidden cards disappear
- [ ] "Show Hidden" checkbox checked → hidden cards reappear
- [ ] Hide status persists after page refresh
- [ ] Can hide multiple shows
- [ ] Can un-hide by right-clicking again

### Hide/Show Functionality (Mobile)
- [ ] Open browser DevTools → Device Toolbar
- [ ] Choose iPhone/Android device
- [ ] Long-press (hold 500ms) on band card
- [ ] Card grays out (similar to desktop)
- [ ] Works same as desktop right-click

### Itinerary Tab
- [ ] Click "My Itinerary" tab
- [ ] View switches to itinerary page
- [ ] No favorites → "No favorites yet" message
- [ ] Add favorite, tab switches automatically to itinerary (**or** manually click tab)
- [ ] Favorite appears chronologically
- [ ] Grouped by day (Thursday, Friday, Saturday, Sunday)
- [ ] Time gaps visible between shows
- [ ] Can see location for each show
- [ ] Remove button (✕) works
- [ ] After removing, favorite removed from timeline too

### Custom Events Form
- [ ] Form visible on itinerary page (right side on desktop)
- [ ] Fill out event name (e.g., "Dinner")
- [ ] Select day from dropdown
- [ ] Set time (not in past)
- [ ] Set duration (15-480 minutes)
- [ ] Pick color
- [ ] Click "Add Event"
- [ ] Event appears in itinerary list above current time
- [ ] Event has correct color stripe
- [ ] Close browser, refresh—event still there
- [ ] Can add multiple events
- [ ] Can remove custom events (✕ button)

### LocalStorage Persistence
- [ ] Open **DevTools** → **Application** tab
- [ ] Go to **LocalStorage**
- [ ] Find `schedulePreferences` key
- [ ] Verify JSON contains:
  - `favorites` array
  - `hidden` array
  - `customEvents` array
- [ ] Expand each and verify data
- [ ] Clear entire localStorage → refresh → favorites gone ✅
- [ ] Add favorite again → data reappears in storage

### Responsive Design

#### Desktop (1024px+)
- [ ] 6 columns in grid layout
- [ ] Legend items wrap properly
- [ ] No horizontal scrolling on page
- [ ] Cards readable and clickable

#### Tablet (768-1024px)
- [ ] 4 columns in grid layout
- [ ] Layout adjusts without overflow
- [ ] Controls still accessible

#### Small Device (480-768px)
- [ ] 2 columns in grid layout
- [ ] Time axis moves to top (horizontal)
- [ ] Cards stack nicely
- [ ] Touch targets large enough

#### Phone (<480px)
- [ ] 1 column (single card width)
- [ ] All buttons clickable (>44px)
- [ ] Text readable without zoom
- [ ] Long-press works for hiding
- [ ] No layout breaks

### Performance
- [ ] Page loads instantly (< 1 second)
- [ ] Scrolling is smooth (no jank)
- [ ] No console errors (F12 → Console)
- [ ] No console warnings
- [ ] Favorites/hide respond instantly

### Browser Compatibility

Test in each browser:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if Mac)
- [ ] Edge
- [ ] Mobile Safari (if iPhone)
- [ ] Chrome Mobile (if Android)

### Accessibility
- [ ] Tab key navigates through buttons
- [ ] Heart button has `title` tooltip
- [ ] Can see focus outlines on buttons
- [ ] Colors don't rely on color alone (cards show music note or icon)
- [ ] Text is readable (high contrast)

---

## 🔍 Edge Cases

### Data Integrity
- [ ] No duplicate bands in grid
- [ ] All times unique (no overlaps showing wrong venue)
- [ ] Day numbers match (1=Thu, 2=Fri, 3=Sat, 4=Sun)
- [ ] Epoch timestamps are valid (future dates)

### Form Validation
- [ ] Can't submit custom event without name
- [ ] Can't submit without day selected
- [ ] Can't submit without time
- [ ] Can't submit without duration
- [ ] Duration limited to 15-480 minutes

### Mobile Gestures
- [ ] Vertical scroll doesn't trigger hide
- [ ] Only long-press (500ms+) triggers hide
- [ ] Can still tap normally (no unintended hides)

### LocalStorage Limits
- [ ] Can favorite all 96 bands (no error)
- [ ] Can add 20+ custom events
- [ ] No "storage quota exceeded" errors

---

## 📊 Data Validation

### Timeline Data
- [ ] First band (Thursday): Underoath - The Storm Set
- [ ] Last band (Sunday): The Emo Band
- [ ] Verify band count:
  - Thursday: ~17 bands ✓
  - Friday: ~28 bands ✓
  - Saturday: ~18 bands ✓
  - Sunday: ~25 bands ✓
- [ ] All venues present: Joy, Manhattan, Atrium, Spice H20, The Social, Pool Deck
- [ ] All times in valid range (11 AM - 1 AM next day)

### Color Codes
- [ ] Joy = #4ECDC4 (Teal)
- [ ] Manhattan = #45B7D1 (Blue)
- [ ] Atrium = #FFA07A (Coral)
- [ ] Spice H20 = #98D8C8 (Mint)
- [ ] The Social = #F7DC6F (Yellow)
- [ ] Pool Deck = #FF6B6B (Red)

### UI Appearance
- [ ] Header looks professional (dark with gradient)
- [ ] Cards are readable (good contrast)
- [ ] No text cutoff on small screens
- [ ] Images/colors are vibrant
- [ ] Layout is not cluttered

---

## 🐛 Common Issues & Fixes

| Issue | Check |
|-------|-------|
| Schedule not loading | Browser console errors? Check file path |
| Favorites not saving | Is localStorage enabled? (not private mode) |
| Wrong colors | Verify hex codes in JSON match CSS |
| Slow scrolling | Check for JavaScript errors, clear cache |
| Mobile layout broken | Verify viewport meta tag in HTML |
| Form not submitting | Check form validation in console |

---

## ✨ Final Checklist

Before going live:

- [ ] All features tested on desktop
- [ ] All features tested on mobile
- [ ] No console errors in DevTools
- [ ] LocalStorage persists data correctly
- [ ] Responsive design works on all breakpoints
- [ ] Performance is smooth
- [ ] Data integrity verified (96 bands, correct times)
- [ ] Images/colors look good
- [ ] Ready to commit & push to GitHub

---

## 🚀 Ready to Deploy!

If all tests pass:

```bash
git add .
git commit -m "All tests passed, ready for deployment"
git push origin main
```

Then enable GitHub Pages in Settings → Pages.

**Enjoy the cruise!** 🎸⛵
