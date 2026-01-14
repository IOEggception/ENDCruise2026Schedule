# 🚀 Quick Start & Deployment Guide

## Local Testing (Before Deployment)

### Option 1: Live Server (VS Code)
1. Install **Live Server** extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. Browser opens at `http://localhost:5500`
4. Test all features:
   - ❤️ Click hearts to favorite
   - Right-click to hide
   - Switch to "My Itinerary" tab
   - Add a custom event
   - Refresh page—data should persist

### Option 2: Python Simple Server
```bash
cd "g:\IntelliJ Projects\ENDCruise2026Schedule"
python -m http.server 8000
# Visit: http://localhost:8000
```

### Option 3: Node.js
```bash
npx http-server
```

## Deploy to GitHub Pages

### Prerequisites
- GitHub account
- Git installed
- Repository ready

### Steps

1. **Create a new GitHub repository**
   - Go to https://github.com/new
   - Name: `emos-cruise-schedule` (or your choice)
   - Make it **public**
   - Skip "Initialize with README" (we have one)

2. **Initialize git in your project folder**
   ```bash
   cd "g:\IntelliJ Projects\ENDCruise2026Schedule"
   git init
   git add .
   git commit -m "Initial Emos Not Dead cruise schedule webapp"
   ```

3. **Add remote and push**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/emos-cruise-schedule.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: Select "Deploy from a branch"
     - Branch: Select `main`, folder `/ (root)`
     - Click **Save**
   - Wait 1-2 minutes for deployment
   - Your site is live at: `https://YOUR_USERNAME.github.io/emos-cruise-schedule`

5. **Share the link!** 🎸

## Using a Custom Domain (Optional)

1. Buy a domain (e.g., Namecheap, GoDaddy)
2. In repository Settings → Pages:
   - Add your custom domain
   - GitHub will generate CNAME file
3. Update DNS records at your registrar:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   (or the IP GitHub provides)
   ```

## Testing After Deployment

- Visit your live site
- Test all features work (favorites, hiding, custom events)
- Test on mobile device
- Share with friends!

## Troubleshooting

### "404 - Not Found"
- Ensure files are in root directory (not in a subfolder)
- Check GitHub Pages is enabled in Settings
- Wait a few minutes for deployment

### Styles not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+Shift+R on Windows)

### Data not loading
- Check browser console (F12 → Console tab)
- Ensure `schedule.data.json` is in root folder
- Verify JSON syntax: https://jsonlint.com/

## Keeping Your Site Updated

After making changes locally:

```bash
git add .
git commit -m "Update schedule or features"
git push origin main
```

Changes deploy automatically within 1-2 minutes!

## Files to Never Delete
- `index.html` - Main page
- `styles.css` - All styling
- `app.js` - All functionality
- `schedule.data.json` - All band data
- `README.md` - Documentation (optional)

## Files You Can Delete
- `Schedule/` folder - Screenshots (no longer needed after deployment)
- `.git/` folder - Only keep if you want to maintain git history

---

**That's it!** Your Emos Not Dead cruise schedule webapp is live for friends to use. 🎸
