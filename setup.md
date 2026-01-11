# 🛠️ Word Safari: Setup & Deployment Guide

Complete guide for setting up, testing, and deploying Word Safari.

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [File Organization](#file-organization)
3. [Testing Locally](#testing-locally)
4. [Adding Audio Assets](#adding-audio-assets)
5. [Deployment Options](#deployment-options)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Minimum Setup (Works Immediately)

The game works out-of-the-box with:
- ✅ Inline SVG graphics (no external files needed)
- ✅ Web Speech API for pronunciation (built-in)
- ✅ CSS animations (no libraries required)

**Just open `index.html` in a browser!**

---

## 📁 File Organization

### Required Files (Included)

```
word-safari/
├── index.html          ← Main game file
├── css/
│   └── style.css       ← All styles
└── js/
    ├── game.js         ← Game logic
    ├── ui.js           ← UI management
    ├── audio.js        ← Sound system
    └── data/
        └── words.js    ← Vocabulary data
```

### Optional Assets (For Enhanced Experience)

```
word-safari/
└── assets/
    └── audio/
        ├── ambient/
        │   └── safari-ambient.mp3
        ├── effects/
        │   ├── correct.mp3
        │   ├── wrong.mp3
        │   └── click.mp3
        └── phonics/
            └── (word pronunciation files)
```

---

## 🧪 Testing Locally

### Option 1: Direct File Opening (Simplest)

1. **Download all files** to a folder
2. **Double-click** `index.html`
3. **Start playing!**

⚠️ **Note**: Some browsers restrict file:// protocol features. Use a local server for full functionality.

### Option 2: Local Web Server (Recommended)

#### Using Python (Built-in)
```bash
# Python 3
cd word-safari
python -m http.server 8000

# Open browser to: http://localhost:8000
```

#### Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run server
cd word-safari
http-server -p 8000
```

#### Using PHP (Built-in)
```bash
cd word-safari
php -S localhost:8000
```

#### Using VS Code Live Server Extension
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 🔊 Adding Audio Assets

### Option 1: Use Web Speech API (Default)
The game uses browser text-to-speech. **No files needed!**

### Option 2: Add MP3 Files (Enhanced Quality)

#### Where to Get Free Sounds

**Background Music:**
- [Freesound.org](https://freesound.org/) - CC0 ambient tracks
- [Mixkit.co](https://mixkit.co/) - Royalty-free music
- Search: "safari ambient", "jungle sounds", "nature ambience"

**Sound Effects:**
- [Zapsplat.com](https://www.zapsplat.com/) - Free SFX
- [Soundbible.com](http://soundbible.com/) - Public domain sounds
- Search: "correct beep", "wrong buzzer", "click button"

**Pronunciation:**
- [Dictionary API](https://dictionaryapi.dev/) - Auto-fetch pronunciation URLs
- [Text-to-Speech APIs](https://ttsmp3.com/) - Generate MP3s

#### File Structure

Place audio files here:
```
assets/
└── audio/
    ├── ambient/
    │   └── safari-ambient.mp3      (looping background)
    ├── effects/
    │   ├── correct.mp3              (success sound)
    │   ├── wrong.mp3                (error sound)
    │   └── click.mp3                (button click)
    └── phonics/
        ├── giraffe.mp3
        ├── lion.mp3
        └── ...
```

#### Update HTML References

In `index.html`, the audio elements are already set up:
```html
<audio id="audio-ambient" loop>
    <source src="assets/audio/ambient/safari-ambient.mp3" type="audio/mpeg">
</audio>
```

If files are missing, the game will:
- Use text-to-speech as fallback
- Continue working without audio
- Log warnings in console (not errors)

---

## 🌐 Deployment Options

### Option 1: GitHub Pages (Free, Easy)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/word-safari.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages"
   - Source: Deploy from branch
   - Branch: `main` → `/root`
   - Save

3. **Access Your Game**
   - URL: `https://yourusername.github.io/word-safari/`
   - Share with students!

### Option 2: Netlify (Free, Drag-and-Drop)

1. Visit [netlify.com](https://www.netlify.com/)
2. Drag your `word-safari` folder into the upload area
3. Get instant URL: `https://your-site.netlify.app`

**Features:**
- Custom domains
- HTTPS automatically
- Deploy updates with drag-and-drop

### Option 3: Vercel (Free, Git Integration)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd word-safari
   vercel
   ```

3. Follow prompts → Get URL

### Option 4: Traditional Web Hosting

Upload via FTP to any web host:
- Bluehost, HostGator, GoDaddy, etc.
- Place files in `public_html` or `www` folder
- Access via your domain

### Option 5: School/Organization Server

1. **Zip the project**: `word-safari.zip`
2. **Send to IT department** with instructions
3. **Request deployment** to school intranet
4. **Access locally** on school network

---

## 🐛 Troubleshooting

### Issue: Audio Not Playing

**Symptoms:** No sounds, muted game, speech not working

**Solutions:**
```javascript
// 1. Check browser audio policy
// Modern browsers require user interaction before audio

// 2. Verify audio files exist
console.log('Audio element:', document.getElementById('audio-correct'));

// 3. Check console for errors
// Open DevTools (F12) → Console tab

// 4. Test Text-to-Speech availability
console.log('Speech supported?', 'speechSynthesis' in window);
```

**Common Fixes:**
- Click anywhere on page first (browser audio policy)
- Check file paths in `index.html`
- Ensure audio files are correct format (MP3)
- Try different browser (Chrome recommended)

### Issue: SVGs Not Displaying

**Symptoms:** Blank animal cards, missing graphics

**Solution:**
```javascript
// SVGs are inline in words.js
// Check browser console for JavaScript errors

// Verify SVG rendering:
const animalCard = document.querySelector('.animal-card');
console.log('SVG content:', animalCard.innerHTML);
```

### Issue: Game Not Loading

**Symptoms:** Blank screen, console errors

**Checklist:**
- ✅ All files in correct folders?
- ✅ JavaScript modules loading? (Check console)
- ✅ Using `type="module"` in script tags?
- ✅ Running on localhost (not file://)?

**Debug Steps:**
```javascript
// 1. Open browser console (F12)
// 2. Check for errors (red text)
// 3. Verify modules loaded:
console.log('Game Manager:', typeof gameManager);
console.log('UI Manager:', typeof window.uiManager);
```

### Issue: Mobile Not Responsive

**Symptoms:** Zoomed in, cut-off elements

**Solution:**
```html
<!-- Verify this tag in index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Issue: Progress Not Saving

**Symptoms:** Score resets, high score lost

**Solution:**
```javascript
// Check localStorage availability
if (typeof(Storage) !== "undefined") {
    console.log('localStorage available');
    console.log('Saved data:', localStorage.getItem('wordSafariProgress'));
} else {
    console.log('localStorage NOT supported');
}

// Clear and test:
localStorage.removeItem('wordSafariProgress');
// Play game, check if it saves
```

### Issue: Spelling Input Not Working

**Symptoms:** Can't type, Enter key doesn't work

**Solution:**
```javascript
// Check event listener attached:
const input = document.getElementById('spelling-input');
console.log('Input element:', input);

// Test manually:
input.addEventListener('keypress', (e) => {
    console.log('Key pressed:', e.key);
});
```

---

## 🔒 Security Considerations

### Content Security Policy (CSP)

If deploying to production, add to index.html:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               script-src 'self';">
```

### HTTPS Requirement

For text-to-speech and audio on mobile:
- **Use HTTPS** (not HTTP)
- Free via GitHub Pages, Netlify, Vercel
- Required for Web Speech API on some browsers

---

## 📱 Mobile Optimization

### Testing on Mobile Devices

1. **Desktop Emulation:**
   - Chrome DevTools (F12) → Toggle device toolbar
   - Test on multiple screen sizes

2. **Real Device Testing:**
   - Deploy to web (GitHub Pages, etc.)
   - Open on phone/tablet
   - Test touch interactions

### Performance Tips

```css
/* Already included in style.css */

/* Use transform for animations (GPU accelerated) */
.animal-card {
    transform: translateZ(0);
    will-change: transform;
}

/* Optimize SVG rendering */
svg {
    shape-rendering: geometricPrecision;
}
```

---

## 🎓 Classroom Deployment Tips

### For Teachers

1. **Deploy to School Server**
   - No internet required after deployment
   - Fast loading on school network
   - Control access

2. **Use in Computer Lab**
   - Bookmark `index.html` on all computers
   - Create desktop shortcut
   - Disable browser distractions

3. **Track Progress**
   ```javascript
   // View student progress:
   localStorage.getItem('wordSafariProgress');
   
   // Export as JSON for teacher dashboard
   ```

4. **Customize Vocabulary**
   - Edit `js/data/words.js`
   - Add current lesson words
   - Adjust difficulty

---

## 📊 Analytics (Optional)

### Track Usage with Google Analytics

Add to `<head>` in index.html:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Track events in `game.js`:

```javascript
// On game completion
gtag('event', 'game_complete', {
    'score': this.score,
    'level': this.level
});
```

---

## ✅ Pre-Launch Checklist

- [ ] All HTML/CSS/JS files present
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile device
- [ ] Audio working (or fallback active)
- [ ] All buttons clickable
- [ ] Progress saves correctly
- [ ] No console errors

---

## 🆘 Getting Help

### Resources

- **GitHub Issues**: Report bugs
- **MDN Web Docs**: [developer.mozilla.org](https://developer.mozilla.org/)
- **Stack Overflow**: Search "javascript game development"
- **Browser DevTools**: F12 for debugging

### Common Questions

**Q: Can I use this commercially?**
A: Check LICENSE file (MIT allows commercial use with attribution)

**Q: Can I modify the code?**
A: Yes! Fork and customize freely

**Q: Do I need a database?**
A: No, uses localStorage (browser-based)

**Q: Works offline?**
A: Yes, once loaded (consider PWA for true offline)

---

**Ready to deploy? Start with GitHub Pages for easiest setup!** 🚀

Good luck with your Word Safari deployment! 🦁🦒