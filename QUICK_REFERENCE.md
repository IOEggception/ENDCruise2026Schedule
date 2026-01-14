# 🎸 QUICK REFERENCE - Emos Not Dead Cruise Schedule Webapp

## 🚀 Deploy in 60 Seconds

```bash
# In your project folder:
git add .
git commit -m "Emos Not Dead schedule webapp"
git push origin main

# Then enable GitHub Pages in Settings → Pages
# Your site: https://USERNAME.github.io/emos-cruise-schedule
```

---

## 🎮 User Guide (for friends)

### Timeline Tab
1. **Browse**: Scroll to see all bands across 4 days
2. **Favorite**: Click ❤️ on band card
3. **Hide**: Right-click card or long-press on phone
4. **Toggle**: Check "Show Hidden" to see/hide grayed shows

### My Itinerary Tab
1. **See Favorites**: All ❤️ bands listed by day
2. **Add Event**: Fill form (dinner, sleep, meetup, etc.)
3. **Remove**: Click ✕ to delete any item
4. **Plan**: See time gaps between shows

### Data Persists
- Favorites ❤️ auto-save
- Hidden shows auto-save
- Custom events auto-save
- Refreshing page = your data stays!

---

## 📋 Files Overview

| File | Purpose |
|------|---------|
| `index.html` | Main page structure |
| `styles.css` | All styling + responsive design |
| `app.js` | All interactive features |
| `schedule.data.json` | 96 band performances |
| `README.md` | Full documentation |
| `DEPLOYMENT.md` | Deploy to GitHub Pages |
| `BUILD_SUMMARY.md` | What was built |

---

## 🛠️ Customization

### Change a band name or time?
Edit `schedule.data.json` → Find band → Update → Git push

### Change colors?
Edit hex codes in `schedule.data.json` or CSS

### Add more bands?
Add new object to `schedule.data.json` array with:
- band, subtitle, location, starttime, endtime, day, color

### Change theme/header?
Edit `index.html` title/colors or `styles.css`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Schedule not loading | Check `schedule.data.json` in root folder |
| Favorites not saving | Clear browser cache, disable private mode |
| Wrong colors | Verify hex values in `schedule.data.json` |
| Mobile layout broken | Check viewport meta tag in `index.html` |
| Git push fails | Run `git config user.email` and `git config user.name` |

---

## 📊 Stats

- **96** band performances
- **4** days of cruise
- **6** venues
- **~15** hours of shows
- **0** backend/server needed
- **0** dependencies/libraries
- **100%** vanilla HTML/CSS/JavaScript

---

## 🎯 Features at a Glance

| Feature | Status |
|---------|--------|
| Timeline grid | ✅ Scrollable, responsive |
| Favorite shows | ✅ Persistent ❤️ |
| Hide shows | ✅ Right-click + toggle |
| Itinerary view | ✅ Chronological by day |
| Custom events | ✅ Add meals, sleep, meetups |
| LocalStorage save | ✅ Auto-persist |
| Mobile optimized | ✅ Touch controls |
| Offline ready | ✅ Works without WiFi |
| No database | ✅ 100% static files |
| GitHub Pages | ✅ Deploy & share |

---

## 📱 Browser Support

| Browser | Status |
|---------|--------|
| Chrome | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Edge | ✅ Full support |
| Mobile browsers | ✅ Full support |
| IE11 | ❌ Not supported |

---

## 🎸 That's It!

Your webapp is production-ready. Test locally, deploy to GitHub Pages, share the link, and enjoy the cruise!

Questions? Check README.md or DEPLOYMENT.md.

**Let's go!** 🚢⛵
